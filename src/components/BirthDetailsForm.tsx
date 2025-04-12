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
      <div className="max-w-md mx-auto bg-secondary p-6 rounded-2xl shadow-2xl border border-gray-700 mt-8">
        {step === 1 && (
          <div className={`space-y-6 ${getAnimationClass()}`}>
            <h2 className="text-2xl font-bold text-center mb-6">Enter Your Birth Details</h2>

            {/* Method selection is now handled by the parent component */}

            <div className="space-y-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1">
                  Birth Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`w-full p-2 bg-primary rounded border ${errors.date ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-accent'} focus:border-transparent`}
                  required
                />
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
                  className={`w-full p-2 bg-primary rounded border ${errors.location ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-accent'} focus:border-transparent`}
                  placeholder="City, Country"
                  required
                />
                {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Time of Day <span className="text-gray-400 text-xs" title="Morning: 6 AM - 9 AM, Afternoon: 12 PM - 3 PM, Evening: 6 PM - 9 PM, Night: 9 PM - 12 AM, Midnight: 12 AM - 3 AM, Early Morning: 3 AM - 6 AM">(i)</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    className={`py-2 rounded-lg transition-transform hover:translate-y-[-2px] text-sm sm:text-base w-full sm:w-auto ${
                      formData.timeOfDay === 'morning' ? 'bg-gray-600 text-white' : 'bg-primary'
                    }`}
                    onClick={() => handleTimeOfDayChange('morning')}
                  >
                    Morning
                  </button>
                  <button
                    type="button"
                    className={`py-2 rounded-lg transition-transform hover:translate-y-[-2px] text-sm sm:text-base w-full sm:w-auto ${
                      formData.timeOfDay === 'afternoon' ? 'bg-gray-600 text-white' : 'bg-primary'
                    }`}
                    onClick={() => handleTimeOfDayChange('afternoon')}
                  >
                    Afternoon
                  </button>
                  <button
                    type="button"
                    className={`py-2 rounded-lg transition-transform hover:translate-y-[-2px] text-sm sm:text-base w-full sm:w-auto ${
                      formData.timeOfDay === 'evening' ? 'bg-gray-600 text-white' : 'bg-primary'
                    }`}
                    onClick={() => handleTimeOfDayChange('evening')}
                  >
                    Evening
                  </button>
                  <button
                    type="button"
                    className={`py-2 rounded-lg transition-transform hover:translate-y-[-2px] text-sm sm:text-base w-full sm:w-auto ${
                      formData.timeOfDay === 'night' ? 'bg-gray-600 text-white' : 'bg-primary'
                    }`}
                    onClick={() => handleTimeOfDayChange('night')}
                  >
                    Night
                  </button>
                  <button
                    type="button"
                    className={`py-2 rounded-lg transition-transform hover:translate-y-[-2px] text-sm sm:text-base w-full sm:w-auto ${
                      formData.timeOfDay === 'midnight' ? 'bg-gray-600 text-white' : 'bg-primary'
                    }`}
                    onClick={() => handleTimeOfDayChange('midnight')}
                  >
                    Midnight
                  </button>
                  <button
                    type="button"
                    className={`py-2 rounded-lg transition-transform hover:translate-y-[-2px] text-sm sm:text-base w-full sm:w-auto ${
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
                    className={`w-full p-2 bg-primary rounded border ${errors.physicalDescription ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-accent'} focus:border-transparent`}
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
                    className={`w-full p-2 bg-primary rounded border ${errors.photo ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-accent'} focus:border-transparent`}
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

            <div className="bg-primary p-4 rounded-lg">
              <h3 className="font-medium mb-2">Birth Information</h3>
              <p><span className="text-gray-400">Location:</span> {formData.location}</p>
              <p><span className="text-gray-400">Date:</span> {formData.date}</p>
              <p><span className="text-gray-400">Time of Day:</span> {formData.timeOfDay}</p>

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
    </>
  );
}