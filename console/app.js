#! /usr/bin/env node
"use strict";
var path = require('path');
var fs  = require("fs");
var zlib = require("zlib");

var Transform = require("stream").Transform;
var args = require("minimist")(process.argv.slice(2), {
    boolean: ["help", "in", "out", "compress", "uncompress"], 
    string: ["file"]
});
var BASE_PATH = path.resolve(
    process.env.BASE_PATH || __dirname
);
var OUTFILE = path.join(BASE_PATH, "out.txt");

if(args.help) {
    printHelp();
} else if (args.in || args._.includes("-")) {
    processFile(process.stdin).catch(error);
}
 else if (args.file) {
    let stream = fs.createReadStream(path.join(BASE_PATH, args.file));
    processFile(stream).then(function() {
        console.log("Complete!");
    }).catch(error);
} else {
    error("Incorrect usage", true);
}
function error(msg, includeHelp = false) {
    console.error(msg);
    if (includeHelp) {
        console.log("");
        printHelp();
    }
}
async function processFile(inStream) {
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
    await streamComplete(outStream)
}

function streamComplete(stream) {
    return new Promise(function c(res){
       stream.on("end", function() {
            res();
       }); 
    });
} 
function printHelp() {
    console.log("Usage --file={FILENAME}");
    console.log("   app.js --help");
    console.log("--in, -            process stdin");
    console.log("--out              print to stdout"); 
    console.log("--compress         to compress file"); 
    console.log("--uncompress       to uncompress file"); 



    console.log("Print necessary help");
}
