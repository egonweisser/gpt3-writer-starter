import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = `Write me a high-end product description in the style of Anna Wintour combined with Paul Graham detailing the kind of the product, the materials and know-how required, the pleasure it brings and why you should get one. The copy text is personal and emotional.
Product name:`;
const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt: `${basePromptPrefix}${req.body.userInput}\n`,
    temperature: 0.9,
    max_tokens: 500,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  // I build Prompt #2.
  const secondPrompt = 
  `Take the content and product name of the description below and generate a description written in the style of Paul Graham. Make it feel like a story. Go deeply into emotions and sensations.

  Product name: ${req.body.userInput}

  Content: ${basePromptOutput.text}

  Description:
  `

   // I call the OpenAI API a second time with Prompt #2
   const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${secondPrompt}`,
    // I set a higher temperature for this one. Up to you!
    temperature: 0.9,
		// I also increase max_tokens.
    max_tokens: 500,
  });
  
  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  // Send over the Prompt #2's output to our UI instead of Prompt #1's.
  res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;