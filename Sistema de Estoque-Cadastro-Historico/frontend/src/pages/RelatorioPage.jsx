import { useState, useEffect } from "react";
import axios from "axios";

function RelatorioPage() {
  const [tipoRelatorio, setTipoRelatorio] = useState("geral");
  const [produtos, setProdutos] = useState([]); // Lista de produtos
  const [idProduto, setIdProduto] = useState(""); // ID do produto selecionado
  const [carregando, setCarregando] = useState(false);

  // Buscar produtos ao carregar a página
  useEffect(() => {
    async function carregarProdutos() {
      try {
        const response = await axios.get("http://localhost:4000/produtos"); // Ajuste a URL conforme necessário
        setProdutos(response.data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    }
    carregarProdutos();
  }, []);

  const gerarRelatorio = async () => {
    if (tipoRelatorio === "historicoProduto" && !idProduto) {
      alert("Selecione um produto para gerar o relatório.");
      return;
    }

    setCarregando(true);
    try {
      const url =
        tipoRelatorio === "historicoProduto"
          ? `http://localhost:4000/relatorio/historicoProduto/${idProduto}/pdf`
          : `http://localhost:4000/relatorio/${tipoRelatorio}/pdf`; // ✅ Correção aqui
      console.log("Requisição para:", url); // 🔍 Debug para ver se o ID está correto

      const response = await axios.get(url, { responseType: "blob" });

      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", `relatorio_${tipoRelatorio}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
    }
    setCarregando(false);
  };

  return (
    <div>
      <h2>📊 Gerar Relatórios</h2>

      {/* Dropdown para escolher o tipo de relatório */}
      <label>Escolha o tipo de relatório:</label>
      <select
        value={tipoRelatorio}
        onChange={(e) => setTipoRelatorio(e.target.value)}
      >
        <option value="geral">📄 Relatório Geral</option>
        <option value="produtos">📦 Relatório de Produtos</option>
        <option value="historico">📋 Histórico de Movimentações</option>
        <option value="historicoProduto">🔍 Histórico por Produto</option>
      </select>

      {/* Dropdown para selecionar o produto (só aparece se o tipo for "historicoProduto") */}
      {tipoRelatorio === "historicoProduto" && (
        <div>
          <label>Selecione o Produto:</label>
          <select
            value={idProduto}
            onChange={(e) => setIdProduto(e.target.value)}
          >
            <option value="">-- Escolha um produto --</option>
            {produtos.map((produto) => (
              <option key={produto.id} value={produto.id}>
                {produto.nome}
              </option>
            ))}
          </select>
        </div>
      )}

      <button onClick={gerarRelatorio} disabled={carregando}>
        {carregando ? "Gerando..." : "📥 Baixar Relatório"}
      </button>
    </div>
  );
}

export default RelatorioPage;
