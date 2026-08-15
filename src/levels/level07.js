// VII · AGENT FOUNDRY — you can't reach the key. Build the drone's harness and watch it try.
// Bad tool descriptions = confused drone. Errors returned as observations = recovery.
import * as THREE from 'three';
import { G, spawn, obj, toast, complete, chime, buzz, blip, onTick, after } from '../engine.js';
import * as W from '../world.js';

export default {
  id:7, name:'VII · AGENT FOUNDRY', tagline:'the loop is the intelligence',
  respawn:[0,1,14,0],
  intro:`
    <p>Behind unbreakable glass sits a sealed vault, a key on a pedestal — and a dormant drone.</p>
    <p>You will never touch that key. The drone will. But the drone knows <em>nothing</em> except what
    its harness tells it: which tools it has, and what their descriptions say.</p>
    <p class="quote">Write the harness. Run the loop. Watch what your descriptions actually taught it.</p>`,
  codex:{
    html:`<p>You just built an <b>agent harness</b> — and discovered that the model was never the problem.</p>
      <p>With the vague description ("does stuff with things"), the drone picked wrong tools, flailed, and
      hit its iteration cap. Same drone, same "intelligence." With the precise description, it planned
      cleanly: scan → grab → unlock. <b>Tool descriptions are prompt engineering</b> — they are the only
      thing the model has when it chooses.</p>
      <p>Notice what happened at the locked vault on the good run: the tool returned
      <code>{"error": "vault requires the brass key"}</code> — and the drone <em>read the error and
      changed plan</em>. An exception would have killed it; an <b>error returned as an observation</b>
      taught it. That single design decision is the most important pattern in agent engineering.</p>
      <p>And the loop itself: think → act → observe, repeat, with a hard iteration cap. That's the whole
      architecture of Claude Code — about 60 lines of Python around a model. The capability lives in
      the loop, not in the tool count.</p>`,
    lecture:'notes/week-08-from-apis-to-agents'
  },
  build(){
    const s=G.scene;
    s.fog=new THREE.Fog(0x04060e,18,60);
    W.lights(s); spawn(0,1,14,0);
    W.room({w:30,h:6,d:34,cz:0});

    // sealed chamber (visible through glass)
    const glass=W.box(14,4.5,.2,new THREE.MeshStandardMaterial({color:0x0e1626,transparent:true,opacity:.28,roughness:.05,metalness:.7}));
    glass.position.set(0,2.25,-6); s.add(glass);
    G.colliders.push({min:new THREE.Vector3(-7,0,-6.2),max:new THREE.Vector3(7,4.5,-5.8),solid:true});
    W.ground(14,10,{cz:-11,color:0x0a1220,grid:false});
    // key pedestal + vault
    const ped=W.pillar(-4,-10,{h:1.1,r:.4});
    const key=new THREE.Mesh(new THREE.TorusGeometry(.3,.09,8,20),W.mat(W.C.gold,{emissive:W.C.gold,ei:1.4}));
    key.position.set(-4,1.6,-10); key.userData.baseY=1.6; key.userData.bob=.08; G.animated.push(key); s.add(key);
    W.label(new THREE.Vector3(-4,2.6,-10),'BRASS KEY',{size:.28,color:'#ffd257'});
    const vault=W.box(2.6,3.2,1,W.mat(0x1a2436,{emissive:0x5c3a1a,ei:.5})); vault.position.set(4,1.6,-11); s.add(vault);
    W.label(new THREE.Vector3(4,3.6,-11),'VAULT',{size:.32,color:'#ffb066'});
    // drone
    const drone=new THREE.Group();
    const body=new THREE.Mesh(new THREE.SphereGeometry(.5,16,16),W.mat(0x203050,{emissive:W.C.cyan,ei:.6}));
    const eye=new THREE.Mesh(new THREE.SphereGeometry(.15,10,10),W.mat(W.C.cyan,{emissive:W.C.cyan,ei:2})); eye.position.set(0,.1,-.42);
    drone.add(body,eye); drone.position.set(0,1.2,-9); s.add(drone);

    // ticker screen (DOM overlay style via labels is weak — use a big panel of floating lines)
    const tickerLines=[];
    function ticker(msg,color='#9fd8ff'){
      const t=W.text(msg,{size:.26,color});
      tickerLines.forEach(l=>l.position.y+=0.42);
      t.position.set(0,4.6,-5.5); s.add(t); tickerLines.push(t);
      while(tickerLines.length>9){ const old=tickerLines.shift(); s.remove(old); }
      blip(500+Math.random()*300,.04,'square',.08);
    }

    // ---------- harness configuration ----------
    let cfg={scanDesc:null, tools:{grab:true, unlock:true, scan:true}};
    W.label(new THREE.Vector3(-9,4.4,6),'STEP 1 — CHOOSE THE "scan" TOOL DESCRIPTION',{size:.32,color:'#ffd257'});
    W.terminal({x:-11,z:8,yaw:.6,label:'DESCRIPTION A',title:'scan — description A',sub:'"does stuff with things"',
      html:`<p><code>scan: does stuff with things</code></p><p>Select this description for the scan tool?</p>`,
      onOpen:()=>{ cfg.scanDesc='vague'; toast('scan description set: <b>"does stuff with things"</b>'); }});
    W.terminal({x:-7.5,z:8,yaw:-.2,label:'DESCRIPTION B',title:'scan — description B',sub:'"lists every object in the chamber with its position"',
      html:`<p><code>scan: lists every object in the chamber with its position. Use it FIRST, before acting.</code></p>
      <p>Select this description for the scan tool?</p>`,
      onOpen:()=>{ cfg.scanDesc='precise'; toast('scan description set: <b>precise</b>'); }});

    let running=false, solved=false;
    W.button({x:0,z:9,label:'RUN THE LOOP',color:W.C.green,fn:()=>{
      if(running||solved) return;
      if(!cfg.scanDesc){ buzz(); toast('choose a description for the scan tool first'); return; }
      running=true; tickerLines.forEach(l=>s.remove(l)); tickerLines.length=0;
      runSim(cfg.scanDesc==='precise');
    }});
    obj('Configure the drone: pick a <b>scan description</b>, then <b>RUN THE LOOP</b>');

    // ---------- scripted simulation ----------
    function moveTo(x,z,t,then){ const fx=drone.position.x,fz=drone.position.z; let k=0;
      const fn=(dt)=>{ k+=dt/t; const e=Math.min(1,k);
        drone.position.x=fx+(x-fx)*e; drone.position.z=fz+(z-fz)*e;
        drone.position.y=1.2+Math.sin(e*Math.PI)*0.35;
        if(e>=1){ G.ticks.splice(G.ticks.indexOf(fn),1); then&&then(); } };
      G.ticks.push(fn);
    }
    function runSim(precise){
      const say=(d,msg,c)=>after(d,()=>ticker(msg,c));
      if(!precise){
        say(0.3,'THOUGHT: I must retrieve a key. What tools do I have?','#cfe6ff');
        say(1.6,'TOOL scan: "does stuff with things" — unclear. Skipping.','#8899aa');
        say(3.0,'ACTION: unlock(vault)','#54e0ff');
        after(3.2,()=>moveTo(4,-9.5,1.6));
        say(5.2,'OBSERVATION: {"error":"vault requires the brass key"}','#ff5c6a');
        say(6.8,'THOUGHT: I need a key. Where is it? I cannot see the room.','#cfe6ff');
        say(8.4,'ACTION: grab(???)  — guessing coordinates','#54e0ff');
        after(8.6,()=>moveTo(2,-12,1.4));
        say(10.2,'OBSERVATION: {"error":"nothing at that position"}','#ff5c6a');
        say(11.8,'ACTION: unlock(vault)   ← trying the same thing again','#54e0ff');
        say(13.2,'OBSERVATION: {"error":"vault requires the brass key"}','#ff5c6a');
        say(14.6,'MAX ITERATIONS REACHED — run terminated.','#ffb066');
        after(15.6,()=>{ running=false; buzz();
          toast('The drone was not stupid. <b>It was blind.</b> Its scan tool description told it nothing.<br>Fix the harness and run again.',5200);
          moveTo(0,-9,1.2);
        });
      } else {
        say(0.3,'THOUGHT: Retrieve the key, open the vault. scan lists objects — use it FIRST.','#cfe6ff');
        say(1.8,'ACTION: scan()','#54e0ff');
        say(3.2,'OBSERVATION: {"key":[-4,-10], "vault":[4,-11], "vault_state":"locked"}','#5cff9d');
        say(4.8,'THOUGHT: Key at (-4,-10). Grab it, then unlock.','#cfe6ff');
        say(6.2,'ACTION: grab(key)','#54e0ff');
        after(6.4,()=>moveTo(-4,-9.6,1.6,()=>{ key.position.set(drone.position.x,1.9,drone.position.z);
          key.userData.bob=0; G.ticks.push(()=>{ key.position.x=drone.position.x; key.position.z=drone.position.z; key.position.y=drone.position.y+0.7; }); }));
        say(8.4,'OBSERVATION: {"held":"brass key"}','#5cff9d');
        say(9.8,'ACTION: unlock(vault)','#54e0ff');
        after(10,()=>moveTo(4,-9.8,1.8));
        say(12.2,'OBSERVATION: {"vault":"open"} — task complete in 3 actions.','#5cff9d');
        after(13,()=>{ vault.material.emissive.setHex(W.C.green); vault.material.emissiveIntensity=1.2; chime();
          toast('<b>Same drone. Same model. Different harness.</b>');
          solved=true;
          after(2.2,()=>complete());
        });
      }
    }
    return {};
  }
};
