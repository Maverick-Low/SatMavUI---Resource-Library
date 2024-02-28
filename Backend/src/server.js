import express from 'express';
// const express = require('express');
// const multer = require('multer');
// const AWS = require('aws-sdk');
// const fs = require('fs');

const app = express();

app.get('/', (req, res) => {
    res.send('LOOL');
})

app.post('/upload', (req, res) => {
    console.log('Uploaded');
    res.send('Connected to server!');
})

const PORT = process.env.PORT || 3000;


console.log('Succesfully connected to database');
app.listen(3000, () => {
    console.log('Server is listening on port ' + PORT);
});
