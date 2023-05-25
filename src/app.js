import express from "express";
import path from "path";
import files from "./db/files";
const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));
app.use("/static", express.static("static"));
app.use("/public", express.static(path.resolve(__dirname, "public")));
app.use("/logo", express.static("logo"));

app.use((req, res, next) => {
  const { method, url, protocol, ip } = req;
  const { statusCode } = res;
  console.log(protocol.toUpperCase(), method, url, statusCode, ip);
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

  res.status(200).render("index", { files: contents });
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

  res.status(200).render("index", { files: contents });
});

app.get("/search", (req, res) => {
  const {
    query: { query, page },
  } = req;

  if (!query) {
    return res.status(400).redirect("/");
  }

  if (page && isNaN(Number(page))) {
    return res.status(400).redirect("/");
  }

  const pagination = page ? Number(page) : 0;
  const pre = pagination * 8;
  const next = (pagination + 1) * 8;

  const _ = files.filter((file) => file.title.match(new RegExp(query, "i")));
  const contents = _.filter((file, i) => {
    if (i >= pre && i < next) return file;
  });
  console.log(contents);
  const paginations = Math.ceil(_.length / 8);

  res.status(200).render("search", { files: contents, paginations, query });
});

app.use((err, req, res, next) => {
  if (err) throw err;
});

app.use((req, res) => {
  res.status(404).redirect("/");
});

const port = 8000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
