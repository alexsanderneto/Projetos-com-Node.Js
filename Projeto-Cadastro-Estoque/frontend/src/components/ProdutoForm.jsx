import { useState, useEffect } from "react";
import { cadastrarProduto, editarProduto } from "../services/api";

const ProdutoForm = ({ produtoEditar, aoSalvar }) => {
  const [produto, setProduto] = useState({
    nome: "",
    categoria: "",
    quantidade: "",
    unidade: "",
    preco: "",
  });

  // Atualiza o formulário ao receber um produto para edição
  useEffect(() => {
    if (produtoEditar) {
      setProduto(produtoEditar);
    }
  }, [produtoEditar]);

  // Atualiza os valores do formulário
  const handleChange = (e) => {
    setProduto({ ...produto, [e.target.name]: e.target.value });
  };

  // Enviar formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (produtoEditar) {
        await editarProduto(produtoEditar.id, produto);
        alert("Produto atualizado com sucesso!");
      } else {
        await cadastrarProduto(produto);
        alert("Produto cadastrado com sucesso!");
      }
      aoSalvar(); // Atualiza a lista de produtos após salvar
    } catch (err) {
      alert("Erro ao salvar produto.", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{produtoEditar ? "Editar Produto" : "Cadastrar Produto"}</h2>
      <input
        type="text"
        name="nome"
        value={produto.nome}
        onChange={handleChange}
        placeholder="Nome"
        required
      />
      <input
        type="text"
        name="categoria"
        value={produto.categoria}
        onChange={handleChange}
        placeholder="Categoria"
        required
      />
      <input
        type="number"
        name="quantidade"
        value={produto.quantidade}
        onChange={handleChange}
        placeholder="Quantidade"
        required
      />
      <input
        type="text"
        name="unidade"
        value={produto.unidade}
        onChange={handleChange}
        placeholder="Unidade"
        required
      />
      <input
        type="number"
        name="preco"
        value={produto.preco}
        onChange={handleChange}
        placeholder="Preço"
        required
      />
      <button type="submit">{produtoEditar ? "Atualizar" : "Cadastrar"}</button>
    </form>
  );
};

export default ProdutoForm;
