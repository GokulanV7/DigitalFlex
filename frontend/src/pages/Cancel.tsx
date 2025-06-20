import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { XCircle } from 'lucide-react';

const Cancel = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    toast({
      title: "Payment Cancelled",
      description: "Your payment was cancelled. You can try again anytime.",
      duration: 5000,
      className: "bg-orange-500/90 text-white border-orange-400"
    });
    // Redirect to the marketplace after a short delay
    setTimeout(() => {
      navigate('/marketplace');
    }, 5000);
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle size={32} className="text-orange-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Payment Cancelled</h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Your payment has been cancelled. You will be redirected shortly.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cancel;
