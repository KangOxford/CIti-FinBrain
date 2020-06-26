const path = require("path");
const fs = require("fs");


const distPath = './dist';
const preservedDirectories = [".git"];
const preservedFiles = ["CNAME"];


Array.prototype.contains = function (other) {
  return this.indexOf(other) >= 0;
};


function cleanup(dirPath) {
  const files = fs.readdirSync(dirPath);
  if (files.length > 0)
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      if (fs.statSync(filePath).isFile()) {
        if (!preservedFiles.contains(file)) {
          fs.unlinkSync(filePath);
        }
      } else {
        if (!preservedDirectories.contains(file)) {
          cleanup(filePath);
        }
      }
    }
}

if (fs.existsSync(distPath)) {
  cleanup(distPath);
  console.log("previous dist cleaned");
}

