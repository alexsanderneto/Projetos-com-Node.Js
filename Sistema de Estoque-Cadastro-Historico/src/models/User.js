import { PrismaClient } from "@prisma/client";
import { fileURLToPath } from "url";
import path from "path";

const prisma = new PrismaClient();

// Corrigir __dirname para ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const User = prisma.user; // Modelo do Prisma

export default User;
