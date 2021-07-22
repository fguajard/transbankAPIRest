import { v4 as uuidv4 } from "https://jspm.dev/uuid";

const carritoDeCompra = [];
const form = document.querySelector("#formPagar");

const getProductos = async () => {
  const { data } = await axios("/productos");
  return data;
};

const agregarALaListaDeCarrito = (producto) => {
  $("#listaEnCarrito").append(`
        <li>${producto.producto} <span class="px-3"> $${producto.precio}</span></li>
        
    `);
  carritoDeCompra.push(producto);
};

const renderTotal = () => {
  const total = carritoDeCompra.reduce((acc, { precio }) => acc + precio, 0);
  $("#totalPago").html(`$${total}`);
  console.log("el total es " + total);
};

const descontarStock = (e) => {
  const cardContenedora = e.target.parentElement;
  let cantidadProducto = $(cardContenedora).find(".stock").html();
  $(cardContenedora)
    .find(".stock")
    .html(`${cantidadProducto - 1}`);
  cantidadProducto = $(cardContenedora).find(".stock").html();
  if (cantidadProducto == 0) {
    console.log(e.target);
    e.target.disabled = true;
  }
};
const agregarACarrito = async () => {
  const productos = await getProductos();
  const botonesProductos = document.querySelectorAll("[data-carrito]");
  botonesProductos.forEach((botonProducto) => {
    botonProducto.addEventListener("click", (e) => {
      const indexProducto = e.target.dataset.carrito;
      descontarStock(e);
      agregarALaListaDeCarrito(productos[indexProducto]);
      renderTotal();
      $("#botonpagar").removeAttr("disabled");
      console.log(productos[indexProducto]);
    });
  });
};

const renderProductos = async () => {
  const Productos = await getProductos();
  $("#listaProductos").html(` `);
  Productos.forEach((producto, index) => {
    $("#listaProductos").append(`
        <div class="card bg-light m-1" style="max-width: 18rem;">
            <div class="card-header">${producto.producto}</div>
            <div class="card-body">
            <h4 class="card-title">$${producto.precio}</h4>
            <p class="card-text " > Stock: <span class="stock">${producto.stock}</span></p>
            </div>
            <button class="btn btn-primary" data-carrito = ${index}>Agregar a Carrito</button>
        </div>
        `);
  });
  agregarACarrito();
};

const crearOrdenCompra = async () => {
  const nombreOrdenCompra = `OrdenCompra${uuidv4().slice(-6)}`;
  const contenidoOrdenCompra = carritoDeCompra;
  const { data: respuestaOrden } = await axios.post(
    `/ordencompra?numerocompra=${nombreOrdenCompra}`,
    contenidoOrdenCompra
  );
  return respuestaOrden;
};
const pagar = () => {
  $("#botonpagar").on("click", async () => {
    const input = document.getElementsByName("token_ws")[0];
    const ordencompra = await crearOrdenCompra();
    console.log(ordencompra);
    const total = carritoDeCompra.reduce((acc, { precio }) => acc + precio, 0);
    const token = await axios.get(
      `/tbk/token?total=${total}&ordencompra=${ordencompra}`
    );
    input.value = token.data;

    form.submit();
    // axios.post("https://webpay3gint.transbank.cl/webpayserver/initTransaction",{token_ws:token.data})
  });
};

(() => {
  renderProductos();
  pagar();
})();
