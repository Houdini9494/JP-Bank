const express = require("express");
//importazione account controller
const AccountController = require("../controllers/AccountController");
//importazione del middleware di autenticazione che verifica se l'utente è autenticato tramite JWT
const Auth = require("../middlewares/AuthMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/accounts:
 *   get:
 *     summary: Restituisce tutti i conti dell’utente autenticato
 *     tags:
 *       - Accounts
 *     responses:
 *       200:
 *         description: Lista dei conti dell’utente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Account'
 *       404:
 *         description: Nessun conto trovato
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
 *                       example: Nessun conto trovato
 *       500:
 *         description: Errore durante il recupero dei conti
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
 *                      message:
 *                       type: string
 *                       example: Errore durante il recupero dei conti
 */

router.get("/", Auth.verifyToken, AccountController.getAccounts); //recupera tutti i conti

/**
 * @swagger
 * /api/accounts:
 *   post:
 *     summary: Crea un nuovo conto bancario
 *     tags:
 *       - Accounts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewAccount'
 *     responses:
 *       200:
 *         description: Conto creato con successo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       409:
 *         description: Numero massimo di conti raggiunto
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
 *                       example: Limite massimo di conti raggiunto
 *       500:
 *         description: Errore durante la creazione del conto
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
 *                       example: Errore durante la creazione del conto
 */

router.post("/", Auth.verifyToken, AccountController.createAccount); //crea un nuovo conto

/**
 * @swagger
 * /api/accounts/{id}/close:
 *   patch:
 *     summary: Chiude un conto bancario (se saldo = 0)
 *     tags:
 *       - Accounts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del conto da chiudere
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Conto chiuso con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Conto chiuso con successo
 *       400:
 *         description: Errore di validazione saldo non nullo
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
 *                       example: Il conto deve avere saldo zero per essere chiuso; devi prima spostare i fondi.
 *       404:
 *         description: Errore di validazione conto non trovato
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
 *                       example: Conto non trovato
 *       500:
 *         description: Errore interno del server
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
 *                       example: Errore durante la chiusura del conto
 */
router.patch("/:id/close", Auth.verifyToken, AccountController.closeAccount); //chiude conto
//il metodo PATCH viene utilizzato per modificare parzialmente una risorsa esistente nel database
//in questo caso viene impostato il conto, identificato con :id, ad 'inactive'

module.exports = router;