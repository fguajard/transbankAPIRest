const http = require("http");
const fs = require("fs");
const url = require("url");
const {getTokenTBK,checkUserInsertCard,confirmTransaction,obtenerOrdenCompraFinalizada} = require("./tbk.js");
const modificarStock = require("./ordenProducto")

http
  .createServer(async (req, res) => {
    const productosJson = JSON.parse(fs.readFileSync('data/Productos.json','utf8'))
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
    //RUTA DE LA VISTA CARRITO DE COMPRAS 
    else if (req.url == "/carrito") {
      fs.readFile("public/carrito/carritoCompra.html", "utf8", (err, html) => {
        if (err) {
          console.log(err);
          res.statusCode = 500;
          res.end(JSON.stringify(err));
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
      });
    }
    //RUTA DEL JAVASCRIPT DE LA VISTA DEL CARRITO DE COMPRA
    else if (req.url == "/javascriptcarrito") {
      fs.readFile("public/carrito/scriptCarrito.js", (err, js) => {
        if (err) {
          console.log(err);
          res.statusCode = 500;
          res.end(JSON.stringify(err));
        }
        res.writeHead(200, { "Content-Type": "application/javascript" });
        res.end(js);
      });
    }
    // RUTA CSS HOME
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
    //RUTA JS HOME
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

    // RUTA GET ALL PRODUCTS
    else if (req.url.startsWith("/productos") && 
    req.method == "GET") {       
      res.writeHead(200, { "Content-Type": "application/json" });        
      res.end(JSON.stringify(productosJson))                
    }

    // RUTA UPDATE PRODUCTS
    else if (req.url.startsWith("/productos") && req.method === "PUT") {
      const { index } = url.parse(req.url, true).query;
      let body = "";
      req.on("data", (payload) => {
        body = JSON.parse(payload);
      });
      req.on("end", () => {
        productosJson[index] = body;
        fs.writeFileSync("data/Productos.json", JSON.stringify(productosJson));
        res.end("Todo bien");
      });
    }

    //RUTA AGREGAR NUEVOS PRODUCTOS

    else if (req.url.startsWith('/productos') && req.method == "POST"){
      let body;
      req.on('data',(payload)=>{          
        body = JSON.parse(payload);                
      });
      
      req.on('end',()=>{          
        const producto = {          
          producto: body.producto,
          precio: body.precio,
          stock: body.stock
        }
        productosJson.push(producto)        
        fs.writeFileSync(`data/Productos.json`,JSON.stringify(productosJson))
        res.end("Creado con exito")
      });
    }


    //RUTA AGREGAR ORDEN DE COMPRAS
    else if (req.url.startsWith('/ordencompra') && req.method == "POST"){
     try {
      const { numerocompra } = url.parse(req.url, true).query;
      const ordenesCompraJson = JSON.parse(fs.readFileSync('data/OrdenesCompra.json','utf8'))
      let body;
      req.on('data',(payload)=>{          
        body = JSON.parse(payload);                
      });      
      req.on('end',()=>{        
        ordenesCompraJson[`${numerocompra}`] = body        
        fs.writeFileSync(`data/OrdenesCompra.json`,JSON.stringify(ordenesCompraJson))
        res.end(numerocompra)
      });
     } catch (error) {
       console.log(`Este error viene de crear una orden de compra ${error}`);
     }
    }

    //RUTA TOKEN TRANSBANK
    else if (req.url.startsWith("/tbk/token")) {
     try {
      const { total,ordencompra } = url.parse(req.url, true).query;
      const token = await getTokenTBK(total,ordencompra);
      res.end(token);
     } catch (error) {
      console.log(`ruta /tbk/token ${error}`);
     }
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

    //RUTA DE RETORNO LUEGO DE PASAR POR TRANSBANK
    else if (req.url === "/tbk/check" && req.method === "POST") {
    try {
      let token = "";
      req.on("data", (chunk) => {
        token = chunk.toString().split("=")[1];
      });
      req.on("end", async () => {
        const userStatus = await checkUserInsertCard(token);
        if (userStatus) {
          const transactionStatus = await confirmTransaction(token);
          if (transactionStatus){
            res.end("Compra finalizada con Exito");
            const ordenCompraFinalizada = await obtenerOrdenCompraFinalizada(token)
            modificarStock(ordenCompraFinalizada)
          } 
          else res.end("Algo salió mal en la compra... ");
        } else {
          res.end("Problemas de autenticación de parte del usuario comprador");
        }
      });
    } catch (error) {
      console.log(`ruta /tbk/check ${error}`);
    }
    }
    
    //RUTA ERRORES
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
