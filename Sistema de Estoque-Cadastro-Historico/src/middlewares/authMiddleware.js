import jwt from "jsonwebtoken";

const secretKey = "seuSegredoSuperSecreto";

const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ error: "Acesso negado! Nenhum token fornecido." });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido ou expirado." });
  }
};
export { verificarToken };
