import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import mongoose from 'mongoose';
import Model from 'file:///D:/SIH-Chatbot/server/caseModel.js';
import cors from 'cors';

dotenv.config();

var url = process.env.DATABASE_URL;

mongoose.connect(url);
const db = mongoose.connection;

db.on('error', (error) => {
    console.log(error)
})

db.once('connected', () => {
    console.log('Database Connected');
})

const GEMINI_TOKEN = process.env.GEMINI_API_KEY;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(GEMINI_TOKEN);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.get('/', (req, res) => {
    res.send("Hi")
})

app.post("/hfapi", async (req, res) => {
    const prompt = req.body.prompt;
    console.log(prompt)
    const result = await model.generateContent(prompt);
    res.send(result.response.text());
})

app.get("/casestatus", async (req, res) => {
    try{
        console.log(req.body.cnr)
        const data = await Model.find({ cnr : req.body.cnr});
        res.json(data);
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

app.post('/createcase', async (req, res) => {
    const data = new Model({
        cnr: req.body.cnr,
        first_hearing: req.body.fhearing,
        next_hearing: req.body.nhearing,
        stage: req.body.stage,
        court_no_and_judge: req.body.cnj,
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

app.listen(3001, () => {
    console.log("App is listening on port 3001...")
})