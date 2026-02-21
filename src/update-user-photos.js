// update-user-photos.js
import { db, auth } from './firebase-config.js';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

const PHOTO_MAP = {
  'spudz': {
    photoURL: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800',
    bio: 'I like dad jokes and long walks through the condiment aisle. Looking for someone who doesn\'t take life too seriously.',
    age: 27
  },
  'Witty Will': {
    displayName: 'Marcus',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    bio: 'Professional pun enthusiast. I have a Ph.D. in sarcasm. Let\'s trade bad jokes.',
    age: 30
  },
  'Dark Dana': {
    displayName: 'Luna',
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800',
    bio: 'Dark humor is my love language. If you can make me laugh until I feel slightly guilty, we\'ll get along.',
    age: 24
  },
  'Physical Phil': {
    displayName: 'Maya',
    photoURL: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800',
    bio: 'My humor style is "uncomfortable silence followed by a weird noise." Catch me at a local improv show or staring at a wall.',
    age: 29
  },
  'Absurd Amy': {
    displayName: 'Julian',
    photoURL: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=800',
    bio: 'If you don\'t like dry sarcasm, we probably won\'t get along. If you do, I\'ll still pretend we don\'t.',
    age: 34
  },
  'Self-Dep Sam': {
    displayName: 'Zara',
    photoURL: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800',
    bio: 'I once laughed at a floating piece of bread for ten minutes. Looking for someone with equally low standards for entertainment.',
    age: 26
  },
  'Combo Carl': {
    displayName: 'Theo',
    photoURL: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800',
    bio: 'I\'m the guy who trips over flat surfaces just to see if anyone is watching. High energy, low coordination.',
    age: 31
  },
  'Neutral Nancy': {
    displayName: 'Elena',
    photoURL: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800',
    bio: 'Sophisticated wit, but also I find the word "pantaloon" hilarious. It\'s a balance.',
    age: 38
  },
  'Extreme Ed': {
    displayName: 'Kai',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800',
    bio: 'Life is a joke and I\'m the punchline. Let\'s go get tacos and judge people silently.',
    age: 28
  },
  'Diverse Deb': {
    displayName: 'Sloane',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    bio: 'My favorite humor is when things go slightly wrong in a very specific way. Absolute chaos enthusiast.',
    age: 32
  }
};

export async function updateUserPhotos() {
  console.log('Starting user photo updates...');
  
  // First, we need admin access - we'll use your main account
  // You need to be logged in as someone with permission
  
  if (!auth.currentUser) {
    alert('You must be logged in to run this update!');
    return;
  }
  
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    let updateCount = 0;
    let errors = 0;
    
    for (const docSnap of snapshot.docs) {
      const userData = docSnap.data();
      const currentName = userData.displayName;
      
      if (PHOTO_MAP[currentName]) {
        try {
          const updates = PHOTO_MAP[currentName];
          
          // Only update fields that exist in the mapping
          const updateData = {
            updatedAt: new Date()
          };
          
          if (updates.displayName) updateData.displayName = updates.displayName;
          if (updates.photoURL) updateData.photoURL = updates.photoURL;
          if (updates.bio) updateData.bio = updates.bio;
          if (updates.age) updateData.age = updates.age;
          
          await updateDoc(doc(db, 'users', docSnap.id), updateData);
          
          console.log(`✅ Updated: ${currentName}`);
          updateCount++;
        } catch (err) {
          console.error(`❌ Failed to update ${currentName}:`, err.message);
          errors++;
        }
      }
    }
    
    alert(`🎉 Updated ${updateCount} users!\n${errors > 0 ? `Failed: ${errors}` : ''}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    alert('Error updating users: ' + error.message);
  }
}