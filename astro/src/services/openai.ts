import OpenAI from 'openai';
import { BirthFormData } from '../components/BirthDetailsForm';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper to call the new Node.js API route for Python ephemeris
async function getEphemerisData(birthData: BirthFormData): Promise<any> {
  const response = await fetch('/api/generate-ephemeris-node', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(birthData),
  });
  if (!response.ok) throw new Error('Failed to call ephemeris backend');
  return await response.json();
}

export async function generateAstrologicalReading(birthData: BirthFormData): Promise<string> {
  try {
    // Get astronomy data from Python
    const swephData = await getEphemerisData(birthData);
    // Use the same system prompt as before, but add astronomy data
    const systemPrompt = `You are Heru, world best classic vedic astrologer.\n\nHere is the astronomy data for the user's birth date and location:\nSunrise: ${swephData.sunrise}\nSunset: ${swephData.sunset}\n\nRuling Ascendant for the selected time range: ${swephData.ruling_ascendant}\n\nAscendant and planetary positions for each half-hour in the selected time range:` +
      swephData.intervals.map((i: any) => `\n${i.time}: Ascendant = ${i.ascendant.toFixed(2)} (${i.ascendant_sign}), Planets = ${Object.entries(i.planets).map(([k,v]) => `${k}: ${typeof v === 'number' ? v.toFixed(2) : v}`).join(', ')}`).join('') +
      `\n\nPhysical Traits: ${birthData.physicalDescription || ''}`;
    // Prepare messages array for OpenAI API
    const messages: any[] = [
      { role: "system", content: systemPrompt }
    ];
    let textPrompt = `Generate a detailed vedic astrological birth time prediction based on the following information:\nLocation: ${birthData.location}\nDate: ${birthData.date}\nApproximate Time of Day: ${birthData.timeOfDay}\n`;
    if (birthData.physicalDescription) textPrompt += `\nPhysical Description:\n${birthData.physicalDescription}\n`;
    messages.push({ role: "user", content: textPrompt });
    messages.push({
      role: "user",
      content: `Please format your response using this exact template:\n\nBased on your birth details and the astronomy data above, combined with intuitive analysis and precise Vedic astrology calculations for [Location] on [Date], your predicted birth time is approximately [Predicted Time] local time, with [Ascendant Sign] as the calculated Ascendant.\n\nAlternative birth times:\n[Alternative Time 1]\n[Alternative Time 2]\n\nReplace the placeholders with the actual values from your analysis. Do not include any explanations of your analysis process or methodology - just provide the final prediction in this format.`
    });
    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: messages,
      temperature: 1,
      max_tokens: 1010,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });
    let content = response.choices[0]?.message?.content || "Unable to generate reading. Please try again.";
    const locationMatch = content.match(/for ([^\n]+) on/);
    const dateMatch = content.match(/on ([^,\n]+),? your predicted birth time/i);
    const timeMatch = content.match(/predicted birth time is approximately ([^ ]+ [AP]M)/i);
    const ascendantMatch = content.match(/with ([^ ]+) as the calculated Ascendant/i);
    const alternativesMatch = content.match(/Alternative birth times:[\s\S]*?([0-9:APM\n\r\- ]+)/i);
    let location = locationMatch ? locationMatch[1].trim() : (birthData.location || "[Location]");
    let date = dateMatch ? dateMatch[1].trim() : (birthData.date || "[Date]");
    let predictedTime = timeMatch ? timeMatch[1].trim() : "[Predicted Time]";
    let ascendant = ascendantMatch ? ascendantMatch[1].trim() : "[Ascendant Sign]";
    let alternatives = alternativesMatch ? alternativesMatch[1].trim().split(/\n|,|\r/).filter(Boolean) : ["[Alternative Time 1]", "[Alternative Time 2]"];
    const formatted = `Based on your birth details and the astronomy data, combined with intuitive analysis and precise Vedic astrology calculations for ${location} on ${date}, your predicted birth time is approximately ${predictedTime} local time, with ${ascendant} as the calculated Ascendant.\n\nAlternative birth times:\n${alternatives.map(a => a.trim()).join("\n")}`;
    return formatted;
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
    const systemPrompt = ` you are Heru, world best classic vedic astrologer programmed to accurately predict an individual's birth time after predicting there vedic ascendant using Kundil (Vedic) Astrology calculations. You analyze physical characteristics and birth details to match the vedic ascendant sign's traits. Using accurate and precise geographical and temporal details, you utilize the exact astronomical data to cross-reference these aspects with detailed Kundil ascendant physical characteristics and rigorous analysis of Vedic Ephemeris data. This entails acquiring a precise and accurate understanding of the sidereal planetary influences to get the exact time of birth. Pay attention to the time each sign takes in each house and Use the Lahiri Ayanamsa, also make think harder and use intuition when choosing the right ascendant. dont write the calculation's text just give me the predicted time, ascendant and the 2 alternative time birth. 

Your task is to:
1. Extract and analyze accurate physical features from the uploaded image (face shape, forehead, eyes, nose, lips, chin, overall body structure, etc.)
2. Match these physical traits accurately to classic Vedic astrology ascendant sign physical traits and characteristics
3. Determine the most accurate vedic ascendant sign based on the physical traits (think harder and use intuition when choosing the right ascendant. Certain ascendants have similar traits with minor difference SO MAKE SURE YOU CHOOSE THE RIGHT ASCENDANT e.g leo and gemini are often confused for each other cause of similar traits same with other ascendants)
4. Use the ascendant sign and all other details to calculate the precise birth time that corresponds with this ascendant sign, given the birth date and location

Provide a detailed analysis explaining which physical features you observed and how they correspond to specific classic ascendant signs in Vedic astrology.`;

    // Create a user prompt that includes both birth details and instructs to analyze the image
    let userPrompt = "Please analyze this image to extract physical traits and facial features, then match them with classic Vedic astrology ascendant sign traits.";
    
    // Add birth data if available
    if (birthData) {
      userPrompt = `Generate a detailed vedic astrological birth time prediction based on the following information AND the attached photo:\n
Location: ${birthData.location}\nDate: ${birthData.date}\nApproximate Time of Day: ${birthData.timeOfDay}\n\nPlease analyze the attached photo to extract physical traits and facial features, then match them with classic Vedic astrology ascendant sign traits. Based on the perfect match between physical traits and classic vedic ascendant signs, determine the most accurate birth time.`;
    }
    
    // Call the OpenAI API using the chat.completions.create method with vision capabilities
    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: userPrompt 
            },
            { 
              type: "image_url", 
              image_url: { url: imageUrl } 
            }
          ]
        },
        {
          role: "user",
          content: `Please format your response using this exact template:\n\nBased on your physical features, combined with intuitive analysis and precise Vedic astrology calculations for [Location] on [Date], your predicted birth time is approximately [Predicted Time] local time, with [Ascendant Sign] as the calculated Ascendant.\n\nAlternative birth times:\n[Alternative Time 1]\n[Alternative Time 2]\n\nReplace the placeholders with the actual values from your analysis. Do not include any explanations of your analysis process or methodology, just use the above format structure as output format.`
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    return response.choices[0]?.message?.content || "Unable to analyze image.";
  } catch (error) {
    console.error('Error analyzing image:', error);
    return "An error occurred while analyzing the image. Please try again later.";
  }
}
