import {galleryItem} from './types';

export default class ImgLoader {
    src: galleryItem[];
    cache: Map<string, HTMLImageElement>;

    constructor(src: galleryItem[]) {
        this.setsrc(src);
        
        this.cache = new Map();
    }

    private loadimg (src: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.src = 'gallery/' + src;
            img.onload = (...args) => {
                this.setImg(src, img);
                resolve();
            };
            img.onerror = reject;
        });
    }

    private readImg (src: string): HTMLImageElement | null {
        return this.cache.has(src) ? this.cache.get(src) : null;
    }

    private setImg (src: string, img: HTMLImageElement): void {
        !this.cache.has(src) && this.cache.set(src, img);
    }

    setsrc (src: galleryItem[]) {
        this.src = src;
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
