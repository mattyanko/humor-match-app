// bulk-add-users.js
import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// Sample users with varied humor profiles
const testUsers = [
  {
    email: 'witty_will@test.com',
    password: 'test123',
    displayName: 'Witty Will',
    bio: 'I speak exclusively in puns and wordplay',
    humorScores: { witty: 7, dark: 2, physical: 3, absurdist: 4, selfDeprecating: 5 }
  },
  {
    email: 'dark_dana@test.com',
    password: 'test123',
    displayName: 'Dark Dana',
    bio: 'My favorite color is black comedy',
    humorScores: { witty: 4, dark: 7, physical: 2, absurdist: 5, selfDeprecating: 6 }
  },
  {
    email: 'slapstick_sam@test.com',
    password: 'test123',
    displayName: 'Slapstick Sam',
    bio: 'Life is a cartoon and I am Bugs Bunny',
    humorScores: { witty: 3, dark: 2, physical: 7, absurdist: 6, selfDeprecating: 4 }
  },
  {
    email: 'absurd_alex@test.com',
    password: 'test123',
    displayName: 'Absurd Alex',
    bio: 'Reality is optional, chaos is mandatory',
    humorScores: { witty: 5, dark: 4, physical: 3, absurdist: 7, selfDeprecating: 4 }
  },
  {
    email: 'selfdep_sara@test.com',
    password: 'test123',
    displayName: 'Self-Deprecating Sara',
    bio: 'I roast myself so you don\'t have to',
    humorScores: { witty: 4, dark: 3, physical: 2, absurdist: 3, selfDeprecating: 7 }
  },
  {
    email: 'balanced_ben@test.com',
    password: 'test123',
    displayName: 'Balanced Ben',
    bio: 'I enjoy all types of humor equally',
    humorScores: { witty: 5, dark: 5, physical: 5, absurdist: 5, selfDeprecating: 5 }
  },
  {
    email: 'pun_master@test.com',
    password: 'test123',
    displayName: 'Pun Master Paula',
    bio: 'Puns are the highest form of comedy and I will die on this hill',
    humorScores: { witty: 7, dark: 1, physical: 2, absurdist: 3, selfDeprecating: 4 }
  },
  {
    email: 'edgy_eddie@test.com',
    password: 'test123',
    displayName: 'Edgy Eddie',
    bio: 'If it doesn\'t make people uncomfortable, it\'s not funny',
    humorScores: { witty: 3, dark: 7, physical: 4, absurdist: 6, selfDeprecating: 5 }
  },
  {
    email: 'classic_claire@test.com',
    password: 'test123',
    displayName: 'Classic Claire',
    bio: 'Give me wholesome humor or give me death',
    humorScores: { witty: 6, dark: 1, physical: 6, absurdist: 2, selfDeprecating: 3 }
  },
  {
    email: 'random_ryan@test.com',
    password: 'test123',
    displayName: 'Random Ryan',
    bio: 'Potato',
    humorScores: { witty: 2, dark: 3, physical: 4, absurdist: 7, selfDeprecating: 3 }
  }
];

async function createBulkUsers() {
  console.log('🚀 Starting bulk user creation...');
  
  for (let i = 0; i < testUsers.length; i++) {
    const user = testUsers[i];
    
    try {
      console.log(`Creating user ${i + 1}/${testUsers.length}: ${user.displayName}...`);
      
      // Create Firebase Auth account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );
      
      const firebaseUser = userCredential.user;
      
      // Set display name
      await updateProfile(firebaseUser, { displayName: user.displayName });
      
      // Create Firestore profile
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        userId: firebaseUser.uid,
        displayName: user.displayName,
        bio: user.bio,
        photoURL: '',
        humorScores: user.humorScores,
        createdAt: new Date(),
        updatedAt: new Date(),
        isProfileComplete: true
      });
      
      console.log(`✅ Created: ${user.displayName}`);
      
      // Sign out before creating next user
      await signOut(auth);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️  ${user.displayName} already exists, skipping...`);
      } else {
        console.error(`❌ Error creating ${user.displayName}:`, error.message);
      }
    }
  }
  
  console.log('🎉 Bulk user creation complete!');
  alert('✅ Created 10 test users! Refresh the page and log in as any user to see matches.');
}

// Export the function
export { createBulkUsers };