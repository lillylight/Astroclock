'use client';

import React, { useState, ChangeEvent, useEffect } from 'react';
import { Header } from './Header';
import { geocodeCity } from '../utils/cityGeocode';

interface BirthDetailsFormProps {
  onSubmit: (data: BirthFormData) => void;
  initialMethod?: 'manual' | 'upload';
}

export interface BirthFormData {
  method: 'manual' | 'upload';
  location?: string;
  date?: string;
  timeOfDay?: 'earlyMorning' | 'morning' | 'midday' | 'afternoon' | 'evening' | 'night';
  physicalDescription?: string;
  photo?: File | null;
  latitude?: string;
  longitude?: string;
  timezone?: string;
}

const TIME_OF_DAY_RANGES = {
  earlyMorning: { label: 'Early Morning (04:00-06:59)', start: 4.0, end: 6.99 },
  morning: { label: 'Morning (07:00-10:59)', start: 7.0, end: 10.99 },
  midday: { label: 'Midday (11:00-13:59)', start: 11.0, end: 13.99 },
  afternoon: { label: 'Afternoon (14:00-16:59)', start: 14.0, end: 16.99 },
  evening: { label: 'Evening (17:00-19:59)', start: 17.0, end: 19.99 },
  night: { label: 'Night (20:00-03:59)', start: 20.0, end: 27.99 }
};

