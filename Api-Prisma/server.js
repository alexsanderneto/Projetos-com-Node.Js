/*
Métodos http - Verbos.
Get -> Listar
Post -> Criar
Put -> Editar vários.
Patch -> Editar um
Delete -> Deletar



Rota é comunicação entre front-end e back-end.


*/
import cors from "cors";
import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const app = express();

app.use(express.json());
app.use(cors());
//Criar usuário novo
app.post("/usuarios", async (req, res) => {
  await prisma.User.create({
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age,
    },
  });

  res.status(201).json(req.body);
});

//Buscar os usuários.
app.get("/usuarios", async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
});

//Editar usuário

app.put("/usuarios/:id", async (req, res) => {
  await prisma.User.create({
    where: {
      id: req.params.id,
    },
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age,
    },
  });

  res.status(201).json(req.body);
});

app.delete("/usuarios/:id", async (req, res) => {
  await prisma.user.delete({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json({ message: "Usuário deletado com sucesso!" });
});

app.listen(4000);

/*
    1) Tipo de Rota / Método HTTP
    2) Endereço 

    Criar nossa API de usuários.
    - Criar um usuário

    -Listar todos os usuários.
    - Editar um usuário
    - Deletar um usuário.
    */
