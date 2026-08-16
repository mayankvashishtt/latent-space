// VI · THE ARCHIVE — semantic search fails on an exact date; grep saves you; then carry the
// answer through a corridor that stuffs your context until you learn to be surgical.
import * as THREE from 'three';
import { G, spawn, obj, toast, complete, chime, buzz, onTick, hold, dropHeld, hudBar, guide, playerNear, insight, after } from '../engine.js';
import * as W from '../world.js';
import { TEXT } from '../text.js';

export default {
  id:5, name:'V · THE ARCHIVE', tagline:'similarity is not relevance',
  respawn:[0,1,20,0],
  intro:TEXT[5].intro,
  codex:TEXT[5].codex,
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
      toast('LANTERN ON — shelves glow when their TOPIC is similar to your question'); }});
    const scannerBtn=W.button({x:3,z:14,label:'GREP SCANNER (locked)',color:0x44586e,fn:()=>{
      if(!scannerUnlocked){ buzz(); toast('The scanner only wakes after the lantern has failed you once.'); return; }
      mode='scanner'; refreshGlow(); toast('SCANNER ON — looks for the exact characters "2024-09-15". Ignores meaning completely.');
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
        after(1.4,()=>insight('Two searches, opposite souls', `
          <p>Feel the difference between your two tools. The <b>lantern</b> understands meaning but
          can't see exact text — it finds "affordable airfare" when you ask about "cheap flights",
          and fails on 2024-09-15. The <b>scanner</b> is the exact opposite: pure spelling, zero
          meaning — Ctrl+F with a flashlight. It nailed the date instantly, but ask it about
          "vacation policy" and it misses the page titled "paid time off".</p>
          <p><b>Each one is blind exactly where the other sees.</b> So real AI search systems run
          BOTH on every question and merge the results. It's called <em>hybrid search</em>, and
          knowing this one trick puts you ahead of half the people building AI products today.</p>
          <p>Now deliver the scroll down the corridor — and watch your CONTEXT bar. You're about to
          feel the attention-budget rule from the last chamber... from the inside.</p>`));
      } else {
        altarFails++; buzz(); dropHeld();
        sh.scroll.position.set(sh.x,2.2,sh.z+0.75); s.add(sh.scroll); G.interactables.push(sh.scroll);
        toast(`The Reader speaks fluently about "${sh.name}"… and says nothing about 2024-09-15.<br><b>Close in meaning. Wrong in fact.</b>`,4200);
        if(altarFails>=1 && !scannerUnlocked){ scannerUnlocked=true;
          after(1.2,()=>insight('The failure that SOUNDS right', `
            <p>Read what the Reader just did: it spoke beautifully, confidently... about the wrong
            document. <b>This is the most dangerous failure in all of AI</b> — not obvious nonsense,
            but a fluent answer built on the wrong source. You can't hear the mistake.</p>
            <p><b>Why did your lantern betray you?</b> Look at the shelf numbers: 0.551, 0.548,
            0.545 — almost identical. The lantern measures similarity of MEANING, and remember the
            shivering date-blob from the meaning map? <em>To a map of meanings, every date means the
            same thing: "a date."</em> 2024-09-15 and 2024-03-22 are practically the same point.
            The lantern physically cannot tell them apart.</p>
            <p>This exact failure happens in real companies every day: AI document-search nails
            "what's our vacation policy?" and faceplants on "what changed on version 2.4.1?" —
            because versions, dates, codes and IDs all blur on the meaning-map. A second instrument
            just woke up by the entrance. It thinks in the opposite way. Go get it.</p>`));
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
          if(ctx===4) after(0.8,()=>insight('Context rot — you are feeling it right now', `
            <p>Notice the fog thickening? Your light dimming? Every "helpful" page that glues itself
            to you makes the ONE page that matters harder to read. Nothing was stolen — your
            attention budget is just being split more ways. Same budget from the Attention chamber.
            More claimants. Thinner slices.</p>
            <p>This is <b>context rot</b>, and it's measured and real: researchers tested top AI
            models and found the 10,000th word of a prompt is treated far less reliably than the
            100th. <b>More text often makes answers WORSE.</b> People assume stuffing everything
            into the chat helps. It doesn't.</p>
            <p>The professional habit hiding here: <em>be surgical.</em> Give an AI the three pages
            that matter, not the thirty that might. You have shredders. Use them — the reading gate
            refuses haystacks.</p>`));
          toast(`a "${jz.name}" latched onto your context (+1) — it seemed relevant…`);
          bar.set(1-(ctx-1)/8, `CONTEXT · ${ctx} scrolls`); refreshFog();
        }
      }
      if(gate.isOpen && G.player.pos.z<-58){ gate.isOpen=false; complete(); }
    });


    // -------- voice guide --------
    guide([
      {who:'nova', say:"A request just came in: find what changed on September 15th, 2024. Your lantern lights up shelves whose TOPIC is similar to the question. Walk in and look at the glow.",
       when:()=>playerNear(0,-8,14)},
      {who:'bit', say:"Notice anything... off? EVERY shelf about dates glows basically the same. 0.551, 0.548, 0.545. Remember my date-blob on the meaning map? To me, all dates are the same word. Pick whatever scroll looks best anyway — feed it to the Reader. Trust the glow. What could go wrong.",
       when:()=>altarFails>=1||answered},
      {who:'nova', say:"And there it is — the Reader spoke beautifully about the wrong document. Close in meaning, wrong in fact. The most dangerous failure there is, because it SOUNDS right. But listen — a second tool just woke up by the entrance. Go switch to it.",
       when:()=>mode==='scanner'},
      {who:'bit', say:"The scanner is my exact opposite: zero meaning, pure spelling. Control-F with a flashlight. Look which single shelf lights up now. THAT's why real systems carry both of us. Grab the right scroll, feed the Reader.",
       when:()=>answered},
      {who:'nova', say:"Found it! Now deliver it down the corridor — and keep an eye on your CONTEXT bar. Helpful-looking junk will glue itself to you the whole way. The more you carry, the dimmer your light. Use the shredders. Arrive light.",
       when:()=>corridorOn && ctx>=3},
      {who:'bit', say:"Feel the fog thickening? That's what it's like inside my head when you paste your entire codebase into the chat. Every extra page spreads my attention thinner. SHRED. THE. JUNK."},
    ]);
    return {};
  }
};
