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

// Helper function to get estimated sunrise/sunset times using GPT-4.5
async function getEstimatedSunriseSunsetWithGPT(latitude: number, longitude: number, date: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.5-preview",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that provides accurate sunrise and sunset times based on scientific calculations."
        },
        {
          role: "user",
          content: `Based on scientific calculations, what would be the approximate sunrise and sunset times for a location at latitude ${latitude}, longitude ${longitude} on date ${date}? Respond with only a JSON object in the format: {"sunrise": "HH:MM AM/PM", "sunset": "HH:MM AM/PM"}`
        }
      ],
      temperature: 0,
      max_tokens: 100,
    });

    const content = response.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const times = JSON.parse(jsonMatch[0]);
      return {
        sunrise: times.sunrise,
        sunset: times.sunset
      };
    }
    
    throw new Error('Failed to parse times from GPT response');
  } catch (error) {
    console.error('Error getting estimated times from GPT:', error);
    throw error; // Propagate the error to be handled by the caller
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
    console.error('Error getting sunrise/sunset times from API:', error);
    
    // Try GPT-4.5 as a fallback
    try {
      console.log('Attempting to get estimated times using GPT-4.5...');
      const estimatedTimes = await getEstimatedSunriseSunsetWithGPT(latitude, longitude, date);
      console.log('Successfully got estimated times from GPT-4.5');
      return estimatedTimes;
    } catch (fallbackError) {
      console.error('Fallback estimation also failed:', fallbackError);
      // Ultimate fallback if even GPT fails
      return { sunrise: "6:30 AM", sunset: "7:15 PM" };
    }
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
        content: "you are the world best vedic astrologer who knows all the secrets and knowledge of astrology both known and unknown, also has intuition."
      }
    ];
    
    // Construct the text prompt
    let textPrompt = `Generate a detailed vedic astrological birth time prediction based on the following information:\n`;
    textPrompt += `Location: ${birthData.location}\n`;
    textPrompt += `Date: ${birthData.date}\n`;
    textPrompt += `Approximate Time of Day: ${birthData.timeOfDay}\n`;
    textPrompt += `Calculated Sunrise Time: ${sunriseTime}\n`;
    textPrompt += `Calculated Sunset Time: ${sunsetTime}\n`;
    
    if (birthData.method === 'manual' && birthData.physicalDescription) {
      textPrompt += `\nPhysical Description:\n${birthData.physicalDescription}\n`;
      
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
            text: textPrompt + "\n\nPlease analyze the attached photo and extract all physical traits and accurately match them to ascendants vedic physical traits correctly."
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

2. TRAIT MATCHING: Compare the user's physical traits with traditional Vedic descriptions of each ascendant to identify the most probable ascendant.

3. NAKSHATRA WEIGHTING:
   - Emphasize the specific nakshatra within the ascendants time that best fits the physical traits and refined features.
   - Match the user's chosen ascendants physical characteristics to the traditional descriptions of nakshatras.
   - Use this weighting to determine the most precise birth time within the ascendant period.

4. PLANETARY INFLUENCE ANALYSIS:
   - Moon's Position: Assess the Moon's position at different times within the ascendant period.
   - Ruling Planet Characteristics: Examine the position and strength of the planet ruling the potential ascendant.
   - Other Planetary Influences: Consider aspects and positions of other planets.

5. PRECISE TIMING: Use the Nakshatra Weighting method to pinpoint the exact time within the 2-hour window.

Format your response EXACTLY according to this template:

Our calculations show [ascendant sign] rising between approximately [time range]. Within [ascendant sign]'s zodiac span, three nakshatras emerge: [nakshatra 1], [nakshatra 2], and [nakshatra 3]. Among these, [best match nakshatra] is the best match, closely aligning with your [physical traits], while [alternative nakshatra 1] and [alternative nakshatra 2] remain possible alternatives.

An ascendant near [specific time] best fits your [specific physical traits]. This precise Lagna placement reflects [explanation]. Our method combines fixed astronomical markers (like sunrise) with physical trait analysis.

Most Accurate Birthday Time & Alternatives:

best: [best time]
Alternate Option 1: [alternate time 1]
Alternate Option 2: [alternate time 2]
These times are derived using the same calculated time frame for [ascendant sign] rising.

IMPORTANT: Keep your response focused ONLY on the birth time prediction. DO NOT include any personality analysis, career prospects, relationships, or health information beyond what's needed to explain the time prediction. Follow the template format EXACTLY as shown above.`
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
