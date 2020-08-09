export interface galleryItem {
    title: string,
    date: number,
    tags: string[],
    desc: string,
    url: string,
    thumb?: string,
}

export type htmlchild = HTMLElement | string