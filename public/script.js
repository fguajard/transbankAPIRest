const input = document.getElementsByName("token_ws")[0];
(async () => {
  const res = await axios("/tbk/token");
  const token = res.data
  input.value = token;
})();
