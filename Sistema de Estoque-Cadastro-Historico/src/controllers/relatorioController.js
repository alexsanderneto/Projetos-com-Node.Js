import { PrismaClient } from "@prisma/client";
import PDFDocument from "pdfkit";
import { ObjectId } from "mongodb";
const prisma = new PrismaClient();

/**
 * 📌 Gerar relatório geral de TODOS os produtos e histórico
 */
const gerarRelatorioGeralHistorico = async (req, res) => {
  try {
    // Buscar todos os produtos no banco
    const produtos = await prisma.produto.findMany({
      orderBy: { nome: "asc" }, // Ordena os produtos pelo nome
    });

    // Buscar todo o histórico de movimentações
    const historico = await prisma.historico.findMany({
      include: { produto: true },
      orderBy: { createdAt: "desc" },
    });

    if (produtos.length === 0 && historico.length === 0) {
      return res
        .status(404)
        .json({ error: "Nenhum produto ou histórico encontrado" });
    }

    // Criar documento PDF
    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "inline; filename=relatorio_geral.pdf"
    );
    doc.pipe(res);

    // 🏷️ **Título**
    doc
      .fontSize(18)
      .text("Relatório Geral de Produtos e Histórico", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, {
      align: "right",
    });
    doc.moveDown(2);

    // 📦 **Seção de Produtos**
    doc.fontSize(16).fillColor("black").text("Lista de Produtos Cadastrados:");
    doc.moveDown(0.5);
    doc.font("Courier-Bold").fontSize(10);
    doc.text(
      "ID".padEnd(25) +
        "NOME".padEnd(25) +
        "CATEGORIA".padEnd(20) +
        "QTD".padEnd(6) +
        "PREÇO",
      { continued: false }
    );
    doc.font("Courier").moveDown(0.5);

    produtos.forEach((p) => {
      doc.text(
        p.id.padEnd(25) +
          p.nome.padEnd(25).substring(0, 25) +
          p.categoria.padEnd(20).substring(0, 20) +
          String(p.quantidade).padEnd(6) +
          `R$ ${p.preco.toFixed(2)}`
      );
    });

    doc.moveDown(2);

    // 📋 **Seção de Histórico**
    if (historico.length > 0) {
      doc.fontSize(16).fillColor("black").text("Histórico de Movimentações:");
      doc.moveDown(0.5);
      doc.font("Courier-Bold").fontSize(10);
      doc.text(
        "PRODUTO".padEnd(25) + "TIPO".padEnd(10) + "QTD".padEnd(6) + "DATA",
        { continued: false }
      );
      doc.font("Courier").moveDown(0.5);

      historico.forEach((h) => {
        doc.text(
          (h.produto?.nome || "Desconhecido").padEnd(25).substring(0, 25) +
            h.tipo.padEnd(10).substring(0, 10) +
            String(h.quantidade).padEnd(6) +
            new Date(h.createdAt).toLocaleDateString("pt-BR")
        );
      });
    } else {
      doc
        .fontSize(12)
        .text("Nenhuma movimentação encontrada.", { align: "left" });
    }

    doc.end();
  } catch (error) {
    console.error("Erro ao gerar relatório geral:", error);
    res.status(500).json({ error: "Erro ao gerar PDF do relatório geral" });
  }
};
//Produtos -==

const gerarRelatorioProdutos = async (req, res) => {
  try {
    // Buscar todos os produtos no banco
    const produtos = await prisma.produto.findMany({
      orderBy: { nome: "asc" }, // Ordena os produtos pelo nome
    });

    if (produtos.length === 0) {
      return res.status(404).json({ error: "Nenhum produto encontrado" });
    }

    // Criar documento PDF
    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "inline; filename=relatorio_produtos.pdf"
    );
    doc.pipe(res);

    // 🏷️ **Título**
    doc
      .fontSize(18)
      .text("Relatório de Produtos Cadastrados", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, {
      align: "right",
    });
    doc.moveDown(2);

    // 📦 **Lista de Produtos**
    doc.fontSize(16).fillColor("black").text("Lista de Produtos:");
    doc.moveDown(0.5);
    doc.font("Courier-Bold").fontSize(10);
    doc.text(
      "ID".padEnd(25) +
        "NOME".padEnd(25) +
        "CATEGORIA".padEnd(20) +
        "QTD".padEnd(6) +
        "PREÇO",
      { continued: false }
    );
    doc.font("Courier").moveDown(0.5);

    produtos.forEach((p) => {
      doc.text(
        p.id.padEnd(25) +
          p.nome.padEnd(25).substring(0, 25) +
          p.categoria.padEnd(20).substring(0, 20) +
          String(p.quantidade).padEnd(6) +
          `R$ ${p.preco.toFixed(2)}`
      );
    });

    doc.end();
  } catch (error) {
    console.error("Erro ao gerar relatório de produtos:", error);
    res.status(500).json({ error: "Erro ao gerar PDF de produtos" });
  }
};

