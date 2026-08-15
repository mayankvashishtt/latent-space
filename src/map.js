// THE JOURNEY MAP — the whole course on one screen: 4 worlds, stars, and what each chamber teaches.
import { G, loadLevel, say } from './engine.js';
import { WORLDS, FINAL, ACADEMY } from './worlds.js';

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
      <div class="ch next academy" data-lvl="${ACADEMY.i}">
        <span class="chIcon">📖</span>
        <div><b>${ACADEMY.n}</b><span class="chD">${ACADEMY.d}</span></div>
      </div>
    </div>
    <div class="mapFoot">
      <button id="mapClose">CLOSE MAP &nbsp;·&nbsp; M</button>
    </div>
  </div>`;

  el.innerHTML=h; el.style.display='flex';
  G.player.frozen=true; document.exitPointerLock();
  try{ window.speechSynthesis && speechSynthesis.cancel(); }catch(e){}

  el.querySelectorAll('.ch').forEach(row=>{
    const lvl=row.dataset.lvl;
    if(lvl!=='') row.addEventListener('click',()=>{ closeMap(); loadLevel(parseInt(lvl,10)); });
  });
  document.getElementById('mapClose').onclick=closeMap;
}
export function closeMap(){
  const el=document.getElementById('map'); if(el) el.style.display='none';
  G.player.frozen=false;
  document.getElementById('c').requestPointerLock();
}
G.openMap=openMap;
