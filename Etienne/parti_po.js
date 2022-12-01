const express = require('express'); // Import
const app = express();              // Create
const PORT = 3000;  
const axios = require('axios');
const puppeteer = require('puppeteer');
const fs = require('fs');
const Papa = require('papaparse');
const csvFilePath = 'Repertoire-national-des-elus.csv'

const file = fs.createReadStream(csvFilePath);

var csvData=[];
Papa.parse(file, {
  header: true,
  step: function(result) {
    csvData.push(result.data)
  },
  complete: function(results, file) {
    console.log('Complete', csvData.length, 'records.'); 
  }
});



app.listen(PORT, (error) => {       // Listen
    if(!error)
        console.log("Server is Successfully Running"+ PORT)
    else
        console.log("Error occurred, server can't start", error);
    }
);

