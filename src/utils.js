export const encodePath = path => path.split('/').map(chunk => encodeURIComponent(chunk)).join('/');
export const decodePath = path => path.split('/').map(chunk => decodeURIComponent(chunk)).join('/');
