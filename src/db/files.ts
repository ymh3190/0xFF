import { readdirSync } from "fs";
import { randomFillSync } from "crypto";

export type File = {
  id: string;
  path: string;
  title: string;
};

const files: File[] = readdirSync("static")
  .filter((file) => !file.includes(".DS_Store"))
  .map((file) => {
    const buf = Buffer.alloc(16);
    const random = randomFillSync(buf).toString("hex");
    return {
      id: random,
      path: `/static/${file}`,
      title: file.split(".")[0],
    };
  });

export default files;
