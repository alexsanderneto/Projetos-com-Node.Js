export const validarProduto = (req, res, next) => {
  let { nome, categoria, quantidade, unidade, preco } = req.body;

  quantidade = Number(quantidade);
  preco = Number(preco);

  if (!nome || !categoria || !unidade || isNaN(quantidade) || isNaN(preco)) {
    return res
      .status(400)
      .json({ error: "Todos os campos são obrigatórios e válidos" });
  }

  if (preco <= 0) return res.status(400).json({ error: "Preço inválido" });
  if (quantidade < 0)
    return res.status(400).json({ error: "Quantidade inválida" });

  req.body.quantidade = quantidade;
  req.body.preco = preco;

  next();
};
