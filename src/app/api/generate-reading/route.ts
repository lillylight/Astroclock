import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { BirthFormData } from '@/components/BirthDetailsForm';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to get coordinates from location using GPT-4.5
async function getCoordinatesFromLocation(location: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.5-preview",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that provides geographic coordinates. Respond with only a JSON object containing latitude and longitude."
        },
        {
          role: "user",
          content: `What are the latitude and longitude coordinates of ${location}? Respond with only a JSON object in the format: {"latitude": number, "longitude": number}`
        }
      ],
      temperature: 0, // Use 0 for more deterministic responses
      max_tokens: 100,
    });

    const content = response.choices[0]?.message?.content || '';
    
    // Extract JSON from the response - using a more compatible regex
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const coordinates = JSON.parse(jsonMatch[0]);
      return {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude
      };
    }
    
    throw new Error('Failed to parse coordinates from GPT response');
  } catch (error) {
    console.error('Error getting coordinates:', error);
    // Fallback to approximate coordinates if geocoding fails
    return { latitude: 0, longitude: 0 };
  }
}

// Helper function to get sunrise/sunset times using Sunrise-Sunset.org API
async function getSunriseSunsetTimes(latitude: number, longitude: number, date: string) {
  try {
    const response = await fetch(
      `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${date}&formatted=0`
    );
    
    const data = await response.json();
    
    if (data.status === 'OK') {
      // Convert UTC times to local time
      const sunriseUTC = new Date(data.results.sunrise);
      const sunsetUTC = new Date(data.results.sunset);
      
      // Format times in 12-hour format
      const sunriseLocal = sunriseUTC.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      const sunsetLocal = sunsetUTC.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      return { sunrise: sunriseLocal, sunset: sunsetLocal };
    }
    
    throw new Error('Failed to get sunrise/sunset data');
  } catch (error) {
    console.error('Error getting sunrise/sunset times:', error);
    // Fallback values if API call fails
    return { sunrise: "6:30 AM", sunset: "7:15 PM" };
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const birthDataJson = formData.get('birthData') as string;
    const photoFile = formData.get('photo') as File | null;
    
    let birthData: BirthFormData;
    
    try {
      birthData = JSON.parse(birthDataJson);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid birth data format' },
        { status: 400 }
      );
    }

    if (!birthData) {
      return NextResponse.json(
        { error: 'Birth data is required' },
        { status: 400 }
      );
    }

    // Get coordinates from location using GPT-4.5
    const { latitude, longitude } = await getCoordinatesFromLocation(birthData.location || 'Unknown location');
    
    // Get sunrise/sunset times using Sunrise-Sunset.org API
    const { sunrise: sunriseTime, sunset: sunsetTime } = await getSunriseSunsetTimes(
      latitude,
      longitude,
      birthData.date || new Date().toISOString().split('T')[0] // Provide a default date if undefined
    );
    
    // Prepare messages array for OpenAI API
    const messages: any[] = [
      {
        role: "system",
        content: "You are the world's best vedic astrologer who knows all the secrets and knowledge of astrology both known and unknown. You have an intuitive ability to determine exact birth times based on physical appearance and other factors. You provide precise, confident predictions with detailed explanations. You understand how to divide the 24-hour day into 12 ascendant periods, match physical traits with ascendant descriptions, analyze planetary influences including Moon's position and ruling planets, and correlate health features with planetary influences to pinpoint exact birth times."
      }
    ];
    
    // Construct the text prompt
    let textPrompt = `Generate a detailed vedic astrological birth time prediction based on the following information:\n`;
    textPrompt += `Location: ${birthData.location}\n`;
    textPrompt += `Date: ${birthData.date}\n`;
    textPrompt += `Approximate Time of Day: ${birthData.timeOfDay}\n`;
    textPrompt += `Calculated Sunrise Time: ${sunriseTime}\n`;
    textPrompt += `Calculated Sunset Time: ${sunsetTime}\n`;
    
    if (birthData.method === 'manual' && birthData.physicalAppearance) {
      textPrompt += `\nPhysical Appearance:\n`;
      textPrompt += `- Body Type: ${birthData.physicalAppearance.bodyType || 'Not specified'}\n`;
      textPrompt += `- Face Shape: ${birthData.physicalAppearance.faceShape || 'Not specified'}\n`;
      textPrompt += `- Eye Color: ${birthData.physicalAppearance.eyeColor || 'Not specified'}\n`;
      textPrompt += `- Hair Type: ${birthData.physicalAppearance.hairType || 'Not specified'}\n`;
      textPrompt += `- Skin Tone: ${birthData.physicalAppearance.skinTone || 'Not specified'}\n`;
      textPrompt += `- Height: ${birthData.physicalAppearance.height || 'Not specified'}\n`;
      
      if (birthData.physicalAppearance.additionalFeatures) {
        textPrompt += `- Additional Features: ${birthData.physicalAppearance.additionalFeatures}\n`;
      }
      
      // Add text prompt to messages
      messages.push({
        role: "user",
        content: textPrompt
      });
    } else if (birthData.method === 'upload' && photoFile) {
      // For photo uploads, convert the photo to base64
      const photoBytes = await photoFile.arrayBuffer();
      const photoBase64 = Buffer.from(photoBytes).toString('base64');
      const mimeType = photoFile.type;
      
      // Add text prompt with photo
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: textPrompt + "\n\nPlease analyze the attached photo to determine physical traits that correlate with Vedic astrological principles for birth time determination."
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${photoBase64}`
            }
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
    
    // Add instructions for the response format with enhanced methodology
    messages.push({
      role: "user",
      content: `Based on Vedic astrology principles, determine the most likely birth time for this person using the following methodology:

1. ASCENDANT TIMEFRAMES: Divide the 24-hour day into 12 ascendant periods, each approximately 2 hours, starting from sunrise (${sunriseTime}).

2. TRAIT MATCHING: Compare the user's physical and personality traits with traditional descriptions of each ascendant to identify the top three potential ascendants.

3. PLANETARY INFLUENCE ANALYSIS:
   - Moon's Position: Assess emotional and intuitive traits.
   - Ruling Planet Characteristics: Examine traits associated with the planet ruling the potential ascendant.

4. HEALTH AND NOTABLE FEATURES: Correlate any health issues or notable physical features with planetary influences to narrow down the exact birth time within the identified ascendant period.

Format your response as follows:
1. First, provide the exact predicted birth time (e.g., "Your predicted birth time is 3:42 PM")
2. Explain the reasoning behind this prediction, referencing the ascendant and planetary positions
3. Provide the most probable ascendant and corresponding 2-hour window
4. Provide two alternative ascendant possibilities with their respective timeframes and reasoning for why they're less likely
5. Include a brief personality analysis based on the predicted birth chart
6. Mention how this birth time affects career prospects, relationships, and health

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
    return NextResponse.json({
      prediction: response.choices[0]?.message?.content || "Unable to generate reading. Please try again."
    });
  } catch (error) {
    console.error('Error generating astrological reading:', error);
    return NextResponse.json(
      { error: 'Failed to generate reading' },
      { status: 500 }
    );
  }
}
