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
    eyeColor?: string;
    hairType?: string;
    skinTone?: string;
    height?: string;
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
      eyeColor: '',
      hairType: '',
      skinTone: '',
      height: '',
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
                    <option value="slim">Slim/Thin</option>
                    <option value="athletic">Athletic/Well-proportioned</option>
                    <option value="medium">Medium/Average build</option>
                    <option value="strong">Strong/Sturdy</option>
                    <option value="rounded">Rounded/Soft</option>
                    <option value="heavySet">Heavy-set/Large</option>
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
                  </select>
                  {errors['physicalAppearance.faceShape'] && <p className="text-red-400 text-xs mt-1">{errors['physicalAppearance.faceShape']}</p>}
                </div>
                
                <div>
                  <label htmlFor="physicalAppearance.eyeColor" className="block text-sm font-medium mb-1">
                    Eye Color & Shape
                  </label>
                  <select
                    id="physicalAppearance.eyeColor"
                    name="physicalAppearance.eyeColor"
                    value={formData.physicalAppearance?.eyeColor}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-primary rounded border border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="">Select eye characteristics</option>
                    <option value="darkBrown">Dark brown/intense</option>
                    <option value="lightBrown">Light brown/warm</option>
                    <option value="hazel">Hazel/changeable</option>
                    <option value="green">Green/bright</option>
                    <option value="blue">Blue/clear</option>
                    <option value="gray">Gray/penetrating</option>
                    <option value="almond">Almond-shaped</option>
                    <option value="round">Round/large</option>
                    <option value="deepSet">Deep-set/intense</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="physicalAppearance.hairType" className="block text-sm font-medium mb-1">
                    Hair Type & Quality
                  </label>
                  <select
                    id="physicalAppearance.hairType"
                    name="physicalAppearance.hairType"
                    value={formData.physicalAppearance?.hairType}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-primary rounded border border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="">Select hair characteristics</option>
                    <option value="straight">Straight/fine</option>
                    <option value="wavy">Wavy/medium</option>
                    <option value="curly">Curly/thick</option>
                    <option value="coarse">Coarse/strong</option>
                    <option value="thin">Thin/delicate</option>
                    <option value="thick">Thick/abundant</option>
                    <option value="early">Early thinning/receding</option>
                    <option value="late">Retains thickness with age</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="physicalAppearance.skinTone" className="block text-sm font-medium mb-1">
                    Skin Tone & Quality
                  </label>
                  <select
                    id="physicalAppearance.skinTone"
                    name="physicalAppearance.skinTone"
                    value={formData.physicalAppearance?.skinTone}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-primary rounded border border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="">Select skin characteristics</option>
                    <option value="veryFair">Very fair/pale</option>
                    <option value="fair">Fair/pinkish</option>
                    <option value="medium">Medium/golden</option>
                    <option value="olive">Olive/warm</option>
                    <option value="brown">Brown/rich</option>
                    <option value="darkBrown">Dark brown/deep</option>
                    <option value="sensitive">Sensitive/thin</option>
                    <option value="oily">Oily/prone to acne</option>
                    <option value="dry">Dry/rough</option>
                    <option value="balanced">Balanced/clear</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="physicalAppearance.height" className="block text-sm font-medium mb-1">
                    Height & Bone Structure
                  </label>
                  <select
                    id="physicalAppearance.height"
                    name="physicalAppearance.height"
                    value={formData.physicalAppearance?.height}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-primary rounded border border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="">Select height & bone structure</option>
                    <option value="tallSlender">Tall & slender</option>
                    <option value="tallMuscular">Tall & muscular</option>
                    <option value="mediumWellProportioned">Medium & well-proportioned</option>
                    <option value="mediumStocky">Medium & stocky</option>
                    <option value="shortCompact">Short & compact</option>
                    <option value="shortDelicate">Short & delicate</option>
                    <option value="largeBones">Large/prominent bones</option>
                    <option value="fineBones">Fine/delicate bones</option>
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
                    <li>Eye Color: {formData.physicalAppearance?.eyeColor}</li>
                    <li>Hair Type: {formData.physicalAppearance?.hairType}</li>
                    <li>Skin Tone: {formData.physicalAppearance?.skinTone}</li>
                    <li>Height: {formData.physicalAppearance?.height}</li>
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
