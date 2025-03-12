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
        content: process.env.OPENAI_SYSTEM_PROMPT_ASTROLOGY || "you are the world best vedic astrologer who knows all the secrets and knowledge of astrology both known and unknown, also has intuition."
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
    
    // Add instructions for the response format with comprehensive methodology
    messages.push({
      role: "user",
      content: `Based on the information provided, determine the most likely birth time for this person using the following Vedic astrology methodology:

1. Collect Birth Data: Use the birth date, time frame (${birthData.timeOfDay}), and location (latitude ${latitude}, longitude ${longitude}).

2. Establish Fixed Markers: Use the local sunrise time (${sunriseTime}) as a reliable astronomical reference point for your calculations.

3. Ascendant Calculation: Calculate the rising sign's degree based on the sunrise data, approximate time of day, the physical traits matching and final nakshatra analysis.

4. Physical Trait Matching: Compare the physical traits described with classical descriptions for each ascendant sign. Match body type, facial features, and other physical characteristics.

5. Ruling Planet Assessment: Evaluate the strength and influence of the ascendant's ruling planet based on the birth details.

6. Nakshatra Analysis: Identify nakshatras within the ascendant and select the one that best reflects the physical traits described.

7. Refinement: use all data and intuition of details to narrow down to the perfect time.

Keep your response to approximately 100-150 words total, and format it EXACTLY according to this template:

Our calculations indicate you were likely born at {birth_time} under the Vedic star pattern {vedic_star_sign}, which aligns with your physical characteristics.

NOTABLE TIME FRAMES

Ascendant Window: {asc_window_start} – {asc_window_end}
Alternative Birth Period: {alt_period_start} – {alt_period_end}

IMPORTANT: 
- The Alternative Birth Period MUST be within the Ascendant Window timeframe, not outside of it
- Do NOT include any explanatory text about physical traits, nakshatra characteristics, or planetary influences in your response
- Do NOT include any sample or test text in your response
- Return ONLY the filled template with no additional text`
    });

    try {
      // Call OpenAI API with a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 50000); // 50 second timeout
      
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4.5-preview",
          messages: messages,
          temperature: 1,
          max_tokens: 2000, // Reduced from 5010 to improve response time
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        }, { signal: controller.signal });
        
        clearTimeout(timeoutId);
        
        // Return the generated reading
        return NextResponse.json({
          prediction: response.choices[0]?.message?.content || "Unable to generate reading. Please try again."
        });
      } catch (abortError: any) {
        clearTimeout(timeoutId);
        if (abortError.name === 'AbortError') {
          console.error('OpenAI API request timed out');
          return NextResponse.json(
            { error: 'The request took too long to complete. Please try again.' },
            { status: 408 }
          );
        }
        throw abortError; // Re-throw for the outer catch block to handle
      }
    } catch (error) {
      console.error('Error generating astrological reading:', error);
      return NextResponse.json(
        { error: 'Failed to generate reading' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error generating astrological reading:', error);
    return NextResponse.json(
      { error: 'Failed to generate reading' },
      { status: 500 }
    );
  }
}
