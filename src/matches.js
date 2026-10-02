import { escapeHTML } from './ui.js';
// matches.js
import { auth, db } from './firebase-config.js';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

// Calculate Euclidean distance
function calculateMatchScore(user1Scores, user2Scores) {
  const distance = Math.sqrt(
    Math.pow(user1Scores.witty - user2Scores.witty, 2) +
    Math.pow(user1Scores.dark - user2Scores.dark, 2) +
    Math.pow(user1Scores.physical - user2Scores.physical, 2) +
    Math.pow(user1Scores.absurdist - user2Scores.absurdist, 2) +
    Math.pow(user1Scores.selfDeprecating - user2Scores.selfDeprecating, 2)
  );
  
  const maxDistance = Math.sqrt(5 * Math.pow(6, 2));
  const matchPercentage = Math.round(100 - (distance / maxDistance * 100));
  
  return matchPercentage;
}

// Detect "Top Vibe" - their strongest humor type
function getTopVibe(scores) {
  const humorTypes = [
    { key: 'witty', name: 'Witty', emoji: '😏', color: '#4facfe' },
    { key: 'dark', name: 'Dark', emoji: '🌑', color: '#1f2937' },
    { key: 'physical', name: 'Physical', emoji: '🤪', color: '#10b981' },
    { key: 'absurdist', name: 'Absurdist', emoji: '🎨', color: '#f59e0b' },
    { key: 'selfDeprecating', name: 'Self-Dep', emoji: '😅', color: '#8b5cf6' }
  ];
  
  let topScore = 0;
  let topType = humorTypes[0];
  
  humorTypes.forEach(type => {
    if (scores[type.key] > topScore) {
      topScore = scores[type.key];
      topType = type;
    }
  });
  
  return topType;
}

export async function showMatches(currentUserData) {
  const app = document.querySelector('#app');
  
  app.innerHTML = `
    <div class="state-screen">
      <h1>Finding Your Matches 🎭</h1>
      <p>Analyzing humor compatibility...</p>
    </div>
  `;
  
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('isProfileComplete', '==', true));
    const querySnapshot = await getDocs(q);
    
    const allMatches = [];
    
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      
      if (userData.userId === auth.currentUser.uid) return;
      
      const matchScore = calculateMatchScore(
        currentUserData.humorScores,
        userData.humorScores
      );
      
      allMatches.push({
        ...userData,
        matchScore: matchScore
      });
    });
    
    allMatches.sort((a, b) => b.matchScore - a.matchScore);
    displayMatches(allMatches, currentUserData);
    
  } catch (error) {
    console.error('Error fetching matches:', error);
    app.innerHTML = `
      <div class="state-screen">
        <h1>Error Loading Matches</h1>
        <p style="color: red;">${escapeHTML(error.message)}</p>
        <button id="backToProfile" class="primary-btn">Back to Profile</button>
      </div>
    `;
    
    document.getElementById('backToProfile').addEventListener('click', () => {
      window.location.reload();
    });
  }
}

