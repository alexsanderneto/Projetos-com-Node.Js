import { useState, useEffect } from "react";
import axios from "axios";
import ProdutoForm from "./ProdutoForm";

const ProdutosPage = () => {
  const [produtos, setProdutos] = useState([]);
  const [produtoEditar, setProdutoEditar] = useState(null);

  const carregarProdutos = async () => {
    try {
      const response = await axios.get("http://localhost:4000/produtos");
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const excluirProduto = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      await axios.delete(`http://localhost:4000/produtos/${id}`);
      setProdutos((prevProdutos) => prevProdutos.filter((p) => p.id !== id));
      alert("Produto excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Erro ao excluir produto.");
    }
  };

  return (
    <div>
      <h1>Lista de Produtos</h1>
      <ProdutoForm produtoEditar={produtoEditar} aoSalvar={carregarProdutos} />
      <ul>
        {produtos.map((produto) => (
          <li key={produto.id}>
            {produto.nome} - {produto.categoria} - {produto.quantidade}{" "}
            {produto.unidade} - R$ {produto.preco}
            <button onClick={() => setProdutoEditar(produto)}>✏️ Editar</button>
            <button
              onClick={() => excluirProduto(produto.id)}
              style={{ marginLeft: "5px", color: "red" }}
            >
              🗑️ Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProdutosPage;
