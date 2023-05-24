import { readdirSync } from "fs";

const files = readdirSync("static")
  .filter((file) => !file.includes(".DS_Store"))
  .map((file) => {
    return {
      path: `/static/${file}`,
      title: file.split(".")[0],
    };
  });

export default files;
