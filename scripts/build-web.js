import { copyFileSync, mkdirSync, existsSync } from "fs";

const files = ["index.html", "styles.css", "script.js"];
const src = "docs";
const dest = "dist/web";

if (!existsSync(dest)) {
  mkdirSync(dest, { recursive: true });
}

files.forEach((file) => {
  copyFileSync(`${src}/${file}`, `${dest}/${file}`);
});

console.log("✅ Web build complete → dist/web/");
