const http = require("http");
const fs = require("fs");
const url = require("url");

http
  .createServer((req, res) => {
    
    if (req.url == "/") {
      fs.readFile("public/index.html", "utf8", (err, html) => {
        if (err) {
          console.log(err);
          res.statusCode = 500;
          res.end(JSON.stringify(err));
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
      });
    } 
    
    else if (req.url == "/estilos") {
      fs.readFile("public/style.css", (err, css) => {
        if (err) {
          console.log(err);
          res.statusCode = 500;
          res.end(JSON.stringify(err));
        }
        res.writeHead(200, { "Content-Type": "text/css" });
        res.end(css);
      });
    } 

    else if (req.url == "/javascript") {
        fs.readFile("public/script.js", (err, js) => {
          if (err) {
            console.log(err);
            res.statusCode = 500;
            res.end(JSON.stringify(err));
          }
          res.writeHead(200, { "Content-Type": "application/javascript" });
          res.end(js);
        });
      }    

    else{
        fs.readFile("public/404.html", "utf8", (err, errorPage) => {
            if (err) {
              console.log(err);
              res.statusCode = 500;
              res.end(JSON.stringify(err));
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(errorPage);
          });
        
    }
  })
  .listen(8080, () => console.log("Servidor encendido"));
