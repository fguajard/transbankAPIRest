const axios = require("axios");
const urlBase = "https://webpay3gint.transbank.cl";
const cabecera = {
    "Tbk-Api-Key-Id": "597055555532",
    "Tbk-Api-Key-Secret":
      "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C",
    "Content-Type": "application/json",
  };

const getTokenTBK = async () => {
  
  const payload = {
    buy_order: "ordenCompra12345678",
    session_id: "sesion1234557545",
    amount: "10000",
    return_url: "http://localhost:3000/tbk/check",
  };

  const { data } = await axios.post(
    `${urlBase}/rswebpaytransaction/api/webpay/v1.0/transactions`,
    payload,{headers: cabecera}
    
  );
  const token = data.token;  
  return token;
};

const checkUserInsertCard = async (token) =>{
    const {data} = await axios.get(`${urlBase}/rswebpaytransaction/api/webpay/v1.0/transactions/${token}`,{headers: cabecera})
    if (data.vci === "TSY"){
        return true
    }
    return false
}

const confirmTransaction = async (token) => {
    const { data } = await axios.put(`${urlBase}/rswebpaytransaction/api/webpay/v1.0/transactions/${token}`, null, {headers: cabecera});
    const { status } = data;
    if (status === "AUTHORIZED") return true;
    else return false;
  };

module.exports = {getTokenTBK,checkUserInsertCard,confirmTransaction};


// const axios = require("axios");

// const getTokenTBK = async () => {
//   console.log("alo");
//   try {
//     const { data } = await axios.post(
//       "https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.0/transactions", // URL
//       {
//         // Payload
//         buy_order: "ordenCompra12345678",
//         session_id: "sesion1234557545",
//         amount: 10000,
//         return_url: "http://www.comercio.cl/webpay/retorno"
//       },
//       {
//         // Headers
//         headers: {
//           "Tbk-Api-Key-Id": "597055555532",
//           "Tbk-Api-Key-Secret":
//             "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C",
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     console.log(data);

//     const { token } = data;
//     return token;
//   } catch (e) {
//     console.log(e);
//     return "Algo salió mal";
//   }
// };

// getTokenTBK()
// module.exports =  getTokenTBK ;
