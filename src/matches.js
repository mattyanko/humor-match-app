// matches.js
import { auth, db } from './firebase-config.js';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

// Calculate Euclidean distance between two users' humor scores
function calculateMatchScore(user1Scores, user2Scores) {
  const distance = Math.sqrt(
    Math.pow(user1Scores.witty - user2Scores.witty, 2) +
    Math.pow(user1Scores.dark - user2Scores.dark, 2) +
    Math.pow(user1Scores.physical - user2Scores.physical, 2) +
    Math.pow(user1Scores.absurdist - user2Scores.absurdist, 2) +
    Math.pow(user1Scores.selfDeprecating - user2Scores.selfDeprecating, 2)
  );
  
  // Max possible distance is sqrt(5 * 6^2) = ~13.4
  const maxDistance = Math.sqrt(5 * Math.pow(6, 2));
  
  // Convert to 0-100 match percentage (lower distance = higher match)
  const matchPercentage = Math.round(100 - (distance / maxDistance * 100));
  
  return matchPercentage;
}

export async function showMatches(currentUserData) {
  const app = document.querySelector('#app');
  
  // Show loading state
  app.innerHTML = `
    <div>
      <h1>Finding Your Matches 🎭</h1>
      <p style="text-align: center; color: #5f6368;">Analyzing humor compatibility...</p>
      <div class="loading-spinner"></div>
    </div>
  `;
  
  try {
    // Fetch all users from Firestore
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('isProfileComplete', '==', true));
    const querySnapshot = await getDocs(q);
    
    const allMatches = [];
    
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      
      // Skip the current user
      if (userData.userId === auth.currentUser.uid) {
        return;
      }
      
      // Calculate match score
      const matchScore = calculateMatchScore(
        currentUserData.humorScores,
        userData.humorScores
      );
      
      allMatches.push({
        ...userData,
        matchScore: matchScore
      });
    });
    
    // Sort by match score (highest first)
    allMatches.sort((a, b) => b.matchScore - a.matchScore);
    
    // Display matches
    displayMatches(allMatches, currentUserData);
    
  } catch (error) {
    console.error('Error fetching matches:', error);
    app.innerHTML = `
      <div>
        <h1>Error Loading Matches</h1>
        <p style="color: red;">${error.message}</p>
        <button id="backToProfile">Back to Profile</button>
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
      <div>
        <h1>No Matches Yet 😢</h1>
        <p style="text-align: center; color: #5f6368;">Be the first! Invite your friends to join.</p>
        <button id="backToProfile">Back to Profile</button>
        <button id="logoutBtn">Log Out</button>
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
  
  // Generate HTML for all match cards
  const matchesHTML = matches.map((match, index) => {
    // Calculate which dimensions to show in summary (best 2 matches + biggest difference)
    const dimensions = ['witty', 'dark', 'physical', 'absurdist', 'selfDeprecating'];
    const scored = dimensions.map(dim => ({
      key: dim,
      diff: Math.abs(currentUserData.humorScores[dim] - match.humorScores[dim]),
      yourScore: currentUserData.humorScores[dim],
      theirScore: match.humorScores[dim]
    }));
    
    // Sort by difference (ascending for matches, descending for differences)
    const bestMatches = [...scored].sort((a, b) => a.diff - b.diff).slice(0, 2);
    const biggestDiff = [...scored].sort((a, b) => b.diff - a.diff)[0];
    
    const keyDimensions = [...bestMatches, biggestDiff];
    
    return `
      <div class="match-card-glass">
        <div class="card-header-glass">
          <div class="header-left">
            <div class="rank-glass">#${index + 1}</div>
            <div class="name-glass">${match.displayName}</div>
          </div>
          <div class="match-score-glass">${match.matchScore}% Match</div>
        </div>
        
        <div class="card-content-glass">
          <div class="profile-section-glass">
            <div class="photo-placeholder-glass">
              <div class="photo-icon">📷</div>
              <div class="photo-text">Photo</div>
            </div>
            <div class="bio-glass">${match.bio || 'No bio yet'}</div>
          </div>
          
          <div class="key-matches-glass">
            <div class="key-matches-title">Top Matches & Differences</div>
            ${keyDimensions.map(dim => createScoreRow(dim, currentUserData.humorScores, match.humorScores)).join('')}
          </div>
          
          <button class="view-all-btn-glass" onclick="toggleBreakdown('${match.userId}')">
            <span>View All 5 Humor Dimensions</span>
            <span class="arrow">▼</span>
          </button>
          
          <div class="full-breakdown-glass" id="breakdown-${match.userId}">
            <div class="breakdown-content-glass">
              <div class="breakdown-title">Complete Humor Breakdown</div>
              
              ${createScoreRow({key: 'witty', yourScore: currentUserData.humorScores.witty, theirScore: match.humorScores.witty, diff: Math.abs(currentUserData.humorScores.witty - match.humorScores.witty)}, currentUserData.humorScores, match.humorScores)}
              ${createScoreRow({key: 'dark', yourScore: currentUserData.humorScores.dark, theirScore: match.humorScores.dark, diff: Math.abs(currentUserData.humorScores.dark - match.humorScores.dark)}, currentUserData.humorScores, match.humorScores)}
              ${createScoreRow({key: 'physical', yourScore: currentUserData.humorScores.physical, theirScore: match.humorScores.physical, diff: Math.abs(currentUserData.humorScores.physical - match.humorScores.physical)}, currentUserData.humorScores, match.humorScores)}
              ${createScoreRow({key: 'absurdist', yourScore: currentUserData.humorScores.absurdist, theirScore: match.humorScores.absurdist, diff: Math.abs(currentUserData.humorScores.absurdist - match.humorScores.absurdist)}, currentUserData.humorScores, match.humorScores)}
              ${createScoreRow({key: 'selfDeprecating', yourScore: currentUserData.humorScores.selfDeprecating, theirScore: match.humorScores.selfDeprecating, diff: Math.abs(currentUserData.humorScores.selfDeprecating - match.humorScores.selfDeprecating)}, currentUserData.humorScores, match.humorScores)}
              
              <div class="legend-glass">
                <div class="legend-item">
                  <div class="legend-dot you-glass"></div>
                  <span>You</span>
                </div>
                <div class="legend-item">
                  <div class="legend-dot them-glass"></div>
                  <span>Them</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="actions-glass">
            <button class="btn-glass btn-pass-glass" data-user-id="${match.userId}">
              <span>👎</span>
              <span>Pass</span>
            </button>
            <button class="btn-glass btn-like-glass" data-user-id="${match.userId}">
              <span>❤️</span>
              <span>Like</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  app.innerHTML = `
    <div class="matches-feed-glass">
      <div class="feed-header-glass">
        <h1>Your Matches 🎭</h1>
        <p class="feed-subtitle">${matches.length} potential ${matches.length === 1 ? 'match' : 'matches'} found</p>
      </div>
      
      <div class="feed-cards-glass">
        ${matchesHTML}
      </div>
      
      <div class="feed-footer-glass">
        <button id="backToProfile" class="secondary-btn">← Back to Profile</button>
        <button id="logoutBtn" class="secondary-btn">Log Out</button>
      </div>
    </div>
  `;
  
  // Add event listeners
  document.querySelectorAll('.btn-like-glass').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const userId = e.currentTarget.getAttribute('data-user-id');
      const userName = matches.find(m => m.userId === userId).displayName;
      handleLike(userId, userName, e.currentTarget);
    });
  });
  
  document.querySelectorAll('.btn-pass-glass').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const userId = e.currentTarget.getAttribute('data-user-id');
      const userName = matches.find(m => m.userId === userId).displayName;
      handlePass(userId, userName, e.currentTarget);
    });
  });
  
  document.getElementById('backToProfile').addEventListener('click', () => {
    window.location.reload();
  });
  
  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await signOut(auth);
  });
}

