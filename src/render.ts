import ImgLoader from "./imgloader";
import { formatter } from "./util";
import { galleryItem } from './types'

type htmlchild = HTMLElement | string
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

const container = document.body;

const thumbwrap = h('div', { class: 'thumb-wrap' });
container.appendChild(thumbwrap);

const detailwrap = h('div', { class: 'detail-wrap' });
detailwrap.addEventListener('click', () => setStyle(detailwrap, { display: 'none' }))
setStyle(detailwrap, { display: 'none' })
container.appendChild(detailwrap);

const renderthumb = (list: galleryItem[], loader: ImgLoader) => {
    list.forEach(item => {
        const img = loader.getImg(item.thumb);
        img.className = 'thumbimg';
        img.addEventListener('click', () => openFull(item.url, loader))

        const itemwrap = h('div',
            { class: 'thumb' },
            [h('div', { class: 'desc' }, item.desc), h('div', { class: 'date' }, formatter.formatDate(item.date))]);

        appendFirst(img, itemwrap);
        thumbwrap.append(itemwrap);
    })
}

const openFull = (src: string, loader: ImgLoader) => {
    setStyle(detailwrap, { display: '' })
    detailwrap.innerHTML = '';
    const detail = loader.getImg(src);
    detail.className = 'detail';
    detailwrap.append(detail);
}

const renderFull = () => {

}

export {
    renderthumb,
    renderFull,
}
