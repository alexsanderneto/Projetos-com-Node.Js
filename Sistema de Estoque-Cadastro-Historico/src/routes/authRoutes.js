import express from "express";
import { login, registrar } from "../controllers/authController.js"; // Importando corretamente

const router = express.Router();

router.post("/login", login); // Agora usa a função login corretamente
router.post("/registrar", registrar); // Agora usa a função registrar.

export default router;
