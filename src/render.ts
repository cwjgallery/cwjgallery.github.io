import ImgLoader from "./imgloader";
import { formatter } from "./util";
import { galleryItem } from './types'
import { h, appendFirst, setStyle } from './dom';
// !!!!!!!!! todo:
// bug:
// 点了详情以后 会多出一个没有图片的div

// setStyle  style ts类型寻找.
const container = document.body;

const header = h('div',
    { class: 'header' },
    h('div', { class: 'title' }, 'wwj gallery'))

container.append(header);

const thumbwrap = h('div', { class: 'thumb-wrap' });
container.appendChild(thumbwrap);

const detailwrap = h('div', { class: 'detail-wrap' });
detailwrap.addEventListener('click', () => setStyle(detailwrap, { display: 'none' }))
setStyle(detailwrap, { display: 'none' })
container.appendChild(detailwrap);

const renderthumb = (list?: galleryItem[], loader?: ImgLoader) => {

    // clean wrapper
    thumbwrap.innerHTML = '';

    // calc waterfall columns.
    // every columns has width of 300px.
    // and body padding was 30px.
    const columncount = Math.floor(thumbwrap.offsetWidth / 300);
    let columnHeight = Array.from({ length: columncount }).map(() => 0);
    thumbwrap.append(...Array.from({ length: columncount }).map(() => h('div', { class: 'waterfall' })));

    list.forEach(item => {
        // create img
        const img = loader.getImg(item.thumb);
        img.className = 'thumbimg';
        img.addEventListener('click', (e) => openFull(item.url, loader, e))
        const itemwrap = h('div',
            { class: 'thumb' },
            [h('div', { class: 'desc' }, item.desc), h('div', { class: 'date' }, formatter.formatDate(item.date))]);
        appendFirst(img, itemwrap);

        // find index and append to waterfall
        const childToAppend = columnHeight.findIndex(i => i === Math.min(...columnHeight));
        thumbwrap.children[childToAppend].append(itemwrap);
        columnHeight[childToAppend] += itemwrap.offsetHeight;

    })

    render3d();
}

const render3d: () => void = () => {
    for (let i = 0; i < thumbwrap.children.length; i++) {
        const waterfallitem = thumbwrap.children[i];
        for (let j = 0; j < waterfallitem.children.length; j++) {
            const thumbitem = waterfallitem.children[j];
            const { top, bottom, left, right, width, height } = thumbitem.getClientRects()[0];

            if (bottom < 0) continue;
            if (top > container.offsetHeight) break;

            const verticalCenter = top + bottom / 2;
            const diff = verticalCenter - container.offsetHeight / 2;
            const diffFromBottom = top - container.offsetHeight;
            
            setStyle(thumbitem as HTMLElement, {
                transform: `translate(${(diff) / -5}px)
                rotate3d(1, 1, 0, 10deg)`,
                // 'box-shadow': `${-(diffFromBottom / 20) + 5}px ${(diffFromBottom / 20) - 5}px 10px rgba(0, 0, 0, .5)`,
            })
        }
    }
}

const openFull = (src: string, loader: ImgLoader, e: MouseEvent) => {
    setStyle(detailwrap, { display: '' })
    detailwrap.innerHTML = '';

    const { screenX, screenY } = e;
    const detail = loader.getImg(src);
    const {width, height} = detail;
    setStyle(detail, {
        transition: '.2s',
        width: '0px',
        height: '0px',
        position: 'absolute',
        left: screenX + 'px',
        top: screenY + 'px',
    })
    detailwrap.append(detail);

    const imgstyle = width/height > detailwrap.offsetWidth/detailwrap.offsetHeight ? {
        width: '100%',
        height: 'auto',
        top: (detailwrap.offsetHeight - height * (detailwrap.offsetWidth / width)) / 2 + 'px',
        left: 0,
    } : {
        width: 'auto',
        height: '100%',
        top: 0,
        left: (detailwrap.offsetWidth - width * (detailwrap.offsetHeight / height)) / 2 + 'px',
    };
    setTimeout(() => {
        setStyle(detail, imgstyle);
    })
}

const renderFull = () => {

}

document.addEventListener('scroll', render3d);

export {
    renderthumb,
    renderFull,
}
