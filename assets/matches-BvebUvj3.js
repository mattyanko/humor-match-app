import{f as v,b as y,q as b,w as m,g as S,a as g,e as f}from"./index-DOAsTIv_.js";function k(o,s){const a=Math.sqrt(Math.pow(o.witty-s.witty,2)+Math.pow(o.dark-s.dark,2)+Math.pow(o.physical-s.physical,2)+Math.pow(o.absurdist-s.absurdist,2)+Math.pow(o.selfDeprecating-s.selfDeprecating,2)),d=Math.sqrt(5*Math.pow(6,2));return Math.round(100-a/d*100)}async function T(o){const s=document.querySelector("#app");s.innerHTML=`
    <div>
      <h1>Finding Your Matches 🎭</h1>
      <p style="text-align: center; color: #5f6368;">Analyzing humor compatibility...</p>
      <div class="loading-spinner"></div>
    </div>
  `;try{const a=v(y,"users"),d=b(a,m("isProfileComplete","==",!0)),e=await S(d),r=[];e.forEach(i=>{const t=i.data();if(t.userId===g.currentUser.uid)return;const l=k(o.humorScores,t.humorScores);r.push({...t,matchScore:l})}),r.sort((i,t)=>t.matchScore-i.matchScore),w(r,o)}catch(a){console.error("Error fetching matches:",a),s.innerHTML=`
      <div>
        <h1>Error Loading Matches</h1>
        <p style="color: red;">${a.message}</p>
        <button id="backToProfile">Back to Profile</button>
      </div>
    `,document.getElementById("backToProfile").addEventListener("click",()=>{window.location.reload()})}}function w(o,s){const a=document.querySelector("#app");if(o.length===0){a.innerHTML=`
      <div>
        <h1>No Matches Yet 😢</h1>
        <p style="text-align: center; color: #5f6368;">Be the first! Invite your friends to join.</p>
        <button id="backToProfile">Back to Profile</button>
        <button id="logoutBtn">Log Out</button>
      </div>
    `,document.getElementById("backToProfile").addEventListener("click",()=>{window.location.reload()}),document.getElementById("logoutBtn").addEventListener("click",async()=>{await f(g)});return}const d=o.map((e,r)=>{const t=["witty","dark","physical","absurdist","selfDeprecating"].map(c=>({key:c,diff:Math.abs(s.humorScores[c]-e.humorScores[c]),yourScore:s.humorScores[c],theirScore:e.humorScores[c]})),l=[...t].sort((c,n)=>c.diff-n.diff).slice(0,2),h=[...t].sort((c,n)=>n.diff-c.diff)[0],p=[...l,h];return`
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
            ${p.map(c=>u(c,s.humorScores,e.humorScores)).join("")}
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
    `}).join("");a.innerHTML=`
    <div class="matches-feed-glass">
      <div class="feed-header-glass">
        <h1>Your Matches 🎭</h1>
        <p class="feed-subtitle">${o.length} potential ${o.length===1?"match":"matches"} found</p>
      </div>
      
      <div class="feed-cards-glass">
        ${d}
      </div>
      
      <div class="feed-footer-glass">
        <button id="backToProfile" class="secondary-btn">← Back to Profile</button>
        <button id="logoutBtn" class="secondary-btn">Log Out</button>
      </div>
    </div>
  `,document.querySelectorAll(".btn-like-glass").forEach(e=>{e.addEventListener("click",r=>{const i=r.currentTarget.getAttribute("data-user-id"),t=o.find(l=>l.userId===i).displayName;M(i,t,r.currentTarget)})}),document.querySelectorAll(".btn-pass-glass").forEach(e=>{e.addEventListener("click",r=>{const i=r.currentTarget.getAttribute("data-user-id"),t=o.find(l=>l.userId===i).displayName;$(i,t,r.currentTarget)})}),document.getElementById("backToProfile").addEventListener("click",()=>{window.location.reload()}),document.getElementById("logoutBtn").addEventListener("click",async()=>{await f(g)})}function u(o,s,a){const d={witty:"😏 Witty",dark:"🌑 Dark",physical:"🤪 Physical",absurdist:"🎨 Absurdist",selfDeprecating:"😅 Self-Dep"},e=o.yourScore,r=o.theirScore,i=o.diff;let t="Different",l="different";i===0?(t="Perfect ✨",l="perfect"):i===1?(t="Close 👍",l="close"):i===2?(t="Similar",l="close"):i>=3&&(t="Different ⚡",l="different");const h=Array(7).fill(0).map((c,n)=>`<div class="dot-glass ${n<e?"filled-you-glass":""}"></div>`).join(""),p=Array(7).fill(0).map((c,n)=>`<div class="dot-glass ${n<r?"filled-them-glass":""}"></div>`).join("");return`
    <div class="score-row-glass">
      <div class="score-row-header">
        <span class="score-label-glass">${d[o.key]}</span>
        <span class="match-quality-glass ${l}">${t}</span>
      </div>
      <div class="score-dots-container">
        <div class="dots-row">
          <div class="dots-label">You</div>
          <div class="dots-glass">${h}</div>
        </div>
        <div class="dots-row">
          <div class="dots-label">Them</div>
          <div class="dots-glass">${p}</div>
        </div>
      </div>
    </div>
  `}window.toggleBreakdown=function(o){const s=document.getElementById(`breakdown-${o}`),a=event.target.closest(".view-all-btn-glass");s.classList.toggle("expanded"),a.classList.toggle("expanded"),s.classList.contains("expanded")?a.innerHTML='<span>Hide Full Breakdown</span><span class="arrow">▼</span>':a.innerHTML='<span>View All 5 Humor Dimensions</span><span class="arrow">▼</span>'};function M(o,s,a){a.disabled=!0,a.classList.add("liked"),a.innerHTML='<span class="btn-icon">💚</span><span class="btn-text">Liked!</span>',console.log(`Liked: ${s} (${o})`),setTimeout(()=>{alert(`You liked ${s}! 💚

(Saving likes to database coming soon)`)},300)}function $(o,s,a){a.disabled=!0,a.classList.add("passed"),a.innerHTML='<span class="btn-icon">👋</span><span class="btn-text">Passed</span>',console.log(`Passed: ${s} (${o})`);const d=a.closest(".match-card-glass");d.style.opacity="0.5"}export{T as showMatches};
