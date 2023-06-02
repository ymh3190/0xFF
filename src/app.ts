import "dotenv/config";
import express from "express";
import files, { type File } from "./db/files";
import mysql from "./db/mysql";
import errorHandlerMiddleware from "./middleware/error-handler";
// const [videos] = await (await mysql).query("SELECT * FROM videos");
// import cookie from "cookie";
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static("static"));
app.use("/dist", express.static("dist"));
app.use("/logo", express.static("logo"));
app.use("/favicon", express.static("favicon"));
// app.use((req, res, next) => {
//   const buf = Buffer.alloc(16);
//   const hex = randomFillSync(buf).toString();
//   res.setHeader(
//     "Set-Cookie",
//     cookie.serialize("id", hex, {
//       httpOnly: true,
//     })
//   );
//   next();
// });

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

app.get("/:id(\\d?|\\d+)", (req, res) => {
  const { id } = req.params;
  const pagination = id ? Number(id) : 0;
  const pre = pagination * 8;
  const next = (pagination + 1) * 8;
  const contents = files.filter((file, i) => {
    if (i >= pre && i < next) return file;
  });
  res.status(200).render("pages/index", { files: contents });
});

app.get("/search", (req, res) => {
  const { query, page } = req.query;
  if (!query || (page && isNaN(Number(page)))) {
    return res.redirect("/");
  }
  const containers: File[] = [];
  const terms = (query as string).trim().split(" ");
  for (const term of terms) {
    for (const file of files) {
      if (containers.includes(file)) continue;
      if (file.title.match(new RegExp(term, "i"))) {
        containers.push(file);
      }
    }
  }
  const paginations = Math.ceil(containers.length / 8);
  const pagination = page ? Number(page) : 0;
  const pre = pagination * 8;
  const next = (pagination + 1) * 8;
  const contents = containers.filter((file, i) => {
    if (i >= pre && i < next) return file;
  });
  res
    .status(200)
    .render("pages/search", { files: contents, paginations, query });
});

app.get("/watch/:id(\\w{32})", (req, res) => {
  const { id } = req.params;
  let video: File | undefined;
  for (const file of files) {
    if (file.id.includes(id)) {
      video = file;
      break;
    }
  }
  if (!video) {
    return res.status(404).render("pages/error", { errMsg: "Video not found" });
  }
  res.status(200).render("pages/watch", { file: video });
});

app.use((req, res) => {
  res.status(404).render("pages/error", { errMsg: "Route not found" });
});
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
