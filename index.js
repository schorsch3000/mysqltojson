#!/usr/bin/env node
const args = require("yargs").argv;
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: args.h,
    user: args.u,
    password: args.p,
    database: args.d
});

connection.connect();
let query = connection.query(args.q);
let lastRow = false;
query
    .on('error', function (err) {
        console.log(err);
        process.exit(1);
    })
    .on('fields', function () {
        console.log("[");
    })
    .on('result', function (row) {
        if (false !== lastRow)
            console.log(lastRow, ",");
        connection.pause();
        lastRow = JSON.stringify(row);
        connection.resume();

    })
    .on('end', function () {
        console.log(lastRow);
        console.log("]");
    });
connection.end();