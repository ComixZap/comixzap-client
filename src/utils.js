export const encodePath = path => path.split('/').map(chunk => encodeURIComponent(chunk)).join('/');
