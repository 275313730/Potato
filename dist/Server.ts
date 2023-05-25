import * as express from "express";
import * as path from "path";

const app = express()

app.get('/', function (req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(`${__dirname}/index.html`)
})

app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(__dirname, { index: "index.html" }))

app.listen(8888)
console.log('Server running at http://127.0.0.1:8888/');