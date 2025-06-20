
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CollectibleForm from './CollectibleForm';

interface Collectible {
  id: string;
  title?: string;
  description?: string;
  price?: number;
  amount?: number;
  category?: string;
  rarity?: string;
  created_at: string;
  item_name?: string;
  type: 'created' | 'purchased';
}

const UserCollectibles = () => {
  const { user } = useAuth();
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollectible, setSelectedCollectible] = useState<Collectible | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserCollectibles();
    }
  }, [user]);

  const fetchUserCollectibles = async () => {
    try {
      // Fetch created collectibles
      const { data: createdData, error: createdError } = await supabase
        .from('collectibles')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (createdError) throw createdError;

      // Fetch purchased collectibles
      const { data: purchasedData, error: purchasedError } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (purchasedError) throw purchasedError;

      // Combine created and purchased collectibles
      const combinedCollectibles: Collectible[] = [
        ...(createdData || []).map(item => ({ ...item, type: 'created' as const })),
        ...(purchasedData || []).map(item => ({
          id: item.id,
          title: 'Purchased Collectible #' + item.collectible_id,
          amount: item.amount,
          created_at: item.created_at,
          type: 'purchased' as const
        }))
      ];

      setCollectibles(combinedCollectibles);
    } catch (error) {
      console.error('Error fetching collectibles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (collectible: Collectible) => {
    try {
      if (collectible.type === 'created') {
        const { error } = await supabase
          .from('collectibles')
          .delete()
          .eq('id', collectible.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('purchases')
          .delete()
          .eq('id', collectible.id);
        if (error) throw error;
      }
      setCollectibles(collectibles.filter(item => item.id !== collectible.id));
    } catch (error) {
      console.error('Error deleting collectible:', error);
    }
  };

  const handleEdit = (collectible: Collectible) => {
    if (collectible.type === 'created') {
      setSelectedCollectible(collectible);
      setDialogOpen(true);
    }
  };

  const handleUpdate = async (updatedData: Partial<Collectible>) => {
    if (!selectedCollectible) return;
    try {
      const { error } = await supabase
        .from('collectibles')
        .update(updatedData)
        .eq('id', selectedCollectible.id);
      if (error) throw error;
      setCollectibles(collectibles.map(item => 
        item.id === selectedCollectible.id ? { ...item, ...updatedData } : item
      ));
      setDialogOpen(false);
      setSelectedCollectible(null);
    } catch (error) {
      console.error('Error updating collectible:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Your Collectibles</h2>
      
      {collectibles.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye size={24} className="text-slate-400" />
          </div>
          <p className="text-slate-400 text-lg mb-4">No collectibles created yet</p>
          <p className="text-slate-500">Start creating your first digital collectible!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {collectibles.map((collectible) => (
            <div key={collectible.id} className="bg-slate-700/50 border border-slate-600/50 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300">
              <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg mb-2">{collectible.title || collectible.item_name || 'Unnamed Item'}</h3>
                {collectible.description && <p className="text-slate-400 text-sm mb-3 line-clamp-2">{collectible.description}</p>}
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-purple-400 font-semibold">{collectible.price || collectible.amount} ETH</span>
                  {collectible.category && <span className="text-slate-500">Category: {collectible.category}</span>}
                  {collectible.rarity && <span className="text-slate-500">Rarity: {collectible.rarity}</span>}
                  <span className="text-slate-500">{collectible.type === 'purchased' ? 'Purchased' : 'Created'}</span>
                </div>
              </div>
                <div className="flex items-center space-x-2 ml-4">
                  {collectible.type === 'created' && (
                    <Dialog open={dialogOpen && selectedCollectible?.id === collectible.id} onOpenChange={(open) => {
                      if (!open) {
                        setSelectedCollectible(null);
                        setDialogOpen(false);
                      }
                    }}>
                      <DialogTrigger asChild>
                        <button 
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-600 rounded-lg transition-colors"
                          onClick={() => handleEdit(collectible)}
                        >
                          <Edit size={16} />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-slate-800 border border-slate-700">
                        <DialogHeader>
                          <DialogTitle>Edit Collectible</DialogTitle>
                        </DialogHeader>
                        <CollectibleForm 
                          initialData={selectedCollectible || undefined} 
                          onSubmit={handleUpdate} 
                          isEditing={true} 
                        />
                      </DialogContent>
                    </Dialog>
                  )}
                  <button 
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-600 rounded-lg transition-colors"
                    onClick={() => handleDelete(collectible)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserCollectibles;
