import express from "express";
import path from "path";
import files from "./db/files";
const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));
app.use("/static", express.static("static"));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/logo", express.static("logo"));

app.use((req, res, next) => {
  const { method, url } = req;
  const { statusCode } = res;
  console.log(method, url, statusCode);
  next();
});

app.use((req, res, next) => {
  res.locals.siteName = "0xFF";
  res.locals.paginations = Math.ceil(files.length / 8);
  next();
});

app.get("/", (req, res) => {
  const contents = files.filter((file, i) => {
    if (i < 8) return file;
  });

  res.render("index", { files: contents });
});
app.get("/:id(\\d+)", (req, res) => {
  const {
    params: { id },
  } = req;

  const pagination = Number(id);
  const pre = pagination * 8;
  const next = (pagination + 1) * 8;

  const contents = files.filter((file, i) => {
    if (i >= pre && i < next) return file;
  });

  res.render("index", { files: contents });
});
app.get("/search", (req, res) => {
  const {
    query: { query },
  } = req;

  const contents = files.filter((file) => file.title.includes(query));
  const paginations = Math.ceil(contents.length / 8);

  res.render("search", { files: contents, paginations });
});

const port = 8000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
