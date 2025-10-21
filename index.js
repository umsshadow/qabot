import dotenv from 'dotenv';
dotenv.config();
import { createServer } from 'http';
import debug from 'debug';
const log = debug('blog-api:server');

import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
 
const port = normalizePort(process.env.PORT || '3050');
// routers
 
import * as waController from './whatsapp.js'; // Assurez-vous que le chemin est correct
import { Server } from 'socket.io';
import waRouter from './routes/whatsapp.js';
const app = express();
const server = createServer(app);
const io = new Server(server);
 


app.set('port', port);
 
//launch whatsapp
waController.launch().then(() => console.log('Whatsapp launched')).catch((err) => console.log(err));

io.on("connection", waController.startSocket);

 

app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
 console.log("CORS ALLOWED")
 next()
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/uploads')));

// app.use(express.static(path.join(__dirname, 'public','qavah')));

app.get('/test', (req, res) => {
  res.json({ message: 'Hello World here' });
}
);
 
app.use('/', waRouter);
 
app.use("/assets", express.static(__dirname + "/client/assets"));
 
  








function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  log('Listening on2 ' + bind);
  console.log(' Listening on ' + bind);
  console.log('http://localhost:' + addr.port);
  console.log("addr : ", addr);
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}




server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


 
