// LATENT SPACE — engine: renderer, player, collision, interaction, HUD, audio.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const EYE = 1.62, RADIUS = 0.38, GRAV = -22, JUMP = 8.2;

export const G = {
  scene:null, camera:null, renderer:null, composer:null,
  player:{ pos:new THREE.Vector3(), vel:new THREE.Vector3(), yaw:0, pitch:0, onGround:false, frozen:false, friction:1 },
  keys:{}, colliders:[], interactables:[], animated:[], tweens:[], ticks:[], timers:[],
  groundSampler:null, held:null, levelIndex:0, levels:[], progress:0, _levelState:null,
  locked:false, started:false,
};

// ---------------- boot ----------------
export function boot(levels){
  G.levels = levels;
  G.progress = parseInt(localStorage.getItem('ls.progress')||'0',10);

  const canvas = document.getElementById('c');
  G.renderer = new THREE.WebGLRenderer({canvas, antialias:true});
  G.renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  G.renderer.setSize(innerWidth,innerHeight);
  G.camera = new THREE.PerspectiveCamera(74, innerWidth/innerHeight, 0.08, 600);

  addEventListener('resize', ()=>{
    G.camera.aspect = innerWidth/innerHeight; G.camera.updateProjectionMatrix();
    G.renderer.setSize(innerWidth,innerHeight);
    G.composer && G.composer.setSize(innerWidth,innerHeight);
  });

  // input
  addEventListener('keydown', e=>{ G.keys[e.code]=true; if(e.code==='KeyE') tryInteract(); if(e.code==='KeyV') voiceToggle(); if(e.code==='KeyM'&&G.started&&G.openMap) G.openMap(); });
  addEventListener('keyup',   e=>{ G.keys[e.code]=false; });
  document.addEventListener('mousemove', e=>{
    if(!G.locked || G.player.frozen) return;
    G.player.yaw   -= e.movementX*0.0023;
    G.player.pitch -= e.movementY*0.0023;
    G.player.pitch = Math.max(-1.45, Math.min(1.45, G.player.pitch));
  });
  document.addEventListener('pointerlockchange', ()=>{ G.locked = document.pointerLockElement===canvas; });

  const menu = document.getElementById('menu');
  menu.addEventListener('click', ()=>{
    if(G.started) return;
    G.started = true; audioInit();
    menu.style.transition='opacity .8s'; menu.style.opacity='0';
    setTimeout(()=>menu.remove(), 850);
    canvas.requestPointerLock();
    loadLevel(0);
    setTimeout(()=>say('Voice check. If you can hear me, we are ready. Press V any time to mute me.'), 900);
    setTimeout(()=>{ G.openMap && G.openMap(); }, 2200);
  });
  canvas.addEventListener('click', ()=>{ if(G.started && !panelOpen()) canvas.requestPointerLock(); });

  const clock = new THREE.Clock();
  G.renderer.setAnimationLoop(()=>{
    const dt = Math.min(clock.getDelta(), 0.05);
    if(G.scene){ step(dt); G.composer ? G.composer.render() : G.renderer.render(G.scene,G.camera); }
  });
}

