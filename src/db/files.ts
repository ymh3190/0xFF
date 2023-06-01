import { readdirSync } from "fs";

export type File = {
  path: string;
  title: string;
};

export type Files = Array<File>;

const files: File[] = readdirSync("static")
  .filter((file) => !file.includes(".DS_Store"))
  .map((file) => {
    return {
      path: `/static/${file}`,
      title: file.split(".")[0],
    };
  });

export default files;
