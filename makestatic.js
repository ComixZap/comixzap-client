const fs = require('fs');

const textFiles = [ 'index.html', 'index.css', 'index.js' ];
const binFiles = [ 'favicon.ico', 'fontawesome-webfont.woff' ];

const json = []; 
textFiles.forEach((filename) => {
  const path = __dirname + '/build/' + filename;
  json.push('exports["' + filename + '"] = ' + JSON.stringify(fs.readFileSync(path, 'utf8')) + ';');
});

binFiles.forEach((filename) => {
  const path = __dirname + '/build/' + filename;
  json.push('exports["' + filename + '"] = Buffer.from([' + fs.readFileSync(path).toJSON().data + ']);');
});

fs.writeFileSync(__dirname + '/static-files.js', json.join('\n'));