// ---------------- level lifecycle ----------------
export function loadLevel(i){
  guideClear();
  try{ window.speechSynthesis && speechSynthesis.cancel(); }catch(e){}
  fade(1);
  setTimeout(()=>{
    disposeLevel();
    G.levelIndex = i;
    const L = G.levels[i];
    G.scene = new THREE.Scene();
    G.scene.background = new THREE.Color(0x04060e);
    G.groundSampler = null; G.player.friction = 1;
    G.colliders.length=0; G.interactables.length=0; G.animated.length=0;
    G.ticks.length=0; G.tweens.length=0;
    document.getElementById('bars').innerHTML='';
    dropHeld();

    const pass1 = new RenderPass(G.scene, G.camera);
    const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight), 0.75, 0.5, 0.72);
    G.composer = new EffectComposer(G.renderer);
    G.composer.addPass(pass1); G.composer.addPass(bloom);

    document.getElementById('lvlname').textContent = L.name;
    G._levelState = L.build(G) || {};
    fade(0);
    if(L.intro && !(i===0 && sessionStorage.getItem('ls.hubSeen'))){
      if(i===0) sessionStorage.setItem('ls.hubSeen','1');
      panel({title:L.name, sub:L.tagline||'', html:L.intro, buttons:[{label:'Begin', primary:true}]});
    }
  }, 620);
}
function disposeLevel(){
  G.timers.forEach(t=>clearTimeout(t)); G.timers.length=0;
  if(G._levelState && G._levelState.dispose) G._levelState.dispose();
  if(G.scene){ G.scene.traverse(o=>{ o.geometry&&o.geometry.dispose&&o.geometry.dispose();
    if(o.material){ (Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose&&m.dispose()); } }); }
  G._levelState = null;
}
export function complete(){
  const L = G.levels[G.levelIndex];
  if(G.levelIndex > G.progress){ G.progress = G.levelIndex; localStorage.setItem('ls.progress', String(G.progress)); }
  chime();
  const cx = L.codex || {};
  panel({
    title:'MECHANISM UNDERSTOOD', sub:L.name,
    html:(cx.html||'') + (cx.lecture?`<p style="margin-top:16px;font-size:13px;color:#7fa8cc">Deep dive → <a href="https://github.com/mayankvashishtt/ai-ml-bootcamp-archive/tree/main/${cx.lecture}" target="_blank">${cx.lecture}</a> in the course archive.</p>`:''),
    buttons:[{label:'See the map ★', primary:true, fn:()=>{ loadLevel(0); setTimeout(()=>G.openMap&&G.openMap(),900); }}]
  });
}

// ---------------- physics + step ----------------
export function spawn(x,y,z,yaw=0){ G.player.pos.set(x,y,z); G.player.vel.set(0,0,0); G.player.yaw=yaw; G.player.pitch=0; }

function step(dt){
  const P = G.player;
  // tweens
  for(let i=G.tweens.length-1;i>=0;i--){ const t=G.tweens[i]; t.t+=dt/t.dur;
    const k = t.t>=1?1:(1-Math.pow(1-t.t,3)); t.obj[t.prop]=t.from+(t.to-t.from)*k;
    if(t.t>=1){ G.tweens.splice(i,1); t.done&&t.done(); } }
  G.animated.forEach(m=>{ if(m.userData.spin) m.rotation.y += m.userData.spin*dt; if(m.userData.bob){ m.userData._b=(m.userData._b||0)+dt; m.position.y = m.userData.baseY + Math.sin(m.userData._b*2)*m.userData.bob; } });
  G.ticks.forEach(f=>f(dt));
  tickGuide(dt);

  if(!P.frozen && G.locked){
    const f = new THREE.Vector3(-Math.sin(P.yaw),0,-Math.cos(P.yaw));
    const r = new THREE.Vector3(-f.z,0,f.x);
    const wish = new THREE.Vector3();
    if(G.keys['KeyW']) wish.add(f); if(G.keys['KeyS']) wish.sub(f);
    if(G.keys['KeyD']) wish.add(r); if(G.keys['KeyA']) wish.sub(r);
    const speed = ((G.keys['ShiftLeft']||G.keys['ShiftRight']) ? 9.5 : 5.6) * (P.speedMul||1);
    if(wish.lengthSq()>0) wish.normalize().multiplyScalar(speed);
    if(P.friction >= 1){ P.vel.x = wish.x; P.vel.z = wish.z; }
    else { // slippery mode (reckless learning rate)
      P.vel.x += (wish.x-P.vel.x)*P.friction; P.vel.z += (wish.z-P.vel.z)*P.friction;
    }
    if(G.keys['Space'] && P.onGround){ P.vel.y = JUMP; P.onGround=false; blip(300,.06,'square',.12); }
  } else { P.vel.x=0; P.vel.z=0; }

  P.vel.y += GRAV*dt;
  P.pos.x += P.vel.x*dt; P.pos.z += P.vel.z*dt;

  // walls
  for(const c of G.colliders){
    if(!c.solid) continue;
    const top=c.max.y, bot=c.min.y, feet=P.pos.y;
    if(top <= feet+0.55) continue;               // low enough to step onto
    if(bot >= feet+EYE) continue;                // above head
    const nx = Math.max(c.min.x-RADIUS, Math.min(P.pos.x, c.max.x+RADIUS));
    const nz = Math.max(c.min.z-RADIUS, Math.min(P.pos.z, c.max.z+RADIUS));
    if(nx!==P.pos.x || nz!==P.pos.z) continue;   // outside expanded box
    const dxl = P.pos.x-(c.min.x-RADIUS), dxr = (c.max.x+RADIUS)-P.pos.x;
    const dzl = P.pos.z-(c.min.z-RADIUS), dzr = (c.max.z+RADIUS)-P.pos.z;
    const m = Math.min(dxl,dxr,dzl,dzr);
    if(m===dxl) P.pos.x=c.min.x-RADIUS; else if(m===dxr) P.pos.x=c.max.x+RADIUS;
    else if(m===dzl) P.pos.z=c.min.z-RADIUS; else P.pos.z=c.max.z+RADIUS;
  }
  // ground
  let ground=-Infinity;
  for(const c of G.colliders){
    if(!c.solid) continue;
    if(P.pos.x>=c.min.x-RADIUS && P.pos.x<=c.max.x+RADIUS && P.pos.z>=c.min.z-RADIUS && P.pos.z<=c.max.z+RADIUS)
      if(c.max.y <= P.pos.y+0.55 && c.max.y>ground) ground=c.max.y;
  }
  if(G.groundSampler){ const h=G.groundSampler(P.pos.x,P.pos.z); if(h!==null && h>ground) ground=h; }
  P.pos.y += P.vel.y*dt;
  if(P.pos.y <= ground){ P.pos.y=ground; P.vel.y=0; P.onGround=true; } else P.onGround=false;
  if(P.pos.y < -40){ const L=G.levels[G.levelIndex]; toast('signal lost — re-initialized'); buzz();
    if(L.respawn) spawn(...L.respawn); else spawn(0,2,0,0); }

  G.camera.position.set(P.pos.x, P.pos.y+EYE, P.pos.z);
  G.camera.rotation.order='YXZ';
  G.camera.rotation.y=P.yaw; G.camera.rotation.x=P.pitch;

  updatePrompt();
  if(G.held){ const c=G.camera; const v=new THREE.Vector3(0.42,-0.38,-0.9).applyQuaternion(c.quaternion);
    G.held.position.copy(c.position).add(v); G.held.rotation.y = P.yaw; }
}

