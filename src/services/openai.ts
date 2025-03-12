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
      // However, since we can't directly access the File object's contents here,
      // we'll need to handle this in the API route
      
      // Add text prompt without photo reference
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: textPrompt + "\n\nPlease analyze the attached photo to determine physical traits that correlate with Vedic astrological principles for birth time determination."
          }
        ]
      });
      
      // Note: In a real implementation, we would add the image content here
      // This would require converting the File to base64 in the API route
    } else {
      // Fallback to text-only prompt
      messages.push({
        role: "user",
        content: textPrompt
      });
    }
    
    // Add instructions for the response format
    messages.push({
      role: "user",
      content: `First, calculate the precise sunrise and sunset times for the given location and date. Then, based on Vedic astrology principles, determine the most likely birth time for this person. Consider:
1. The ascendant (lagna) that best matches their physical appearance
2. The planetary positions on the given date
3. The relationship between time of day and the ruling planets
4. The correlation between physical traits and astrological houses

Format your response as follows:
1. First, provide the exact predicted birth time (e.g., "Your predicted birth time is 3:42 PM")
2. Explain the reasoning behind this prediction, referencing the ascendant and planetary positions
3. Provide two alternative possible birth times with lower probability and explain why they're less likely
4. Include a brief personality analysis based on the predicted birth chart
5. Mention how this birth time affects career prospects, relationships, and health

Make the prediction specific, detailed, and personalized to the provided information.`
    });

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4.5-preview",
      messages: messages,
      temperature: 1,
      max_tokens: 5010,
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
