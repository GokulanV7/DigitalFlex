import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RaffleWidget from '@/components/RaffleWidget';
import CollectibleForm from '@/components/CollectibleForm';
import { Alert } from '@/components/ui/alert'; // You may need to create this component if it doesn't exist

const Create = () => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormError = (errorMessage: string) => {
    setError(errorMessage);
    setIsSubmitting(false);
    // Scroll to the top to make the error visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = () => {
    setIsSubmitting(true);
    setError(null);
  };

  const handleFormSuccess = () => {
    setIsSubmitting(false);
    setError(null);
    // Optionally show success message or redirect
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <RaffleWidget />
      
      <div className="container mx-auto px-6 py-20">
        {error && (
          <Alert className="mb-6 bg-red-900/50 border border-red-500 text-white p-4 rounded-lg">
            <h4 className="font-bold">Error</h4>
            <p>{error}</p>
            <p className="text-sm mt-2">
              Note: The storage bucket for images may not be configured correctly. 
              Please contact the administrator or check your Supabase configuration.
            </p>
          </Alert>
        )}

        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Create Your
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Digital Legacy</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Transform your creativity into valuable digital assets. Issue collectibles that showcase your unique vision and connect with collectors worldwide.
          </p>
        </div>

        <CollectibleForm 
          onError={handleFormError}
          onSubmit={handleFormSubmit}
          onSuccess={handleFormSuccess}
          isSubmitting={isSubmitting}
        />
      </div>

      <Footer />
    </div>
  );
};

export default Create;