// ---------------- colliders / interact ----------------
export function addCollider(mesh, solid=true){
  mesh.updateWorldMatrix(true,false);
  const b = new THREE.Box3().setFromObject(mesh);
  const c = {min:b.min.clone(), max:b.max.clone(), mesh, solid,
    remove(){ const i=G.colliders.indexOf(c); if(i>=0) G.colliders.splice(i,1); },
    refresh(){ mesh.updateWorldMatrix(true,false); const nb=new THREE.Box3().setFromObject(mesh); c.min.copy(nb.min); c.max.copy(nb.max); }};
  G.colliders.push(c); return c;
}
export function interact(mesh, prompt, fn){
  mesh.userData.interact = {prompt, fn}; G.interactables.push(mesh); return mesh;
}
export function removeInteract(mesh){
  delete mesh.userData.interact;
  const i=G.interactables.indexOf(mesh); if(i>=0) G.interactables.splice(i,1);
}
const ray = new THREE.Raycaster(); ray.far = 3.6;
let aimed = null;
function updatePrompt(){
  aimed = null;
  if(G.interactables.length && !panelOpen()){
    ray.setFromCamera({x:0,y:0}, G.camera);
    const hits = ray.intersectObjects(G.interactables, true);
    for(const h of hits){ let o=h.object; while(o && !o.userData.interact) o=o.parent;
      if(o){ aimed=o; break; } }
  }
  const pr = document.getElementById('prompt'), xh=document.getElementById('xh');
  if(aimed){ pr.textContent = '[E] ' + aimed.userData.interact.prompt; pr.style.opacity='1'; xh.classList.add('on'); }
  else { pr.style.opacity='0'; xh.classList.remove('on'); }
}
function tryInteract(){ if(aimed && !panelOpen() && !G.player.frozen){ blip(720,.05,'triangle',.15); aimed.userData.interact.fn(aimed); } }