// Helper function to create score row HTML
function createScoreRow(dimension, yourScores, theirScores) {
  const labels = {
    witty: '😏 Witty',
    dark: '🌑 Dark',
    physical: '🤪 Physical',
    absurdist: '🎨 Absurdist',
    selfDeprecating: '😅 Self-Dep'
  };
  
  const yourScore = dimension.yourScore;
  const theirScore = dimension.theirScore;
  const diff = dimension.diff;
  
  let qualityText = 'Different';
  let qualityClass = 'different';
  
  if (diff === 0) {
    qualityText = 'Perfect ✨';
    qualityClass = 'perfect';
  } else if (diff === 1) {
    qualityText = 'Close 👍';
    qualityClass = 'close';
  } else if (diff === 2) {
    qualityText = 'Similar';
    qualityClass = 'close';
  } else if (diff >= 3) {
    qualityText = 'Different ⚡';
    qualityClass = 'different';
  }
  
  // Create dots for visualization
  const yourDots = Array(7).fill(0).map((_, i) => 
    `<div class="dot-glass ${i < yourScore ? 'filled-you-glass' : ''}"></div>`
  ).join('');
  
  const theirDots = Array(7).fill(0).map((_, i) => 
    `<div class="dot-glass ${i < theirScore ? 'filled-them-glass' : ''}"></div>`
  ).join('');
  
  return `
    <div class="score-row-glass">
      <span class="score-label-glass">${labels[dimension.key]}</span>
      <div class="dots-glass">${yourDots}</div>
      <div class="dots-glass">${theirDots}</div>
      <span class="match-quality-glass ${qualityClass}">${qualityText}</span>
    </div>
  `;
}

