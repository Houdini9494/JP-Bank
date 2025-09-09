const express=require("express");
const router=express.Router();
const TransactionController=require("../controllers/TransactionController");
const Auth=require("../middlewares/AuthMiddleware");
/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Esegue un trasferimento di fondi tra due conti
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransferRequest'
 *     responses:
 *       200:
 *         description: Trasferimento completato con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Trasferimento completato con successo
 *       400:
 *         description: Dati non validi, conto mittente non valido o fondi insufficienti
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
*                       example: Fondi insufficienti
 *       404:
 *         description: Conto destinatario non valido
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
*                       example: Conto destinatario non valido
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
*                       example: Errore durante il trasferimento, riprovare piu tardi
 */
router.post("/", Auth.verifyToken, TransactionController.transferFunds); //trasferisce fondi tra 2 conti

/**
 * @swagger
 * /api/transactions/{id}/transactions:
 *   get:
 *     summary: Restituisce tutte le transazioni inviate e ricevute da un conto
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del conto
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transazioni recuperate con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sent:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *                 received:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *       500:
 *         description: Errore nel recupero delle transazioni
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
*                       example: Errore nel recupero delle transazioni
 */
router.get("/:id/transactions", Auth.verifyToken, TransactionController.getTransactions); //recupera storico transazioni

module.exports=router;