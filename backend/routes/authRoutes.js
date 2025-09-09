const express = require("express");
//importazione del controller di login e di registrazione
const AuthController = require("../controllers/AuthController");
//creazione dell'app router per gestire le rotte
const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuovo utente
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewUser'
 *     responses:
 *       200:
 *         description: Utente registrato con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utente registrato con successo
 *       400:
 *         description: Campi mancanti
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Tutti i campi sono obbligatori
 *       409:
 *         description: Email già registrata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Email già in uso
 *       500:
 *         description: Errore generico durante la registrazione
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Errore durante la registrazione, riprovare piu tardi
 */
router.post("/register", AuthController.register); //registra nuovo utente

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Effettua il login di un utente e restituisce un token JWT
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUser'
 *     responses:
 *       200:
 *         description: Login riuscito, restituisce un token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6...
 *       400:
 *         description: Campi mancanti o credenziali non valide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Password non valida
 *       500:
 *         description: Errore durante il login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Errore durante il login, riprovare piu tradi
 */
router.post("/login", AuthController.login); //login di utenti già esistenti

//esportazione router
module.exports = router;