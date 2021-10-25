import express from 'express';
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import { join } from 'path';

const server = express();

//Middleware
server.use(cors());
server.use(express.json());

// Endpoints

// Error-handling middleware


const port = 3001;
console.table(listEndpoints(server));

server.listen(port, () => {
  console.log("Server is running on port:", port);
});

export default server;






