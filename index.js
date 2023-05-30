import dotenv from 'dotenv';
import express from "express";
import bodyParser from "body-parser";



dotenv.config()

const PORT = 5000 || process.env.port;

const app = express();


app.use(bodyParser.json());

app.listen(PORT, () => console.log(`Server running on port:${PORT}`));

        


