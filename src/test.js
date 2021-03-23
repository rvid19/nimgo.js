const open = require("open");
const path = require("path");
const url = require("url");

console.log("opening in browser...");
open(
    url.format({
        protocol: "file",
        pathname: path.join(__dirname, "/test.html")
    })
);