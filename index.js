import express from 'express';
import cors from 'cors';

import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    apiKey: "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",
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
                        { type: "text", text: "¿Describeme detallamente la imagen?" },
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
        res.status(500).json({ error: 'Error al procesar la solicitud.' });
    }
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});