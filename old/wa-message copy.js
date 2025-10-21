

//   // send text message to wa user
//  exports.sendWaMessage= async (req, res, isConnected, sock) => {
// //  launch().then(() => console.log('Whatsapp launched')).catch((err) => console.log(err));

//     console.log(req.body);
//     const messageBody = req.body.message;
//     const number = req.body.number;
//     const files = req.files; // Utiliser req.files pour les fichiers multiples
//   console.log("Number ",number)
//   console.log("Files ",files)
//     let numberWA;
//     try {
//       if (!files || files.length === 0) {
//         // Envoi de message texte uniquement
//         if (!number) {
//           res.status(500).json({
//             status: false,
//             response: "Le numéro WA n'est pas inclus!",
//           });
//         } else {
//           numberWA =  number.substring(1) + "@s.whatsapp.net";
//           console.log("NUmberWA ",numberWA)

//           if (isConnected) {
//             const exists = await sock.onWhatsApp(numberWA);
//             console.log("EXISTS ",exists)
//             if (exists?.jid || (exists && exists[0]?.jid)) {
//               sock
//                 .sendMessage(exists.jid || exists[0].jid, { text: messageBody })
//                 .then((result) => {
//                   res.status(200).json({
//                     status: true,
//                     response: result,
//                   });
//                 })
//                 .catch((err) => {
//                   console.log("ERROR ",err)
//                   res.status(500).json({
//                     status: false,
//                     response: err,
//                   });
//                 });
//             } else {
//               console.log("Not connected n'est pas reportprie")
//               res.status(500).json({
//                 status: false,
//                 response: `Le numéro ${number} n'est pas répertorié.`,
//               });
//             }
//           } else {
//             console.log("Not connected")
//             res.status(500).json({
//               status: false,
//               response: `WhatsApp n'est pas encore connecté.`,
//             });
//           }
//         }
//       } else {
//         // Envoi de fichiers multiples
//         if (!number) {
//           res.status(500).json({
//             status: false,
//             response: "Le numéro WA n'est pas inclus!",
//           });
//         } else {
//           numberWA =  number.substring(1) + "@s.whatsapp.net";

//           if (isConnected) {
//             const exists = await sock.onWhatsApp(numberWA);
//             console.log("EXISTS ",exists)
//             if (exists?.jid || (exists && exists[0]?.jid)) {
//               const jid = exists.jid || exists[0].jid;
//               const sentFiles = [];
//               const errors = [];

//               // Envoyer chaque fichier individuellement
//               for (let i = 0; i < files.length; i++) {
//                 try {
//                   const file = files[i];
//                   const fileName = file.filename || file.originalname;
//                   console.log("FILE NAME ",fileName)
//                   const fileNameWithoutDate = fileName.split("Z-")[1];
//                   console.log("FILE NAME WITHOUT DATE ",fileNameWithoutDate)
//                   const fileNameUploaded = file.path;
//                   const extensionName = path.extname(fileNameUploaded).toLowerCase();

//                   let messageOptions = {
//                     caption: i === 0 ? messageBody : '', // Ajouter la légende seulement au premier fichier
//                     fileName: fileNameWithoutDate,
//                   };

//                   // Déterminer le type de message selon l'extension
//                   if (extensionName === '.pdf' || extensionName === '.xlsx' || extensionName === '.doc' || extensionName === '.docx') {
//                     messageOptions.document = { url: fileNameUploaded };
//                     messageOptions.mimetype = file.mimetype;
//                   } else if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(extensionName)) {
//                     messageOptions.image = { url: fileNameUploaded };
//                     messageOptions.mimetype = file.mimetype;
//                   } else if (['.mp4', '.avi', '.mov', '.mkv'].includes(extensionName)) {
//                     messageOptions.video = { url: fileNameUploaded };
//                     messageOptions.mimetype = file.mimetype;
//                   } else if (['.mp3', '.wav', '.ogg', '.m4a'].includes(extensionName)) {
//                     messageOptions.audio = { url: fileNameUploaded };
//                     messageOptions.mimetype = file.mimetype;
//                   } else {
//                     // Pour les autres types de fichiers, les envoyer comme documents
//                     messageOptions.document = { url: fileNameUploaded };
//                     messageOptions.mimetype = file.mimetype;
//                   }
//                   console.log("MESSAGE OPTIONS ",messageOptions)

//                   const result = await sock.sendMessage(jid, messageOptions);
//                   sentFiles.push({
//                     name: fileName,
//                     mimetype: file.mimetype,
//                     size: file.size,
//                     status: 'success'
//                   });

//                   // Attendre un peu entre chaque envoi pour éviter le spam
//                   if (i < files.length - 1) {
//                     await delay(1000);
//                   }

//                 } catch (error) {
//                   console.log(`Erreur lors de l'envoi du fichier ${files[i].originalname}:`, error);
//                   errors.push({
//                     name: files[i].originalname,
//                     error: error.message
//                   });
//                 }
//               }

//               // Retourner le résultat
//               return res.status(200).json({
//                 status: true,
//                 message: "Fichiers envoyés avec succès",
//                 data: {
//                   sentFiles: sentFiles,
//                   errors: errors,
//                   totalFiles: files.length,
//                   successfulFiles: sentFiles.length,
//                   failedFiles: errors.length
//                 },
//               });

//             } else {
//               console.log(`Le numéro ${number} n'est pas répertorié.`)
//               res.status(500).json({
//                 status: false,
//                 response: `Le numéro ${number} n'est pas répertorié.`,
//               });
//             }
//           } else {
//             console.log("Not connected")
//             res.status(500).json({
//               status: false,
//               response: `WhatsApp n'est pas encore connecté.`,
//             });
//           }
//         }
//       }
//     } catch (err) {
//       console.log("ERROR ",err)
//       res.status(500).json({
//         status: false,
//         response: err.message,
//       });
//     }
//   };
