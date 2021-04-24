const express = require('express');
const fs = require('fs');
const yaml = require('js-yaml');
const files = require('./static-files');
const app = express();

let config;
try {
  const configFile = fs.readFileSync(__dirname + '/config.yml');
  config = yaml.load(configFile);
  if (!config.client) {
    throw new Error('config.yml requires `client` parameter');
  }
  if (!config.client.root) {
    throw new Error('config.yml requires `client.root` parameter');
  }
} catch (err) {
  console.log(err.name)
  if (err.code === 'ENOENT') {
    console.error('File `config.yml` does not exist');
  } else if (err.name === 'YAMLException') {
    console.error('Improper format for `config.yml`');
  } else {
    console.error(err.message);
  }
  process.exit(1);
}

const configString = JSON.stringify(config.client);
app.get('/config.json', (req, res) => res.end(configString));

Object.keys(files).forEach((filename) => {
  app.get('/' + filename, (req, res) => {
    res.end(files[filename]);
  });
});


if (config.server) {
  const filesApi = require('files-api/api');
  app.use('/api', filesApi(config.server.root));
}

app.use((req, res) => {
  res.end(files['index.html']);
});

app.listen(process.env.PORT || 8080);
