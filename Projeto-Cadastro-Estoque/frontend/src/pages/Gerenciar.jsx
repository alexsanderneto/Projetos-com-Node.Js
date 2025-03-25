import { useState, useEffect } from "react";
import axios from "axios";

export default function Gerenciar() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [novoNome, setNovoNome] = useState("");
  const [novaCategoria, setNovaCategoria] = useState("");
  const [novaQuantidade, setNovaQuantidade] = useState("");

  // Buscar produtos ao carregar a página
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await axios.get("http://localhost:4000/produtos");
        setProdutos(response.data);
      } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  // Função para deletar um produto
  const deletarProduto = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await axios.delete(`http://localhost:4000/produtos/${id}`);
        alert("Produto excluído com sucesso!");
        setProdutos(produtos.filter((produto) => produto.id !== id)); // Atualiza a lista sem recarregar a página
      } catch (erro) {
        console.error("Erro ao excluir produto:", erro);
        alert("Erro ao excluir produto.");
      }
    }
  };

  // Função para iniciar a edição
  const iniciarEdicao = (produto) => {
    setProdutoEditando(produto.id);
    setNovoNome(produto.nome);
    setNovaCategoria(produto.categoria);
    setNovaQuantidade(produto.quantidade);
  };

  // Função para salvar a edição
  const salvarEdicao = async (id) => {
    try {
      await axios.put(`http://localhost:4000/produtos/${id}`, {
        nome: novoNome,
        categoria: novaCategoria,
        quantidade: Number(novaQuantidade),
      });

      alert("Produto atualizado com sucesso!");

      // Atualizar a lista de produtos
      setProdutos(
        produtos.map((produto) =>
          produto.id === id
            ? {
                ...produto,
                nome: novoNome,
                categoria: novaCategoria,
                quantidade: novaQuantidade,
              }
            : produto
        )
      );

      setProdutoEditando(null);
    } catch (erro) {
      console.error("Erro ao atualizar produto:", erro);
      alert("Erro ao atualizar produto.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-center text-2xl font-bold mb-4">
        Gerenciar Produtos
      </h2>

      {loading ? (
        <p>Carregando produtos...</p>
      ) : produtos.length === 0 ? (
        <p>Nenhum produto encontrado.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Nome</th>
              <th className="border p-2">Categoria</th>
              <th className="border p-2">Quantidade</th>
              <th className="border p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => (
              <tr key={produto.id} className="text-center">
                {produtoEditando === produto.id ? (
                  <>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={novoNome}
                        onChange={(e) => setNovoNome(e.target.value)}
                        className="border p-1 w-full"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={novaCategoria}
                        onChange={(e) => setNovaCategoria(e.target.value)}
                        className="border p-1 w-full"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={novaQuantidade}
                        onChange={(e) => setNovaQuantidade(e.target.value)}
                        className="border p-1 w-full"
                      />
                    </td>
                    <td className="border p-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                        onClick={() => salvarEdicao(produto.id)}
                      >
                        Salvar
                      </button>
                      <button
                        className="bg-gray-500 text-white px-3 py-1 rounded"
                        onClick={() => setProdutoEditando(null)}
                      >
                        Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="border p-2">{produto.nome}</td>
                    <td className="border p-2">{produto.categoria}</td>
                    <td className="border p-2">{produto.quantidade}</td>
                    <td className="border p-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                        onClick={() => iniciarEdicao(produto)}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={() => deletarProduto(produto.id)}
                      >
                        Excluir
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
