import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addCollectible, updateCollectible } from '@/store/collectibles';
import { Loader2 } from 'lucide-react';

interface CollectibleFormProps {
  isEditing?: boolean;
  existingData?: any;
  onSuccess?: () => void;
}

const CollectibleForm: React.FC<CollectibleFormProps> = ({ 
  isEditing = false, 
  existingData = null,
  onSuccess
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: existingData?.title || existingData?.item_name || '',
    description: existingData?.description || '',
    price: existingData?.price || 0,
    category: existingData?.category || 'Art',
    image_url: existingData?.image_url || ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) : value
    });
  };
  
  // Image upload functionality removed as per request
  
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to create collectibles');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const collectibleData = {
        id: isEditing && existingData?.id ? existingData.id : Date.now().toString(),
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        rarity: 'common', // Default rarity
        image_url: '',
        created_at: new Date().toISOString()
      };
      
      // Save to Redux store
      if (isEditing && existingData?.id) {
        dispatch(updateCollectible(collectibleData));
      } else {
        dispatch(addCollectible(collectibleData));
      }
      
      // Handle success with a confirmation message
      setSuccessMessage(isEditing ? 'Collectible updated successfully!' : 'Collectible created successfully!');
      setTimeout(() => {
        setSuccessMessage(null);
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/dashboard');
        }
      }, 2000);
      
    } catch (error: any) {
      console.error('Error saving collectible:', error);
      setError(error.message || 'Failed to save collectible');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-slate-800/50 border-slate-700/50 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">
        {isEditing ? 'Update Digital Asset' : 'Create Digital Asset'}
      </h2>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded-md mb-6">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-1">Asset Name*</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-1">Description*</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-1">Price (ETH)*</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                step="0.001"
                min="0"
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Art">Art</option>
                <option value="Music">Music</option>
                <option value="Gaming">Gaming</option>
                <option value="Photography">Photography</option>
                <option value="Video">Video</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Asset Image <span className="text-slate-400">(Not supported in current mode)</span>
            </label>
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 flex flex-col items-center justify-center h-72">
              <p className="text-slate-400">Image upload functionality is currently disabled.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 mr-4 bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:from-purple-700 hover:to-blue-700 transition-colors flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              isEditing ? 'Update Collectible' : 'Create & Issue Collectible'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CollectibleForm;
