// survey.js
import { auth, db } from './firebase-config.js';
import { doc, setDoc } from 'firebase/firestore';

export function showSurvey() {
  const app = document.querySelector('#app');
  
  app.innerHTML = `
    <div class="survey-container-blue">
      <div class="survey-header-blue">
        <h1>Complete Your Profile 🎭</h1>
        <p class="survey-subtitle">Tap your rating for each humor type</p>
      </div>

      <div class="survey-cards-blue">
        
        <!-- Witty -->
        <div class="survey-card-blue">
          <div class="card-header-blue">
            <div class="emoji-large">😏</div>
            <div class="header-text">
              <div class="title-blue">Witty Humor</div>
              <div class="example-text">Clever wordplay, puns, quick comebacks</div>
            </div>
          </div>
          <div class="slider-labels-blue">
            <span>Not my thing</span>
            <span>Love it!</span>
          </div>
          <div class="dots-selector-blue" data-question="witty">
            <div class="dot-option-blue" data-value="1">1</div>
            <div class="dot-option-blue" data-value="2">2</div>
            <div class="dot-option-blue" data-value="3">3</div>
            <div class="dot-option-blue" data-value="4">4</div>
            <div class="dot-option-blue" data-value="5">5</div>
            <div class="dot-option-blue" data-value="6">6</div>
            <div class="dot-option-blue" data-value="7">7</div>
          </div>
        </div>

        <!-- Dark -->
        <div class="survey-card-blue">
          <div class="card-header-blue">
            <div class="emoji-large">🌑</div>
            <div class="header-text">
              <div class="title-blue">Dark Humor</div>
              <div class="example-text">Morbid jokes, taboo topics, edgy content</div>
            </div>
          </div>
          <div class="slider-labels-blue">
            <span>Not my thing</span>
            <span>Love it!</span>
          </div>
          <div class="dots-selector-blue" data-question="dark">
            <div class="dot-option-blue" data-value="1">1</div>
            <div class="dot-option-blue" data-value="2">2</div>
            <div class="dot-option-blue" data-value="3">3</div>
            <div class="dot-option-blue" data-value="4">4</div>
            <div class="dot-option-blue" data-value="5">5</div>
            <div class="dot-option-blue" data-value="6">6</div>
            <div class="dot-option-blue" data-value="7">7</div>
          </div>
        </div>

        <!-- Physical -->
        <div class="survey-card-blue">
          <div class="card-header-blue">
            <div class="emoji-large">🤪</div>
            <div class="header-text">
              <div class="title-blue">Physical Humor</div>
              <div class="example-text">Slapstick, silly faces, pranks</div>
            </div>
          </div>
          <div class="slider-labels-blue">
            <span>Not my thing</span>
            <span>Love it!</span>
          </div>
          <div class="dots-selector-blue" data-question="physical">
            <div class="dot-option-blue" data-value="1">1</div>
            <div class="dot-option-blue" data-value="2">2</div>
            <div class="dot-option-blue" data-value="3">3</div>
            <div class="dot-option-blue" data-value="4">4</div>
            <div class="dot-option-blue" data-value="5">5</div>
            <div class="dot-option-blue" data-value="6">6</div>
            <div class="dot-option-blue" data-value="7">7</div>
          </div>
        </div>

        <!-- Absurdist -->
        <div class="survey-card-blue">
          <div class="card-header-blue">
            <div class="emoji-large">🎨</div>
            <div class="header-text">
              <div class="title-blue">Absurdist Humor</div>
              <div class="example-text">Random, nonsensical, surreal, weird memes</div>
            </div>
          </div>
          <div class="slider-labels-blue">
            <span>Not my thing</span>
            <span>Love it!</span>
          </div>
          <div class="dots-selector-blue" data-question="absurdist">
            <div class="dot-option-blue" data-value="1">1</div>
            <div class="dot-option-blue" data-value="2">2</div>
            <div class="dot-option-blue" data-value="3">3</div>
            <div class="dot-option-blue" data-value="4">4</div>
            <div class="dot-option-blue" data-value="5">5</div>
            <div class="dot-option-blue" data-value="6">6</div>
            <div class="dot-option-blue" data-value="7">7</div>
          </div>
        </div>

        <!-- Self-Deprecating -->
        <div class="survey-card-blue">
          <div class="card-header-blue">
            <div class="emoji-large">😅</div>
            <div class="header-text">
              <div class="title-blue">Self-Deprecating Humor</div>
              <div class="example-text">Making fun of yourself, self-roasting</div>
            </div>
          </div>
          <div class="slider-labels-blue">
            <span>Not my thing</span>
            <span>Love it!</span>
          </div>
          <div class="dots-selector-blue" data-question="selfDeprecating">
            <div class="dot-option-blue" data-value="1">1</div>
            <div class="dot-option-blue" data-value="2">2</div>
            <div class="dot-option-blue" data-value="3">3</div>
            <div class="dot-option-blue" data-value="4">4</div>
            <div class="dot-option-blue" data-value="5">5</div>
            <div class="dot-option-blue" data-value="6">6</div>
            <div class="dot-option-blue" data-value="7">7</div>
          </div>
        </div>

      </div>

      <!-- Bio Section -->
      <div class="bio-section-blue">
        <label>
          <strong>Tell us about yourself</strong>
          <span class="optional-text">(Optional - 500 characters max)</span>
        </label>
        <textarea id="bio" maxlength="500" placeholder="I love comedy because..."></textarea>
        <span class="char-count" id="charCount">0 / 500</span>
      </div>

      <button id="submitSurvey" class="primary-btn">Complete Profile ✨</button>
    </div>
  `;

  // Store selections
  const selections = {
    witty: 0,
    dark: 0,
    physical: 0,
    absurdist: 0,
    selfDeprecating: 0
  };

  // Handle dot selection
  document.querySelectorAll('.dots-selector-blue').forEach(selector => {
    selector.addEventListener('click', (e) => {
      const dot = e.target.closest('.dot-option-blue');
      if (!dot) return;

      const question = selector.getAttribute('data-question');
      const value = parseInt(dot.getAttribute('data-value'));

      // Update selection
      selections[question] = value;

      // Visual feedback
      selector.querySelectorAll('.dot-option-blue').forEach(d => {
        d.classList.remove('selected');
      });
      dot.classList.add('selected');
    });
  });

  // Bio character counter
  const bioInput = document.getElementById('bio');
  const charCount = document.getElementById('charCount');
  
  bioInput.addEventListener('input', () => {
    charCount.textContent = `${bioInput.value.length} / 500`;
  });

  // Submit
  document.getElementById('submitSurvey').addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) {
      alert('You must be logged in');
      return;
    }

    // Validate all questions answered
    const unanswered = Object.entries(selections).filter(([key, value]) => value === 0);
    if (unanswered.length > 0) {
      alert('Please rate all humor types before continuing');
      return;
    }

    const bio = bioInput.value.trim();

    try {
      await setDoc(doc(db, 'users', user.uid), {
        userId: user.uid,
        displayName: user.displayName || 'Anonymous',
        bio: bio,
        photoURL: '',
        humorScores: {
          witty: selections.witty,
          dark: selections.dark,
          physical: selections.physical,
          absurdist: selections.absurdist,
          selfDeprecating: selections.selfDeprecating
        },
        isProfileComplete: true,
        updatedAt: new Date()
      }, { merge: true });

      alert('Profile saved! 🎉');
      window.location.reload();
    } catch (error) {
      console.error('Survey error:', error);
      alert('Error saving profile: ' + error.message);
    }
  });
}