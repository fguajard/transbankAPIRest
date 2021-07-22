const fs = require("fs");
const _ = require("lodash");


const modificarStock = (ordenCompraFinalizada) => {
  const ordenesCompraJson = JSON.parse(
    fs.readFileSync("data/OrdenesCompra.json", "utf8")
  );
  const productosJson = JSON.parse(
    fs.readFileSync("data/Productos.json", "utf8")
  );
  const ordenBuscada = ordenesCompraJson[ordenCompraFinalizada];
  const objetoProductosCantidad = _.countBy(
    ordenBuscada,
    (orden) => orden.producto
  );
  _.forIn(objetoProductosCantidad, (value, key) => {
    productosJson.map((producto) => {
      if (producto.producto === key) {
        producto.stock = producto.stock - value;
        return producto;
      }
      return producto;
    });
  });

  fs.writeFileSync(`data/Productos.json`,JSON.stringify(productosJson))
  
};

module.exports = modificarStock

