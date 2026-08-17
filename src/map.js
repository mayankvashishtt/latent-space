// THE JOURNEY MAP — the whole course on one screen: 4 worlds, stars, and what each chamber teaches.
import { G, loadLevel, stinger } from './engine.js';
import { WORLDS, FINAL } from './worlds.js';

function starEarned(w){ return w.chambers.every(c=>G.progress>=c.i); }
export function starCount(){ return WORLDS.filter(starEarned).length; }

function chamberState(i){
  if(G.progress>=i) return 'done';
  if(G.progress===i-1) return 'next';
  return 'locked';
}

export function openMap(){
  let el=document.getElementById('map');
  if(el && el.style.display==='flex'){ closeMap(); return; }
  if(!el){ el=document.createElement('div'); el.id='map'; document.body.appendChild(el); }
  const stars=starCount();
  const finalOpen = stars>=FINAL.needs;

  let h=`<div id="mapInner">
    <div class="mapHead">
      <div>
        <h1>YOUR JOURNEY</h1>
        <p class="sub">4 worlds · earn a star for finishing each · ${FINAL.needs} stars open the final gate</p>
      </div>
      <div class="starRow">${WORLDS.map(w=>`<span class="${starEarned(w)?'starOn':'starOff'}">★</span>`).join('')}</div>
    </div>
    <div class="worlds">`;

  for(const w of WORLDS){
    const earned=starEarned(w);
    h+=`<div class="world" style="--wc:${w.color}">
      <div class="wTop"><span class="wStar ${earned?'starOn':'starOff'}">★</span><h2>${w.name}</h2></div>
      <p class="wBlurb">${w.blurb}</p>`;
    for(const c of w.chambers){
      const st=chamberState(c.i);
      h+=`<div class="ch ${st}" data-lvl="${st==='locked'?'':c.i}">
        <span class="chIcon">${st==='done'?'✓':st==='next'?'▶':'🔒'}</span>
        <div><b>${c.n}</b><span class="chD">${c.d}</span></div>
      </div>`;
    }
    h+=`</div>`;
  }

  const fs=chamberState(FINAL.i);
  h+=`</div>
    <div class="world final" style="--wc:#ffd257">
      <div class="ch ${finalOpen?(fs==='done'?'done':'next'):'locked'}" data-lvl="${finalOpen?FINAL.i:''}">
        <span class="chIcon">${fs==='done'?'✓':finalOpen?'▶':'🔒'}</span>
        <div><b>${FINAL.n}</b><span class="chD">${finalOpen?FINAL.d:`locked — earn ${FINAL.needs} stars first (you have ${stars})`}</span></div>
      </div>
      </div>
    </div>
    <div class="mapNote">More of the course — scale &amp; MoE, vision, world models, multi-agent, memory —
      is being built as future chambers. Until then it lives in
      <a href="https://github.com/mayankvashishtt/ai-ml-bootcamp-archive" target="_blank">the full notes archive</a>
      (38 lectures, plain-English rewrite included).
      &nbsp;·&nbsp; <a href="#" id="storyReplay">↻ watch the origin story again</a></div>
    <div class="mapFoot">
      <button id="mapClose">CLOSE MAP &nbsp;·&nbsp; M</button>
    </div>
  </div>`;

  el.innerHTML=h; el.style.display='flex';
  G.player.frozen=true; document.exitPointerLock();
  try{ window.speechSynthesis && speechSynthesis.cancel(); }catch(e){}

  // star pop animation when a new star was just earned
  const prev=parseInt(localStorage.getItem('ls.stars')||'0',10);
  if(stars>prev){
    const starEls=el.querySelectorAll('.starRow .starOn');
    const newest=starEls[starEls.length-1];
    if(newest){ newest.classList.add('pop'); }
    try{ stinger(); }catch(e){}
  }
  localStorage.setItem('ls.stars', String(stars));

  el.querySelectorAll('.ch').forEach(row=>{
    const lvl=row.dataset.lvl;
    if(lvl!=='') row.addEventListener('click',()=>{ closeMap(); loadLevel(parseInt(lvl,10)); });
  });
  document.getElementById('mapClose').onclick=closeMap;
  const sr=document.getElementById('storyReplay');
  if(sr) sr.onclick=(e)=>{ e.preventDefault(); closeMap(); G.storyIntro&&G.storyIntro(()=>{}); };
}
export function closeMap(){
  const el=document.getElementById('map'); if(el) el.style.display='none';
  G.player.frozen=false;
  document.getElementById('c').requestPointerLock();
}
G.openMap=openMap;
