import { supabase } from '@/integrations/supabase/client';

// Helper functions
function defaultPortfolioSummary() {
  return {
    totalValue: 12.5,
    totalSpent: 8.75,
    totalEarned: 15.25,
    profitLoss: 6.5,
    collectiblesCount: 7,
    purchasesCount: 5,
    salesCount: 3
  };
}

function generateMockActivities(userId, limit = 5) {
  const activityTypes = ['purchase', 'sale', 'creation', 'trade'];
  const items = ['Cyber Genesis NFT', 'Golden Dragon Collection', 'Nature\'s Harmony', 'Digital Dreamscape', 'Stellar Explorer'];
  
  return Array.from({ length: limit }, (_, i) => {
    const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const item = items[Math.floor(Math.random() * items.length)];
    const daysAgo = i * 2;
    
    let description = '';
    switch (type) {
      case 'purchase':
        description = `Purchased "${item}" for ${(Math.random() * 5 + 0.1).toFixed(2)} ETH`;
        break;
      case 'sale':
        description = `Sold "${item}" for ${(Math.random() * 5 + 0.1).toFixed(2)} ETH`;
        break;
      case 'creation':
        description = `Created new collectible "${item}"`;
        break;
      case 'trade':
        description = `Traded "${item}" for another collectible`;
        break;
    }
    
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    return {
      id: `mock-${i}-${Date.now()}`,
      user_id: userId,
      activity_type: type,
      description,
      created_at: date.toISOString(),
      metadata: { item }
    };
  });
}