//
/*

*/
const gerarRelatorioHistoricoProduto = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Parâmetros recebidos:", req.params); // Verifica se o id chega corretamente

    if (!id) {
      return res.status(400).json({ error: "ID do produto não fornecido." });
    }

    if (!id) {
      return res.status(400).json({ error: "ID do produto não fornecido." });
    }

    console.log("Recebendo requisição para ID:", id);

    const produto = await prisma.produto.findUnique({
      where: { id: String(id) },
    });

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    const historico = await prisma.historico.findMany({
      where: { produtoId: String(id) },
      orderBy: { createdAt: "desc" },
    });

    if (historico.length === 0) {
      return res
        .status(404)
        .json({ error: "Nenhum histórico encontrado para este produto." });
    }

    // Criar documento PDF
    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=historico_${produto.nome}.pdf`
    );

    doc.pipe(res);

    doc
      .fontSize(18)
      .text(`Relatório de Histórico do Produto: ${produto.nome}`, {
        align: "center",
      });
    doc.moveDown();
    doc.fontSize(12).text(`Categoria: ${produto.categoria}`, { align: "left" });
    doc.moveDown();

    doc.font("Courier-Bold").fontSize(10);
    doc.text("TIPO".padEnd(15) + "DESCRIÇÃO".padEnd(50) + "DATA", {
      continued: false,
    });
    doc.font("Courier").moveDown(0.5);

    historico.forEach((h) => {
      const linha =
        h.tipo.padEnd(15) +
        h.descricao.padEnd(50) +
        new Date(h.createdAt).toLocaleDateString("pt-BR");
      doc.text(linha);
    });

    doc.end();
  } catch (error) {
    console.error("Erro ao gerar relatório do histórico:", error);
    res.status(500).json({ error: "Erro ao gerar PDF do histórico" });
  }
};

////
const gerarRelatorioHistorico = async (req, res) => {
  try {
    // Buscar todo o histórico de movimentações
    const historico = await prisma.historico.findMany({
      include: { produto: true },
      orderBy: { createdAt: "desc" },
    });

    if (historico.length === 0) {
      return res.status(404).json({ error: "Nenhum histórico encontrado" });
    }

    // Criar documento PDF
    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "inline; filename=relatorio_historico.pdf"
    );
    doc.pipe(res);

    doc
      .fontSize(18)
      .text("Relatório de Histórico de Movimentações", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, {
      align: "right",
    });
    doc.moveDown(2);

    doc.fontSize(16).fillColor("black").text("Histórico de Movimentações:");
    doc.moveDown(0.5);
    doc.font("Courier-Bold").fontSize(10);
    doc.text(
      "PRODUTO".padEnd(25) + "TIPO".padEnd(10) + "QTD".padEnd(6) + "DATA",
      { continued: false }
    );
    doc.font("Courier").moveDown(0.5);

    historico.forEach((h) => {
      doc.text(
        (h.produto?.nome || "Desconhecido").padEnd(25).substring(0, 25) +
          h.tipo.padEnd(10).substring(0, 10) +
          String(h.quantidade).padEnd(6) +
          new Date(h.createdAt).toLocaleDateString("pt-BR")
      );
    });

    doc.end();
  } catch (error) {
    console.error("Erro ao gerar relatório do histórico:", error);
    res.status(500).json({ error: "Erro ao gerar PDF do histórico" });
  }
};
export {
  gerarRelatorioProdutos,
  gerarRelatorioHistorico,
  gerarRelatorioHistoricoProduto,
  gerarRelatorioGeralHistorico,
};
