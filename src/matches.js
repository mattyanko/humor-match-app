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
  
  const matchesHTML = matches.map((match, index) => `
    <div class="match-feed-card">
      <div class="card-header">
        <div class="match-rank-badge">#${index + 1}</div>
        <div class="match-score-badge ${getMatchClass(match.matchScore)}">
          ${match.matchScore}% Match
        </div>
      </div>
      
      <div class="card-body">
        <div class="profile-section">
          <div class="profile-photo-placeholder">
            <div class="profile-initials">${getInitials(match.displayName)}</div>
          </div>
          
          <div class="profile-info">
            <h2 class="profile-name">${match.displayName}</h2>
            ${match.bio ? `<p class="profile-bio">"${match.bio}"</p>` : '<p class="profile-bio-empty">No bio yet</p>'}
          </div>
        </div>
        
        <div class="humor-scores-section">
          <h3 class="section-title">Humor Compatibility</h3>
          
          <div class="score-item">
            <div class="score-header">
              <span class="score-label">😏 Witty</span>
              <span class="score-difference ${getDiffClass(currentUserData.humorScores.witty, match.humorScores.witty)}">
                ${getMatchText(currentUserData.humorScores.witty, match.humorScores.witty)}
              </span>
            </div>
            <div class="score-bars">
              <div class="score-bar-wrapper">
                <span class="bar-label">You</span>
                <div class="score-bar-bg">
                  <div class="score-bar you-bar" style="width: ${(currentUserData.humorScores.witty / 7) * 100}%">
                    <span class="bar-value">${currentUserData.humorScores.witty}</span>
                  </div>
                </div>
              </div>
              <div class="score-bar-wrapper">
                <span class="bar-label">Them</span>
                <div class="score-bar-bg">
                  <div class="score-bar them-bar" style="width: ${(match.humorScores.witty / 7) * 100}%">
                    <span class="bar-value">${match.humorScores.witty}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="score-item">
            <div class="score-header">
              <span class="score-label">🌑 Dark</span>
              <span class="score-difference ${getDiffClass(currentUserData.humorScores.dark, match.humorScores.dark)}">
                ${getMatchText(currentUserData.humorScores.dark, match.humorScores.dark)}
              </span>
            </div>
            <div class="score-bars">
              <div class="score-bar-wrapper">
                <span class="bar-label">You</span>
                <div class="score-bar-bg">
                  <div class="score-bar you-bar" style="width: ${(currentUserData.humorScores.dark / 7) * 100}%">
                    <span class="bar-value">${currentUserData.humorScores.dark}</span>
                  </div>
                </div>
              </div>
              <div class="score-bar-wrapper">
                <span class="bar-label">Them</span>
                <div class="score-bar-bg">
                  <div class="score-bar them-bar" style="width: ${(match.humorScores.dark / 7) * 100}%">
                    <span class="bar-value">${match.humorScores.dark}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="score-item">
            <div class="score-header">
              <span class="score-label">🤪 Physical</span>
              <span class="score-difference ${getDiffClass(currentUserData.humorScores.physical, match.humorScores.physical)}">
                ${getMatchText(currentUserData.humorScores.physical, match.humorScores.physical)}
              </span>
            </div>
            <div class="score-bars">
              <div class="score-bar-wrapper">
                <span class="bar-label">You</span>
                <div class="score-bar-bg">
                  <div class="score-bar you-bar" style="width: ${(currentUserData.humorScores.physical / 7) * 100}%">
                    <span class="bar-value">${currentUserData.humorScores.physical}</span>
                  </div>
                </div>
              </div>
              <div class="score-bar-wrapper">
                <span class="bar-label">Them</span>
                <div class="score-bar-bg">
                  <div class="score-bar them-bar" style="width: ${(match.humorScores.physical / 7) * 100}%">
                    <span class="bar-value">${match.humorScores.physical}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="score-item">
            <div class="score-header">
              <span class="score-label">🎨 Absurdist</span>
              <span class="score-difference ${getDiffClass(currentUserData.humorScores.absurdist, match.humorScores.absurdist)}">
                ${getMatchText(currentUserData.humorScores.absurdist, match.humorScores.absurdist)}
              </span>
            </div>
            <div class="score-bars">
              <div class="score-bar-wrapper">
                <span class="bar-label">You</span>
                <div class="score-bar-bg">
                  <div class="score-bar you-bar" style="width: ${(currentUserData.humorScores.absurdist / 7) * 100}%">
                    <span class="bar-value">${currentUserData.humorScores.absurdist}</span>
                  </div>
                </div>
              </div>
              <div class="score-bar-wrapper">
                <span class="bar-label">Them</span>
                <div class="score-bar-bg">
                  <div class="score-bar them-bar" style="width: ${(match.humorScores.absurdist / 7) * 100}%">
                    <span class="bar-value">${match.humorScores.absurdist}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="score-item">
            <div class="score-header">
              <span class="score-label">😅 Self-Deprecating</span>
              <span class="score-difference ${getDiffClass(currentUserData.humorScores.selfDeprecating, match.humorScores.selfDeprecating)}">
                ${getMatchText(currentUserData.humorScores.selfDeprecating, match.humorScores.selfDeprecating)}
              </span>
            </div>
            <div class="score-bars">
              <div class="score-bar-wrapper">
                <span class="bar-label">You</span>
                <div class="score-bar-bg">
                  <div class="score-bar you-bar" style="width: ${(currentUserData.humorScores.selfDeprecating / 7) * 100}%">
                    <span class="bar-value">${currentUserData.humorScores.selfDeprecating}</span>
                  </div>
                </div>
              </div>
              <div class="score-bar-wrapper">
                <span class="bar-label">Them</span>
                <div class="score-bar-bg">
                  <div class="score-bar them-bar" style="width: ${(match.humorScores.selfDeprecating / 7) * 100}%">
                    <span class="bar-value">${match.humorScores.selfDeprecating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="card-actions">
        <button class="action-btn pass-btn" data-user-id="${match.userId}">
          <span class="btn-icon">👎</span>
          <span class="btn-text">Pass</span>
        </button>
        <button class="action-btn like-btn" data-user-id="${match.userId}">
          <span class="btn-icon">❤️</span>
          <span class="btn-text">Like</span>
        </button>
      </div>
    </div>
  `).join('');
  
  app.innerHTML = `
    <div class="matches-feed-container">
      <div class="feed-header">
        <h1>Your Matches 🎭</h1>
        <p class="feed-subtitle">${matches.length} potential ${matches.length === 1 ? 'match' : 'matches'} found</p>
      </div>
      
      <div class="feed-cards">
        ${matchesHTML}
      </div>
      
      <div class="feed-footer">
        <button id="backToProfile" class="secondary-btn">← Back to Profile</button>
        <button id="logoutBtn" class="secondary-btn">Log Out</button>
      </div>
    </div>
  `;
  
  // Add event listeners to all like/pass buttons
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const userId = e.currentTarget.getAttribute('data-user-id');
      const userName = matches.find(m => m.userId === userId).displayName;
      handleLike(userId, userName, e.currentTarget);
    });
  });
  
  document.querySelectorAll('.pass-btn').forEach(btn => {
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
  const card = button.closest('.match-feed-card');
  card.style.opacity = '0.5';
}

function getMatchClass(score) {
  if (score >= 80) return 'excellent-match';
  if (score >= 60) return 'good-match';
  if (score >= 40) return 'ok-match';
  return 'low-match';
}