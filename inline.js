class S {
    #root;
    #nodes;

    /**
     * @param {HTMLElement} root
     */
    constructor(root) {
        this.#root = root;
        this.#nodes = [root];
    }

    /**
     * @param {string} selector
     */
    q(selector) {
        let selection = this.#nodes
            .map((node) => {
                return Array.from(node.querySelectorAll(selector));
            })
            .flat();

        this.#nodes = selection;

        return this;
    }

    /**
     *
     * @param {string} name
     * @param {string} value
     */
    attr(name, value) {
        if (value === undefined) {
            return this.#nodes.map((node) => node.getAttribute(name));
        }
        this.#nodes.forEach((node) => node.setAttribute(name, value));
        return this;
    }

    has(name) {
        return this.#nodes.some((node) => node.hasAttribute(name));
    }

    is(name, test) {
        this.#nodes.map((node) => {
            // console.log(node, name, node.getAttribute(name), test);
            return node;
        });
        return this.#nodes.some((node) => node.getAttribute(name) == test);
    }

    home() {
        this.#nodes = [this.#root];
        return this;
    }

    on(name, handler) {
        let currentSelection = this.#nodes;
        let names = name.split(" ");
        // console.log(names);
        this.#nodes.forEach((node) =>
            names.forEach((name) => {
                node.addEventListener(name, (e) => {
                    this.#nodes = currentSelection;
                    let data = handler(this, e, new S(node));
                });
            })
        );

        return this;
    }

    /**
     * @param {string} name
     * @param {any} data
     * @param {HTMLElement[]} target
     */
    send(name, data = {}, target = this.#nodes) {
        target.forEach((node) =>
            node.dispatchEvent(
                new CustomEvent(name, { bubbles: true, detail: data })
            )
        );

        return this;
    }

    /**
     * @param {HTMLElement} target
     */
    target(target) {
        if (target instanceof Event) target = target.currentTarget;
        this.#nodes = [target];
        return this;
    }

    /**
     * @param {string|((test:string)=>string)} textOrCb
     */
    text(textOrCb) {
        if (textOrCb === undefined) {
            return this.#nodes.map((node) => node.textContent).join("");
        }
        this.#nodes.forEach(
            (node) =>
                (node.textContent =
                    typeof textOrCb == "function"
                        ? textOrCb.call?.(null, node.textContent)
                        : typeof textOrCb == "string"
                        ? textOrCb
                        : node.textContent)
        );
        return this;
    }

    /**
     * @param {string} tagName
     */
    append(tagName) {
        let selection = this.#nodes.map((node) => {
            let element = document.createElement(tagName);
            node.append(element);
            return element;
        });
        this.#nodes = selection;
        return this;
    }

    /**
     * @param {string} tagName
     */
    adjecent(tagName) {
        let selection = this.#nodes.map((node) => {
            let element = document.createElement(tagName);
            node.insertAdjacentElement("afterend", element);
            return element;
        });

        this.#nodes = selection;

        return this;
    }
}

function s(root = document.currentScript?.parentElement) {
    if (root.hasAttribute("src")) {
        root = document.body;
    }

    let _ = new S(root);
    return _;
}