// ---------------- HUD ----------------
export function obj(text){ document.getElementById('obj').innerHTML = text; }
let toastT=null;
export function toast(text, ms=2600, speak=true){
  const t=document.getElementById('toast'); t.innerHTML=text; t.style.opacity='1';
  clearTimeout(toastT); toastT=setTimeout(()=>t.style.opacity='0', ms);
  if(speak) say(text,'bit');
}
export function hudBar(id,label){
  const wrap=document.getElementById('bars');
  const el=document.createElement('div'); el.className='bar'; el.id='bar_'+id;
  el.innerHTML=`<div class="lb">${label}</div><div class="tr"><div class="fl"></div></div>`;
  wrap.appendChild(el);
  return { set(frac,lb){ el.querySelector('.fl').style.width=(Math.max(0,Math.min(1,frac))*100)+'%'; if(lb!==undefined) el.querySelector('.lb').textContent=lb; },
           remove(){ el.remove(); } };
}
export function fade(v){ document.getElementById('fade').style.opacity=String(v); }

// ---------------- panel ----------------
export function panelOpen(){ return document.getElementById('panelWrap').style.display==='flex'; }
export function panel({title='',sub='',html='',buttons}){
  const w=document.getElementById('panelWrap');
  document.getElementById('pTitle').textContent=title;
  document.getElementById('pSub').textContent=sub;
  document.getElementById('pBody').innerHTML=html;
  const bt=document.getElementById('pBtns'); bt.innerHTML='';
  (buttons||[{label:'Continue',primary:true}]).forEach(b=>{
    const btn=document.createElement('button'); btn.textContent=b.label;
    if(b.gold) btn.classList.add('gold');
    btn.onclick=()=>{ closePanel(); b.fn&&b.fn(); };
    bt.appendChild(btn);
  });
  w.style.display='flex'; G.player.frozen=true; document.exitPointerLock();
  say(title + '. ' + sub + '. ' + html);
}
export function closePanel(){
  try{ window.speechSynthesis && speechSynthesis.cancel(); }catch(e){}
  document.getElementById('panelWrap').style.display='none';
  G.player.frozen=false;
  document.getElementById('c').requestPointerLock();
}

// ---------------- held items ----------------
export function hold(mesh){ dropHeld(); G.held=mesh; G.scene.add(mesh); }
export function dropHeld(){ if(G.held){ G.held.removeFromParent(); G.held=null; } }

// ---------------- helpers ----------------
export function after(sec,fn){ const t=setTimeout(fn, sec*1000); G.timers.push(t); return t; }
export function tween(obj,prop,to,dur,done){ G.tweens.push({obj,prop,from:obj[prop],to,dur,t:0,done}); }
export function onTick(fn){ G.ticks.push(fn); }
export function playerNear(x,z,r){ const p=G.player.pos; return (p.x-x)**2+(p.z-z)**2 < r*r; }

// ---------------- guided steps: voice says -> player does -> next ----------------
let gSteps=null, gIdx=0, gHold=0;
export function guide(steps){ gSteps=steps; gIdx=-1; gHold=0; advanceGuide(); }
export function guideClear(){ gSteps=null; const el=document.getElementById('guide'); if(el) el.style.opacity='0'; }
function advanceGuide(){
  gIdx++;
  const el=document.getElementById('guide');
  if(!gSteps || gIdx>=gSteps.length){ guideClear(); return; }
  const st=gSteps[gIdx];
  const who=st.who||'nova';
  el.innerHTML='<b class="spk-'+who+'">'+(who==='bit'?'BIT':'NOVA')+'</b>'+st.say;
  el.style.opacity='1';
  say(st.say, who);
  st.do && st.do();
}
function tickGuide(dt){
  if(!gSteps || gIdx<0 || gIdx>=gSteps.length || panelOpen()) return;
  const st=gSteps[gIdx];
  if(!st.when){ return; }               // terminal line: stays until guideClear/level end
  let ok=false; try{ ok=!!st.when(); }catch(e){}
  if(ok){ gHold+=dt; if(gHold>0.25){ gHold=0; blip(980,.09,'sine',.14); setTimeout(advanceGuide, 650); gSteps[gIdx]={say:st.say,who:st.who}; } }
  else gHold=0;
}

