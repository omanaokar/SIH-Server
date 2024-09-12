import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { HfInference } from "@huggingface/inference";
import mongoose from 'mongoose';
import Model from 'file:///D:/hftrialapo/caseModel.js';

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

const HF_TOKEN = process.env.HF_TOKEN;

const app = express();
app.use(bodyParser.json());

const inference = new HfInference(HF_TOKEN);

app.get('/', (req, res) => {
    res.send("Hi")
})

const model = 'meta-llama/Meta-Llama-3-8B-Instruct'; //specify model name here (copy paste from huggingface)

app.get("/hfapi", async (req, res) => {
    const prompt = req.body.prompt;

    const result = await inference.textGeneration({
        model: model,
        inputs: prompt,
        parameters: {
            max_new_tokens: 1000
        }
    })
    res.send(result.generated_text);
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