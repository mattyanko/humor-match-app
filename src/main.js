import { escapeHTML } from './ui.js';
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
      <div class="brand">humor match<span>✳</span></div>
      
      <div id="auth-section">
        <p class="eyebrow">GOOD CHEMISTRY STARTS WITH A LAUGH</p><h1>Find your kind<br>of funny.</h1><p class="intro">A little wit. A little weird. Meet people who laugh at the same things you do.</p><h2>Your next inside joke starts here</h2>
        <input type="email" id="email" placeholder="Email" aria-label="Email" autocomplete="email" />
        <input type="password" id="password" placeholder="Password" aria-label="Password" autocomplete="current-password" />
        <input type="text" id="displayName" placeholder="Your name (for signup)" aria-label="Your name" autocomplete="nickname" />
        <br>
        <button id="signupBtn">Sign Up</button>
        <button id="loginBtn">Log In</button>
        
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


}

function showWelcomeScreen(user, profileData) {
  document.querySelector('#app').innerHTML = `
    <div>
      <div class="brand">humor match<span>✳</span></div>
      <div id="profile-section" style="text-align: center;">
        <p class="eyebrow">YOUR HUMOR PROFILE</p><h1>Hey, ${escapeHTML(user.displayName || "you")}.</h1><p class="intro">There’s someone out there who gets your punchline.</p>
        <h2>Your recipe for a good laugh</h2>
        <div class="profile-scores">
          <p><strong>Witty:</strong> ${profileData.humorScores.witty}/7</p>
          <p><strong>Dark:</strong> ${profileData.humorScores.dark}/7</p>
          <p><strong>Physical:</strong> ${profileData.humorScores.physical}/7</p>
          <p><strong>Absurdist:</strong> ${profileData.humorScores.absurdist}/7</p>
          <p><strong>Self-Deprecating:</strong> ${profileData.humorScores.selfDeprecating}/7</p>
        </div>
        <button id="findMatches" class="primary-btn">Find Matches 🎯</button>
        <button id="retakeSurvey">Edit Profile</button>
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
