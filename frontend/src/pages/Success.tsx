import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle } from 'lucide-react';
import { RootState } from '@/store/index.ts';

const Success = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const paymentDetails = useSelector((state: RootState) => state.stripe.paymentDetails);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const sessionId = urlParams.get('session_id');
    if (sessionId) {
      toast({
        title: "Payment Successful",
        description: "Your payment was processed successfully. The order has been placed."
      });
      // Redirect to the dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 5000);
    } else {
      // If no session ID, redirect immediately
      navigate('/dashboard');
    }
  }, [location, navigate, toast]);

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Payment Successful!</h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Your payment has been processed successfully. 
            {paymentDetails && (
              <span>
                You have purchased <span className="text-purple-400 font-semibold">{paymentDetails.name}</span>.
              </span>
            )}
            You will be redirected shortly.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Success;
