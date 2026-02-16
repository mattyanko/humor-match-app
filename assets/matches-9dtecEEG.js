import{f as v,b as u,q as h,w as f,g as m,a as p,e as b}from"./index-CFP3b_5Z.js";function y(e,s){const r=Math.sqrt(Math.pow(e.witty-s.witty,2)+Math.pow(e.dark-s.dark,2)+Math.pow(e.physical-s.physical,2)+Math.pow(e.absurdist-s.absurdist,2)+Math.pow(e.selfDeprecating-s.selfDeprecating,2)),t=Math.sqrt(5*Math.pow(6,2));return Math.round(100-r/t*100)}async function T(e){const s=document.querySelector("#app");s.innerHTML=`
    <div>
      <h1>Finding Your Matches 🎭</h1>
      <p style="text-align: center; color: #5f6368;">Analyzing humor compatibility...</p>
      <div class="loading-spinner"></div>
    </div>
  `;try{const r=v(u,"users"),t=h(r,f("isProfileComplete","==",!0)),a=await m(t),i=[];a.forEach(o=>{const c=o.data();if(c.userId===p.currentUser.uid)return;const l=y(e.humorScores,c.humorScores);i.push({...c,matchScore:l})}),i.sort((o,c)=>c.matchScore-o.matchScore),g(i,e)}catch(r){console.error("Error fetching matches:",r),s.innerHTML=`
      <div>
        <h1>Error Loading Matches</h1>
        <p style="color: red;">${r.message}</p>
        <button id="backToProfile">Back to Profile</button>
      </div>
    `,document.getElementById("backToProfile").addEventListener("click",()=>{window.location.reload()})}}function g(e,s){const r=document.querySelector("#app");if(e.length===0){r.innerHTML=`
      <div>
        <h1>No Matches Yet 😢</h1>
        <p style="text-align: center; color: #5f6368;">Be the first! Invite your friends to join.</p>
        <button id="backToProfile">Back to Profile</button>
        <button id="logoutBtn">Log Out</button>
      </div>
    `,document.getElementById("backToProfile").addEventListener("click",()=>{window.location.reload()}),document.getElementById("logoutBtn").addEventListener("click",async()=>{await b(p)});return}const t=e.map((a,i)=>`
    <div class="match-feed-card">
      <div class="card-header">
        <div class="match-rank-badge">#${i+1}</div>
        <div class="match-score-badge ${k(a.matchScore)}">
          ${a.matchScore}% Match
        </div>
      </div>
      
      <div class="card-body">
        <div class="profile-section">
          <div class="profile-photo-placeholder">
            <div class="profile-initials">${w(a.displayName)}</div>
          </div>
          
          <div class="profile-info">
            <h2 class="profile-name">${a.displayName}</h2>
            ${a.bio?`<p class="profile-bio">"${a.bio}"</p>`:'<p class="profile-bio-empty">No bio yet</p>'}
          </div>
        </div>
        
        <div class="humor-scores-section">
          <h3 class="section-title">Humor Compatibility</h3>
          
          <div class="score-item">
            <div class="score-header">
              <span class="score-label">😏 Witty</span>
              <span class="score-difference ${d(s.humorScores.witty,a.humorScores.witty)}">
                ${n(s.humorScores.witty,a.humorScores.witty)}
              </span>
            </div>
            <div class="score-bars">
              <div class="score-bar-wrapper">
                <span class="bar-label">You</span>
                <div class="score-bar-bg">
                  <div class="score-bar you-bar" style="width: ${s.humorScores.witty/7*100}%">
                    <span class="bar-value">${s.humorScores.witty}</span>
                  </div>
                </div>
              </div>
              <div class="score-bar-wrapper">
                <span class="bar-label">Them</span>
                <div class="score-bar-bg">
                  <div class="score-bar them-bar" style="width: ${a.humorScores.witty/7*100}%">
                    <span class="bar-value">${a.humorScores.witty}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="score-item">
            <div class="score-header">
              <span class="score-label">🌑 Dark</span>
              <span class="score-difference ${d(s.humorScores.dark,a.humorScores.dark)}">
                ${n(s.humorScores.dark,a.humorScores.dark)}
              </span>
            </div>
            <div class="score-bars">
              <div class="score-bar-wrapper">
                <span class="bar-label">You</span>
                <div class="score-bar-bg">
                  <div class="score-bar you-bar" style="width: ${s.humorScores.dark/7*100}%">
                    <span class="bar-value">${s.humorScores.dark}</span>
                  </div>
                </div>
              </div>
              <div class="score-bar-wrapper">
                <span class="bar-label">Them</span>
                <div class="score-bar-bg">
                  <div class="score-bar them-bar" style="width: ${a.humorScores.dark/7*100}%">
                    <span class="bar-value">${a.humorScores.dark}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="score-item">
            <div class="score-header">
              <span class="score-label">🤪 Physical</span>
              <span class="score-difference ${d(s.humorScores.physical,a.humorScores.physical)}">
                ${n(s.humorScores.physical,a.humorScores.physical)}
              </span>
            </div>
            <div class="score-bars">
              <div class="score-bar-wrapper">
                <span class="bar-label">You</span>
                <div class="score-bar-bg">
                  <div class="score-bar you-bar" style="width: ${s.humorScores.physical/7*100}%">
                    <span class="bar-value">${s.humorScores.physical}</span>
                  </div>
                </div>
              </div>
              <div class="score-bar-wrapper">
                <span class="bar-label">Them</span>
                <div class="score-bar-bg">
                  <div class="score-bar them-bar" style="width: ${a.humorScores.physical/7*100}%">
                    <span class="bar-value">${a.humorScores.physical}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="score-item">
            <div class="score-header">
              <span class="score-label">🎨 Absurdist</span>
              <span class="score-difference ${d(s.humorScores.absurdist,a.humorScores.absurdist)}">
                ${n(s.humorScores.absurdist,a.humorScores.absurdist)}
              </span>
            </div>
            <div class="score-bars">
              <div class="score-bar-wrapper">
                <span class="bar-label">You</span>
                <div class="score-bar-bg">
                  <div class="score-bar you-bar" style="width: ${s.humorScores.absurdist/7*100}%">
                    <span class="bar-value">${s.humorScores.absurdist}</span>
                  </div>
                </div>
              </div>
              <div class="score-bar-wrapper">
                <span class="bar-label">Them</span>
                <div class="score-bar-bg">
                  <div class="score-bar them-bar" style="width: ${a.humorScores.absurdist/7*100}%">
                    <span class="bar-value">${a.humorScores.absurdist}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="score-item">
            <div class="score-header">
              <span class="score-label">😅 Self-Deprecating</span>
              <span class="score-difference ${d(s.humorScores.selfDeprecating,a.humorScores.selfDeprecating)}">
                ${n(s.humorScores.selfDeprecating,a.humorScores.selfDeprecating)}
              </span>
            </div>
            <div class="score-bars">
              <div class="score-bar-wrapper">
                <span class="bar-label">You</span>
                <div class="score-bar-bg">
                  <div class="score-bar you-bar" style="width: ${s.humorScores.selfDeprecating/7*100}%">
                    <span class="bar-value">${s.humorScores.selfDeprecating}</span>
                  </div>
                </div>
              </div>
              <div class="score-bar-wrapper">
                <span class="bar-label">Them</span>
                <div class="score-bar-bg">
                  <div class="score-bar them-bar" style="width: ${a.humorScores.selfDeprecating/7*100}%">
                    <span class="bar-value">${a.humorScores.selfDeprecating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="card-actions">
        <button class="action-btn pass-btn" data-user-id="${a.userId}">
          <span class="btn-icon">👎</span>
          <span class="btn-text">Pass</span>
        </button>
        <button class="action-btn like-btn" data-user-id="${a.userId}">
          <span class="btn-icon">❤️</span>
          <span class="btn-text">Like</span>
        </button>
      </div>
    </div>
  `).join("");r.innerHTML=`
    <div class="matches-feed-container">
      <div class="feed-header">
        <h1>Your Matches 🎭</h1>
        <p class="feed-subtitle">${e.length} potential ${e.length===1?"match":"matches"} found</p>
      </div>
      
      <div class="feed-cards">
        ${t}
      </div>
      
      <div class="feed-footer">
        <button id="backToProfile" class="secondary-btn">← Back to Profile</button>
        <button id="logoutBtn" class="secondary-btn">Log Out</button>
      </div>
    </div>
  `,document.querySelectorAll(".like-btn").forEach(a=>{a.addEventListener("click",i=>{const o=i.currentTarget.getAttribute("data-user-id"),c=e.find(l=>l.userId===o).displayName;S(o,c,i.currentTarget)})}),document.querySelectorAll(".pass-btn").forEach(a=>{a.addEventListener("click",i=>{const o=i.currentTarget.getAttribute("data-user-id"),c=e.find(l=>l.userId===o).displayName;$(o,c,i.currentTarget)})}),document.getElementById("backToProfile").addEventListener("click",()=>{window.location.reload()}),document.getElementById("logoutBtn").addEventListener("click",async()=>{await b(p)})}function w(e){return e.split(" ").map(s=>s[0]).join("").toUpperCase().substring(0,2)}function d(e,s){const r=Math.abs(e-s);return r===0?"perfect-match":r===1?"great-match":r<=2?"good-match":"ok-match"}function n(e,s){const r=Math.abs(e-s);return r===0?"🎯 Perfect!":r===1?"✨ Very close":r<=2?"👍 Similar":r<=3?"~ Different":"⚡ Opposite"}function S(e,s,r){r.disabled=!0,r.classList.add("liked"),r.innerHTML='<span class="btn-icon">💚</span><span class="btn-text">Liked!</span>',console.log(`Liked: ${s} (${e})`),setTimeout(()=>{alert(`You liked ${s}! 💚

(Saving likes to database coming soon)`)},300)}function $(e,s,r){r.disabled=!0,r.classList.add("passed"),r.innerHTML='<span class="btn-icon">👋</span><span class="btn-text">Passed</span>',console.log(`Passed: ${s} (${e})`);const t=r.closest(".match-feed-card");t.style.opacity="0.5"}function k(e){return e>=80?"excellent-match":e>=60?"good-match":e>=40?"ok-match":"low-match"}export{T as showMatches};