function displayMatches(matches, currentUserData) {
  const app = document.querySelector('#app');
  
  if (matches.length === 0) {
    app.innerHTML = `
      <div class="state-screen">
        <h1>No Matches Yet 😢</h1>
        <p>Be the first! Invite your friends to join.</p>
        <button id="backToProfile" class="primary-btn">Back to Profile</button>
        <button id="logoutBtn" class="secondary-btn">Log Out</button>
      </div>
    `;
    
    document.getElementById('backToProfile').addEventListener('click', () => {
      window.location.reload();
    });
    
    document.getElementById('logoutBtn').addEventListener('click', async () => {
      await signOut(auth);
    });
    
    return;
  }
  
  const matchesHTML = matches.map((match, index) => {
    const topVibe = getTopVibe(match.humorScores);
    const photoURL = match.photoURL || '';
    const hasPhoto = photoURL && photoURL.length > 0;
    
    return `
      <div class="image-match-card" data-vibe="${topVibe.key}" data-score="${match.matchScore}">
        <!-- Image Section -->
        <div class="image-section">
          ${hasPhoto ? `
            <img src="${escapeHTML(/^https?:\/\//.test(photoURL) ? photoURL : "")}" alt="${escapeHTML(match.displayName)}" class="profile-image" />
          ` : `
            <div class="profile-image-placeholder">
              <div class="placeholder-icon">${escapeHTML((match.displayName || "?").slice(0,1).toUpperCase())}</div>
              <div class="placeholder-text">A face to meet soon</div>
            </div>
          `}
          
          <div class="image-gradient"></div>
          
          <!-- Match Badge -->
          <div class="match-badge">
            ✨ ${match.matchScore}% Match
          </div>
          
          <!-- Top Vibe Badge -->
          <div class="vibe-badge">
            <span class="vibe-emoji">${topVibe.emoji}</span>
            <span class="vibe-name">${topVibe.name}</span>
          </div>
          
          <!-- Name & Bio Overlay -->
          <div class="overlay-info">
            <div class="name-age">
              <h2>${escapeHTML(match.displayName)}${match.age ? `, ${escapeHTML(match.age)}` : ''}</h2>
            </div>
            <p class="bio-text">${escapeHTML(match.bio || 'Still working on their opening line.')}</p>
          </div>
        </div>
        
        <p class="match-reason">${compatibilityReason(match.humorScores, currentUserData.humorScores)}</p>
        <!-- Expand Button -->
        <button class="expand-btn" aria-expanded="false" data-user-id="${escapeHTML(match.userId)}">
          <span class="expand-text">Humor Compatibility</span>
          <span class="expand-arrow">▼</span>
        </button>
        
        <!-- Hidden Breakdown -->
        <div class="breakdown-section" id="breakdown-${escapeHTML(match.userId)}">
          ${createBreakdownHTML(match, currentUserData)}
        </div>
        
        <!-- Action Buttons -->
        <div class="image-actions">
          <button class="btn-image-pass" data-user-id="${escapeHTML(match.userId)}">
            <span>✕</span>
            <span>Pass</span>
          </button>
          <button class="btn-image-like" data-user-id="${escapeHTML(match.userId)}">
            <span>❤️</span>
            <span>Like</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
  
  app.innerHTML = `
    <div class="image-feed">
      <div class="image-feed-header">
        <div class="brand">humor match<span>✳</span></div><p class="eyebrow">SAME WAVELENGTH. BETTER PUNCHLINES.</p><h1>Meet your kind of funny.</h1>
        <p class="feed-count">${matches.length} potential ${matches.length === 1 ? 'match' : 'matches'} found</p>
      </div>
      
      <div class="match-toolbar">
        <label>Humor style <select id="vibeFilter"><option value="all">All styles</option><option value="witty">Witty</option><option value="dark">Dark</option><option value="physical">Physical</option><option value="absurdist">Absurdist</option><option value="selfDeprecating">Self-deprecating</option></select></label>
        <label>Compatibility <select id="scoreFilter"><option value="0">All matches</option><option value="80">80% and up</option><option value="90">90% and up</option></select></label>
        <span id="filterCount" class="feed-count" aria-live="polite"></span>
      </div>
      <div class="image-cards-container">
        ${matchesHTML}
        <p id="filterEmpty" class="match-empty" hidden>No matches with these filters. Try another humor style.</p>
      </div>
      
      <div class="feed-footer">
        <button id="backToProfile" class="secondary-btn">← Back to Profile</button>
        <button id="logoutBtn" class="secondary-btn">Log Out</button>
      </div>
    </div>
  `;
  
  function filterMatches() {
    const vibe = document.getElementById('vibeFilter').value;
    const score = Number(document.getElementById('scoreFilter').value);
    let count = 0;
    document.querySelectorAll('.image-match-card').forEach(card => {
      card.hidden = (vibe !== 'all' && card.dataset.vibe !== vibe) || Number(card.dataset.score) < score;
      if (!card.hidden) count++;
    });
    document.getElementById('filterCount').textContent = `${count} shown`;
    document.getElementById('filterEmpty').hidden = count > 0;
  }
  document.getElementById('vibeFilter').addEventListener('change', filterMatches);
  document.getElementById('scoreFilter').addEventListener('change', filterMatches);
  filterMatches();
  // Add event listeners
  document.querySelectorAll('.expand-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const userId = e.currentTarget.getAttribute('data-user-id');
      toggleBreakdown(userId, e.currentTarget);
    });
  });
  
  document.querySelectorAll('.btn-image-like').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const userId = e.currentTarget.getAttribute('data-user-id');
      const userName = matches.find(m => m.userId === userId).displayName;
      handleLike(userId, userName);
    });
  });
  
  document.querySelectorAll('.btn-image-pass').forEach(btn => {
    btn.addEventListener('click', (e) => {
      handlePass(e.currentTarget);
    });
  });
  
  document.getElementById('backToProfile').addEventListener('click', () => {
    window.location.reload();
  });
  
  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await signOut(auth);
  });
}

function createBreakdownHTML(match, currentUserData) {
  const humorTypes = [
    { key: 'witty', name: 'Witty', emoji: '😏' },
    { key: 'dark', name: 'Dark', emoji: '🌑' },
    { key: 'physical', name: 'Physical', emoji: '🤪' },
    { key: 'absurdist', name: 'Absurdist', emoji: '🎨' },
    { key: 'selfDeprecating', name: 'Self-Dep', emoji: '😅' }
  ];
  
  const rows = humorTypes.map(type => {
    const yourScore = currentUserData.humorScores[type.key];
    const theirScore = match.humorScores[type.key];
    const diff = Math.abs(yourScore - theirScore);
    const isMatch = diff <= 1;
    
    const yourPercent = (yourScore / 7) * 100;
    const theirPercent = (theirScore / 7) * 100;
    
    return `
      <div class="breakdown-row">
        <div class="breakdown-header">
          <span class="breakdown-label">
            <span class="breakdown-emoji">${type.emoji}</span>
            <span>${type.name}</span>
          </span>
          ${isMatch ? '<span class="perfect-badge">Perfect Alignment ✨</span>' : ''}
        </div>
        <div class="bar-container">
          <div class="bar-bg"></div>
          <div class="bar-you" style="width: ${yourPercent}%"></div>
          <div class="bar-them" style="width: ${theirPercent}%"></div>
        </div>
        <div class="bar-labels">
          <span class="label-you">You: ${yourScore}</span>
          <span class="label-them">Them: ${theirScore}</span>
        </div>
      </div>
    `;
  }).join('');
  
  return `
    <div class="breakdown-content">
      <h3 class="breakdown-title">Humor Breakdown</h3>
      ${rows}
    </div>
  `;
}

function toggleBreakdown(userId, button) {
  const breakdown = document.getElementById(`breakdown-${userId}`);
  const arrow = button.querySelector('.expand-arrow');
  const text = button.querySelector('.expand-text');
  button.setAttribute('aria-expanded', String(!breakdown.classList.contains('expanded')));
  
  const isExpanded = breakdown.classList.contains('expanded');
  
  if (isExpanded) {
    breakdown.classList.remove('expanded');
    arrow.textContent = '▼';
    text.textContent = 'Humor Compatibility';
  } else {
    breakdown.classList.add('expanded');
    arrow.textContent = '▲';
    text.textContent = 'Hide Details';
  }
}

function handleLike(userId, userName) {
  alert(`You liked ${userName}! 💚\n\n(Saving likes coming soon)`);
  console.log(`Liked: ${userName} (${userId})`);
}

function handlePass(button) {
  const card = button.closest('.image-match-card');
  card.style.opacity = '0.5';
  card.style.pointerEvents = 'none';
  console.log('Passed on user');
}

function compatibilityReason(theirs, yours) {
  const labels = { witty: 'clever comebacks', dark: 'dark humor', physical: 'slapstick', absurdist: 'the wonderfully weird', selfDeprecating: 'a little self-roasting' };
  const keys = Object.keys(labels).sort((a, b) => Math.abs(theirs[a] - yours[a]) - Math.abs(theirs[b] - yours[b]) || (theirs[b] + yours[b]) - (theirs[a] + yours[a]));
  const key = keys[0];
  return theirs[key] >= 5 && yours[key] >= 5 ? `You both love ${labels[key]}. Instant icebreaker.` : `You’re closest on ${labels[key]}. Compare your humor below.`;
}
