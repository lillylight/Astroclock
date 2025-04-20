import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { BirthFormData } from '@/components/BirthDetailsForm';
import { analyzeImageAndPredictBirthTime } from '@/services/openai';

export const runtime = 'edge';
export const preferredRegion = 'iad1'; // Virginia region for best performance

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to get coordinates from location using GPT-4.5
async function getCoordinatesFromLocation(location: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
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
      model: "gpt-4.1",
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
    
    // Try GPT-4.1 as a fallback
    try {
      console.log('Attempting to get estimated times using GPT-4.1...');
      const estimatedTimes = await getEstimatedSunriseSunsetWithGPT(latitude, longitude, date);
      console.log('Successfully got estimated times from GPT-4.1');
      return estimatedTimes;
    } catch (fallbackError) {
      console.error('Fallback estimation also failed:', fallbackError);
      // Ultimate fallback if even GPT fails
      return { sunrise: "6:30 AM", sunset: "7:15 PM" };
    }
  }
}

// We're now using the enhanced analyzeImageAndPredictBirthTime function from the openai service

// Modify POST handler to include image analysis
export async function POST(request: NextRequest) {
  try {
    // Payment verification: Check for a valid payment before generating a prediction
    const paymentCompleted = request.headers.get('x-payment-verified');
    if (!paymentCompleted || paymentCompleted !== 'true') {
      return NextResponse.json(
        { error: 'Payment has not been verified. Please complete your payment before requesting a prediction.' },
        { status: 403 }
      );
    }

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

    if (photoFile) {
      const photoBytes = await photoFile.arrayBuffer();
      const photoBase64 = Buffer.from(photoBytes).toString('base64');
      const mimeType = photoFile.type;

      // Pass both the image and birth data to the analysis function
      // The enhanced function will extract physical features and match them with ascendant signs
      const imageAnalysisResult = await analyzeImageAndPredictBirthTime(
        `data:${mimeType};base64,${photoBase64}`,
        birthData
      );

      return NextResponse.json({
        prediction: imageAnalysisResult
      });
    }

    // Existing logic for text-based prediction
    const { latitude, longitude } = await getCoordinatesFromLocation(birthData.location || 'Unknown location');
    const { sunrise: sunriseTime, sunset: sunsetTime } = await getSunriseSunsetTimes(
      latitude,
      longitude,
      birthData.date || new Date().toISOString().split('T')[0]
    );

    const messages: any[] = [
      {
        role: "system",
        content: process.env.OPENAI_SYSTEM_PROMPT_ASTROLOGY
      },
      {
        role: "user",
        content: `Location: ${birthData.location}\nDate: ${birthData.date}\nSunrise: ${sunriseTime}\nSunset: ${sunsetTime}`
      }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: messages,
      temperature: 1,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,

    });

    // Before returning the prediction, log it for debugging
    console.log('GPT prediction:', response.choices[0]?.message?.content);
    return NextResponse.json({
      prediction: response.choices[0]?.message?.content || "Unable to generate prediction."
    });
  } catch (error) {
    console.error('Error generating astrological reading:', error);
    
    // Handle timeout specifically
    if (error instanceof Error && error.message.includes('timeout')) {
      return NextResponse.json(
        { error: 'The request took too long. Please try again with a simpler description.' },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to generate reading' },
      { status: 500 }
    );
  }
}
