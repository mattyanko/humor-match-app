import './style.css'
import { auth, db } from './firebase-config.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { showSurvey } from './survey.js';

function showAuthScreen() {
  document.querySelector('#app').innerHTML = `
    <div>
      <h1>Humor Match 🎭</h1>
      
      <div id="auth-section">
        <h2>Sign Up / Log In</h2>
        <input type="email" id="email" placeholder="Email" />
        <input type="password" id="password" placeholder="Password" />
        <input type="text" id="displayName" placeholder="Display Name (for signup)" />
        <br>
        <button id="signupBtn">Sign Up</button>
        <button id="loginBtn">Log In</button>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #dadce0;">
        
        <div style="text-align: center;">
          <p style="color: #5f6368; font-size: 14px;">Testing? Create 10 users instantly:</p>
          <button id="bulkCreateBtn" class="secondary-btn">Create Test Users 🤖</button>
        </div>
      </div>
    </div>
  `;

  // Sign Up
  document.getElementById('signupBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const displayName = document.getElementById('displayName').value;
    
    if (!email || !password || !displayName) {
      alert('Please fill in all fields');
      return;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName });
      
      await setDoc(doc(db, 'users', user.uid), {
        userId: user.uid,
        displayName: displayName,
        bio: '',
        photoURL: '',
        humorScores: {
          witty: 0,
          dark: 0,
          physical: 0,
          absurdist: 0,
          selfDeprecating: 0
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        isProfileComplete: false
      });
      
      alert('Account created! Now complete your humor profile.');
      console.log('User created:', user.uid);
    } catch (error) {
      alert('Error: ' + error.message);
      console.error('Signup error:', error);
    }
  });

  // Log In
  document.getElementById('loginBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Logged in successfully! ✅');
    } catch (error) {
      alert('Error: ' + error.message);
      console.error('Login error:', error);
    }
  });

  // Bulk Create Test Users
  document.getElementById('bulkCreateBtn').addEventListener('click', async () => {
    const confirmed = confirm(
      'This will create 10 test users with different humor profiles.\n\n' +
      'All passwords will be "test123"\n\n' +
      'Continue?'
    );
    
    if (confirmed) {
      const { createBulkUsers } = await import('./bulk-add-users.js');
      await createBulkUsers();
    }
  });


  // Bulk Update Photos Button
  document.getElementById('bulkCreateBtn').insertAdjacentHTML('afterend', `
    <button id="bulkUpdatePhotos" class="secondary-btn" style="margin-top: 10px;">
      Update User Photos 📸
    </button>
  `);

  document.getElementById('bulkUpdatePhotos').addEventListener('click', async () => {
    const confirmed = confirm(
      'This will update all existing users with photos and bios.\n\n' +
      'Continue?'
    );
    
    if (confirmed) {
      const { updateUserPhotos } = await import('./update-user-photos.js');
      await updateUserPhotos();
    }
  });
}

function showWelcomeScreen(user, profileData) {
  document.querySelector('#app').innerHTML = `
    <div>
      <h1>Humor Match 🎭</h1>
      <div id="profile-section" style="text-align: center;">
        <h2>Welcome, ${user.displayName}! 👋</h2>
        <p style="color: #5f6368;">Profile complete! Your humor scores:</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Witty:</strong> ${profileData.humorScores.witty}/7</p>
          <p><strong>Dark:</strong> ${profileData.humorScores.dark}/7</p>
          <p><strong>Physical:</strong> ${profileData.humorScores.physical}/7</p>
          <p><strong>Absurdist:</strong> ${profileData.humorScores.absurdist}/7</p>
          <p><strong>Self-Deprecating:</strong> ${profileData.humorScores.selfDeprecating}/7</p>
        </div>
        <button id="findMatches" class="primary-btn">Find Matches 🎯</button>
        <button id="retakeSurvey">Edit Profile</button>
        <button id="updatePhotosBtn" class="secondary-btn">Update User Photos 📸</button>
        <button id="logoutBtn">Log Out</button>
      </div>
    </div>
  `;

  document.getElementById('retakeSurvey').addEventListener('click', () => {
    showSurvey();
  });

  document.getElementById('findMatches').addEventListener('click', async () => {
    const { showMatches } = await import('./matches.js');
    showMatches(profileData);
  });

  document.getElementById('updatePhotosBtn').addEventListener('click', async () => {
    const confirmed = confirm(
      'This will update all existing users with photos and bios.\n\n' +
      'Continue?'
    );
    
    if (confirmed) {
      const { updateUserPhotos } = await import('./update-user-photos.js');
      await updateUserPhotos();
    }
  });

  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await signOut(auth);
  });
}

// Auth State Listener - Main Router
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log('User logged in:', user.email);
    
    // Check if profile is complete
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const profileData = userDoc.data();
    
    if (profileData && profileData.isProfileComplete) {
      // Show welcome screen with their scores
      showWelcomeScreen(user, profileData);
    } else {
      // Show survey to complete profile
      showSurvey();
    }
  } else {
    console.log('No user logged in');
    showAuthScreen();
  }
});