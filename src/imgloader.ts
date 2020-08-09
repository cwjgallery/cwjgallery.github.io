import {galleryItem} from './types';

export default class ImgLoader {
    src: galleryItem[];
    cache: Map<string, string>;

    constructor(src: galleryItem[]) {
        this.setsrc(src);
        
        this.cache = new Map();
    }

    private loadimg (src: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.src = 'gallery/' + src;
            img.onload = (...args) => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, img.width, img.height);
                const ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
                const dataURL = canvas.toDataURL("image/" + ext);
                this.setImg(src, dataURL);
                resolve();
            };
            img.onerror = reject;
        });
    }

    private readImg (src: string): HTMLImageElement | null {
        if (this.cache.has(src)) {
            const img = new Image();
            img.src = this.cache.get(src);
            return img;
        } else {
            return null;
        }
    }

    private setImg (src: string, img: string): void {
        !this.cache.has(src) && this.cache.set(src, img);
    }

    setsrc (src: galleryItem[]) {
        this.src = src.map(i => {
            if (!i.thumb) {
                i.thumb = i.url;
            }
            return i;
        });
    }
    
    loadThumb () {
        return Promise.all(this.src.map(i => this.loadimg(i.thumb)));
    }

    loadFull () {
        return Promise.all(this.src.map(i => this.loadimg(i.url)));
    }

    getImg (src: string): HTMLImageElement | null {
        return this.readImg(src);
    }

}
