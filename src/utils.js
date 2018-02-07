export const encodePath = (path) => {
  return path.split('/').map(chunk => encodeURIComponent(chunk)).join('/');
}