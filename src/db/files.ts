import { readdirSync } from "fs";
import { randomFillSync } from "crypto";

export type File = {
  path: string;
  title: string;
  thumbnail: string;
};

const files: File[] = readdirSync("static")
  .filter((file) => !file.includes(".DS_Store") && file.includes(".mp4"))
  .map((file) => {
    const title = file.split(".")[0];
    return {
      path: `/static/${title}.mp4`,
      title,
      thumbnail: `/static/${title}.jpg`,
    };
  });

export default files;
