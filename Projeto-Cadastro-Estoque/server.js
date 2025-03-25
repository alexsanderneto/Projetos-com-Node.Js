import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import produtoRoutes from "./src/routes/produtoRoutes.js";
import movimentacaoRoutes from "./src/routes/movimentacaoRoutes.js";
import historicoRoutes from "./src/routes/historicoRoutes.js";
import relatorioRoutes from "./src/routes/relatorioRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: "http://localhost:5173", credentials: true })); // 🔥 Aplica o CORS antes de qualquer rota
app.use(express.json()); // Garante que o JSON do body seja lido corretamente

// 📌 Carregar as rotas organizadas
app.use("/api", authRoutes);
app.use("/produtos", produtoRoutes);
app.use("/movimentacoes", movimentacaoRoutes);
app.use("/historico", historicoRoutes);
app.use("/relatorio", relatorioRoutes);
app.use("/auth", authRoutes);

const PORT = 4000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));

/*
Métodos http - Verbos.
Get -> Listar
Post -> Criar
Put -> Editar vários.
Patch -> Editar um
Delete -> Deletar



Rota é comunicação entre front-end e back-end.


/*
import cors from "cors";
import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();




*/
/*
import PDFDocument from "pdfkit";
import { createWriteStream } from "fs";
import fs from "fs";
import path from "path";
import { ObjectId } from "mongodb";

const app = express();

app.use(express.json());
app.use(cors());

// 📥 Criar produto - Funcional é com Histórico
app.post("/produtos", async (req, res) => {
  const { nome, categoria, quantidade, unidade, preco } = req.body;

  // Verificar se todos os campos estão presentes
  if (!nome || !categoria || !quantidade || !unidade || !preco) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  } else if (typeof preco !== "number" || preco <= 0) {
    return res.status(400).json({ error: "Preço inválido" });
  } else if (typeof quantidade !== "number" || quantidade < 0) {
    return res.status(400).json({ error: "Quantidade inválida" });
  }

  // Verificar se o produto já existe no banco de dados
  const produtoExistente = await prisma.produto.findFirst({
    where: {
      nome,
      categoria, // Evitar duplicação pelo nome e categoria
    },
  });

  if (produtoExistente) {
    return res.status(400).json({ error: "Produto já cadastrado" });
  } else {
    try {
      // Criar o produto
      const produto = await prisma.produto.create({
        data: {
          nome,
          categoria,
          quantidade,
          unidade,
          preco,
        },
      });

      console.log("Esse produto já existe no banco de dados" + produto);

      // Criar um histórico de criação do produto
      await prisma.historico.create({
        data: {
          tipo: "Criação",
          descricao: `Produto ${nome} foi criado.`,
          produtoId: produto.id, // Usando o id do produto criado
        },
      });

      // Retornar o produto criado e uma mensagem de sucesso
      res.status(201).json(produto);
      console.log(`Produto ${nome} criado e registrado no histórico.`);
    } catch (error) {
      // Caso ocorra algum erro na criação
      console.error("Erro ao criar produto:", error);
      res.status(500).json({ error: "Erro ao criar produto" });
    }
  }
});

//Histórico ---

app.get("/produtos/:id/historico", async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se o ID é válido antes de buscar no banco
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    // Converte o ID para ObjectId antes da busca no banco
    const produto = await prisma.produto.findUnique({
      where: { id: id },
    });

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    // Buscar o histórico do produto pelo ID
    const historico = await prisma.historico.findMany({
      where: { produtoId: id },
      orderBy: { createdAt: "desc" }, // Ordenar do mais recente para o mais antigo
    });

    console.log("Histórico encontrado:", historico); // Depuração no console

    if (historico.length === 0) {
      return res
        .status(404)
        .json({ error: "Nenhum histórico encontrado para este produto" });
    }

    res.status(200).json(historico);
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    res.status(500).json({ error: "Erro ao buscar histórico" });
  }
});

app.get("/produtos/:id/historico/pdf", async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica se o ID é válido antes de buscar no banco
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    // Buscar o produto para exibir no relatório
    const produto = await prisma.produto.findUnique({ where: { id } });

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    // Buscar o histórico do produto pelo ID
    const historico = await prisma.historico.findMany({
      where: { produtoId: id },
      orderBy: { createdAt: "desc" }, // Ordenar do mais recente para o mais antigo
    });

    if (!historico.length) {
      return res
        .status(404)
        .json({ error: "Nenhum histórico encontrado para este produto" });
    }

    // Criar o documento PDF
    const doc = new PDFDocument({ margin: 40 });

    // Configurar cabeçalhos para exibir o PDF no navegador
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=historico_${produto.nome}.pdf`
    );

    doc.pipe(res);

    // 🏷️ **Título do relatório**
    doc
      .fontSize(18)
      .text("Relatório de Histórico do Produto", { align: "center" });
    doc.moveDown();
    doc
      .fontSize(12)
      .text(`Produto: ${produto.nome} (Categoria: ${produto.categoria})`, {
        align: "left",
      });
    doc.moveDown();

    // 📋 **Cabeçalho da tabela**
    doc.font("Courier-Bold").fontSize(10);
    doc.text("TIPO".padEnd(15) + "DESCRIÇÃO".padEnd(50) + "DATA", {
      continued: false,
    });
    doc.font("Courier").moveDown(0.5);

    // 📝 **Adicionar cada registro do histórico**
    historico.forEach((h) => {
      const linha =
        h.tipo.padEnd(15).substring(0, 15) +
        h.descricao.padEnd(50).substring(0, 50) +
        new Date(h.createdAt).toLocaleDateString("pt-BR");
      doc.text(linha);
    });

    doc.end();
  } catch (error) {
    console.error("Erro ao gerar PDF do histórico do produto:", error);
    res.status(500).json({ error: "Erro ao gerar PDF do histórico" });
  }
});
//FIM

// 📄 Listar todos os produtos - Tá listando corretamente
app.get("/produtos", async (req, res) => {
  try {
    // Buscar todos os produtos da tabela
    const produtos = await prisma.produto.findMany();

    // Verifique se não há produtos e retorne uma resposta adequada
    if (produtos.length === 0) {
      return res.status(404).json({ message: "Nenhum produto encontrado" });
    }

    // Retorne os produtos encontrados com status 200
    res.status(200).json(produtos);
  } catch (error) {
    // Caso ocorra um erro, retorne status 500 (erro no servidor)
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
  console.log("Está buscando dados corretamente");
});

// ➕ Entrada de estoque -- Entrada de produtos no estoque


 
app.post("/produtos/:id/entrada", async (req, res) => {
  try {
    const { id } = req.params;
    let { quantidade } = req.body;
    quantidade = Number(quantidade);

    if (!quantidade || quantidade <= 0) {
      return res.status(400).json({ error: "Quantidade inválida" });
    }

    // Verifica se o produto existe
    const produto = await prisma.produto.findUnique({ where: { id } });
    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    // Atualiza o estoque
    const produtoAtualizado = await prisma.produto.update({
      where: { id },
      data: { quantidade: { increment: quantidade } },
    });

    // Registra a movimentação
    await prisma.movimentacao.create({
      data: {
        tipo: "ENTRADA",
        quantidade,
        produtoId: id,
      },
    });

    res.status(200).json(produtoAtualizado);
  } catch (error) {
    console.error("Erro ao registrar entrada:", error);
    res.status(500).json({ error: "Erro ao registrar entrada" });
  }
});

// ➖ Saída de estoque -- Saida de produtos no estoque
app.post("/produtos/:id/saida", async (req, res) => {
  try {
    const { id } = req.params;
    let { quantidade } = req.body;
    quantidade = Number(quantidade);

    if (!quantidade || quantidade <= 0) {
      return res.status(400).json({ error: "Quantidade inválida" });
    }

    const produto = await prisma.produto.findUnique({ where: { id } });

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    if (produto.quantidade < quantidade) {
      return res.status(400).json({ error: "Estoque insuficiente" });
    }

    const produtoAtualizado = await prisma.produto.update({
      where: { id },
      data: { quantidade: { decrement: quantidade } },
    });

    // Registra a movimentação
    await prisma.movimentacao.create({
      data: {
        tipo: "SAIDA",
        quantidade,
        produtoId: id,
      },
    });

    res.status(200).json(produtoAtualizado);
  } catch (error) {
    console.error("Erro ao registrar saída:", error);
    res.status(500).json({ error: "Erro ao registrar saída" });
  }
});

// Histórico de todos produtos

//Deletar produtos nulos
app.delete("/produtos/nome-null", async (req, res) => {
  try {
    const deletados = await prisma.produto.deleteMany({
      where: {
        nome: {
          equals: null,
        },
      },
    });

    res.status(200).json({
      message: `${deletados.count} produto(s) deletado(s) com nome nulo.`,
    });
  } catch (error) {
    console.error("Erro ao deletar produtos com nome null:", error);
    res.status(500).json({ error: "Erro ao deletar produtos com nome null" });
  }
  console.log("Deletados com nulo");
});
// Rota para deletar um produto
app.delete("/produtos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar se o produto existe
    const produtoExistente = await prisma.produto.findUnique({
      where: { id },
    });

    if (!produtoExistente) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    // Deletar o produto
    const produtoDeletado = await prisma.produto.delete({
      where: { id },
    });

    // Registrar o histórico de exclusão
    await prisma.historico.create({
      data: {
        tipo: "Exclusão",
        descricao: `Produto ${produtoDeletado.nome} foi excluído.`,
        produtoId: produtoDeletado.id,
      },
    });

    res.status(200).json({
      message: `Produto ${produtoDeletado.nome} excluído com sucesso.`,
    });
    console.log(`Produto ${produtoDeletado.nome} excluído com sucesso.`);
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    res.status(500).json({ error: "Erro ao excluir produto" });
  }
});

//Criar PDF com os dados

// Rota para gerar o PDF
app.get("/gerar-pdf", (req, res) => {
  const doc = new PDFDocument();

  // Define o tipo de conteúdo e nome do arquivo
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=relatorio.pdf");

  // Pipe diretamente para a resposta
  doc.pipe(res);

  // Conteúdo do PDF
  doc
    .fontSize(20)
    .text("Relatório de Produtos e Histórico", { align: "center" });
  doc.moveDown();
  doc
    .fontSize(12)
    .text("Este é um exemplo simples de geração de PDF com pdfkit.");

  // Finaliza o documento
  doc.end();
});

// FIM GERADOR DE PDF

// Testando os relatórios --
app.get("/relatorio-produtos", async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany();

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=relatorio.pdf");
    doc.pipe(res);

    // 🖼️ Logo
    const logoPath = path.join("public", "logo.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, { width: 80 });
    }

    // 📄 Título
    doc.fontSize(18).text("Relatório de Produtos", { align: "center" });
    const dataAtual = new Date().toLocaleString("pt-BR");
    doc.fontSize(10).text(`Gerado em: ${dataAtual}`, { align: "right" });

    doc.moveDown();

    // 🧾 Cabeçalho com alinhamento fixo
    doc.font("Courier-Bold").fontSize(10);
    doc.text(
      "NOME".padEnd(25) +
        "CATEGORIA".padEnd(20) +
        "QTD".padEnd(6) +
        "UND".padEnd(6) +
        "PREÇO (R$)",
      {
        continued: false,
      }
    );

    doc.font("Courier").moveDown(0.5);

    // 📋 Conteúdo alinhado com padEnd
    produtos.forEach((p) => {
      const linha =
        p.nome.padEnd(25).substring(0, 25) +
        p.categoria.padEnd(20).substring(0, 20) +
        String(p.quantidade).padEnd(6) +
        p.unidade.padEnd(6) +
        p.preco.toFixed(2);
      doc.text(linha);
    });

    doc.end();
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    res.status(500).json({ error: "Erro ao gerar PDF" });
  }
});
// filtros do relatório

app.get("/relatorio-movimentacoes", async (req, res) => {
  try {
    // Capturar os filtros enviados na URL
    const { inicio, fim, tipo, produto } = req.query;
    const where = {};

    // Filtro por data (se os parâmetros forem enviados)
    if (inicio && fim) {
      where.data = {
        gte: new Date(inicio),
        lte: new Date(fim),
      };
    }

    // Filtro por tipo (ENTRADA ou SAÍDA)
    if (tipo) {
      where.tipo = tipo.toUpperCase(); // Garante que está em caixa alta
    }

    // Filtro por produto (busca pelo nome do produto)
    if (produto) {
      const produtoEncontrado = await prisma.produto.findFirst({
        where: { nome: { equals: produto, mode: "insensitive" } },
      });

      if (produtoEncontrado) {
        where.produtoId = produtoEncontrado.id;
      } else {
        return res.status(404).json({ error: "Produto não encontrado" });
      }
    }

    // Buscar movimentações aplicando os filtros
    const movimentacoes = await prisma.movimentacao.findMany({
      where,
      include: { produto: true }, // Inclui informações do produto na resposta
      orderBy: { data: "desc" }, // Ordena da mais recente para a mais antiga
    });

    // Criar o PDF
    const doc = new PDFDocument({ margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=movimentacoes.pdf");
    doc.pipe(res);

    // Título do relatório
    doc.fontSize(18).text("Relatório de Movimentações", { align: "center" });
    doc.fontSize(10).text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, {
      align: "right",
    });
    doc.moveDown();

    // Mostrar filtros aplicados
    if (inicio && fim) doc.text(`Período: ${inicio} até ${fim}`);
    if (tipo) doc.text(`Tipo: ${tipo}`);
    if (produto) doc.text(`Produto: ${produto}`);
    doc.moveDown(2);

    // Cabeçalho da tabela
    doc.font("Courier-Bold").fontSize(10);
    doc.text(
      "PRODUTO".padEnd(25) + "TIPO".padEnd(10) + "QTD".padEnd(6) + "DATA",
      { continued: false }
    );

    doc.font("Courier").moveDown(0.5);

    // Adicionar as movimentações ao relatório
    movimentacoes.forEach((m) => {
      const linha =
        (m.produto?.nome || "N/A").padEnd(25).substring(0, 25) +
        m.tipo.padEnd(10).substring(0, 10) +
        String(m.quantidade).padEnd(6) +
        new Date(m.data).toLocaleDateString("pt-BR");
      doc.text(linha);
    });

    doc.end();
  } catch (error) {
    console.error("Erro ao gerar relatório de movimentações:", error);
    res.status(500).json({ error: "Erro ao gerar PDF" });
  }
});

//

const PORT = 4000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));

/*








/*
    1) Tipo de Rota / Método HTTP
    2) Endereço 

    Criar nossa API de usuários.
    - Criar um usuário

    -Listar todos os usuários.
    - Editar um usuário
    - Deletar um usuário.
    */
