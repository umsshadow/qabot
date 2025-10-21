const express = require('express');
const router = express.Router();
const waController = require('../whatsapp'); // Assurez-vous que le chemin est correct
const mail = require('../mail');

// dans multer.js ou upload.js
const multer = require('multer');

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

module.exports = router;