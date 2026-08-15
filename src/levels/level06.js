// VI · THE ARCHIVE — semantic search fails on an exact date; grep saves you; then carry the
// answer through a corridor that stuffs your context until you learn to be surgical.
import * as THREE from 'three';
import { G, spawn, obj, toast, complete, chime, buzz, onTick, hold, dropHeld, hudBar } from '../engine.js';
import * as W from '../world.js';

export default {
  id:6, name:'VI · THE ARCHIVE', tagline:'similarity is not relevance',
  respawn:[0,1,20,0],
  intro:`
    <p>The Archive holds everything the model was never trained on. A request has arrived:</p>
    <p class="quote">FIND: <b>what changed on 2024-09-15</b></p>
    <p>Your <em>semantic lantern</em> makes shelves glow by similarity of <em>meaning</em>.
    Trust it — and then discover what it cannot see.</p>`,
  codex:{
    html:`<p>Your lantern was <b>dense retrieval</b> — embedding similarity. It glowed on every shelf
      <em>about</em> dates and changes, because to a space built on meaning, every date is the same word
      (you saw that blob in Embedding Space). The distances told the story: 0.551 vs 0.548 — no separation.
      The right scroll was indistinguishable from the wrong ones, and the failure produced a fluent,
      confident, <em>wrong</em> answer at the altar.</p>
      <p>The scanner was <b>BM25 / grep</b> — exact string match, zero notion of meaning. It found
      <code>2024-09-15</code> instantly, because an identifier is not a concept to approximate.
      Carrying both tools is <b>hybrid search</b>, and it beats either alone.</p>
      <p>Then the corridor: every "helpful" scroll that latched on made your light dimmer — that was
      <b>context rot</b>. Attention is a budget; junk competes with the needle. You passed the reading
      gate only after shredding down to what mattered.</p>
      <p class="quote">Every token you add is a bet against accuracy. Be surgical.</p>`,
    lecture:'notes/week-09-rag-part-1'
  },
  build(){
    const s=G.scene;
    s.fog=new THREE.Fog(0x040308,16,55);
    W.lights(s,{amb:.32,sun:.3});
    spawn(0,1,20,0);
    W.room({w:44,h:8,d:46,cz:0,gaps:['n']});
    // corridor + reading room
    W.ground(10,34,{cz:-40}); // corridor
    for(const sx of [-5,5]){ const wall=W.box(0.8,6,34,W.mat(W.C.steel,{rough:.85})); wall.position.set(sx,3,-40); s.add(wall);
      G.colliders.push({min:new THREE.Vector3(sx-0.4,0,-57),max:new THREE.Vector3(sx+0.4,6,-23),solid:true}); }
    W.room({w:20,h:6,d:16,cz:-64,gaps:['s']});

    // ---------- shelves ----------
    // similarity values chosen to mirror the real Week 9 numbers
    const shelves=[
      {x:-16,z:-8, name:'Q3 CHANGELOG',     sim:0.551, target:true,  text:'2024-09-15 — auth migrated to RS256'},
      {x:-8, z:-14,name:'RELEASE NOTES',    sim:0.548, target:false, text:'2024-03-22 — dashboard redesign shipped'},
      {x:0,  z:-8, name:'DEPLOY LOG',       sim:0.545, target:false, text:'2023-11-02 — canary rollout policy'},
      {x:8,  z:-14,name:'INCIDENT REPORTS', sim:0.542, target:false, text:'2024-01-30 — outage postmortem'},
      {x:16, z:-8, name:'MEETING MINUTES',  sim:0.538, target:false, text:'2024-06-11 — roadmap review'},
      {x:-8, z:2,  name:'COOKING RECIPES',  sim:0.719, target:false, text:'how to fold dumplings'},
      {x:8,  z:2,  name:'POETRY ARCHIVE',   sim:0.745, target:false, text:'odes to the sea'},
    ];
    let mode='lantern'; // or 'scanner'
    const scrolls=[];
    shelves.forEach(sh=>{
      const unit=W.box(3.2,3.4,1.1,W.mat(0x14202f,{emissive:0x0a1420,ei:.6}));
      unit.position.set(sh.x,1.7,sh.z); s.add(unit);
      G.colliders.push({min:new THREE.Vector3(sh.x-1.6,0,sh.z-0.55),max:new THREE.Vector3(sh.x+1.6,3.4,sh.z+0.55),solid:true});
      W.label(new THREE.Vector3(sh.x,4.1,sh.z),sh.name,{size:.3,color:'#8fb8d8'});
      sh.simLbl=W.label(new THREE.Vector3(sh.x,3.6,sh.z),'',{size:.24,color:'#54e0ff'});
      sh.mesh=unit;
      // scroll on shelf
      const sc=new THREE.Mesh(new THREE.CylinderGeometry(.14,.14,.9,10),W.mat(0xd8c9a3,{emissive:0x6a5a30,ei:.4}));
      sc.rotation.z=Math.PI/2; sc.position.set(sh.x,2.2,sh.z+0.75); s.add(sc);
      sc.userData.shelf=sh;
      sc.userData.interact={prompt:`take scroll — ${sh.name}`, fn:()=>{
        if(G.held){ toast('already carrying a scroll'); return; }
        hold(sc); sc.userData.taken=true;
        const ix=G.interactables.indexOf(sc); if(ix>=0)G.interactables.splice(ix,1);
        toast(`carrying: ${sh.name}`);
      }};
      G.interactables.push(sc); scrolls.push(sc);
      sh.scroll=sc;
    });

    function refreshGlow(){
      shelves.forEach(sh=>{
        if(mode==='lantern'){
          // similarity glow — everything topical glows nearly the same
          const rel = sh.sim<0.6 ? (0.6-sh.sim)*12 : 0.02;
          sh.mesh.material.emissive.setHex(0x1a5a8a); sh.mesh.material.emissiveIntensity=rel;
          const nl=W.text(`dist ${sh.sim.toFixed(3)}`,{size:.24,color: sh.sim<0.6?'#54e0ff':'#33465e'});
          sh.simLbl.material=nl.material; sh.simLbl.scale.copy(nl.scale);
        } else {
          const hit=sh.target;
          sh.mesh.material.emissive.setHex(hit?0x2aff7a:0x0a1420); sh.mesh.material.emissiveIntensity=hit?1.6:.2;
          const nl=W.text(hit?'EXACT MATCH: "2024-09-15"':'no match',{size:.24,color:hit?'#5cff9d':'#33465e'});
          sh.simLbl.material=nl.material; sh.simLbl.scale.copy(nl.scale);
        }
      });
    }
    refreshGlow();

    // tools
    W.button({x:-3,z:14,label:'SEMANTIC LANTERN',color:W.C.cyan,fn:()=>{ mode='lantern'; refreshGlow();
      toast('LANTERN — shelves glow by similarity of meaning'); }});
    const scannerBtn=W.button({x:3,z:14,label:'GREP SCANNER (locked)',color:0x44586e,fn:()=>{
      if(!scannerUnlocked){ buzz(); toast('The scanner only wakes after the lantern has failed you once.'); return; }
      mode='scanner'; refreshGlow(); toast('SCANNER — exact string: "2024-09-15". Meaning ignored entirely.');
    }});
    let scannerUnlocked=false, altarFails=0;

    // altar
    const altar=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.5,1,10),W.mat(0x1a2440,{emissive:0x2a4a7a,ei:.7}));
    altar.position.set(0,.5,-19); s.add(altar);
    G.colliders.push({min:new THREE.Vector3(-1.4,0,-20.3),max:new THREE.Vector3(1.4,1,-17.7),solid:true});
    W.label(new THREE.Vector3(0,2.6,-19),'THE READER — submit the scroll',{size:.34,color:'#ffd257'});
    let answered=false;
    altar.userData.interact={prompt:'submit scroll', fn:()=>{
      if(!G.held){ toast('bring a scroll'); return; }
      const sh=G.held.userData.shelf;
      if(sh.target){ chime(); answered=true; dropHeld();
        toast(`"${sh.text}" — <b>found.</b> Now deliver it through the far corridor.`);
        doorC.open(); obj('DELIVER the answer through the corridor · <b>watch your context</b>');
        startCorridor();
      } else {
        altarFails++; buzz(); dropHeld();
        sh.scroll.position.set(sh.x,2.2,sh.z+0.75); s.add(sh.scroll); G.interactables.push(sh.scroll);
        toast(`The Reader speaks fluently about "${sh.name}"… and says nothing about 2024-09-15.<br><b>Close in meaning. Wrong in fact.</b>`,4200);
        if(altarFails>=1 && !scannerUnlocked){ scannerUnlocked=true;
          scannerBtn.btn.material.color.setHex(W.C.green); scannerBtn.btn.material.emissive.setHex(W.C.green);
          setTimeout(()=>toast('A second instrument hums awake near the entrance: <b>THE GREP SCANNER</b>.',4200),2400);
        }
      }
    }};
    G.interactables.push(altar);
    obj('FIND: <b>what changed on 2024-09-15</b> · use the lantern, take the best scroll, submit at the Reader');

    const doorC=W.door({x:0,z:-23.5,axis:'x'});

    // ---------- corridor: context rot ----------
    let ctx=1, bar=null, corridorOn=false;
    const junkNames=['helpful summary','related FAQ','similar ticket','old changelog','style guide','vendor doc'];
    const junkZones=[-28,-32,-36,-40,-44,-48].map((z,i)=>({z, used:false, name:junkNames[i]}));
    const shredders=[-34,-46].map(z=>{
      const m=W.button({x:3.4,z,label:'SHRED JUNK (−2)',color:W.C.magenta,fn:()=>{
        if(ctx>1){ ctx=Math.max(1,ctx-2); bar&&bar.set(1-(ctx-1)/8, `CONTEXT · ${ctx} scroll${ctx>1?'s':''}`);
          toast('junk shredded — the light steadies'); refreshFog(); }
        else toast('nothing but the answer remains');
      }});
      return m;
    });
    function refreshFog(){ // more junk = darker world
      const f=Math.min(0.85,(ctx-1)*0.12);
      s.fog.near=16-(ctx-1)*1.6; s.fog.far=55-(ctx-1)*5;
    }
    function startCorridor(){
      corridorOn=true; bar=hudBar('ctx','CONTEXT · 1 scroll');
      bar.set(1);
    }
    // reading gate at corridor end
    const gate=W.door({x:0,z:-56,axis:'x',color:W.C.gold});
    const gateBtn=W.button({x:-3.4,z:-53,label:'READING GATE',color:W.C.gold,fn:()=>{
      if(!corridorOn){ toast('nothing to read yet'); return; }
      if(ctx<=3){ chime(); gate.open(); toast('The gate reads the answer instantly. <b>Small context, sharp attention.</b>'); }
      else { buzz(); toast(`${ctx} scrolls presented. The gate squints… <b>"the needle is lost in the haystack."</b><br>Shred down to 3 or fewer.`,4200); }
    }});
    onTick(()=>{
      if(!corridorOn) return;
      for(const jz of junkZones){
        if(!jz.used && Math.abs(G.player.pos.z-jz.z)<1.2 && Math.abs(G.player.pos.x)<4.5){
          jz.used=true; ctx++; buzz();
          toast(`a "${jz.name}" latched onto your context (+1) — it seemed relevant…`);
          bar.set(1-(ctx-1)/8, `CONTEXT · ${ctx} scrolls`); refreshFog();
        }
      }
      if(gate.isOpen && G.player.pos.z<-58){ gate.isOpen=false; complete(); }
    });

    return {};
  }
};
