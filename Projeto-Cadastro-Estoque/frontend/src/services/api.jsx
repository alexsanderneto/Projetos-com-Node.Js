import axios from "axios";

const API_BASE_URL = "http://localhost:4000"; // Confirme se essa é a URL do seu backend

const fazerLogin = async (email, senha) => {
  try {
    const resposta = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      senha,
    });

    console.log("Resposta da API:", resposta.data); // Ver se a resposta está correta

    return resposta.data; // Retorna o JSON corretamente
  } catch (erro) {
    if (erro.response) {
      // O servidor respondeu com um status diferente de 2xx
      console.error("Erro do backend:", erro.response.data);
      console.error("Status:", erro.response.status);
    } else if (erro.request) {
      // A requisição foi feita, mas não houve resposta
      console.error("Nenhuma resposta do servidor.");
    } else {
      // Outro erro
      console.error("Erro ao configurar a requisição:", erro.message);
    }
  }
};
export default fazerLogin;