// Global function to toggle breakdown (needs to be accessible from onclick)
window.toggleBreakdown = function(userId) {
  const breakdown = document.getElementById(`breakdown-${userId}`);
  const button = event.target.closest('.view-all-btn-glass');
  
  breakdown.classList.toggle('expanded');
  button.classList.toggle('expanded');
  
  if (breakdown.classList.contains('expanded')) {
    button.innerHTML = '<span>Hide Full Breakdown</span><span class="arrow">▼</span>';
  } else {
    button.innerHTML = '<span>View All 5 Humor Dimensions</span><span class="arrow">▼</span>';
  }
};

// Helper function to get initials from name
function getInitials(name) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

// Helper function to get difference class
function getDiffClass(score1, score2) {
  const diff = Math.abs(score1 - score2);
  if (diff === 0) return 'perfect-match';
  if (diff === 1) return 'great-match';
  if (diff <= 2) return 'good-match';
  return 'ok-match';
}

// Helper function to get match text
function getMatchText(score1, score2) {
  const diff = Math.abs(score1 - score2);
  if (diff === 0) return '🎯 Perfect!';
  if (diff === 1) return '✨ Very close';
  if (diff <= 2) return '👍 Similar';
  if (diff <= 3) return '~ Different';
  return '⚡ Opposite';
}

// Handle like action
function handleLike(userId, userName, button) {
  // Disable button
  button.disabled = true;
  button.classList.add('liked');
  button.innerHTML = '<span class="btn-icon">💚</span><span class="btn-text">Liked!</span>';
  
  // TODO: Save to Firestore later
  console.log(`Liked: ${userName} (${userId})`);
  
  // Show feedback
  setTimeout(() => {
    alert(`You liked ${userName}! 💚\n\n(Saving likes to database coming soon)`);
  }, 300);
}

// Handle pass action
function handlePass(userId, userName, button) {
  // Disable button
  button.disabled = true;
  button.classList.add('passed');
  button.innerHTML = '<span class="btn-icon">👋</span><span class="btn-text">Passed</span>';
  
  // TODO: Save to Firestore later
  console.log(`Passed: ${userName} (${userId})`);
  
  // Fade out the card
  const card = button.closest('.match-card-glass');
  card.style.opacity = '0.5';
}

function getMatchClass(score) {
  if (score >= 80) return 'excellent-match';
  if (score >= 60) return 'good-match';
  if (score >= 40) return 'ok-match';
  return 'low-match';
}