import express from 'express';
import { Router } from 'express';
const router = Router();
import * as waController from '../whatsapp.js'; // Assurez-vous que le chemin est correct
import * as mail from '../mail.js';

// dans multer.js ou upload.js
import multer from 'multer';

const storage = multer.memoryStorage(); // ✅ EN MÉMOIRE

const upload = multer({ storage });
 
// Créer une nouvelle sortie
router.get('/', waController.initFile);

// Lire toutes les sorties
router.get('/scan', waController.scanFile);
router.post('/message',upload.single('files'), waController.sendMessage);
router.post('/mail/contrat',mail.sendContratMail);
router.post('/mail',upload.array('files',10),mail.sendFileMail);
router.post('/disconnect', waController.removeSession);
router.post('/check-number', waController.checkNumber);
router.post('/search-contact', waController.searchContact);
// Lire une sortie par ID
// router.get('/:id',authenticateToken, sortieController.getSortieById);

// // Mettre à jour une sortie par ID
// router.put('/:id',authenticateToken, sortieController.updateSortie);

// // Supprimer une sortie par ID
// router.delete('/:id',authenticateToken, sortieController.deleteSortie);

export default router;