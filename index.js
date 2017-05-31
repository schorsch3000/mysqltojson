#!/usr/bin/env node
const args = require("yargs").argv;
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: args.h,
    user: args.u,
    password: args.p,
    database: args.d,
    charset: "utf8_general_ci"
});


connection.connect();
let query = connection.query(args.q);
let lastRow = false;
query
    .on('error', function (err) {
        process.stderr.write(err + "\n");
        process.exit(1);
    })
    .on('fields', function () {
        process.stdout.write("[");
    })
    .on('result', function (row) {
        if (false !== lastRow) {
            process.stdout.write(lastRow);
            process.stdout.write(",");
        }
        connection.pause();
        lastRow = JSON.stringify(row);
        connection.resume();
    })
    .on('end', function () {
        process.stdout.write(lastRow);
        process.stdout.write("]\n");
    });
connection.end();