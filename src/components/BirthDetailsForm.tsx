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
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  physicalAppearance?: {
    bodyType?: string;
    faceShape?: string;
    complexion?: string;
    eyeFeatures?: string;
    bodyStructure?: string;
    additionalFeatures?: string;
  };
  photo?: File | null;
}

export function BirthDetailsForm({ onSubmit, initialMethod = 'manual' }: BirthDetailsFormProps) {
  const [formData, setFormData] = useState<BirthFormData>({
    method: initialMethod,
    location: '',
    date: '',
    timeOfDay: 'morning',
    physicalAppearance: {
      bodyType: '',
      faceShape: '',
      complexion: '',
      eyeFeatures: '',
      bodyStructure: '',
      additionalFeatures: ''
    },
    photo: null,
  });

  const [step, setStep] = useState(1);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof BirthFormData] as object,
          [child]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleMethodChange = (method: 'manual' | 'upload') => {
    setFormData((prev) => ({
      ...prev,
      method,
    }));
  };

  const handleTimeOfDayChange = (timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night') => {
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
        if (!formData.physicalAppearance?.bodyType) {
          newErrors['physicalAppearance.bodyType'] = 'Body type is required';
        }
        if (!formData.physicalAppearance?.faceShape) {
          newErrors['physicalAppearance.faceShape'] = 'Face shape is required';
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
                  Time of Day
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className={`py-2 rounded-lg transition-transform hover:translate-y-[-2px] ${
                      formData.timeOfDay === 'morning' ? 'bg-gray-600 text-white' : 'bg-primary'
                    }`}
                    onClick={() => handleTimeOfDayChange('morning')}
                  >
                    Morning
                  </button>
                  <button
                    type="button"
                    className={`py-2 rounded-lg transition-transform hover:translate-y-[-2px] ${
                      formData.timeOfDay === 'afternoon' ? 'bg-gray-600 text-white' : 'bg-primary'
                    }`}
                    onClick={() => handleTimeOfDayChange('afternoon')}
                  >
                    Afternoon
                  </button>
                  <button
                    type="button"
                    className={`py-2 rounded-lg transition-transform hover:translate-y-[-2px] ${
                      formData.timeOfDay === 'evening' ? 'bg-gray-600 text-white' : 'bg-primary'
                    }`}
                    onClick={() => handleTimeOfDayChange('evening')}
                  >
                    Evening
                  </button>
                  <button
                    type="button"
                    className={`py-2 rounded-lg transition-transform hover:translate-y-[-2px] ${
                      formData.timeOfDay === 'night' ? 'bg-gray-600 text-white' : 'bg-primary'
                    }`}
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
            <h2 className="text-2xl font-bold text-center mb-6">Physical Appearance</h2>
            
            {formData.method === 'manual' ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="physicalAppearance.bodyType" className="block text-sm font-medium mb-1">
                    Body Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="physicalAppearance.bodyType"
                    name="physicalAppearance.bodyType"
                    value={formData.physicalAppearance?.bodyType}
                    onChange={handleInputChange}
                    className={`w-full p-2 bg-primary rounded border ${errors['physicalAppearance.bodyType'] ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-accent'} focus:border-transparent`}
                  >
                    <option value="">Select body type</option>
                    <option value="slim">Slim/Thin/Lean</option>
                    <option value="athletic">Athletic/Muscular</option>
                    <option value="medium">Medium/Average build</option>
                    <option value="heavySet">Heavy-set/Large</option>
                    <option value="shortStocky">Short & Stocky</option>
                    <option value="tallSlender">Tall & Slender</option>
                    <option value="wellProportioned">Well-proportioned/Balanced</option>
                  </select>
                  {errors['physicalAppearance.bodyType'] && <p className="text-red-400 text-xs mt-1">{errors['physicalAppearance.bodyType']}</p>}
                </div>
                
                <div>
                  <label htmlFor="physicalAppearance.faceShape" className="block text-sm font-medium mb-1">
                    Face Shape <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="physicalAppearance.faceShape"
                    name="physicalAppearance.faceShape"
                    value={formData.physicalAppearance?.faceShape}
                    onChange={handleInputChange}
                    className={`w-full p-2 bg-primary rounded border ${errors['physicalAppearance.faceShape'] ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-accent'} focus:border-transparent`}
                  >
                    <option value="">Select face shape</option>
                    <option value="oval">Oval/Elongated</option>
                    <option value="round">Round/Full</option>
                    <option value="square">Square/Angular</option>
                    <option value="triangular">Triangular/Heart-shaped</option>
                    <option value="rectangular">Rectangular/Oblong</option>
                    <option value="diamond">Diamond/Sharp features</option>
                    <option value="prominent">Prominent features</option>
                    <option value="delicate">Delicate/Fine features</option>
                  </select>
                  {errors['physicalAppearance.faceShape'] && <p className="text-red-400 text-xs mt-1">{errors['physicalAppearance.faceShape']}</p>}
                </div>
                
                <div>
                  <label htmlFor="physicalAppearance.complexion" className="block text-sm font-medium mb-1">
                    Complexion
                  </label>
                  <select
                    id="physicalAppearance.complexion"
                    name="physicalAppearance.complexion"
                    value={formData.physicalAppearance?.complexion}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-primary rounded border border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="">Select complexion</option>
                    <option value="fair">Fair/Pale</option>
                    <option value="medium">Medium/Wheat</option>
                    <option value="olive">Olive/Tan</option>
                    <option value="brown">Brown/Dark</option>
                    <option value="ruddy">Ruddy/Reddish</option>
                    <option value="glowing">Glowing/Radiant</option>
                    <option value="yellowish">Yellowish tint</option>
                    <option value="uneven">Uneven/Mixed</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="physicalAppearance.eyeFeatures" className="block text-sm font-medium mb-1">
                    Eye Features
                  </label>
                  <select
                    id="physicalAppearance.eyeFeatures"
                    name="physicalAppearance.eyeFeatures"
                    value={formData.physicalAppearance?.eyeFeatures}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-primary rounded border border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="">Select eye features</option>
                    <option value="large">Large/Prominent</option>
                    <option value="small">Small/Narrow</option>
                    <option value="almond">Almond-shaped</option>
                    <option value="round">Round</option>
                    <option value="deepSet">Deep-set</option>
                    <option value="bright">Bright/Shining</option>
                    <option value="intense">Intense/Penetrating</option>
                    <option value="gentle">Gentle/Soft</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="physicalAppearance.bodyStructure" className="block text-sm font-medium mb-1">
                    Body Structure
                  </label>
                  <select
                    id="physicalAppearance.bodyStructure"
                    name="physicalAppearance.bodyStructure"
                    value={formData.physicalAppearance?.bodyStructure}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-primary rounded border border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="">Select body structure</option>
                    <option value="fineBones">Fine/Delicate bones</option>
                    <option value="largeBones">Large/Prominent bones</option>
                    <option value="symmetrical">Symmetrical/Balanced</option>
                    <option value="asymmetrical">Asymmetrical features</option>
                    <option value="broadShoulders">Broad shoulders</option>
                    <option value="narrowShoulders">Narrow shoulders</option>
                    <option value="longLimbs">Long limbs</option>
                    <option value="shortLimbs">Short limbs</option>
                  </select>
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

        {step === 3 && formData.method === 'manual' && (
          <div className={`space-y-6 ${getAnimationClass()}`}>
            <h2 className="text-2xl font-bold text-center mb-6">Additional Features</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="physicalAppearance.additionalFeatures" className="block text-sm font-medium mb-1">
                  Additional Features
                </label>
                <textarea
                  id="physicalAppearance.additionalFeatures"
                  name="physicalAppearance.additionalFeatures"
                  value={formData.physicalAppearance?.additionalFeatures}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full p-2 bg-primary rounded border border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Any distinctive features (e.g., birthmarks, dimples, etc.)"
                />
              </div>
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

        {((step === 3 && formData.method === 'upload') || (step === 4 && formData.method === 'manual')) && (
          <div className={`space-y-6 ${getAnimationClass()}`}>
            <h2 className="text-2xl font-bold text-center mb-6">Confirm Your Details</h2>
            
            <div className="bg-primary p-4 rounded-lg">
              <h3 className="font-medium mb-2">Birth Information</h3>
              <p><span className="text-gray-400">Location:</span> {formData.location}</p>
              <p><span className="text-gray-400">Date:</span> {formData.date}</p>
              <p><span className="text-gray-400">Time of Day:</span> {formData.timeOfDay}</p>
              
              {formData.method === 'manual' ? (
                <div className="mt-2">
                  <p className="text-gray-400 font-medium">Physical Appearance:</p>
                  <ul className="list-disc list-inside pl-2 text-sm">
                    <li>Body Type: {formData.physicalAppearance?.bodyType}</li>
                    <li>Face Shape: {formData.physicalAppearance?.faceShape}</li>
                    <li>Complexion: {formData.physicalAppearance?.complexion}</li>
                    <li>Eye Features: {formData.physicalAppearance?.eyeFeatures}</li>
                    <li>Body Structure: {formData.physicalAppearance?.bodyStructure}</li>
                  </ul>
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
