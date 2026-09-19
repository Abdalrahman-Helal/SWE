// build and read file paths

import path  from "node:path";

// const filePath = projectRoot + "/uploads" + filenName

// path.join : uses the correct separator for the current os 
// /users/helal/project/file.txt

// process.cwd : the folder from where the node js process was started


const projectRoot = process.cwd();

console.log(projectRoot);

// uploads/users/42/profile.photo.png

const userId = '42';
const originalName = 'profile.photo.png';

 // important path.join creates a path string it will not create the folder and doesn't check if the path exists or not
const uploadFilePath = path.join(
  projectRoot, "uploads", "users", userId , originalName
);

console.log(uploadFilePath);


// final part of the path is the file name we can get it using path.basename
const fileName = path.basename(uploadFilePath);
const fileExt = path.extname(uploadFilePath);
const parentFolder = path.dirname(uploadFilePath);
console.log(fileName);
console.log(fileExt);
console.log(parentFolder);


// matchesGlob : check if a path matches a glob pattern
const filePath = "uploads/profile.png";
const isPngFile = path.matchesGlob(filePath, "*.png");

console.log(`Does ${filePath} match *.png?`, isPngFile);

if (isPngFile) {
  console.log("This is a PNG file");
}






