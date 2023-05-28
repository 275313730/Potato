import * as express from "express";
import * as path from "path";

const app = express()

const devPath = path.resolve(__dirname, "dev")

app.get('/', function (req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(path.resolve(devPath, "index.html"))
})

app.use(express.static(path.resolve(devPath, "assets")));
app.use(express.static(devPath, { index: "index.html" }))

app.listen(8888)
console.log('Server running at http://127.0.0.1:8888/');