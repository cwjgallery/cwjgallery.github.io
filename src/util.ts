export const formatter = {
    formatDate: (date: number): string => {
        const src = new Date(date);
        return src.getFullYear() + '-' + (src.getMonth() + 1) + '-' + src.getDate();
    }
}