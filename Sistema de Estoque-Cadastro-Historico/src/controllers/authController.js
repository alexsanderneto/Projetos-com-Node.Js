import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const login = async (req, res) => {
  try {
    console.log("Dados recebidos:", req.body); // Log para depuração

    // Verifica se os dados foram enviados corretamente
    const { email, senha } = req.body;
    if (!email || !senha) {
      console.log("Erro: Email ou senha não fornecidos.");
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    console.log("Buscando usuário no banco de dados...");
    const user = await prisma.usuario.findUnique({ where: { email } });

    if (!user) {
      console.log("Usuário não encontrado!");
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    console.log("Usuário encontrado:", user);

    const validSenha = await bcrypt.compare(senha, user.senha);
    if (!validSenha) {
      console.log("Senha incorreta!");
      return res.status(401).json({ error: "Senha incorreta" });
    }

    console.log("Gerando token...");
    const token = jwt.sign({ id: user.id }, "secreto", { expiresIn: "1h" });

    res.json({ message: "Login bem-sucedido", token });
  } catch (error) {
    console.error("Erro no servidor:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};
const registrar = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt); // 🔒 Criptografando senha

    const newUser = await prisma.usuario.create({
      data: { nome, email, senha: hashedPassword }, // Salvando a senha criptografada
    });

    res
      .status(201)
      .json({ message: "Usuário criado com sucesso!", user: newUser });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
};
const atualizarSenhas = async () => {
  const usuarios = await prisma.usuario.findMany(); // Buscar todos os usuários

  for (const user of usuarios) {
    if (!user.senha.startsWith("$2b$")) {
      // Verifica se a senha já está criptografada
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.senha, salt);

      await prisma.usuario.update({
        where: { id: user.id },
        data: { senha: hashedPassword },
      });

      console.log(`Senha de ${user.email} atualizada!`);
    }
  }
};

atualizarSenhas();

export { login, registrar };
