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
        content: process.env.OPENAI_SYSTEM_PROMPT_ASTROLOGY
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
      const base64Photo = fs.readFileSync(birthData.photo, { encoding: 'base64' });

      // Add text prompt with photo in a single message
      messages.push({
        role: "user",
        content: [
          { 
            type: "text", 
            text: textPrompt + "\n\nPlease analyze the attached photo to determine and extract physical traits that correlate with classic Vedic astrological principles for ascendant determination."
          },
          { 
            type: "image_url", 
            image_url: { url: `data:image/jpeg;base64,${base64Photo}` } 
          }
        ]
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
      content: `Please format your response using this exact template:

Based on your physical features, combined with intuitive analysis and precise Vedic astrology calculations for [Location] on [Date], your predicted birth time is approximately [Predicted Time] local time, with [Ascendant Sign] as the calculated Ascendant.

Alternative birth times:
[Alternative Time 1]
[Alternative Time 2]

Replace the placeholders with the actual values from your analysis. Do not include any explanations of your analysis process or methodology - just provide the final prediction in this format.`
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

export async function analyzeImageAndPredictBirthTime(imageData: string, birthData?: BirthFormData): Promise<string> {
  try {
    // The imageData is already a data URL (e.g., data:image/jpeg;base64,/9j/4AAQ...)
    // so we can use it directly without reading from the filesystem
    const imageUrl = imageData;

    // Create a system prompt that guides the model to focus on Vedic astrology principles
    const systemPrompt = ` you are Heru, programmed to accurately predict an individual's birth time from the ascendant using Kundil (Vedic) Astrology calculations. You analyze characteristics that correspond to ascendant sign's traits. Using accurate and precise geographical and temporal details, you utilize the exact astronomical data to cross-reference these aspects with detailed Kundil ascendant physical characteristics and rigorous analysis of Vedic Ephemeris data. This entails acquiring a precise and accurate understanding of the planetary influences to get the exact time of birth. Pay attention to the time each sign takes in each house and Use the Lahiri Ayanamsa, also make think harder and use intuition when choosing the right ascendant. dont write the calculation's text just give me the predicted time and ascendant instead. 

Your task is to:
1. Extract and analyze physical features from the uploaded image (face shape, forehead, eyes, nose, lips, chin, overall body structure, etc.)
2. Match these physical traits to classic Vedic astrology ascendant sign characteristics
3. Determine the most likely ascendant sign based on the physical traits (think harder and use intuition when choosing the right ascendant as certain ascendants have similar traits e.g leo and gemini are often confused for each other)
4. Calculate the precise birth time that corresponds with this ascendant sign, given the birth date and location

Provide a detailed analysis explaining which physical features you observed and how they correspond to specific ascendant signs in Vedic astrology.`;

    // Create a user prompt that includes both birth details and instructs to analyze the image
    let userPrompt = "Please analyze this image to extract physical traits and facial features, then match them with classic Vedic astrology ascendant sign traits.";

    // Add birth data if available
    if (birthData) {
      userPrompt = `Generate a detailed vedic astrological birth time prediction based on the following information AND the attached photo:\n
Location: ${birthData.location}\nDate: ${birthData.date}\nApproximate Time of Day: ${birthData.timeOfDay}\n\nPlease analyze the attached photo to extract physical traits and facial features, then match them with classic Vedic astrology ascendant sign traits. Based on the perfect match between physical traits and classic vedic ascendant signs, determine the most accurate birth time.`;
    }

    // Call the OpenAI API using the chat.completions.create method with vision capabilities
    const response = await openai.chat.completions.create({
      model: "gpt-4.5-preview",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: [
            { type: "text", text: userPrompt },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        },
        {
          role: "user",
          content: `Please format your response using this exact template:

Based on your physical features, combined with intuitive analysis and precise Vedic astrology calculations for [Location] on [Date], your predicted birth time is approximately [Predicted Time] local time, with [Ascendant Sign] as the calculated Ascendant.

Alternative birth times:
[Alternative Time 1]
[Alternative Time 2]

Replace the placeholders with the actual values from your analysis. Do not include any explanations of your analysis process or methodology - just provide the final prediction in this format.`
        }
      ],
      max_tokens: 1500,
      temperature: 0.7
    });

    return response.choices[0]?.message?.content || "Unable to analyze image.";
  } catch (error) {
    console.error('Error analyzing image:', error);
    return "An error occurred while analyzing the image. Please try again later.";
  }
}