import "dotenv/config";
import express from "express";
import path from "path";
import files from "./db/files";
import mysql from "./db/mysql";
// const [videos] = await (await mysql).query("SELECT * FROM videos");
// import cookie from "cookie";
// import { randomFillSync } from "crypto";
const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));
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

app.get("/", async (req, res) => {
  const contents = files.filter((file, i) => {
    if (i < 8) return file;
  });

  res.status(200).render("pages/index", { files: contents });
});

app.get("/:id(\\d+)", (req, res) => {
  const { id } = req.params;
  const pagination = Number(id);
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
  const containers = []; // 검색된 컨텐츠을 임시로 저장할 배열
  let contents; // containers 배열에서 0~7 인덱스된 변수
  let paginations; // 총 페이지 수

  /**
   * query로 컨텐츠 검색
   */
  function searchContents() {
    const terms = query.trim().split(" ");
    for (const term of terms) {
      for (const file of files) {
        if (containers.includes(file)) continue;
        if (file.title.match(new RegExp(term, "i"))) {
          containers.push(file);
        }
      }
    }
    paginations = Math.ceil(containers.length / 8);
  }

  /**
   * 8개씩 인덱싱
   */
  function filterContents() {
    const pagination = page ? Number(page) : 0;
    const pre = pagination * 8;
    const next = (pagination + 1) * 8;
    contents = containers.filter((file, i) => {
      if (i >= pre && i < next) return file;
    });
  }
  searchContents();
  filterContents();

  res
    .status(200)
    .render("pages/search", { files: contents, paginations, query });
});

app.get("/watch/:id", (req, res) => {
  const { id } = req.params;
  const video = files.filter((file) => file.title.includes(id))[0];
  if (!video) {
    return res.status(404).render("pages/error", { errMsg: "Video not found" });
  }

  res.status(200).render("pages/watch", { file: video });
});

app.use((req, res) => {
  res.status(404).render("pages/error", { errMsg: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err) throw err;
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
