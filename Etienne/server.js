"use strict";
const path = require("path");
const express = require("express");
const https = require("https");

var express = require("express") /* npm install express */
var XLSX = require('xlsx');
const app = express();
const bodyParser = require("body-parser");
const http = require('http');
const httprequest = require('request');
//const axios = require('axios');

var fetch = require('node-fetch');
app.set("view engine", "ejs");


const PORT = process.env.PORT || 300;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
    extended:true
}));

app.get('/covoit', function(req, res) {
	res.sendFile(__dirname + "/index.html");
});