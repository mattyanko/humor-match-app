import{f as v,b as y,q as b,w as m,g as S,a as g,e as f}from"./index-B3QoEf81.js";function k(o,s){const t=Math.sqrt(Math.pow(o.witty-s.witty,2)+Math.pow(o.dark-s.dark,2)+Math.pow(o.physical-s.physical,2)+Math.pow(o.absurdist-s.absurdist,2)+Math.pow(o.selfDeprecating-s.selfDeprecating,2)),c=Math.sqrt(5*Math.pow(6,2));return Math.round(100-t/c*100)}async function T(o){const s=document.querySelector("#app");s.innerHTML=`
    <div>
      <h1>Finding Your Matches 🎭</h1>
      <p style="text-align: center; color: #5f6368;">Analyzing humor compatibility...</p>
      <div class="loading-spinner"></div>
    </div>
  `;try{const t=v(y,"users"),c=b(t,m("isProfileComplete","==",!0)),e=await S(c),r=[];e.forEach(i=>{const a=i.data();if(a.userId===g.currentUser.uid)return;const n=k(o.humorScores,a.humorScores);r.push({...a,matchScore:n})}),r.sort((i,a)=>a.matchScore-i.matchScore),w(r,o)}catch(t){console.error("Error fetching matches:",t),s.innerHTML=`
      <div>
        <h1>Error Loading Matches</h1>
        <p style="color: red;">${t.message}</p>
        <button id="backToProfile">Back to Profile</button>
      </div>
    `,document.getElementById("backToProfile").addEventListener("click",()=>{window.location.reload()})}}function w(o,s){const t=document.querySelector("#app");if(o.length===0){t.innerHTML=`
      <div>
        <h1>No Matches Yet 😢</h1>
        <p style="text-align: center; color: #5f6368;">Be the first! Invite your friends to join.</p>
        <button id="backToProfile">Back to Profile</button>
        <button id="logoutBtn">Log Out</button>
      </div>
    `,document.getElementById("backToProfile").addEventListener("click",()=>{window.location.reload()}),document.getElementById("logoutBtn").addEventListener("click",async()=>{await f(g)});return}const c=o.map((e,r)=>{const a=["witty","dark","physical","absurdist","selfDeprecating"].map(l=>({key:l,diff:Math.abs(s.humorScores[l]-e.humorScores[l]),yourScore:s.humorScores[l],theirScore:e.humorScores[l]})),n=[...a].sort((l,d)=>l.diff-d.diff).slice(0,2),h=[...a].sort((l,d)=>d.diff-l.diff)[0],p=[...n,h];return`
      <div class="match-card-glass">
        <div class="card-header-glass">
          <div class="header-left">
            <div class="rank-glass">#${r+1}</div>
            <div class="name-glass">${e.displayName}</div>
          </div>
          <div class="match-score-glass">${e.matchScore}% Match</div>
        </div>
        
        <div class="card-content-glass">
          <div class="profile-section-glass">
            <div class="photo-placeholder-glass">
              <div class="photo-icon">📷</div>
              <div class="photo-text">Photo</div>
            </div>
            <div class="bio-glass">${e.bio||"No bio yet"}</div>
          </div>
          
          <div class="key-matches-glass">
            <div class="key-matches-title">Top Matches & Differences</div>
            ${p.map(l=>u(l,s.humorScores,e.humorScores)).join("")}
          </div>
          
          <button class="view-all-btn-glass" onclick="toggleBreakdown('${e.userId}')">
            <span>View All 5 Humor Dimensions</span>
            <span class="arrow">▼</span>
          </button>
          
          <div class="full-breakdown-glass" id="breakdown-${e.userId}">
            <div class="breakdown-content-glass">
              <div class="breakdown-title">Complete Humor Breakdown</div>
              
              ${u({key:"witty",yourScore:s.humorScores.witty,theirScore:e.humorScores.witty,diff:Math.abs(s.humorScores.witty-e.humorScores.witty)},s.humorScores,e.humorScores)}
              ${u({key:"dark",yourScore:s.humorScores.dark,theirScore:e.humorScores.dark,diff:Math.abs(s.humorScores.dark-e.humorScores.dark)},s.humorScores,e.humorScores)}
              ${u({key:"physical",yourScore:s.humorScores.physical,theirScore:e.humorScores.physical,diff:Math.abs(s.humorScores.physical-e.humorScores.physical)},s.humorScores,e.humorScores)}
              ${u({key:"absurdist",yourScore:s.humorScores.absurdist,theirScore:e.humorScores.absurdist,diff:Math.abs(s.humorScores.absurdist-e.humorScores.absurdist)},s.humorScores,e.humorScores)}
              ${u({key:"selfDeprecating",yourScore:s.humorScores.selfDeprecating,theirScore:e.humorScores.selfDeprecating,diff:Math.abs(s.humorScores.selfDeprecating-e.humorScores.selfDeprecating)},s.humorScores,e.humorScores)}
              
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
            <button class="btn-glass btn-pass-glass" data-user-id="${e.userId}">
              <span>👎</span>
              <span>Pass</span>
            </button>
            <button class="btn-glass btn-like-glass" data-user-id="${e.userId}">
              <span>❤️</span>
              <span>Like</span>
            </button>
          </div>
        </div>
      </div>
    `}).join("");t.innerHTML=`
    <div class="matches-feed-glass">
      <div class="feed-header-glass">
        <h1>Your Matches 🎭</h1>
        <p class="feed-subtitle">${o.length} potential ${o.length===1?"match":"matches"} found</p>
      </div>
      
      <div class="feed-cards-glass">
        ${c}
      </div>
      
      <div class="feed-footer-glass">
        <button id="backToProfile" class="secondary-btn">← Back to Profile</button>
        <button id="logoutBtn" class="secondary-btn">Log Out</button>
      </div>
    </div>
  `,document.querySelectorAll(".btn-like-glass").forEach(e=>{e.addEventListener("click",r=>{const i=r.currentTarget.getAttribute("data-user-id"),a=o.find(n=>n.userId===i).displayName;M(i,a,r.currentTarget)})}),document.querySelectorAll(".btn-pass-glass").forEach(e=>{e.addEventListener("click",r=>{const i=r.currentTarget.getAttribute("data-user-id"),a=o.find(n=>n.userId===i).displayName;$(i,a,r.currentTarget)})}),document.getElementById("backToProfile").addEventListener("click",()=>{window.location.reload()}),document.getElementById("logoutBtn").addEventListener("click",async()=>{await f(g)})}function u(o,s,t){const c={witty:"😏 Witty",dark:"🌑 Dark",physical:"🤪 Physical",absurdist:"🎨 Absurdist",selfDeprecating:"😅 Self-Dep"},e=o.yourScore,r=o.theirScore,i=o.diff;let a="Different",n="different";i===0?(a="Perfect ✨",n="perfect"):i===1?(a="Close 👍",n="close"):i===2?(a="Similar",n="close"):i>=3&&(a="Different ⚡",n="different");const h=Array(7).fill(0).map((l,d)=>`<div class="dot-glass ${d<e?"filled-you-glass":""}"></div>`).join(""),p=Array(7).fill(0).map((l,d)=>`<div class="dot-glass ${d<r?"filled-them-glass":""}"></div>`).join("");return`
    <div class="score-row-glass">
      <span class="score-label-glass">${c[o.key]}</span>
      <div class="dots-glass">${h}</div>
      <div class="dots-glass">${p}</div>
      <span class="match-quality-glass ${n}">${a}</span>
    </div>
  `}window.toggleBreakdown=function(o){const s=document.getElementById(`breakdown-${o}`),t=event.target.closest(".view-all-btn-glass");s.classList.toggle("expanded"),t.classList.toggle("expanded"),s.classList.contains("expanded")?t.innerHTML='<span>Hide Full Breakdown</span><span class="arrow">▼</span>':t.innerHTML='<span>View All 5 Humor Dimensions</span><span class="arrow">▼</span>'};function M(o,s,t){t.disabled=!0,t.classList.add("liked"),t.innerHTML='<span class="btn-icon">💚</span><span class="btn-text">Liked!</span>',console.log(`Liked: ${s} (${o})`),setTimeout(()=>{alert(`You liked ${s}! 💚

(Saving likes to database coming soon)`)},300)}function $(o,s,t){t.disabled=!0,t.classList.add("passed"),t.innerHTML='<span class="btn-icon">👋</span><span class="btn-text">Passed</span>',console.log(`Passed: ${s} (${o})`);const c=t.closest(".match-card-glass");c.style.opacity="0.5"}export{T as showMatches};
