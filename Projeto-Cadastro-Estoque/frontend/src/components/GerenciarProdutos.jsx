import { useState, useEffect } from "react";
import axios from "axios";

function GerenciarProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    categoria: "",
    quantidade: 0,
    unidade: "",
    preco: 0,
  });

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const response = await axios.get("http://localhost:4000/produtos"); // Ajuste a URL conforme necessário
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const deletarProduto = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/produtos/${id}`);
      setProdutos(produtos.filter((produto) => produto.id !== id));
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
    }
  };

  const editarProduto = (produto) => {
    setEditando(produto.id);
    setNovoProduto({
      nome: produto.nome,
      categoria: produto.categoria,
      quantidade: produto.quantidade,
      unidade: produto.unidade,
      preco: produto.preco,
    });
  };

  const salvarEdicao = async (id) => {
    try {
      await axios.put(`http://localhost:4000/produtos/${id}`, novoProduto);

      setProdutos(
        produtos.map((produto) =>
          produto.id === id ? { ...produto, ...novoProduto } : produto
        )
      );
      setEditando(null);
    } catch (error) {
      console.error("Erro ao editar produto:", error);
    }
  };

  return (
    <div>
      <h2>⚙️ Página de Gerenciamento de Produtos</h2>
      {produtos.length > 0 ? (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Quantidade</th>
              <th>Unidade</th>
              <th>Preço (R$)</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => (
              <tr key={produto.id}>
                {editando === produto.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={novoProduto.nome}
                        onChange={(e) =>
                          setNovoProduto({
                            ...novoProduto,
                            nome: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={novoProduto.categoria}
                        onChange={(e) =>
                          setNovoProduto({
                            ...novoProduto,
                            categoria: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={novoProduto.quantidade}
                        onChange={(e) =>
                          setNovoProduto({
                            ...novoProduto,
                            quantidade: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={novoProduto.unidade}
                        onChange={(e) =>
                          setNovoProduto({
                            ...novoProduto,
                            unidade: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={novoProduto.preco}
                        onChange={(e) =>
                          setNovoProduto({
                            ...novoProduto,
                            preco: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td>
                      <button onClick={() => salvarEdicao(produto.id)}>
                        💾 Salvar
                      </button>
                      <button onClick={() => setEditando(null)}>
                        ❌ Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{produto.nome}</td>
                    <td>{produto.categoria}</td>
                    <td>{produto.quantidade}</td>
                    <td>{produto.unidade}</td>
                    <td>{produto.preco.toFixed(2)}</td>
                    <td>
                      <button onClick={() => editarProduto(produto)}>
                        ✏️ Editar
                      </button>
                      <button onClick={() => deletarProduto(produto.id)}>
                        🗑️ Excluir
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Carregando produtos...</p>
      )}
    </div>
  );
}

export default GerenciarProdutos;
