import { htmlchild } from './types'

const h: (tag: string, attr?: Object | undefined, children?: htmlchild[] | htmlchild)=> HTMLElement = (tag, attr, children) => {
    const ele = document.createElement(tag);
    if (attr) {
        for (let [k, v] of Object.entries(attr)) {
            ele.setAttribute(k, v);
        }
    }
    if (children) {
        if (!Array.isArray(children)) children = [children];
        children.forEach(child => {
            if (typeof child === 'string') {
                ele.innerText = child;
            } else {
                ele.appendChild(child)
            }
        });
    }
    return ele;
}

const appendFirst: (target: HTMLElement, container: HTMLElement)=> void = (target, container) => {
    if (container.children.length) {
        container.insertBefore(target, container.children[0]);
    } else {
        container.append(target);
    }
}

const setStyle = (ele: HTMLElement, styles: {}) => {
    Object.entries(styles).forEach((i: any[]) => {
        ele.style[i[0]] = i[1];
    });
}

export {
    h,
    appendFirst,
    setStyle,
}