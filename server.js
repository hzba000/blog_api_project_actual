'use strict';

//import express
const express = require('express');
const app = express();

//Import Router
const blogPostRouter = require('./blogPostRouter');

//log HTTP layer
const morgan = require('morgan');
app.use(morgan('common'));

//sets up static file server
app.use(express.static('public'));

//sets up router module
app.use('/blog-posts', blogPostRouter);

//Both runServer and closeServer need access to server object
let server; // when runServer runs, it assigns a value to it

function runServer(){
    const port = process.env.PORT || 8080;
    return new Promise((resolve, reject) =>{
        server = app
            .listen(port, () =>{
                console.log(`You app is listening on port ${port}`);
                resolve(server);
            })
            .on("error", err=>{
                reject(err);
            });
    });
}

function closeServer() {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          reject(err);
          // so we don't also call `resolve()`
          return;
        }
        resolve();
      });
    });
  }

  if (require.main === module) {
    runServer().catch(err => console.error(err));
  }
  
  module.exports = { app, runServer, closeServer };



//Listen for requests and log when you've started doing it
// app.listen(process.env.PORT || 8080, () => console.log(
//     `Your app is listening on port ${process.env.PORT || 8080}`));

