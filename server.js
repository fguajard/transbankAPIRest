const http = require("http");
const fs = require("fs");
const url = require("url");
const {getTokenTBK,checkUserInsertCard,confirmTransaction} = require("./tbk.js");

http
  .createServer(async (req, res) => {
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
    } else if (req.url == "/estilos") {
      fs.readFile("public/style.css", (err, css) => {
        if (err) {
          console.log(err);
          res.statusCode = 500;
          res.end(JSON.stringify(err));
        }
        res.writeHead(200, { "Content-Type": "text/css" });
        res.end(css);
      });
    } else if (req.url == "/javascript") {
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
    
    else if (req.url === "/tbk/token") {
      const token = await getTokenTBK();
      res.end(token);
    } 
    
    // else if (req.url === "/tbk/check" && req.method == "POST") {
    //   let token = "";
    //   req.on("data", (payload) => {
    //     token = payload.toString().split("=")[1]
    //   });
    //   req.on("end", async () => {
    //     const userStatus = await checkUserInsertCard()
    //     res.end(JSON.stringify(userStatus));
    //   });
    // } 
    else if (req.url === "/tbk/check" && req.method === "POST") {
      let token = "";
      req.on("data", (chunk) => {
        token = chunk.toString().split("=")[1];
      });
      req.on("end", async () => {
        const userStatus = await checkUserInsertCard(token);
        if (userStatus) {
          const transactionStatus = await confirmTransaction(token);
          if (transactionStatus) res.end("Compra finalizada con Exito");
          else res.end("Algo salió mal en la compra... ");
        } else {
          res.end("Problemas de autenticación de parte del usuario comprador");
        }
      });
    }
    
    
    else {
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
  .listen(process.env.PORT || 3000);
