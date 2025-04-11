'use client';

import React, { useState, ChangeEvent } from 'react';
import { Header } from './Header';

interface BirthDetailsFormProps {
  onSubmit: (data: BirthFormData) => void;
  initialMethod?: 'manual' | 'upload';
}

export interface BirthFormData {
  method: 'manual' | 'upload';
  location?: string;
  date?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night' | 'midnight' | 'earlyMorning';
  physicalDescription?: string;
  photo?: File | null;
}

export function BirthDetailsForm({ onSubmit, initialMethod = 'manual' }: BirthDetailsFormProps) {
  const [formData, setFormData] = useState<BirthFormData>({
    method: initialMethod,
    location: '',
    date: '',
    timeOfDay: 'morning',
    physicalDescription: '',
    photo: null,
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

  const handleTimeOfDayChange = (timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | 'midnight' | 'earlyMorning') => {
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

  return (
    <>
      <Header isHomePage={false} />
      <div className="max-w-md mx-auto bg-secondary p-6 md:p-5 sm:p-4 xs:p-3 rounded-2xl md:rounded-xl sm:rounded-lg xs:rounded shadow-2xl border border-gray-700 mt-8 md:mt-6 sm:mt-4 xs:mt-3 mx-4 sm:mx-2 xs:mx-1">
        {step === 1 && (
          <div className={`space-y-6 md:space-y-5 sm:space-y-4 xs:space-y-3 ${getAnimationClass()}`}>
            <h2 className="text-2xl md:text-xl sm:text-lg xs:text-base font-bold text-center mb-6 md:mb-5 sm:mb-4 xs:mb-3">Enter Your Birth Details</h2>
            
            {/* Method selection is now handled by the parent component */}

            <div className="space-y-4 md:space-y-3 sm:space-y-2 xs:space-y-1.5">
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1 sm:text-xs xs:text-[10px]">
                  Birth Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`w-full p-2 sm:p-1.5 xs:p-1 bg-primary rounded border ${errors.date ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-accent'} focus:border-transparent xs:text-xs`}
                  required
                />
                {errors.date && <p className="text-red-400 text-xs mt-1 sm:text-[10px] xs:text-[8px] xs:mt-0.5">{errors.date}</p>}
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-1 sm:text-xs xs:text-[10px]">
                  Birth Location <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full p-2 sm:p-1.5 xs:p-1 bg-primary rounded border ${errors.location ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-accent'} focus:border-transparent xs:text-xs`}
                  placeholder="City, Country"
                  required
                />
                {errors.location && <p className="text-red-400 text-xs mt-1 sm:text-[10px] xs:text-[8px] xs:mt-0.5">{errors.location}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 sm:text-xs xs:text-[10px]">
                  Time of Day <span className="text-gray-400 text-xs sm:text-[10px] xs:text-[8px]" title="Morning: 6 AM - 9 AM, Afternoon: 12 PM - 3 PM, Evening: 6 PM - 9 PM, Night: 9 PM - 12 AM, Midnight: 12 AM - 3 AM, Early Morning: 3 AM - 6 AM">(i)</span>
                </label>
                <div className="grid grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-2 gap-2 sm:gap-1.5 xs:gap-1">
                  <button
                    type="button"
                    className={`py-2 md:py-1.5 sm:py-1 xs:py-0.5 sm:text-xs xs:text-[8px] rounded-lg md:rounded sm:rounded-md xs:rounded transition-transform hover:translate-y-[-2px] ${
                      formData.timeOfDay === 'morning' ? 'bg-gray-600 text-white' : 'bg-primary'
                    }`}
                    onClick={() => handleTimeOfDayChange('morning')}
                  >
                    Morning
                  </button>
                  <button
                    type="button"
                    className={`py-2 md:py-1.5 sm:py-1 xs:py-0.5 sm:text-xs xs:text-[8px] rounded-lg md:rounded sm:rounded-md xs:rounded transition-transform hover:translate-y-[-2px] ${
                      formData.timeOfDay === 'afternoon' ? 'bg-gray-600 text-white' : 'bg-primary'
                    }`}
                    onClick={() => handleTimeOfDayChange('afternoon')}
                  >
                    Afternoon
                  </button>
                  <button
                    type="button"
                    className={`py-2 md:py-1.5 sm:py-1 xs:py-0.5 sm:text-xs xs:text-[8px] rounded-lg md:rounded sm:rounded-md xs:rounded transition-transform hover:translate-y-[-2px] ${
                      formData.timeOfDay === 'evening' ? 'bg-gray-600 text-white' : 'bg-primary'
                    }`}
                    onClick={() => handleTimeOfDayChange('evening')}
                  >
                    Evening
                  </button>
                  <button
                    type="button"
                    className={`py-2 md:py-1.5 sm:py-1 xs:py-0.5 sm:text-xs xs:text-[8px] rounded-lg md:rounded sm:rounded-md xs:rounded transition-transform hover:translate-y-[-2px] ${
                      formData.timeOfDay === 'night' ? 'bg-gray-600 text-white' : 'bg-primary'
                    }`}
                    onClick={() => handleTimeOfDayChange('night')}
                  >
                    Night
                  </button>
                  <button
                    type="button"
                    className={`py-2 md:py-1.5 sm:py-1 xs:py-0.5 sm:text-xs xs:text-[8px] rounded-lg md:rounded sm:rounded-md xs:rounded transition-transform hover:translate-y-[-2px] ${
                      formData.timeOfDay === 'midnight' ? 'bg-gray-600 text-white' : 'bg-primary'
                    }`}
                    onClick={() => handleTimeOfDayChange('midnight')}
                  >
                    Midnight
                  </button>
                  <button
                    type="button"
                    className={`py-2 md:py-1.5 sm:py-1 xs:py-0.5 sm:text-xs xs:text-[8px] rounded-lg md:rounded sm:rounded-md xs:rounded transition-transform hover:translate-y-[-2px] ${
                      formData.timeOfDay === 'earlyMorning' ? 'bg-gray-600 text-white' : 'bg-primary'
                    }`}
                    onClick={() => handleTimeOfDayChange('earlyMorning')}
                  >
                    Early Morning
                  </button>
                </div>
              </div>
            </div>
            
            <button
              type="button"
              onClick={goToNextStep}
              className="w-full py-3 md:py-2.5 sm:py-2 xs:py-1.5 xs:text-xs bg-gray-600 hover:bg-opacity-90 rounded-lg md:rounded sm:rounded-md xs:rounded mt-6 md:mt-5 sm:mt-4 xs:mt-3 transition-transform hover:translate-y-[-2px]"
            >
              Next
            </button>

            <p className="text-xs md:text-[10px] sm:text-[10px] xs:text-[8px] text-gray-400 text-center mt-4 md:mt-3 sm:mt-2 xs:mt-1.5">
              This information helps us calculate your exact birth time using Vedic astrology.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className={`space-y-6 md:space-y-5 sm:space-y-4 xs:space-y-3 ${getAnimationClass()}`}>
            <h2 className="text-2xl md:text-xl sm:text-lg xs:text-base font-bold text-center mb-6 md:mb-5 sm:mb-4 xs:mb-3">Physical Description</h2>
            
            {formData.method === 'manual' ? (
              <div className="space-y-4 md:space-y-3 sm:space-y-2 xs:space-y-1.5">
                <div>
                  <label htmlFor="physicalDescription" className="block text-sm font-medium mb-1 sm:text-xs xs:text-[10px]">
                    Describe Your Physical Appearance <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="physicalDescription"
                    name="physicalDescription"
                    value={formData.physicalDescription}
                    onChange={handleInputChange}
                    rows={8}
                    className={`w-full p-2 sm:p-1.5 xs:p-1 bg-primary rounded border ${errors.physicalDescription ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-accent'} focus:border-transparent xs:text-xs`}
                    placeholder="Describe your physical traits in detail (body type, face shape, forehead, eyes, height, distinctive features, etc.)"
                  />
                  {errors.physicalDescription && <p className="text-red-400 text-xs mt-1 sm:text-[10px] xs:text-[8px] xs:mt-0.5">{errors.physicalDescription}</p>}
                  <p className="text-xs md:text-[10px] sm:text-[10px] xs:text-[8px] text-gray-400 mt-2 sm:mt-1.5 xs:mt-1">
                    Include details about your body type, face shape, forehead, eyes, height, and any distinctive features. The more details you provide, the more accurate your birth time prediction will be.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 md:space-y-3 sm:space-y-2 xs:space-y-1.5">
                <p className="text-center text-gray-300 mb-4 md:mb-3 sm:mb-2 xs:mb-1.5 sm:text-sm xs:text-xs">
                  Upload a clear photo of yourself to help us analyze your physical traits.
                </p>
                <div>
                  <label htmlFor="photo" className="block text-sm font-medium mb-1 sm:text-xs xs:text-[10px]">
                    Upload Photo <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={`w-full p-2 sm:p-1.5 xs:p-1 bg-primary rounded border ${errors.photo ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-accent'} focus:border-transparent xs:text-xs`}
                  />
                  {errors.photo && <p className="text-red-400 text-xs mt-1 sm:text-[10px] xs:text-[8px] xs:mt-0.5">{errors.photo}</p>}
                  {formData.photo && (
                    <p className="mt-2 sm:mt-1.5 xs:mt-1 text-sm sm:text-xs xs:text-[10px] text-gray-400">
                      Selected file: {formData.photo.name}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex space-x-4 sm:space-x-2 xs:space-x-1.5">
              <button
                type="button"
                onClick={goToPreviousStep}
                className="flex-1 py-3 md:py-2.5 sm:py-2 xs:py-1.5 xs:text-xs bg-primary hover:bg-opacity-90 rounded-lg md:rounded sm:rounded-md xs:rounded transition-transform hover:translate-y-[-2px]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={goToNextStep}
                className="flex-1 py-3 md:py-2.5 sm:py-2 xs:py-1.5 xs:text-xs bg-gray-600 hover:bg-opacity-90 rounded-lg md:rounded sm:rounded-md xs:rounded transition-transform hover:translate-y-[-2px]"
              >
                Next
              </button>
            </div>

            <p className="text-xs md:text-[10px] sm:text-[10px] xs:text-[8px] text-gray-400 text-center mt-4 md:mt-3 sm:mt-2 xs:mt-1.5">
              Your physical traits are linked to your ascendant in Vedic astrology, helping us determine your exact birth time.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className={`space-y-6 md:space-y-5 sm:space-y-4 xs:space-y-3 ${getAnimationClass()}`}>
            <h2 className="text-2xl md:text-xl sm:text-lg xs:text-base font-bold text-center mb-6 md:mb-5 sm:mb-4 xs:mb-3">Confirm Your Details</h2>
            
            <div className="bg-primary p-4 md:p-3 sm:p-2 xs:p-2 rounded-lg md:rounded sm:rounded-md xs:rounded">
              <h3 className="font-medium mb-2 sm:mb-1.5 xs:mb-1 sm:text-sm xs:text-xs">Birth Information</h3>
              <p className="sm:text-sm xs:text-xs"><span className="text-gray-400">Location:</span> {formData.location}</p>
              <p className="sm:text-sm xs:text-xs"><span className="text-gray-400">Date:</span> {formData.date}</p>
              <p className="sm:text-sm xs:text-xs"><span className="text-gray-400">Time of Day:</span> {formData.timeOfDay}</p>
              
              {formData.method === 'manual' ? (
                <div className="mt-2 sm:mt-1.5 xs:mt-1">
                  <p className="text-gray-400 font-medium sm:text-sm xs:text-xs">Physical Description:</p>
                  <p className="text-sm sm:text-xs xs:text-[10px] mt-1 xs:mt-0.5">{formData.physicalDescription}</p>
                </div>
              ) : (
                <p className="mt-2 sm:mt-1.5 xs:mt-1 sm:text-sm xs:text-xs">
                  <span className="text-gray-400">Photo:</span> {formData.photo?.name || 'No photo selected'}
                </p>
              )}
            </div>
            
            <div className="flex space-x-4 sm:space-x-2 xs:space-x-1.5">
              <button
                type="button"
                onClick={goToPreviousStep}
                className="flex-1 py-3 md:py-2.5 sm:py-2 xs:py-1.5 xs:text-xs bg-primary hover:bg-opacity-90 rounded-lg md:rounded sm:rounded-md xs:rounded transition-transform hover:translate-y-[-2px]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 py-3 md:py-2.5 sm:py-2 xs:py-1.5 xs:text-xs bg-gray-600 hover:bg-opacity-90 rounded-lg md:rounded sm:rounded-md xs:rounded transition-transform hover:translate-y-[-2px]"
              >
                Predict Birth Time
              </button>
            </div>

            <p className="text-xs md:text-[10px] sm:text-[10px] xs:text-[8px] text-gray-400 text-center mt-4 md:mt-3 sm:mt-2 xs:mt-1.5">
              By proceeding, you agree to our terms and understand that this is an experimental service.
              Results may vary and should be used for entertainment purposes only.
            </p>
          </div>
        )}
      </div>
    </>
  );
}