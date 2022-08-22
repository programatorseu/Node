#! /usr/bin/env node
"use strict";
var util = require('util');
var path = require('path');
var fs = require('fs');
var zlib = require("zlib");

var Transform = require("stream").Transform;
// var getStdin = require("get-stdin");



var args = require("minimist")(process.argv.slice(2), {
    boolean: ["help", "in", "out", "compress", "uncompress"], 
    string: ["file"]
});

function streamComplete(stream) {
    return new Promise(function callback(res) {
        stream.on("end", res);
    });
}

var BASE_PATH = path.resolve(
    process.env.BASE_PATH || __dirname
);

var OUTFILE = path.join(BASE_PATH, "out.txt");

if(args.help) {
    printHelp();
}
else if(args.in || args._.includes("-")) {
    processDifferentWay(process.stdin);
} 
else if (args.file) {
    let stream = fs.createReadStream(path.join(BASE_PATH, args.file));
    processDifferentWay(stream).then(function() {
        console.log("Complete");
    }).catch(error);
}
else {
    error("Incorrect usage.", true);
}
async function processDifferentWay(inStream) {
    var outStream = inStream;
    if (args.uncompress) {
        let gunzipStream = zlib.createGunzip();
        outStream = outStream.pipe(gunzipStream);
    }
    
    var upperStream = new Transform({
		transform(chunk,encoding,callFinish) {
			this.push(chunk.toString().toUpperCase());
            callFinish();
		}
	});
    outStream = outStream.pipe(upperStream);
    if(args.compress) {
        let gzipStream = zlib.createGzip();
        outStream = outStream.pipe(gzipStream);
        OUTFILE = `${OUTFILE}.gz`;
    }
    var targetStream;
    if(args.out) {
        targetStream = process.stdout;
    } else {
        targetStream = fs.createWriteStream(OUTFILE);
    }
    outStream.pipe(targetStream);
    await streamComplete(outStream);

}

function processFile(filepath) {
    fs.readFile(filepath, function onContents(err, contents) {
        if(err) {
            error(err.toString());
        } else {
            contents = contents.toString().toUpperCase();
            process.stdout.write(contents);
        }
    });
}

// printHelp();
function error(msg, includeHelp = false) {
    console.error(msg);
    if(includeHelp) {
        console.log("");
        printHelp();
    }
}
function printHelp() {
    console.log("ex1 usage:");
    console.log("   ex1 usage --file={FILENAME}");
    console.log("");
    console.log("--help             print this help");
    console.log("--file={FILENAME   process the file");
    console.log("--in, -            process stdin");
    console.log("--out              print to stdout");
    console.log("--compress         compress file");
    console.log("--uncompress       gunzip the file"); 
    console.log("");

}
