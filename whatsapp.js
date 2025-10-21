
import { useMultiFileAuthState,   fetchLatestBaileysVersion,
  isJidBroadcast,
  makeWASocket,
  } from "@whiskeysockets/baileys";
  //import os
  import { exec } from 'child_process';
  import { fileURLToPath } from "url";
  import { dirname } from "path";
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  import { Boom } from "@hapi/boom";
  import path from "path";
  import fs from "fs";
  import express from "express";
  import cors from "cors";
  import bodyParser from "body-parser";
  const app = express();
  
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  import { createServer } from "http";
  const server = createServer(app);
  import { Server } from "socket.io";
  const io = new Server(server);
  const port = process.env.PORT || 8002;
  import qrcode from "qrcode";
  import axios from "axios";
  import os from "os";
import { sendWaMessage } from "./wa-message.js";
  
  
  app.get("/scan", (req, res) => {
    res.sendFile("./client/server.html", {
      root: __dirname,
    });
  });


  export const scanFile = async (req, res) => {
    res.sendFile("./client/server.html", {
        root: __dirname,
      });
     
    };

    export const startSocket = async (socket) => {
    //  console.log("START SOCKET")
        soket = socket;
        // console.log(sock)
        if(isConnected()==-1){
           setTimeout(() => {
            connectToWhatsApp();
           }
              ,2000);
            
        }
        if (isConnected()) {
            // console.log("CONNECTED ",sock.user)
          updateQR("connected");
        } else if (qr) {
           // console.log("NOT CONNECTED")
          updateQR("qr");
        }
    };



    export const removeSession = async (req, res) => {
         
            //delete baileys_auth_info folder
            const pathBaileys = path.join(__dirname,  "baileys_auth_info");
            const platform = os.platform();
            const deleteCommand = platform === 'win32' ? 'rmdir /s /q baileys_auth_info' : 'rm -rf baileys_auth_info';
            
            exec(deleteCommand, async(error, stdout, stderr) => {
              if (error) {
                  console.error(`Error: ${error.message}`);
                  return;
              }
              if (stderr) {
                  console.error(`Stderr: ${stderr}`);
                  return;
              }
             // console.log(`Folder deleted successfully: ${stdout}`);
              const { state, saveCreds } = await useMultiFileAuthState("baileys_auth_info");
              saveCreds(null);
              setTimeout(() => {
                // startSocket(socket)//
                //reload socket 
                connectToWhatsApp();
             },2000);
    
                
          });
           
    };


    const deletCred=async(cb)=>{
     //("DELETING CREDENTIALS")
        
        //delete credential
        //get path baileys_auth_info
        const pathBaileys = path.join(__dirname,  "baileys_auth_info");
        //check if folder exist
        if(fs.existsSync(pathBaileys)){
          console.log("PATH Existe",pathBaileys)
        }else{
          console.log("PATH NOT FOUND")
        }
       
    }
    export const launch = async (req, res) => {
        setTimeout(() => {
            connectToWhatsApp();
        },2000);
        // res.json({ message: "WhatsApp connecté!" });
    };

  
    export const initFile = async (req, res) => {
        res.sendFile("./client/index.html", {
            root: __dirname,
          });
    };


  let sock;
  let qr;
  let soket;
  let essaie=0;
  
  async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState("baileys_auth_info");
    let { version, isLatest } = await fetchLatestBaileysVersion();
    sock = makeWASocket({
      auth: state,
      version,
      shouldIgnoreJid: (jid) => isJidBroadcast(jid),
    });
    sock.multi = true;
    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;
      console.log("UPDATE ",update)
      if (connection === "close") {
        let reason = new Boom(lastDisconnect.error).output;
          console.log("Connexion fermée", reason);
          if(reason.statusCode==440 || reason.statusCode==401 || reason.statusCode==503){
            console.log(essaie," Il y a conflit ",reason.statusCode)
            //delete credential
           if(essaie<3){
            essaie++;
            setTimeout(() => {
              connectToWhatsApp();
            },1500);
          }else{
            deletCred(()=>console.log("Session supprimée!"));
            essaie=0;
          }
          return;
        }
          setTimeout(() => {
            connectToWhatsApp();
          },1500);
      
      } 


      if (update.qr) {
        qr = update.qr;
        updateQR("qr");
      } else if ((qr = undefined)) {
        updateQR("loading");
      } else {
        if (update.connection === "open") {
          updateQR("qrscanned");
          return;
        }
      }
    });
    sock.ev.on("creds.update", saveCreds);
    
  }
  
 
  
  // functions
  const isConnected = () => {
    // console.log("IS CONNECTED", sock); 
  try {
      return sock.user;
      
  } catch (error) {
      console.log("ERROR ",error)
      return -1;
  }  };
  
  const updateQR = (data) => {
    switch (data) {
      case "qr":
        qrcode.toDataURL(qr, (err, url) => {
          soket?.emit("qr", url);
          soket?.emit("log", "QR Code received, please scan!");
        });
        break;
      case "connected":
        soket?.emit("qrstatus", "https://firebasestorage.googleapis.com/v0/b/goodvibes-event.appspot.com/o/whatsapp%2Fcheck.svg?alt=media&token=80e3d5e7-cff9-48ae-86dc-2a0a600b940c");
        soket?.emit("log", "WhatsApp connecté!");
        break;
      case "qrscanned":
        soket?.emit("qrstatus", "https://firebasestorage.googleapis.com/v0/b/goodvibes-event.appspot.com/o/whatsapp%2Fcheck.svg?alt=media&token=80e3d5e7-cff9-48ae-86dc-2a0a600b940c");
        soket?.emit("log", "Le QR Code a été scanné!");
        break;
      case "loading":
        soket?.emit("qrstatus", "https://firebasestorage.googleapis.com/v0/b/goodvibes-event.appspot.com/o/whatsapp%2Floader.gif?alt=media&token=b1d4209a-0588-4a83-85af-07c6d54b54c4");
        soket?.emit("log", "Registering QR Code , please wait!");
        break;
      default:
        break;
    }
  };
  
 







  // send text message to wa user
  export const sendMessage= async (req, res) =>sendWaMessage(req, res, isConnected, sock);






  export const checkNumber = async (req, res) => {
    try {
      console.log("CHECK NUMBER ",req.body)
      const number  = req.body.number;
      if (!number) {
        return res.status(400).json({
          status: false,
          message: "Number is required"
        });
      }

      // Format number to expected format
      const formattedNumber = number.includes('@s.whatsapp.net') 
        ? number 
        : `${number}@s.whatsapp.net`;

      if (!sock) {
        return res.status(400).json({
          status: false,
          message: "WhatsApp not connected"
        });
      }

      const [exists] = await sock.onWhatsApp(formattedNumber);
      
      if (exists) {
        // Get additional info about the number14384559713
        console.log("EXISTS ",exists)
        const jid = exists.jid;
        const status = await sock.fetchStatus(jid)
        console.log('status: ' + status)
        // const profilePicture = await sock.profilePictureUrl(formattedNumber).catch(() => null);
        // const status = await sock.fetchStatus(formattedNumber).catch(() => null);
        // const presence = await sock.presenceSubscribe(formattedNumber).catch(() => null);
        // const businessProfile = await sock.getBusinessProfile(formattedNumber).catch(() => null);
        // console.log("BUSINESS PROFILE ",businessProfile)
        return res.status(200).json({
          status: true,
          message: "Number exists on WhatsApp",
          data: {
            ...exists,
            status: status?.status,
            // profilePicture,
            // status: status?.status,
            // lastSeen: status?.setAt,
            // presence,
            // businessProfile
          }
        });
      } else {
        return res.status(404).json({
          status: false,
          message: "Number not found on WhatsApp"
        });
      }

    } catch (err) {
      console.error("Error checking number:", err);
      return res.status(500).json({
        status: false,
        message: "Error checking number",
        error: err.message
      });
    }
  };




  export const searchContact = async (req, res) => {

    const apiKey = '41cb95fe06ab15ee8729ed64fa32a9d40984e72bd83a798492229920dcaacc4e';
    const query = req.body.name;
    const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${apiKey}`;
    axios.get(url)
      .then(response => {
        const results = response.data.organic_results;
        return res.status(200).json({
          status: true,
          message: "Search results found",
          data: results
        });
      })
      .catch(error => {
        return res.status(500).json({
          status: false, 
          message: "Error searching contacts",
          error: error.message
        });
      });
  }








 
 