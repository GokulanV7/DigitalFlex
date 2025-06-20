import { supabase } from '../../src/integrations/supabase/client';

const dummyCollectibles = [
  {
    title: 'Digital Art #1',
    description: 'A unique piece of digital art.',
    price: 0.05,
    category: 'art',
    rarity: 'rare',
    image_url: '/placeholder.svg',
    user_id: 'dummy-user-1',
  },
  {
    title: 'Epic Music Track',
    description: 'An epic music track for your collection.',
    price: 0.03,
    category: 'music',
    rarity: 'epic',
    image_url: '/placeholder.svg',
    user_id: 'dummy-user-2',
  },
  {
    title: 'Gaming Asset',
    description: 'A rare gaming asset for in-game use.',
    price: 0.1,
    category: 'gaming',
    rarity: 'legendary',
    image_url: '/placeholder.svg',
    user_id: 'dummy-user-3',
  },
  {
    title: 'Video Clip',
    description: 'A short memorable video clip.',
    price: 0.02,
    category: 'video',
    rarity: 'common',
    image_url: '/placeholder.svg',
    user_id: 'dummy-user-4',
  },
  {
    title: 'Photography Shot',
    description: 'A stunning digital photograph.',
    price: 0.04,
    category: 'photography',
    rarity: 'rare',
    image_url: '/placeholder.svg',
    user_id: 'dummy-user-5',
  },
  {
    title: 'Collectible Item #1',
    description: 'A must-have collectible item.',
    price: 0.08,
    category: 'collectible',
    rarity: 'epic',
    image_url: '/placeholder.svg',
    user_id: 'dummy-user-6',
  },
  {
    title: 'Digital Art #2',
    description: 'Another unique piece of digital art.',
    price: 0.06,
    category: 'art',
    rarity: 'rare',
    image_url: '/placeholder.svg',
    user_id: 'dummy-user-7',
  },
  {
    title: 'Music Sample',
    description: 'A sample of an upcoming music release.',
    price: 0.01,
    category: 'music',
    rarity: 'common',
    image_url: '/placeholder.svg',
    user_id: 'dummy-user-8',
  },
  {
    title: 'Gaming Skin',
    description: 'A rare skin for your favorite game.',
    price: 0.09,
    category: 'gaming',
    rarity: 'legendary',
    image_url: '/placeholder.svg',
    user_id: 'dummy-user-9',
  },
  {
    title: 'Video Highlight',
    description: 'A highlight from a popular video.',
    price: 0.07,
    category: 'video',
    rarity: 'epic',
    image_url: '/placeholder.svg',
    user_id: 'dummy-user-10',
  },
];

const insertDummyData = async () => {
  try {
    for (const collectible of dummyCollectibles) {
      const { data, error } = await supabase
        .from('collectibles')
        .insert([collectible])
        .select();
      if (error) {
        console.error(`Error inserting ${collectible.title}:`, error);
      } else {
        console.log(`Inserted ${collectible.title} successfully:`, data);
      }
    }
    console.log('All dummy data insertion attempted.');
  } catch (error) {
    console.error('Error in insertDummyData:', error);
  }
};

// Run the script
insertDummyData();
