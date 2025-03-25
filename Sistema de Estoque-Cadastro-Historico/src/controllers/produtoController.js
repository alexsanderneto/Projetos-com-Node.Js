import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const criarProduto = async (req, res) => {
  try {
    const { nome, categoria, quantidade, unidade, preco } = req.body;

    const produtoExistente = await prisma.produto.findFirst({
      where: { nome, categoria },
    });

    if (produtoExistente) {
      return res.status(400).json({ error: "Produto já cadastrado" });
    }

    const produto = await prisma.produto.create({
      data: { nome, categoria, quantidade, unidade, preco },
    });

    await prisma.historico.create({
      data: {
        tipo: "Criação",
        descricao: `Produto ${nome} foi criado.`,
        produtoId: produto.id,
      },
    });

    res.status(201).json(produto);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar produto" });
  }
};
const editarProduto = async (req, res) => {
  try {
    const { id } = req.params; // ID vem da URL como String
    let { nome, categoria, quantidade, unidade, preco } = req.body;

    // ✅ Verifica se o produto existe antes de editar
    const produtoExistente = await prisma.produto.findUnique({
      where: { id: id }, // Mantém como String
    });

    if (!produtoExistente) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    // ✅ Converte quantidade e preço para número, se existirem
    quantidade = quantidade ? Number(quantidade) : produtoExistente.quantidade;
    preco = preco ? Number(preco) : produtoExistente.preco;

    if (quantidade < 0) {
      return res
        .status(400)
        .json({ error: "Quantidade não pode ser negativa" });
    }
    if (preco <= 0) {
      return res.status(400).json({ error: "Preço deve ser maior que zero" });
    }

    // ✅ Atualiza o produto no banco
    const produtoAtualizado = await prisma.produto.update({
      where: { id: id }, // Mantém como String
      data: { nome, categoria, quantidade, unidade, preco },
    });

    res
      .status(200)
      .json({ message: "Produto atualizado com sucesso!", produtoAtualizado });
  } catch (error) {
    console.error("Erro ao editar produto:", error);
    res.status(500).json({ error: "Erro ao editar produto. Tente novamente." });
  }
};
/*
const editarProduto = async (req, res) => {
  const { id } = req.params;
  const { nome, categoria, quantidade, unidade, preco } = req.body;

  try {
    const produtoAtualizado = await prisma.produto.update({
      where: { id },
      data: { nome, categoria, quantidade, unidade, preco },
    });

    res.status(200).json(produtoAtualizado);
  } catch (error) {
    console.error("Erro ao editar produto:", error);
    res.status(500).json({ error: "Erro ao editar produto" });
  }
};

/*
const criarProduto = async (req, res) => {
  try {
    let { nome, categoria, quantidade, unidade, preco } = req.body;

    // ✅ Validação dos campos obrigatórios
    if (!nome || !categoria || !unidade) {
      return res
        .status(400)
        .json({ error: "Nome, categoria e unidade são obrigatórios" });
    }

    quantidade = Number(quantidade);
    preco = Number(preco);

    if (isNaN(quantidade) || quantidade < 0) {
      return res
        .status(400)
        .json({ error: "Quantidade deve ser um número positivo" });
    }
    if (isNaN(preco) || preco <= 0) {
      return res
        .status(400)
        .json({ error: "Preço deve ser um número maior que zero" });
    }

    // ✅ Criar produto no banco de dados
    const produto = await prisma.produto.create({
      data: { nome, categoria, quantidade, unidade, preco },
    });

    res
      .status(201)
      .json({ message: "Produto cadastrado com sucesso!", produto });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res
      .status(500)
      .json({ error: "Erro ao criar produto. Tente novamente mais tarde." });
  }
};
*/
const listarProdutos = async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany();
    res.status(200).json(produtos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar produtos" });
  }
};

const deletarProduto = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar se o produto existe
    const produtoExiste = await prisma.produto.findUnique({
      where: { id },
    });

    if (!produtoExiste) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    // 🔹 Deletar todas as movimentações associadas ao produto
    await prisma.historico.deleteMany({
      where: { produtoId: id },
    });

    // 🔹 Agora podemos deletar o produto
    await prisma.produto.delete({
      where: { id },
    });

    res.json({ message: "Produto e histórico deletados com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    res.status(500).json({ error: "Erro ao deletar produto" });
  }
};
export { criarProduto, listarProdutos, deletarProduto, editarProduto };
