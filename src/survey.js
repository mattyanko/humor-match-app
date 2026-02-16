// survey.js
import { auth, db } from './firebase-config.js';
import { doc, updateDoc } from 'firebase/firestore';

export function showSurvey() {
  const app = document.querySelector('#app');
  
  app.innerHTML = `
    <div>
      <h1>Humor Profile Survey 🎭</h1>
      <p style="text-align: center; color: #5f6368;">How much do you enjoy each type of humor?</p>
      
      <div class="survey-container">
        
        <div class="survey-question">
          <label>
            <strong>Witty Humor</strong>
            <span class="description">Clever wordplay, puns, intellectual jokes</span>
          </label>
          <div class="slider-container">
            <span class="anchor-label">Not my thing</span>
            <input type="range" id="witty" min="1" max="7" value="4" />
            <span class="anchor-label">Love it!</span>
          </div>
        </div>

        <div class="survey-question">
          <label>
            <strong>Dark Humor</strong>
            <span class="description">Morbid, edgy, taboo topics</span>
          </label>
          <div class="slider-container">
            <span class="anchor-label">Not my thing</span>
            <input type="range" id="dark" min="1" max="7" value="4" />
            <span class="anchor-label">Love it!</span>
          </div>
        </div>

        <div class="survey-question">
          <label>
            <strong>Physical Humor</strong>
            <span class="description">Slapstick, pranks, visual gags</span>
          </label>
          <div class="slider-container">
            <span class="anchor-label">Not my thing</span>
            <input type="range" id="physical" min="1" max="7" value="4" />
            <span class="anchor-label">Love it!</span>
          </div>
        </div>

        <div class="survey-question">
          <label>
            <strong>Absurdist Humor</strong>
            <span class="description">Surreal, nonsensical, random</span>
          </label>
          <div class="slider-container">
            <span class="anchor-label">Not my thing</span>
            <input type="range" id="absurdist" min="1" max="7" value="4" />
            <span class="anchor-label">Love it!</span>
          </div>
        </div>

        <div class="survey-question">
          <label>
            <strong>Self-Deprecating Humor</strong>
            <span class="description">Making fun of yourself</span>
          </label>
          <div class="slider-container">
            <span class="anchor-label">Not my thing</span>
            <input type="range" id="selfDeprecating" min="1" max="7" value="4" />
            <span class="anchor-label">Love it!</span>
          </div>
        </div>

        <div class="bio-section">
          <label>
            <strong>Your Bio</strong>
            <span class="description">Tell potential matches about yourself (optional)</span>
          </label>
          <textarea id="bio" placeholder="I love stand-up comedy and dad jokes..." maxlength="500"></textarea>
          <span class="char-count" id="bio-count">0/500</span>
        </div>

        <button id="submitSurvey" class="primary-btn">Complete Profile</button>
        <button id="logoutFromSurvey" class="secondary-btn">Log Out</button>
      </div>
    </div>
  `;

  // No more real-time value displays - sliders update silently

  // Bio character counter
  const bioTextarea = document.getElementById('bio');
  const bioCount = document.getElementById('bio-count');
  bioTextarea.addEventListener('input', (e) => {
    bioCount.textContent = `${e.target.value.length}/500`;
  });

  // Submit survey
  document.getElementById('submitSurvey').addEventListener('click', async () => {
    const user = auth.currentUser;
    
    if (!user) {
      alert('You must be logged in to complete the survey');
      return;
    }

    const humorScores = {
      witty: parseInt(document.getElementById('witty').value),
      dark: parseInt(document.getElementById('dark').value),
      physical: parseInt(document.getElementById('physical').value),
      absurdist: parseInt(document.getElementById('absurdist').value),
      selfDeprecating: parseInt(document.getElementById('selfDeprecating').value)
    };

    const bio = document.getElementById('bio').value.trim();
console.log('About to update with:', { humorScores, bio, userId: user.uid });
    try {

        
      // Update Firestore profile
      await updateDoc(doc(db, 'users', user.uid), {
        humorScores: humorScores,
        bio: bio,
        isProfileComplete: true,
        updatedAt: new Date()
      });

      alert('Profile completed! 🎉 Ready to find matches!');
      console.log('Survey saved:', humorScores);
      
      window.location.reload();
      
    } catch (error) {
      alert('Error saving profile: ' + error.message);
      console.error('Survey error:', error);
    }
  });

  // Logout
  document.getElementById('logoutFromSurvey').addEventListener('click', async () => {
    const { signOut } = await import('firebase/auth');
    await signOut(auth);
  });
}