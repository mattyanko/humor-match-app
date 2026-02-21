import{f as m,b as h,q as b,w as g,g as y,a as d,e as l}from"./index-BogPp0aW.js";function v(t,a){const o=Math.sqrt(Math.pow(t.witty-a.witty,2)+Math.pow(t.dark-a.dark,2)+Math.pow(t.physical-a.physical,2)+Math.pow(t.absurdist-a.absurdist,2)+Math.pow(t.selfDeprecating-a.selfDeprecating,2)),i=Math.sqrt(5*Math.pow(6,2));return Math.round(100-o/i*100)}function f(t){const a=[{key:"witty",name:"Witty",emoji:"😏",color:"#4facfe"},{key:"dark",name:"Dark",emoji:"🌑",color:"#1f2937"},{key:"physical",name:"Physical",emoji:"🤪",color:"#10b981"},{key:"absurdist",name:"Absurdist",emoji:"🎨",color:"#f59e0b"},{key:"selfDeprecating",name:"Self-Dep",emoji:"😅",color:"#8b5cf6"}];let o=0,i=a[0];return a.forEach(e=>{t[e.key]>o&&(o=t[e.key],i=e)}),i}async function L(t){const a=document.querySelector("#app");a.innerHTML=`
    <div style="text-align: center; padding: 40px; background: #e3f2fd;">
      <h1 style="color: #1565c0;">Finding Your Matches 🎭</h1>
      <p style="color: #42a5f5;">Analyzing humor compatibility...</p>
    </div>
  `;try{const o=m(h,"users"),i=b(o,g("isProfileComplete","==",!0)),e=await y(i),n=[];e.forEach(s=>{const c=s.data();if(c.userId===d.currentUser.uid)return;const r=v(t.humorScores,c.humorScores);n.push({...c,matchScore:r})}),n.sort((s,c)=>c.matchScore-s.matchScore),k(n,t)}catch(o){console.error("Error fetching matches:",o),a.innerHTML=`
      <div style="text-align: center; padding: 40px;">
        <h1>Error Loading Matches</h1>
        <p style="color: red;">${o.message}</p>
        <button id="backToProfile" class="primary-btn">Back to Profile</button>
      </div>
    `,document.getElementById("backToProfile").addEventListener("click",()=>{window.location.reload()})}}function k(t,a){const o=document.querySelector("#app");if(t.length===0){o.innerHTML=`
      <div style="text-align: center; padding: 40px; background: #e3f2fd;">
        <h1 style="color: #1565c0;">No Matches Yet 😢</h1>
        <p style="color: #42a5f5;">Be the first! Invite your friends to join.</p>
        <button id="backToProfile" class="primary-btn">Back to Profile</button>
        <button id="logoutBtn" class="secondary-btn">Log Out</button>
      </div>
    `,document.getElementById("backToProfile").addEventListener("click",()=>{window.location.reload()}),document.getElementById("logoutBtn").addEventListener("click",async()=>{await l(d)});return}const i=t.map((e,n)=>{const s=f(e.humorScores),c=e.photoURL||"";return`
      <div class="image-match-card">
        <!-- Image Section -->
        <div class="image-section">
          ${c&&c.length>0?`
            <img src="${c}" alt="${e.displayName}" class="profile-image" />
          `:`
            <div class="profile-image-placeholder">
              <div class="placeholder-icon">📷</div>
              <div class="placeholder-text">No Photo</div>
            </div>
          `}
          
          <div class="image-gradient"></div>
          
          <!-- Match Badge -->
          <div class="match-badge">
            ✨ ${e.matchScore}% Match
          </div>
          
          <!-- Top Vibe Badge -->
          <div class="vibe-badge">
            <span class="vibe-emoji">${s.emoji}</span>
            <span class="vibe-name">${s.name}</span>
          </div>
          
          <!-- Name & Bio Overlay -->
          <div class="overlay-info">
            <div class="name-age">
              <h2>${e.displayName}${e.age?`, ${e.age}`:""}</h2>
            </div>
            <p class="bio-text">${e.bio||"No bio yet"}</p>
          </div>
        </div>
        
        <!-- Expand Button -->
        <button class="expand-btn" data-user-id="${e.userId}">
          <span class="expand-text">Humor Compatibility</span>
          <span class="expand-arrow">▼</span>
        </button>
        
        <!-- Hidden Breakdown -->
        <div class="breakdown-section" id="breakdown-${e.userId}">
          ${w(e,a)}
        </div>
        
        <!-- Action Buttons -->
        <div class="image-actions">
          <button class="btn-image-pass" data-user-id="${e.userId}">
            <span>✕</span>
            <span>Pass</span>
          </button>
          <button class="btn-image-like" data-user-id="${e.userId}">
            <span>❤️</span>
            <span>Like</span>
          </button>
        </div>
      </div>
    `}).join("");o.innerHTML=`
    <div class="image-feed">
      <div class="image-feed-header">
        <h1>Your Matches 🔥</h1>
        <p class="feed-count">${t.length} potential ${t.length===1?"match":"matches"} found</p>
      </div>
      
      <div class="image-cards-container">
        ${i}
      </div>
      
      <div class="feed-footer">
        <button id="backToProfile" class="secondary-btn">← Back to Profile</button>
        <button id="logoutBtn" class="secondary-btn">Log Out</button>
      </div>
    </div>
  `,document.querySelectorAll(".expand-btn").forEach(e=>{e.addEventListener("click",n=>{const s=n.currentTarget.getAttribute("data-user-id");$(s,n.currentTarget)})}),document.querySelectorAll(".btn-image-like").forEach(e=>{e.addEventListener("click",n=>{const s=n.currentTarget.getAttribute("data-user-id"),c=t.find(r=>r.userId===s).displayName;x(s,c)})}),document.querySelectorAll(".btn-image-pass").forEach(e=>{e.addEventListener("click",n=>{M(n.currentTarget)})}),document.getElementById("backToProfile").addEventListener("click",()=>{window.location.reload()}),document.getElementById("logoutBtn").addEventListener("click",async()=>{await l(d)})}function w(t,a){return`
    <div class="breakdown-content">
      <h3 class="breakdown-title">Humor Breakdown</h3>
      ${[{key:"witty",name:"Witty",emoji:"😏"},{key:"dark",name:"Dark",emoji:"🌑"},{key:"physical",name:"Physical",emoji:"🤪"},{key:"absurdist",name:"Absurdist",emoji:"🎨"},{key:"selfDeprecating",name:"Self-Dep",emoji:"😅"}].map(e=>{const n=a.humorScores[e.key],s=t.humorScores[e.key],r=Math.abs(n-s)<=1,p=n/7*100,u=s/7*100;return`
      <div class="breakdown-row">
        <div class="breakdown-header">
          <span class="breakdown-label">
            <span class="breakdown-emoji">${e.emoji}</span>
            <span>${e.name}</span>
          </span>
          ${r?'<span class="perfect-badge">Perfect Alignment ✨</span>':""}
        </div>
        <div class="bar-container">
          <div class="bar-bg"></div>
          <div class="bar-you" style="width: ${p}%"></div>
          <div class="bar-them" style="width: ${u}%"></div>
        </div>
        <div class="bar-labels">
          <span class="label-you">You: ${n}</span>
          <span class="label-them">Them: ${s}</span>
        </div>
      </div>
    `}).join("")}
    </div>
  `}function $(t,a){const o=document.getElementById(`breakdown-${t}`),i=a.querySelector(".expand-arrow"),e=a.querySelector(".expand-text");o.classList.contains("expanded")?(o.classList.remove("expanded"),i.textContent="▼",e.textContent="Humor Compatibility"):(o.classList.add("expanded"),i.textContent="▲",e.textContent="Hide Details")}function x(t,a){alert(`You liked ${a}! 💚

(Saving likes coming soon)`),console.log(`Liked: ${a} (${t})`)}function M(t){const a=t.closest(".image-match-card");a.style.opacity="0.5",a.style.pointerEvents="none",console.log("Passed on user")}export{L as showMatches};
