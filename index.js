import express from 'express';
import cors from 'cors';

import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    apiKey: "",
});
const openai = new OpenAIApi(configuration);

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('APi RockAI!');
});

app.post('/api/process', async (req, res) => {


    const { email, imageUrl } = req.body;

    if (!email || !imageUrl) {
        return res.status(400).json({ error: 'Debe proporcionar el correo electrónico y la URL de la imagen.' });
    }

    try {
        const response = await openai.createChatCompletion({
            model: "gpt-4-vision-preview",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Eres un experto en geología. Brindame un suposición sobre qué elementos de la tabla periodica puede contener la siguiente foto." },
                        {
                            type: "image_url",
                            image_url: {
                                "url": imageUrl,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 1500
        });

        console.log("REspuest", response.data.choices[0].message.content)

        // Puedes guardar o procesar la respuesta aquí según tus necesidades
        res.send({ email, imageUrl, visionResult: response.data.choices[0].message.content });
    } catch (error) {
        console.error('Error al llamar a la API de OpenAI:', error);
        res.status(500).json({ error: error });
    }
});


app.post('/api/prompt', async (req, res) => {


    const { email, imageUrl, prompt } = req.body;

    let prompt_ = prompt

    if (!email || !imageUrl) {
        return res.status(400).json({ error: 'Debe proporcionar el correo electrónico y la URL de la imagen.' });
    }
    console.log('paso la validacion de email y imagurl ', imageUrl);

    if (!prompt_) {
        prompt_ = "Describe a detalle que es lo que ves en la foto.";
    }

    try {
        const response = await openai.createChatCompletion({
            model: "gpt-4-vision-preview",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt_ },
                        {
                            type: "image_url",
                            image_url: {
                                "url": imageUrl,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 1500
        });

        console.log("Respuesta", response.data.choices[0].message.content)

        // Puedes guardar o procesar la respuesta aquí según tus necesidades
        res.send({ email, imageUrl, visionResult: response.data.choices[0].message.content });
    } catch (error) {
        console.error('Error al llamar a la API de OpenAI:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud.' });
    }
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});