// ---------------- voice narrator (built-in browser speech) ----------------
let voiceOn = localStorage.getItem('ls.voice')!=='0';
const VOICES={nova:null,bit:null};
function pickVoices(){
  try{
    const vs=speechSynthesis.getVoices(); if(!vs.length) return;
    const en=vs.filter(v=>/^en/i.test(v.lang));
    const pool=en.length?en:vs;
    const nova=pool.find(v=>/samantha/i.test(v.name))
            || pool.find(v=>/google uk english female|zira|victoria|karen|serena|female/i.test(v.name))
            || pool.find(v=>/google us english/i.test(v.name)) || pool[0];
    const bit =pool.find(v=>/daniel/i.test(v.name))
            || pool.find(v=>/google uk english male|david|alex|fred|male/i.test(v.name)&&v!==nova)
            || pool.find(v=>v!==nova) || nova;
    VOICES.nova=nova; VOICES.bit=bit;
  }catch(e){}
}
if(window.speechSynthesis){ speechSynthesis.onvoiceschanged=pickVoices; pickVoices(); }
// Chrome bug workaround: long speech silently dies unless nudged
setInterval(()=>{ try{ if(window.speechSynthesis&&speechSynthesis.speaking&&!speechSynthesis.paused){ speechSynthesis.pause(); speechSynthesis.resume(); } }catch(e){} }, 8000);

export function say(text, who='nova'){
  try{
    if(!voiceOn || !window.speechSynthesis) return;
    const plain=String(text).replace(/<[^>]*>/g,' ').replace(/&[a-z]+;/gi,' ').replace(/[·—]/g,', ').replace(/\s+/g,' ').trim();
    if(!plain) return;
    speechSynthesis.cancel();
    // chunk into ~sentences (Chrome kills utterances > ~15s)
    const raw=plain.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[plain];
    const parts=[]; let cur='';
    for(const c of raw){ if((cur+c).length<170){ cur+=c; } else { if(cur.trim())parts.push(cur); cur=c; } }
    if(cur.trim())parts.push(cur);
    const prof = who==='bit' ? {v:VOICES.bit, pitch:0.7, rate:1.08} : {v:VOICES.nova, pitch:1.04, rate:1.0};
    setTimeout(()=>{                       // delay after cancel() — Chrome race fix
      for(const pt of parts){
        const u=new SpeechSynthesisUtterance(pt.trim());
        if(prof.v) u.voice=prof.v;
        u.pitch=prof.pitch; u.rate=prof.rate; u.volume=1;
        speechSynthesis.speak(u);
      }
    }, 90);
  }catch(e){}
}
export function voiceToggle(){
  voiceOn=!voiceOn; localStorage.setItem('ls.voice', voiceOn?'1':'0');
  if(!voiceOn && window.speechSynthesis) speechSynthesis.cancel();
  toast(voiceOn?'🔊 voice ON':'🔇 voice OFF', 2600, false);
  if(voiceOn) say('Voice is back on.');
}

// ---------------- audio (synth, no assets) ----------------
let AC=null;
function audioInit(){ AC = new (window.AudioContext||window.webkitAudioContext)();
  // ambient pad
  const o1=AC.createOscillator(), o2=AC.createOscillator(), g=AC.createGain();
  o1.frequency.value=55; o2.frequency.value=55*1.5; o1.type='sine'; o2.type='sine';
  g.gain.value=0.018; o1.connect(g); o2.connect(g); g.connect(AC.destination); o1.start(); o2.start();
}
export function blip(f=880,d=0.08,type='sine',v=0.2){ if(!AC) return;
  const o=AC.createOscillator(),g=AC.createGain(); o.type=type; o.frequency.value=f;
  g.gain.setValueAtTime(v,AC.currentTime); g.gain.exponentialRampToValueAtTime(0.001,AC.currentTime+d);
  o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime+d); }
export function buzz(){ blip(110,.22,'sawtooth',.15); }
export function chime(){ [523,659,784,1046].forEach((f,i)=>setTimeout(()=>blip(f,.28,'sine',.16), i*110)); }
export function thud(){ blip(70,.15,'square',.2); }
