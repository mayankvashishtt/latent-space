// X · OUTPUT HEAD — a speedrun remix of everything, ending at the softmax gate.
import * as THREE from 'three';
import { G, spawn, obj, toast, complete, chime, buzz, blip, onTick, after, panel, loadLevel, guide } from '../engine.js';
import * as W from '../world.js';
import { TEXT } from '../text.js';

export default {
  id:10, name:'X · OUTPUT HEAD', tagline:'the final forward pass',
  respawn:[0,1,10,0],
  intro:TEXT[10].intro,
  codex:TEXT[10].codex,
  build(){
    const s=G.scene;
    s.fog=new THREE.Fog(0x04060e,16,60);
    W.lights(s); spawn(0,1,10,0);
    // one long gauntlet: rooms every 16 units
    const ROOMW=18;
    for(let i=0;i<6;i++) W.room({w:ROOMW,h:6,d:16,cz:-i*16,gaps: i===0?['n']: i===5?['s']:['n','s']});
    const doors=[]; for(let i=0;i<5;i++) doors.push(W.door({x:0,z:-8-i*16,axis:'x'}));
    obj('THE GAUNTLET — five chambers, no hints');

    // ---------- C1: one cut (z≈0) ----------
    {
      const pts=[[-3,-3,0],[-3,3,0],[3,-3,1],[3,3,1]].map(([px,pz,lab])=>{
        const m=new THREE.Mesh(new THREE.SphereGeometry(.35,16,16),W.mat(lab?W.C.gold:0x3a7bd5,{emissive:lab?W.C.gold:0x3a7bd5,ei:.9}));
        m.position.set(px,.5,pz-1); s.add(m); return {x:px,z:pz-1,lab,m};});
      let theta=0.6;
      const blade=W.box(9,2.6,.06,new THREE.MeshStandardMaterial({color:W.C.cyan,emissive:W.C.cyan,emissiveIntensity:.6,transparent:true,opacity:.3,side:THREE.DoubleSide}));
      blade.position.set(0,1.3,-1); s.add(blade); blade.rotation.y=theta;
      W.button({x:-5,z:4,label:'ROTATE',color:W.C.cyan,fn:()=>{ theta+=Math.PI/8; blade.rotation.y=theta; }});
      let ok1=false, t1=0;
      onTick(dt=>{
        if(ok1) return;
        const n={x:Math.sin(theta),z:Math.cos(theta)};
        let good=true;
        for(const p of pts){ const side=n.x*p.x+n.z*(p.z+1); const pred=side>0?1:0; if(pred!==p.lab){good=false;break;} }
        if(good){ t1+=dt; if(t1>1){ ok1=true; doors[0].open(); chime(); toast('C1 — one cut. onward.'); } } else t1=0;
      });
    }
    // ---------- C2: the frequent pair (z≈-16) ----------
    {
      const pairs=[['t h',2],['h e',3],['e r',1]]; // "the the her the" -> 'he' most frequent... display counts
      let solved2=false;
      pairs.forEach(([p,c],i)=>{
        W.label(new THREE.Vector3(-4+i*4,3.4,-17),`"${p.replace(' ','')}" ×${c}`,{size:.4,color:'#bfe8ff'});
        W.button({x:-4+i*4,z:-14,label:`MERGE "${p.replace(' ','')}"`,color:W.C.magenta,fn:()=>{
          if(solved2) return;
          if(c===3){ solved2=true; doors[1].open(); chime(); toast('C2 — frequency decides. always.'); }
          else { buzz(); toast('not the most frequent pair'); }
        }});
      });
    }
    // ---------- C3: the budget (z≈-32) ----------
    {
      W.label(new THREE.Vector3(0,4.2,-33),'"the bridge held because IT was strong" — route 1.00',{size:.32,color:'#9fd8ff'});
      let a={bridge:0,storm:0}, pool=1, solved3=false;
      const lbl=W.label(new THREE.Vector3(0,3.5,-33),'pool 1.00',{size:.3,color:'#54e0ff'});
      const upd=()=>{ const nl=W.text(`pool ${pool.toFixed(2)} · bridge ${a.bridge.toFixed(2)} · storm ${a.storm.toFixed(2)}`,{size:.3,color:'#54e0ff'});
        lbl.material=nl.material; lbl.scale.copy(nl.scale); };
      [['bridge',-3],['storm',3]].forEach(([k,x])=>W.button({x,z:-30,label:`+0.25 ${k.toUpperCase()}`,color:W.C.cyan,fn:()=>{
        if(solved3||pool<0.24){ pool<0.24&&buzz(); return; } pool-=.25; a[k]+=.25; upd(); }}));
      W.button({x:0,z:-28,label:'CONFIRM',color:W.C.gold,fn:()=>{
        if(solved3) return;
        if(pool<=0.01 && a.bridge>=0.75){ solved3=true; doors[2].open(); chime(); toast('C3 — IT was the bridge. budget spent.'); }
        else { buzz(); pool=1; a={bridge:0,storm:0}; upd(); toast('wrong routing — pool reset'); }
      }});
    }
    // ---------- C4: exact match (z≈-48) ----------
    {
      W.label(new THREE.Vector3(0,4.2,-49),'FIND: error code E-7741 — one plinth holds it',{size:.32,color:'#9fd8ff'});
      const opts=[['about error handling',false],['E-7741 raised in auth',true],['errors & retries guide',false]];
      let solved4=false;
      opts.forEach(([t,hit],i)=>{
        const p=W.pillar(-5+i*5,-49,{h:1.4,r:.5,emissive:0x1a3a5c});
        W.label(new THREE.Vector3(-5+i*5,2.6,-49),t,{size:.26,color:'#8fb8d8'});
        p.userData.interact={prompt:'take this scroll',fn:()=>{
          if(solved4) return;
          if(hit){ solved4=true; doors[3].open(); chime(); toast('C4 — the string matched. meaning was a decoy.'); }
          else { buzz(); toast('fluent about errors. silent about E-7741.'); }
        }};
        G.interactables.push(p);
      });
    }
    // ---------- C5: revoke (z≈-64) ----------
    {
      W.label(new THREE.Vector3(0,4.2,-65),'a sign will lie to your courier. remove ONE tool.',{size:.32,color:'#9fd8ff'});
      const tools=[['move',false],['deliver',false],['red_chute',true]];
      let solved5=false;
      tools.forEach(([t,hit],i)=>W.button({x:-4+i*4,z:-62,label:`REVOKE ${t}`,color:hit?W.C.magenta:W.C.cyan,fn:()=>{
        if(solved5) return;
        if(hit){ solved5=true; doors[4].open(); chime(); toast('C5 — it can be fooled and still be harmless.'); }
        else { buzz(); toast(`revoke ${t} and the job itself dies. think about which tool the ATTACK needs.`); }
      }}));
    }
    // ---------- SOFTMAX GATE (z≈-80) ----------
    {
      const logits=[2.1,0.3,1.1,-0.5,0.8];
      let T=1.0, emitted=false;
      const bars=[], doorsF=[];
      const probs=()=>{ const ex=logits.map(l=>Math.exp(l/T)); const su=ex.reduce((a,b)=>a+b,0); return ex.map(e=>e/su); };
      for(let i=0;i<5;i++){
        const x=-6+i*3;
        const d=W.box(1.8,3,.3,W.mat(0x0a1020,{emissive:W.C.magenta,ei:.4})); d.position.set(x,1.5,-86); s.add(d);
        const col={min:new THREE.Vector3(x-.9,0,-86.2),max:new THREE.Vector3(x+.9,3,-85.8),solid:true}; G.colliders.push(col);
        doorsF.push({d,col,x});
        W.label(new THREE.Vector3(x,3.6,-86),`logit ${logits[i]}`,{size:.26,color:'#8fb8d8'});
        bars.push(W.label(new THREE.Vector3(x,4.2,-86),'',{size:.3,color:'#54e0ff'}));
      }
      const showP=()=>{ const p=probs(); p.forEach((v,i)=>{ const nl=W.text(`p=${v.toFixed(2)}`,{size:.3,color: v===Math.max(...p)?'#ffd257':'#54e0ff'});
        bars[i].material=nl.material; bars[i].scale.copy(nl.scale); }); };
      showP();
      const tl=W.label(new THREE.Vector3(0,5.2,-82),'TEMPERATURE 1.0',{size:.4,color:'#ff9d5c'});
      W.button({x:-4,z:-78,label:'T = 0.1',color:W.C.green,fn:()=>{ T=0.1; showP(); const nl=W.text('TEMPERATURE 0.1 — sharp',{size:.4,color:'#5cff9d'}); tl.material=nl.material; tl.scale.copy(nl.scale); }});
      W.button({x:0,z:-78,label:'T = 1.0',color:W.C.cyan,fn:()=>{ T=1; showP(); const nl=W.text('TEMPERATURE 1.0',{size:.4,color:'#ff9d5c'}); tl.material=nl.material; tl.scale.copy(nl.scale); }});
      W.button({x:4,z:-78,label:'T = 10',color:W.C.red,fn:()=>{ T=10; showP(); const nl=W.text('TEMPERATURE 10 — chaos',{size:.4,color:'#ff5c6a'}); tl.material=nl.material; tl.scale.copy(nl.scale); }});
      W.button({x:0,z:-75,label:'SAMPLE THE NEXT TOKEN',color:W.C.gold,fn:()=>{
        if(emitted) return;
        const p=probs(); const r=Math.random(); let acc=0, pick=0;
        for(let i=0;i<5;i++){ acc+=p[i]; if(r<=acc){ pick=i; break; } }
        const best=p.indexOf(Math.max(...p));
        if(T<=0.2 || pick===best){
          emitted=true; chime();
          const f=doorsF[best]; f.d.material.emissive.setHex(W.C.gold); f.d.material.emissiveIntensity=1.6;
          f.col.min.y=99; // disable
          toast(`token sampled — door ${best+1} opens. walk through.`);
          onTick(()=>{ if(emitted && G.player.pos.z<-87) finale(); });
        } else {
          buzz(); toast(`sampled door ${pick+1} — a low-probability token. at this temperature, anything can happen.<br><b>sharpen the distribution.</b>`,4200);
        }
      }});
    }
    let finaleDone=false;
    function finale(){
      if(finaleDone) return; finaleDone=true;
      G.player.frozen=true;
      const beam=new THREE.Mesh(new THREE.CylinderGeometry(.6,.6,40,16),
        new THREE.MeshBasicMaterial({color:0xffd257,transparent:true,opacity:.5}));
      beam.position.set(G.player.pos.x,20,G.player.pos.z-2); s.add(beam);
      chime();
      after(1.4,()=>{
        panel({title:'TOKEN EMITTED',sub:'the forward pass is complete',
          html:`<p style="text-align:center;font-size:18px;line-height:2.2">
            neuron · descent · token · vector · attention<br>retrieval · loop · reward · defense · softmax<br><br>
            <em style="color:#ffd257">You are the forward pass.<br>The next token is yours.</em></p>`,
          buttons:[{label:'Return to the Stream',gold:true,fn:()=>{ G.player.frozen=false; complete(); }}]});
      });
    }

    // -------- voice guide: final test = silence --------
    guide([
      {who:'nova', say:"This is the final test. Five rooms — cut, glue, budget, exact match, remove the power — then the softmax gate. We won't help this time.",
       when:()=>G.player.pos.z<4},
      {who:'bit', say:"What she means is: you don't NEED help anymore. You've been the neuron, the tokenizer, the attention, the reward, the defense. Go be the whole forward pass. I'll be watching. No pressure."},
    ]);
    return {};
  }
};
