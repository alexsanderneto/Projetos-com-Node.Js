import { useState } from "react";
import axios from "axios";
import "../css/style.css";
function CadastroProduto() {
  const [produto, setProduto] = useState({
    nome: "",
    categoria: "",
    quantidade: 0,
    unidade: "",
    preco: 0,
  });

  const handleChange = (e) => {
    setProduto({ ...produto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/produtos", produto);
      alert("Produto cadastrado com sucesso!");
      setProduto({
        nome: "",
        categoria: "",
        quantidade: 0,
        unidade: "",
        preco: 0,
      });
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
    }
  };

  return (
    <div>
      <h2>📋 Cadastro de Produto</h2>
      <form onSubmit={handleSubmit}>
        <label>Nome:</label>
        <input
          type="text"
          name="nome"
          value={produto.nome}
          onChange={handleChange}
          required
        />

        <label>Categoria:</label>
        <input
          type="text"
          name="categoria"
          value={produto.categoria}
          onChange={handleChange}
          required
        />

        <label>Quantidade:</label>
        <input
          type="number"
          name="quantidade"
          value={produto.quantidade}
          onChange={handleChange}
          required
        />

        <label>Unidade:</label>
        <input
          type="text"
          name="unidade"
          value={produto.unidade}
          onChange={handleChange}
          required
        />

        <label>Preço (R$):</label>
        <input
          type="number"
          step="0.01"
          name="preco"
          value={produto.preco}
          onChange={handleChange}
          required
        />

        <button type="submit">➕ Cadastrar</button>
      </form>
    </div>
  );
}

export default CadastroProduto;
