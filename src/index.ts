import { galleryItem } from './types'
import Imgloader from './imgloader';
import {renderthumb, renderFull} from './render';

declare global {
    interface Window {
        __GALLERY_LIST__: Array<galleryItem>
    }
}

const galleryLoader = new Imgloader(window.__GALLERY_LIST__);
const list = galleryLoader.src;

galleryLoader
    .loadThumb()
    .then(() => {
        renderthumb(list, galleryLoader);
        return galleryLoader.loadFull()
    })
    .then(renderFull)
    .catch(() => {
        console.log('图片加载失败');
    })

window.addEventListener('resize', () => renderthumb(list, galleryLoader));