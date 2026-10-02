// survey.js
import { auth, db } from './firebase-config.js';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export async function showSurvey() {
  const user = auth.currentUser;
  if (!user) return;
  const app = document.querySelector("#app");
  let existing = {};
  try { existing = (await getDoc(doc(db, "users", user.uid))).data() || {}; } catch { /* Allow onboarding when the profile cannot be read. */ }
  if (auth.currentUser?.uid !== user.uid) return;

  
  app.innerHTML = `
    <div class="survey-container-blue">
      <div class="survey-header-blue">
        <div class="brand">humor match<span>✳</span></div><p class="eyebrow">LET’S FIND YOUR FUNNY</p><h1>What makes you laugh?</h1>
        <p class="survey-subtitle">No wrong answers. Rate each style from 1 to 7 to find your people.</p><div class="survey-progress"><span id="surveyProgress" style="width:0%"></span></div><p id="surveyStatus" class="survey-status" aria-live="polite">0 of 5 styles rated</p>
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
            <button type="button" class="dot-option-blue" data-value="1" aria-pressed="false">1</button>
            <button type="button" class="dot-option-blue" data-value="2" aria-pressed="false">2</button>
            <button type="button" class="dot-option-blue" data-value="3" aria-pressed="false">3</button>
            <button type="button" class="dot-option-blue" data-value="4" aria-pressed="false">4</button>
            <button type="button" class="dot-option-blue" data-value="5" aria-pressed="false">5</button>
            <button type="button" class="dot-option-blue" data-value="6" aria-pressed="false">6</button>
            <button type="button" class="dot-option-blue" data-value="7" aria-pressed="false">7</button>
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
            <button type="button" class="dot-option-blue" data-value="1" aria-pressed="false">1</button>
            <button type="button" class="dot-option-blue" data-value="2" aria-pressed="false">2</button>
            <button type="button" class="dot-option-blue" data-value="3" aria-pressed="false">3</button>
            <button type="button" class="dot-option-blue" data-value="4" aria-pressed="false">4</button>
            <button type="button" class="dot-option-blue" data-value="5" aria-pressed="false">5</button>
            <button type="button" class="dot-option-blue" data-value="6" aria-pressed="false">6</button>
            <button type="button" class="dot-option-blue" data-value="7" aria-pressed="false">7</button>
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
            <button type="button" class="dot-option-blue" data-value="1" aria-pressed="false">1</button>
            <button type="button" class="dot-option-blue" data-value="2" aria-pressed="false">2</button>
            <button type="button" class="dot-option-blue" data-value="3" aria-pressed="false">3</button>
            <button type="button" class="dot-option-blue" data-value="4" aria-pressed="false">4</button>
            <button type="button" class="dot-option-blue" data-value="5" aria-pressed="false">5</button>
            <button type="button" class="dot-option-blue" data-value="6" aria-pressed="false">6</button>
            <button type="button" class="dot-option-blue" data-value="7" aria-pressed="false">7</button>
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
            <button type="button" class="dot-option-blue" data-value="1" aria-pressed="false">1</button>
            <button type="button" class="dot-option-blue" data-value="2" aria-pressed="false">2</button>
            <button type="button" class="dot-option-blue" data-value="3" aria-pressed="false">3</button>
            <button type="button" class="dot-option-blue" data-value="4" aria-pressed="false">4</button>
            <button type="button" class="dot-option-blue" data-value="5" aria-pressed="false">5</button>
            <button type="button" class="dot-option-blue" data-value="6" aria-pressed="false">6</button>
            <button type="button" class="dot-option-blue" data-value="7" aria-pressed="false">7</button>
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
            <button type="button" class="dot-option-blue" data-value="1" aria-pressed="false">1</button>
            <button type="button" class="dot-option-blue" data-value="2" aria-pressed="false">2</button>
            <button type="button" class="dot-option-blue" data-value="3" aria-pressed="false">3</button>
            <button type="button" class="dot-option-blue" data-value="4" aria-pressed="false">4</button>
            <button type="button" class="dot-option-blue" data-value="5" aria-pressed="false">5</button>
            <button type="button" class="dot-option-blue" data-value="6" aria-pressed="false">6</button>
            <button type="button" class="dot-option-blue" data-value="7" aria-pressed="false">7</button>
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

  bioInputPlaceholder();
  function updateProgress() {
    const count = Object.values(selections).filter(Boolean).length;
    document.getElementById('surveyProgress').style.width = `${count / 5 * 100}%`;
    document.getElementById('surveyStatus').textContent = `${count} of 5 styles rated`;
  }
  function bioInputPlaceholder() {
    document.getElementById('bio').value = existing.bio || '';
    document.getElementById('charCount').textContent = `${(existing.bio || '').length} / 500`;
    document.querySelectorAll('.dots-selector-blue').forEach(selector => {
      const key = selector.dataset.question;
      selector.setAttribute('role', 'group');
      selector.setAttribute('aria-label', `${key} humor rating`);
      const value = existing.humorScores?.[key];
      if (value >= 1 && value <= 7) {
        selections[key] = value;
        const button = selector.querySelector(`[data-value="${value}"]`);
        button.classList.add('selected');
        button.setAttribute('aria-pressed', 'true');
      }
    });
    updateProgress();
  }
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
        d.setAttribute('aria-pressed', 'false');
      });
      dot.classList.add('selected');
      dot.setAttribute('aria-pressed', 'true');
      updateProgress();
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

    const submit = document.getElementById('submitSurvey');
    submit.disabled = true;
    submit.textContent = 'Saving your profile…';
    try {
      await setDoc(doc(db, 'users', user.uid), {
        userId: user.uid,
        displayName: user.displayName || 'Anonymous',
        bio: bio,
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
      submit.disabled = false;
      submit.textContent = 'Save profile';
    }
  });
}
