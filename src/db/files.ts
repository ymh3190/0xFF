import { readdirSync } from "fs";
import { randomFillSync } from "crypto";

export type File = {
  path: string;
  title: string;
};

const files: File[] = readdirSync("static")
  .filter((file) => !file.includes(".DS_Store"))
  .map((file) => {
    return {
      path: `/static/${file}`,
      title: `${file.split(".")[0]}`,
    };
  });

export default files;
