"use strict";

let fs = require("fs");
let path = require("path");
let corePackage = path.join(__dirname, "CorePackage");

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            let toSplitWith = "/home/david/Code/CORE_package/CorePackage/";
            files_.push(name.split(toSplitWith)[1]);
        }
    }
    return files_;
}

console.log(getFiles(corePackage))