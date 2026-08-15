// V · ATTENTION — distribute a budget that sums to 1; the sentence changes under you.
// Then the causal glass, then the KV cache choice.
import * as THREE from 'three';
import { G, spawn, obj, toast, complete, chime, buzz, onTick, after, guide, playerNear } from '../engine.js';
import * as W from '../world.js';
import { TEXT } from '../text.js';

export default {
  id:4, name:'IV · ATTENTION', tagline:'a budget that always sums to one',
  respawn:[0,1,16,0],
  intro:TEXT[4].intro,
  codex:TEXT[4].codex,
  build(){
    const s=G.scene;
    s.fog=new THREE.Fog(0x04060e,20,70);
    W.lights(s); spawn(0,1,16,0);
    W.room({w:40,h:7,d:40,cz:0,gaps:['n']});
    W.room({w:18,h:6,d:26,cz:-31,gaps:['s','n']});
    W.room({w:24,h:6,d:24,cz:-54,gaps:['s','n']});
    W.ground(10,8,{cz:-69});

    // ---------- ROOM A: the budget ----------
    const words=['The','animal',"didn't",'cross','the','street','because','IT','was','too','tired'];
    const pillars={};
    words.forEach((wd,i)=>{
      const x=-15+i*3;
      const p=W.pillar(x,-6,{h: wd==='IT'?3.4:2.4, color: wd==='IT'?0x2a3a5c:W.C.steel,
        emissive: wd==='IT'?W.C.gold:0});
      const t=W.text(wd,{size:.42,color: wd==='IT'?'#ffd257':'#bfe8ff',bold:wd==='IT'}); t.position.set(x, wd==='IT'?4.3:3.2, -6); s.add(t);
      pillars[wd+i]={mesh:p,x,wd,label:t};
    });
    // candidates
    const cands=[{wd:'animal',x:-12},{wd:'street',x:0}];
    let alloc={animal:0,street:0}, pool=1.0, phase=1;
    const beams={};
    function beamTo(x, frac){
      // beam from IT pillar to candidate, thickness by weight
      const key='b'+x;
      if(beams[key]){ s.remove(beams[key]); delete beams[key]; }
      if(frac<=0) return;
      const from=new THREE.Vector3(-15+7*3,3.2,-6); // IT at index 7
      const to=new THREE.Vector3(x,2.6,-6);
      const len=from.distanceTo(to);
      const m=new THREE.Mesh(new THREE.CylinderGeometry(.05+frac*.35,.05+frac*.35,len,8),
        new THREE.MeshBasicMaterial({color:W.C.cyan,transparent:true,opacity:.25+frac*.6}));
      m.position.copy(from).add(to).multiplyScalar(.5);
      m.lookAt(to); m.rotateX(Math.PI/2);
      s.add(m); beams[key]=m;
    }
    const poolBarLbl = W.label(new THREE.Vector3(6,5.6,-6),'ATTENTION POOL · 1.00',{size:.44,color:'#54e0ff'});
    function poolText(){ const nl=W.text(`ATTENTION POOL · ${pool.toFixed(2)}`,{size:.44,color:'#54e0ff'});
      poolBarLbl.material=nl.material; poolBarLbl.scale.copy(nl.scale); }
    cands.forEach(c=>{
      W.button({x:c.x-1, z:-1.5, label:`+0.25 → ${c.wd.toUpperCase()}`, color:W.C.cyan, fn:()=>{
        if(pool<0.24){ buzz(); toast('POOL EMPTY — your attention budget always adds up to exactly 1.<br>Press RESET to try a different split.'); return; }
        pool-=0.25; alloc[c.wd]+=0.25; poolText(); beamTo(c.x==-12?-12:0, alloc[c.wd]);
        toast(`attention(${c.wd}) = ${alloc[c.wd].toFixed(2)}`);
      }});
    });
    W.button({x:-6,z:2.5,label:'RESET POOL',color:0x8a9dc0,fn:()=>{
      pool=1; alloc={animal:0,street:0}; poolText(); beamTo(-12,0); beamTo(0,0); toast('redistributed'); }});
    const confirm=W.button({x:-4,z:2.5,label:'CONFIRM ROUTING',color:W.C.gold,fn:()=>{
      if(pool>0.01){ buzz(); toast('spend the whole pool — attention weights are a full distribution'); return; }
      const need = phase===1?'animal':'street';
      if(alloc[need]>=0.5){
        chime();
        if(phase===1){
          toast('IT → ANIMAL. The animal was tired. Correct.');
          // mutate the sentence
          after(1.6,()=>{
            const last=Object.values(pillars).find(p=>p.wd==='tired');
            s.remove(last.label);
            const nt=W.text('WIDE',{size:.42,color:'#ff4fd8',bold:true}); nt.position.set(last.x,3.2,-6); s.add(nt);
            last.label=nt; buzz();
            toast('<b>THE SENTENCE CHANGED.</b> "...because IT was too WIDE."<br>Same structure. New meaning. Redistribute.',4200);
            phase=2; pool=1; alloc={animal:0,street:0}; poolText(); beamTo(-12,0); beamTo(0,0);
            obj('PHASE 2 — "wide": route the attention again · then CONFIRM');
          });
        } else {
          toast('IT → STREET. The street was wide. <b>Same word, new meaning — the surroundings decided.</b>');
          doorA.open(); obj('proceed north — through the causal glass');
        }
      } else { buzz(); toast(`with "${phase===1?'tired':'wide'}", IT does not mean that. Rethink the routing.`); }
    }});
    obj('PHASE 1 — "tired": spend the pool so IT attends to the right word · then CONFIRM');
    const doorA=W.door({x:0,z:-20,axis:'x'});

    // ---------- ROOM B: causal glass ----------
    for(let i=0;i<8;i++){
      const z=-24-i*2.6, future=i>4;
      const p=W.pillar(-4,z,{h:2, color: future?0x0a0f1a:W.C.steel, emissive: future?0:0x123a5c});
      const t=W.text(`t${i+1}`,{size:.36,color: future?'#2a3548':'#9fd8ff'}); t.position.set(-4,2.8,z); s.add(t);
      if(i===4){ const you=W.text('← YOU ARE HERE',{size:.3,color:'#ffd257'}); you.position.set(-1.5,2.2,z); s.add(you); }
    }
    // glass wall over future tokens
    const glass=W.box(6,4,.15,new THREE.MeshStandardMaterial({color:0x080e1a,transparent:true,opacity:.75,roughness:.1,metalness:.6}));
    glass.position.set(-4,2,-37.4); glass.rotation.y=0; s.add(glass);
    W.terminal({x:1.5,z:-31,yaw:-1.2,label:'THE MASK',title:'CAUSAL MASK',sub:'scores set to −∞',
      html:`<p>The dark pillars are <em>future tokens</em>. Their attention scores are not lowered —
      they are set to <b>−∞</b>, and e<sup>−∞</sup> = 0. Zero weight. Renormalize. The future
      contributes <em>nothing</em>.</p>
      <p>Without this, training would be an exam with the answers printed on the page: position 5
      could simply read position 6. The mask is why a single pass trains a thousand predictions at
      once — and why generation is possible at all.</p>`});

    // ---------- ROOM C: KV cache ----------
    W.label(new THREE.Vector3(0,5,-50),'GATE REQUIRES: K,V of tokens 1–4 + your fresh Q',{size:.36,color:'#9fd8ff'});
    // cached crystals
    for(let i=0;i<4;i++){
      const c=W.beacon(-6+i*2.2,1.6,-50,W.C.cyan,.35);
      W.label(new THREE.Vector3(-6+i*2.2,2.6,-50),`K,V t${i+1} · CACHED`,{size:.22,color:'#54e0ff'});
    }
    const doorC=W.door({x:0,z:-65,axis:'x',color:W.C.gold});
    let choosing=true;
    W.button({x:-3,z:-56,label:'RECOMPUTE ALL K,V',color:W.C.red,fn:()=>{
      if(!choosing) return;
      buzz(); toast('recomputing t1… recomputing t2… <b>this is the same math you already did.</b><br>The gate grows impatient.',4200);
      after(4.5,()=>toast('…recomputing t3… (the same tokens produce the same keys. always.)',3600));
      after(9,()=>{ toast('RECOMPUTE ABORTED — wasted work detected. The crystals never changed.',3600); });
    }});
    W.button({x:3,z:-56,label:'USE THE CACHE',color:W.C.green,fn:()=>{
      if(!choosing) return; choosing=false; chime();
      toast('CACHE HIT — old K,V reused, only your fresh Q computed. The gate opens instantly.');
      doorC.open();
      obj('walk through the gold gate');
    }});
    onTick(()=>{
      if(doorC.isOpen && G.player.pos.z<-66.5){ doorC.isOpen=false; complete(); }
    });

    // -------- voice guide --------
    guide([
      {who:'nova', say:"Read the sentence made of pillars: The animal didn't cross the street because IT was too tired. So — what does IT mean, the animal or the street? Think about what was actually tired. Walk to the buttons.",
       when:()=>playerNear(-6,0,8)},
      {who:'bit', say:"You're holding exactly ONE point of my attention. Not one point one. ONE. This is the deepest rule in my whole head: attention always adds up to exactly one, so giving more to one word STEALS it from the rest. Spend the whole pool on the right word.",
       when:()=>pool<=0.01},
      {who:'nova', say:"Pool spent. Press CONFIRM — let's see how you routed the meaning.",
       when:()=>phase===2},
      {who:'bit', say:"Correct, the ANIMAL was tired. But don't relax. Watch the sentence. Watch it...",
       when:()=>alloc.street>=0.5},
      {who:'nova', say:"Now it says WIDE — and suddenly IT means the STREET. Same sentence, one word changed, whole meaning moved. That's the superpower: meaning gets computed fresh from the neighbors, every time. Confirm your new answer.",
       when:()=>G.player.pos.z<-24},
      {who:'bit', say:"See the dark pillars behind glass? Future words. When I'm predicting the next word, I am NEVER allowed to peek ahead — not discouraged, mathematically walled off. Otherwise training would be an exam with the answers printed on it. Keep walking.",
       when:()=>G.player.pos.z<-44},
      {who:'nova', say:"Last room. The gate needs the stored values of the old words plus your fresh question. Look — the old values are already sitting there, cached, glowing blue. Old words never change, so their math never changes. So: recompute everything... or use the cache? Choose a button."},
    ]);
    return {};
  }
};
