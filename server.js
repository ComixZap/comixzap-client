const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.static(__dirname + '/build'));
app.use((req, res) => {
  fs.createReadStream(__dirname + '/build/index.html').pipe(res);
});

app.listen(process.env.PORT || 8080);