export function BirthDetailsForm({ onSubmit, initialMethod = 'manual' }: BirthDetailsFormProps) {
  const [formData, setFormData] = useState<BirthFormData>({
    method: initialMethod,
    location: '',
    date: '',
    timeOfDay: 'morning',
    physicalDescription: '',
    photo: null,
    latitude: '',
    longitude: '',
    timezone: ''
  });

  const [step, setStep] = useState(1);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMethodChange = (method: 'manual' | 'upload') => {
    setFormData((prev) => ({
      ...prev,
      method,
    }));
  };

  const handleTimeOfDayChange = (timeOfDay: 'earlyMorning' | 'morning' | 'midday' | 'afternoon' | 'evening' | 'night') => {
    setFormData((prev) => ({
      ...prev,
      timeOfDay,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        photo: e.target.files?.[0] || null,
      }));
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (currentStep === 1) {
      if (!formData.date) {
        newErrors.date = 'Birth date is required';
      }
      if (!formData.location) {
        newErrors.location = 'Birth location is required';
      }
      if (!formData.latitude) {
        newErrors.latitude = 'Latitude is required';
      }
      if (!formData.longitude) {
        newErrors.longitude = 'Longitude is required';
      }
      if (!formData.timezone) {
        newErrors.timezone = 'Timezone is required';
      }
    } else if (currentStep === 2) {
      if (formData.method === 'manual') {
        if (!formData.physicalDescription || formData.physicalDescription.trim().length < 10) {
          newErrors.physicalDescription = 'Please provide a detailed physical description (at least 10 characters)';
        }
      } else if (formData.method === 'upload') {
        if (!formData.photo) {
          newErrors.photo = 'Please upload a photo';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToNextStep = () => {
    if (validateStep(step)) {
      setSlideDirection('left');
      setStep(prev => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    setSlideDirection('right');
    setStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const getAnimationClass = () => {
    return slideDirection === 'left' ? 'animate-slide-left' : 'animate-slide-right';
  };

  useEffect(() => {
    if (formData.location && (!formData.latitude || !formData.longitude || !formData.timezone)) {
      geocodeCity(formData.location).then(res => {
        if (res) {
          setFormData(prev => ({
            ...prev,
            latitude: res.lat.toString(),
            longitude: res.lon.toString(),
            timezone: res.timezone.toString()
          }));
        }
      });
    }
  }, [formData.location]);

  return (
    <div className="max-w-xl mx-auto bg-secondary bg-opacity-90 p-6 rounded-3xl shadow-2xl border border-gray-600/30 mt-16 mb-8 mx-4 sm:my-4 sm:mx-2">
      {/* Only show the main title on the first step */}
      {step === 1 && (
        <h2 className="text-2xl font-bold mb-4 sm:text-xl text-center">Enter Your Birth Details</h2>
      )}
      {step === 1 && (
        <div className={`space-y-6 ${getAnimationClass()}`}>
          <div className="space-y-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-1">
                Birth Date <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`w-full p-2 bg-primary rounded border text-white ${errors.date ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-accent'} focus:border-transparent`}
                  required
                  style={{ colorScheme: 'dark' }}
                />
              </div>
              {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1">
                Birth Location <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full p-2 bg-primary rounded border ${errors.location ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-accent'} focus:border-transparent`}
                placeholder="City, Country"
                required
              />
              {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location}</p>}
            </div>
            
            {/*
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                className={`w-full p-2 bg-primary rounded border ${errors.latitude ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-accent'} focus:border-transparent`}
                placeholder="e.g. -15.4"
                required
              />
              {errors.latitude && <p className="text-red-400 text-xs mt-1">{errors.latitude}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                className={`w-full p-2 bg-primary rounded border ${errors.longitude ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-accent'} focus:border-transparent`}
                placeholder="e.g. 28.3"
                required
              />
              {errors.longitude && <p className="text-red-400 text-xs mt-1">{errors.longitude}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                Timezone (offset from UTC)
              </label>
              <input
                type="number"
                step="any"
                name="timezone"
                value={formData.timezone}
                onChange={handleInputChange}
                className={`w-full p-2 bg-primary rounded border ${errors.timezone ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-accent'} focus:border-transparent`}
                placeholder="e.g. 2 for UTC+2"
                required
              />
              {errors.timezone && <p className="text-red-400 text-xs mt-1">{errors.timezone}</p>}
            </div>
            */}
            
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                Time of Day
                <div className="relative group inline-block">
                  <span className="cursor-pointer flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold">i</span>
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-white text-gray-900 rounded-2xl shadow-xl border border-gray-300 p-4 z-50 opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto text-xs text-left whitespace-pre-line animate-dropdown">
                    <div className="font-semibold text-base mb-2 text-center">Time of Day Guide</div>
                    <table className="w-full text-xs border-separate border-spacing-y-1">
                      <tbody>
                        <tr><td className="font-medium text-blue-700">Early Morning</td><td className="text-right">2:00 AM – 6:00 AM</td></tr>
                        <tr><td className="font-medium text-blue-700">Morning</td><td className="text-right">6:00 AM – 10:00 AM</td></tr>
                        <tr><td className="font-medium text-blue-700">Midday</td><td className="text-right">10:00 AM – 2:00 PM</td></tr>
                        <tr><td className="font-medium text-blue-700">Afternoon</td><td className="text-right">2:00 PM – 6:00 PM</td></tr>
                        <tr><td className="font-medium text-blue-700">Evening</td><td className="text-right">6:00 PM – 10:00 PM</td></tr>
                        <tr><td className="font-medium text-blue-700">Night</td><td className="text-right">10:00 PM – 2:00 AM</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className={`py-2 rounded-lg transition-transform hover:translate-y-[-2px] ${formData.timeOfDay === 'earlyMorning' ? 'bg-gray-600 text-white' : 'bg-primary'}`}
                  onClick={() => handleTimeOfDayChange('earlyMorning')}
                >
                  Early Morning
                </button>
                <button
                  type="button"
                  className={`py-2 rounded-lg transition-transform hover:translate-y-[-2px] ${formData.timeOfDay === 'morning' ? 'bg-gray-600 text-white' : 'bg-primary'}`}
                  onClick={() => handleTimeOfDayChange('morning')}
                >
                  Morning
                </button>
                <button
                  type="button"
                  className={`py-2 rounded-lg transition-transform hover:translate-y-[-2px] ${formData.timeOfDay === 'midday' ? 'bg-gray-600 text-white' : 'bg-primary'}`}
                  onClick={() => handleTimeOfDayChange('midday')}
                >
                  Midday
                </button>
                <button
                  type="button"
                  className={`py-2 rounded-lg transition-transform hover:translate-y-[-2px] ${formData.timeOfDay === 'afternoon' ? 'bg-gray-600 text-white' : 'bg-primary'}`}
                  onClick={() => handleTimeOfDayChange('afternoon')}
                >
                  Afternoon
                </button>
                <button
                  type="button"
                  className={`py-2 rounded-lg transition-transform hover:translate-y-[-2px] ${formData.timeOfDay === 'evening' ? 'bg-gray-600 text-white' : 'bg-primary'}`}
                  onClick={() => handleTimeOfDayChange('evening')}
                >
                  Evening
                </button>
                <button
                  type="button"
                  className={`py-2 rounded-lg transition-transform hover:translate-y-[-2px] ${formData.timeOfDay === 'night' ? 'bg-gray-600 text-white' : 'bg-primary'}`}
                  onClick={() => handleTimeOfDayChange('night')}
                >
                  Night
                </button>
              </div>
            </div>
          </div>
          
          <button
            type="button"
            onClick={goToNextStep}
            className="w-full py-3 bg-gray-600 hover:bg-opacity-90 rounded-lg mt-6 transition-transform hover:translate-y-[-2px]"
          >
            Next
          </button>

          <p className="text-xs text-gray-400 text-center mt-4">
            This information helps us calculate your exact birth time using Vedic astrology.
          </p>
        </div>
      )}

      {step === 2 && (
        <div className={`space-y-6 ${getAnimationClass()}`}>
          <h2 className="text-2xl font-bold text-center mb-6">Physical Description</h2>
          
          {formData.method === 'manual' ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="physicalDescription" className="block text-sm font-medium mb-1">
                  Describe Your Physical Appearance <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="physicalDescription"
                  name="physicalDescription"
                  value={formData.physicalDescription}
                  onChange={handleInputChange}
                  rows={8}
                  className={`w-full p-2 bg-primary rounded border ${errors.physicalDescription ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-accent'} focus:border-transparent`}
                  placeholder="Describe your physical traits in detail (body type, face shape, forehead, eyes, height, distinctive features, etc.)"
                />
                {errors.physicalDescription && <p className="text-red-400 text-xs mt-1">{errors.physicalDescription}</p>}
                <p className="text-xs text-gray-400 mt-2">
                  Include details about your body type, face shape, forehead, eyes, height, and any distinctive features. The more details you provide, the more accurate your birth time prediction will be.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-gray-300 mb-4">
                Upload a clear photo of yourself to help us analyze your physical traits.
              </p>
              <div>
                <label htmlFor="photo" className="block text-sm font-medium mb-1">
                  Upload Photo <span className="text-red-400">*</span>
                </label>
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={`w-full p-2 bg-primary rounded border ${errors.photo ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-accent'} focus:border-transparent`}
                />
                {errors.photo && <p className="text-red-400 text-xs mt-1">{errors.photo}</p>}
                {formData.photo && (
                  <p className="mt-2 text-sm text-gray-400">
                    Selected file: {formData.photo.name}
                  </p>
                )}
              </div>
            </div>
          )}
          
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={goToPreviousStep}
              className="flex-1 py-3 bg-primary hover:bg-opacity-90 rounded-lg transition-transform hover:translate-y-[-2px]"
            >
              Back
            </button>
            <button
              type="button"
              onClick={goToNextStep}
              className="flex-1 py-3 bg-gray-600 hover:bg-opacity-90 rounded-lg transition-transform hover:translate-y-[-2px]"
            >
              Next
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            Your physical traits are linked to your ascendant in Vedic astrology, helping us determine your exact birth time.
          </p>
        </div>
      )}

      {step === 3 && (
        <div className={`space-y-6 ${getAnimationClass()}`}>
          <h2 className="text-2xl font-bold text-center mb-6">Confirm Your Details</h2>
          
          <div className="bg-primary bg-opacity-90 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Birth Information</h3>
            <p><span className="text-gray-400">Location:</span> {formData.location}</p>
            <p><span className="text-gray-400">Date:</span> {formData.date}</p>
            <p><span className="text-gray-400">Time of Day:</span> {formData.timeOfDay}</p>
            <p><span className="text-gray-400">Latitude:</span> {formData.latitude}</p>
            <p><span className="text-gray-400">Longitude:</span> {formData.longitude}</p>
            <p><span className="text-gray-400">Timezone:</span> {formData.timezone}</p>
            
            {formData.method === 'manual' ? (
              <div className="mt-2">
                <p className="text-gray-400 font-medium">Physical Description:</p>
                <p className="text-sm mt-1">{formData.physicalDescription}</p>
              </div>
            ) : (
              <p className="mt-2">
                <span className="text-gray-400">Photo:</span> {formData.photo?.name || 'No photo selected'}
              </p>
            )}
          </div>
          
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={goToPreviousStep}
              className="flex-1 py-3 bg-primary hover:bg-opacity-90 rounded-lg transition-transform hover:translate-y-[-2px]"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 py-3 bg-gray-600 hover:bg-opacity-90 rounded-lg transition-transform hover:translate-y-[-2px]"
            >
              Predict Birth Time
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            By proceeding, you agree to our terms and understand that this is an experimental service.
            Results may vary and should be used for entertainment purposes only.
          </p>
        </div>
      )}
    </div>
  );
}
