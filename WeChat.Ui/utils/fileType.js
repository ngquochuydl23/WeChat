export function getFileType(file) {
    const type = file.type.substring(0, file.type.indexOf('/'));
    return type === 'image' ? type : 'file';
}