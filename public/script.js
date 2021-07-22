$("form").on("submit", async (e)=>{
    e.preventDefault()
    const producto = $("#producto").val()
    const precio = $("#precio").val()
    const stock = $("#stock").val()
    const productoEnviar = {
        producto: producto,
        precio: +precio,
        stock: +stock,
    }
    const {data:respuesta} = await axios.post('/productos', productoEnviar)
    alert(respuesta)  
})