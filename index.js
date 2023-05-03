const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const openaiApiKey = 'Here Enter api _key';

app.post('/webhook', async (req, res) => {
  const userInput = req.body.queryResult.queryText;
  const chatbotResponse = await getChatGPTResponse(userInput);
  res.json({ fulfillmentText: chatbotResponse });
});

async function getChatGPTResponse(userInput) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci-codex/completions',
      {
        prompt: userInput,
        max_tokens: 50,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
      }
    );

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error fetching GPT response:', error);
    return 'Sorry, I could not process your request at this time.';
  }
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
