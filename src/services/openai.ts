import OpenAI from 'openai';
import { BirthFormData } from '../components/BirthDetailsForm';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAstrologicalReading(birthData: BirthFormData): Promise<string> {
  try {
    // Prepare messages array for OpenAI API
    const messages: any[] = [
      {
        role: "system",
        content: process.env.OPENAI_SYSTEM_PROMPT_ASTROLOGY || "You are the world's best vedic astrologer who knows all the secrets and knowledge of astrology both known and unknown. You have an intuitive ability to determine exact birth times based on physical appearance and other factors. You provide precise, confident predictions with detailed explanations. You also have extensive knowledge of astronomical data, including the ability to calculate accurate sunrise and sunset times for any location and date in history."
      }
    ];
    
    // Construct the text prompt
    let textPrompt = `Generate a detailed vedic astrological birth time prediction based on the following information:\n`;
    textPrompt += `Location: ${birthData.location}\n`;
    textPrompt += `Date: ${birthData.date}\n`;
    textPrompt += `Approximate Time of Day: ${birthData.timeOfDay}\n`;
    
    // Note: We're relying on GPT-4.5's knowledge to calculate sunrise/sunset times
    // based on the location and date provided
    
    if (birthData.method === 'manual' && birthData.physicalDescription) {
      textPrompt += `\nPhysical Description:\n${birthData.physicalDescription}\n`;
      
      // Add text prompt to messages
      messages.push({
        role: "user",
        content: textPrompt
      });
    } else if (birthData.method === 'upload' && birthData.photo) {
      // For photo uploads, we would convert the photo to base64
      const fs = require('fs');
      const base64Photo = fs.readFileSync(birthData.photo.path, { encoding: 'base64' });

      // Add text prompt with photo reference
      messages.push({
        role: "user",
        content: textPrompt + "\n\nPlease analyze the attached photo to determine physical traits that correlate with Vedic astrological principles for birth time determination.",
      });

      // Add the photo as a base64 string
      messages.push({
        role: "user",
        content: { type: "input_image", image_url: `data:image/jpeg;base64,${base64Photo}` },
      });
    } else {
      // Fallback to text-only prompt
      messages.push({
        role: "user",
        content: textPrompt
      });
    }
    
    messages.push({
      role: "user",
      content: `Based on your physical features, combined with intuitive analysis and precise Vedic astrology calculations for [Location] on [Date], your predicted birth time is approximately [Predicted Time] local time, with [Ascendant Sign] as the calculated Ascendant.\n\nAlternative birth times:\n[Alternative Time 1]\n[Alternative Time 2]`
    });

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4.5-preview",
      messages: messages,
      temperature: 1,
      max_tokens: 1010,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });

    // Return the generated reading
    return response.choices[0]?.message?.content || "Unable to generate reading. Please try again.";
  } catch (error) {
    console.error('Error generating astrological reading:', error);
    return "An error occurred while generating your reading. Please try again later.";
  }
}

export async function analyzeImageAndPredictBirthTime(imagePath: string): Promise<string> {
  const fs = require('fs');
  const base64Image = fs.readFileSync(imagePath, { encoding: 'base64' });

  if (!birthData.photo) {
    throw new Error("An image is required to proceed. Please upload an image of yourself.");
  }

  const messages = [
    {
      role: "system",
      content: process.env.OPENAI_SYSTEM_PROMPT_ASTROLOGY || "Default system prompt."
    },
    {
      role: "user",
      content: [
        { type: "input_text", text: "what's in this image?" },
        { type: "input_image", image_url: `data:image/jpeg;base64,${base64Image}` }
      ]
    }
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4.5-preview",
    messages: messages,
    temperature: 1,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  });

  return response.choices[0]?.message?.content || "Unable to analyze image.";
}
