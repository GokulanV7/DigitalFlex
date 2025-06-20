import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Loader2, Image as ImageIcon, Plus, ArrowLeft } from 'lucide-react';

const CreateAsset = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    item_name: '',
    description: '',
    price: 0,
    category: 'Art',
    rarity: 'Common',
    image_url: ''
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) : value
    });
  };
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    
    const file = e.target.files[0];
    setImageFile(file);
    
    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    
    // Clean up preview URL when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  };
  
  const uploadImage = async (): Promise<string> => {
    if (!imageFile || !user) {
      throw new Error("No image file selected or user not logged in");
    }
    
    const fileExt = imageFile.name.split('.').pop();
    const filePath = `collectibles/${user.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('assets')
      .upload(filePath, imageFile);
      
    if (error) throw error;
    
    const { data } = supabase.storage
      .from('assets')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) {
      setError("You must be logged in to create assets");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Upload image if selected
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadImage();
      }
      
      // Create the collectible record
      const { error } = await supabase
        .from('collectibles')
        .insert({
          user_id: user.id,
          item_name: formData.item_name,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          rarity: formData.rarity,
          image_url: imageUrl
        });
        
      if (error) throw error;
      
      // Redirect to dashboard on success
      navigate('/dashboard');
      
    } catch (err: any) {
      console.error('Error creating asset:', err);
      setError(err.message || 'Failed to create asset');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-6 py-12">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={18} className="mr-1" />
        <span>Back</span>
      </button>
      
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Create Digital Asset</h1>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-1">Asset Name*</label>
                <input
                  type="text"
                  name="item_name"
                  value={formData.item_name}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Rarity</label>
                  <select
                    name="rarity"
                    value={formData.rarity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Common">Common</option>
                    <option value="Uncommon">Uncommon</option>
                    <option value="Rare">Rare</option>
                    <option value="Epic">Epic</option>
                    <option value="Legendary">Legendary</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Asset Image* <span className="text-slate-400">(Recommended: 800x800px)</span>
              </label>
              <div className={`border-2 border-dashed ${imagePreview ? 'border-purple-500/30' : 'border-slate-600'} rounded-lg p-4 flex flex-col items-center justify-center h-72`}>
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500/80 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Plus className="rotate-45" size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
                    <ImageIcon className="h-12 w-12 text-slate-500 mb-2" />
                    <span className="text-slate-400 mb-1">Drag and drop your image here</span>
                    <span className="text-slate-500 text-sm mb-4">or</span>
                    <span className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md transition-colors">
                      Browse Files
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      required
                    />
                  </label>
                )}
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
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : 'Create Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAsset;
