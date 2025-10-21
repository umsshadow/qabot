

  // send text message to wa user
 export const sendWaMessage= async (req, res, isConnected, sock) => {
//  launch().then(() => console.log('Whatsapp launched')).catch((err) => console.log(err));

    console.log(req.body);
    const messageBody = req.body.message;
    const number = req.body.number;
    const files = req.files || req.file; // Utiliser req.files pour les fichiers multiples

  console.log("Number ",number)
  console.log("Files ",files)
    let numberWA;
    try {
      if (!files || files.length === 0) {
        console.log("No files to send");
        // Envoi de message texte uniquement
        if (!number) {
          res.status(500).json({
            status: false,
            response: "Le numéro WA n'est pas inclus!",
          });
        } else {
          numberWA =  number.substring(1) + "@s.whatsapp.net";
          console.log("NUmberWA ",numberWA)

          if (isConnected) {
            const exists = await sock.onWhatsApp(numberWA);
            console.log("EXISTS ",exists)
            if (exists?.jid || (exists && exists[0]?.jid)) {
              sock
                .sendMessage(exists.jid || exists[0].jid, { text: messageBody })
                .then((result) => {
                  res.status(200).json({
                    status: true,
                    response: result,
                  });
                })
                .catch((err) => {
                  console.log("ERROR ",err)
                  res.status(500).json({
                    status: false,
                    response: err,
                  });
                });
            } else {
              console.log("Not connected n'est pas reportprie")
              res.status(500).json({
                status: false,
                response: `Le numéro ${number} n'est pas répertorié.`,
              });
            }
          } else {
            console.log("Not connected")
            res.status(500).json({
              status: false,
              response: `WhatsApp n'est pas encore connecté.`,
            });
          }
        }
      } else {
        console.log("Files to send ")
        // Envoi de fichiers multiples
        if (!number) {
          res.status(500).json({
            status: false,
            response: "Le numéro WA n'est pas inclus!",
          });
        } else {
          numberWA =  number.substring(1) + "@s.whatsapp.net";

          if (isConnected) {
            const exists = await sock.onWhatsApp(numberWA);
            console.log("EXISTS ",exists)
            if (exists?.jid || (exists && exists[0]?.jid)) {
              const jid = exists.jid || exists[0].jid;
              const sentFiles = [];
              const errors = [];

              // Envoyer chaque fichier individuellement
                try {
                  const file = files;
                  const fileName = file.filename || file.originalname;
                  console.log("FILE NAME ",fileName)
                  // If fileName contains 'Z-', keep logic, else use originalname
                  const fileNameWithoutDate = fileName.includes('Z-') ? fileName.split("Z-")[1] : fileName;
                  console.log("FILE NAME WITHOUT DATE ",fileNameWithoutDate)
                  // Use buffer instead of path
                  const fileBuffer = file.buffer;
                  
                  let messageOptions = {
                    caption:  messageBody , // Ajouter la légende seulement au premier fichier
                    fileName: fileNameWithoutDate,
                  };
 
                    messageOptions.document = fileBuffer;
                    messageOptions.mimetype = file.mimetype;
                  
                  console.log("MESSAGE OPTIONS ",messageOptions)

                  const result = await sock.sendMessage(jid, messageOptions);
                  sentFiles.push({
                    name: fileName,
                    mimetype: file.mimetype,
                    size: file.size,
                    status: 'success'
                  });

                 

                } catch (error) {
                  console.log(`Erreur lors de l'envoi du fichier ${files.originalname}:`, error);
                  errors.push({
                    name: files.originalname,
                    error: error.message
                  });
                }
             

              // Retourner le résultat
              return res.status(200).json({
                status: true,
                message: "Fichiers envoyés avec succès",
                data: {
                  sentFiles: sentFiles,
                  errors: errors,
                  totalFiles: files.length,
                  successfulFiles: sentFiles.length,
                  failedFiles: errors.length
                },
              });

            } else {
              console.log(`Le numéro ${number} n'est pas répertorié.`)
              res.status(500).json({
                status: false,
                response: `Le numéro ${number} n'est pas répertorié.`,
              });
            }
          } else {
            console.log("Not connected")
            res.status(500).json({
              status: false,
              response: `WhatsApp n'est pas encore connecté.`,
            });
          }
        }
      }
    } catch (err) {
      console.log("ERROR ",err)
      res.status(500).json({
        status: false,
        response: err.message,
      });
    }
  };
