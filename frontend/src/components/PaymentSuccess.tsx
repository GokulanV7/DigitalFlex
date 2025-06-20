import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './PaymentSuccess.css'; // You'll need to create this CSS file

const PaymentSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [transactionType, setTransactionType] = useState('buy');
  const location = useLocation();

  useEffect(() => {
    // Extract transaction type from query parameters
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    if (type === 'trade') {
      setTransactionType('trade');
    }
    
    // Simulate verification of payment status
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className="success-container">
      <div className="success-card">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <h3>Verifying your payment...</h3>
          </div>
        ) : (
          <div className="success-content">
            <div className="success-icon">✓</div>
            <h1>Payment Successful!</h1>
            <h3>
              {transactionType === 'buy' 
                ? 'Your purchase has been completed successfully.' 
                : 'Your trade has been completed successfully.'}
            </h3>
            <p>Thank you for your transaction. You can now access your items in your profile.</p>
            <div className="button-group">
              <Link to="/marketplace" className="primary-button">
                Back to Marketplace
              </Link>
              <Link to="/profile" className="secondary-button">
                View Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