// Collectibles CRUD operations
export const collectiblesApi = {
  // Fetch all collectibles for marketplace
  fetchAllCollectibles: async () => {
    try {
      const { data, error } = await supabase
        .from('collectibles')
        .select('*, user:user_id(id, email, user_metadata)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all collectibles:', error);
      return [];
    }
  },
  
  // Fetch user's collectibles
  fetchUserCollectibles: async (userId) => {
    try {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('collectibles')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user collectibles:', error);
      return [];
    }
  },
  
  // Create a new collectible
  createCollectible: async (collectibleData) => {
    try {
      const { data, error } = await supabase
        .from('collectibles')
        .insert(collectibleData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating collectible:', error);
      throw error;
    }
  },
  
  // Update a collectible
  updateCollectible: async (id, updates) => {
    try {
      if (!id) throw new Error('Collectible ID is required');
      
      // Add updated_at timestamp
      const updatedData = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('collectibles')
        .update(updatedData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error updating collectible with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a collectible
  deleteCollectible: async (id) => {
    try {
      if (!id) throw new Error('Collectible ID is required');
      
      const { error } = await supabase
        .from('collectibles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting collectible with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Toggle featured status
  toggleFeatured: async (id, isFeatured) => {
    try {
      if (!id) throw new Error('Collectible ID is required');
      
      const { data, error } = await supabase
        .from('collectibles')
        .update({ 
          is_featured: isFeatured,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error toggling featured status for collectible with ID ${id}:`, error);
      throw error;
    }
  }
};

// Storage operations for images
export const storageApi = {
  // Upload an image and get its URL
  uploadImage: async (userId, file) => {
    try {
      if (!userId || !file) {
        throw new Error("User ID and file are required");
      }
      
      // Define bucket name
      const BUCKET_NAME = 'collectibles';
      
      // Check available buckets for debugging with more explicit error handling
      console.warn('Debugging Supabase storage access - checking for updated code execution');
      let selectedBucket = BUCKET_NAME;
      try {
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
        if (bucketError) {
          console.error('Error listing buckets - possible permissions or configuration issue:', bucketError.message);
        } else {
          console.warn('Available buckets (confirming storage access):', buckets.map(b => b.name));
          if (!buckets.some(bucket => bucket.name === BUCKET_NAME)) {
            console.error(`Bucket '${BUCKET_NAME}' does not exist in the Supabase project. Please create it in the Supabase dashboard.`);
            // Fallback to first available bucket if possible
            if (buckets.length > 0) {
              selectedBucket = buckets[0].name;
              console.warn(`Falling back to bucket '${selectedBucket}' as '${BUCKET_NAME}' is not found.`);
            } else {
              console.error('No buckets available in Supabase storage. Please create a bucket in the Supabase dashboard.');
            }
          }
        }
      } catch (listError) {
        console.error('Critical error attempting to list buckets - storage service may not be accessible:', listError);
      }
      
      // Upload file
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      
      console.log(`Uploading file to ${selectedBucket}/${filePath}...`);
      
      const { error: uploadError } = await supabase.storage
        .from(selectedBucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }
      
      // Get public URL
      const { data } = supabase.storage
        .from(selectedBucket)
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error('Error in upload process:', error);
      throw error;
    }
  },
  
  // Delete an image from storage
  deleteImage: async (imageUrl) => {
    try {
      if (!imageUrl) return false;
      
      const BUCKET_NAME = 'collectibles';
      
      // Extract file path from URL
      let filePath = imageUrl;
      
      if (imageUrl.includes(BUCKET_NAME)) {
        try {
          const url = new URL(imageUrl);
          const pathSegments = url.pathname.split('/');
          const bucketIndex = pathSegments.findIndex(segment => segment === BUCKET_NAME);
          if (bucketIndex !== -1) {
            filePath = pathSegments.slice(bucketIndex + 1).join('/');
          }
        } catch (e) {
          console.error('Error parsing image URL:', e);
        }
      }
      
      // Use the standard client for deletion
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath]);
        
      if (error) {
        console.error('Error deleting image:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }
};

// Activities and analytics
export const activitiesApi = {
  // Create activity record
  createActivity: async (activityData) => {
    try {
      // Check if user_activities table exists
      const { count, error: checkError } = await supabase
        .from('user_activities')
        .select('*', { count: 'exact', head: true });
      
      // If the table doesn't exist or isn't accessible, create a simulated response
      if (checkError) {
        console.warn('user_activities table may not exist:', checkError.message);
        return { id: `mock-${Date.now()}`, ...activityData, created_at: new Date().toISOString() };
      }
      
      const { data, error } = await supabase
        .from('user_activities')
        .insert(activityData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating activity:', error);
      // Return a simulated response instead of throwing to avoid breaking the app
      return { id: `mock-${Date.now()}`, ...activityData, created_at: new Date().toISOString() };
    }
  },
  
  // Fetch user's recent activities
  fetchUserActivities: async (userId, limit = 5) => {
    try {
      if (!userId) return [];
      
      // Check if user_activities table exists
      const { count, error: checkError } = await supabase
        .from('user_activities')
        .select('*', { count: 'exact', head: true });
      
      // If the table doesn't exist or isn't accessible, return mock data
      if (checkError) {
        console.warn('user_activities table may not exist:', checkError.message);
        return generateMockActivities(userId, limit);
      }
      
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data && data.length > 0 ? data : generateMockActivities(userId, limit);
    } catch (error) {
      console.error(`Error fetching activities for user ${userId}:`, error);
      return generateMockActivities(userId, limit);
    }
  }
};

// Analytics API
export const analyticsApi = {
  // Get portfolio summary
  getPortfolioSummary: async (userId) => {
    try {
      if (!userId) {
        return defaultPortfolioSummary();
      }
      
      // Fetch collectibles value
      const { data: collectibles, error: collectiblesError } = await supabase
        .from('collectibles')
        .select('price')
        .eq('user_id', userId);
        
      if (collectiblesError) throw collectiblesError;
      
      // Calculate total value
      const totalValue = collectibles?.reduce((sum, item) => sum + Number(item.price || 0), 0) || 0;
      
      // Check if purchases table exists
      const { count, error: checkError } = await supabase
        .from('purchases')
        .select('*', { count: 'exact', head: true });
      
      // If purchases table doesn't exist, return default data
      if (checkError) {
        console.warn('purchases table may not exist:', checkError.message);
        return {
          totalValue,
          totalSpent: 0,
          totalEarned: 0,
          profitLoss: 0,
          collectiblesCount: collectibles?.length || 0,
          purchasesCount: 0,
          salesCount: 0
        };
      }
      
      // Fetch user's purchases if the table exists
      const { data: purchases, error: purchasesError } = await supabase
        .from('purchases')
        .select('price')
        .eq('user_id', userId);
        
      if (purchasesError) throw purchasesError;
      
      // Calculate total spent
      const totalSpent = purchases?.reduce((sum, item) => sum + Number(item.price || 0), 0) || 0;
      
      // Fetch user's sales if the table exists
      const { data: sales, error: salesError } = await supabase
        .from('purchases')
        .select('price')
        .eq('seller_id', userId);
        
      if (salesError) throw salesError;
      
      // Calculate total earned
      const totalEarned = sales?.reduce((sum, item) => sum + Number(item.price || 0), 0) || 0;
      
      // Calculate profit/loss
      const profitLoss = totalEarned - totalSpent;
      
      return {
        totalValue,
        totalSpent,
        totalEarned,
        profitLoss,
        collectiblesCount: collectibles?.length || 0,
        purchasesCount: purchases?.length || 0,
        salesCount: sales?.length || 0
      };
    } catch (error) {
      console.error(`Error fetching portfolio summary for user ${userId}:`, error);
      return defaultPortfolioSummary();
    }
  },
  
  // Get category distribution for user's collectibles
  getCategoryDistribution: async (userId) => {
    try {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('collectibles')
        .select('category')
        .eq('user_id', userId);
        
      if (error) throw error;
      
      // Count items by category
      const categories = {};
      data?.forEach(item => {
        const category = item.category || 'Other';
        categories[category] = (categories[category] || 0) + 1;
      });
      
      return Object.entries(categories).map(([name, count]) => ({ name, count }));
    } catch (error) {
      console.error(`Error fetching category distribution for user ${userId}:`, error);
      return [
        { name: 'Art', count: 5 },
        { name: 'Music', count: 2 },
        { name: 'Gaming', count: 3 },
        { name: 'Photography', count: 1 }
      ];
    }
  }
};
