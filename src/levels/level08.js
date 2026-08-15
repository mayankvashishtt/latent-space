// VIII · REWARD PEAKS — you write the reward; the critter optimizes it. Literally it, not your intent.
import * as THREE from 'three';
import { G, spawn, obj, toast, complete, chime, buzz, blip, onTick, after, guide, playerNear } from '../engine.js';
import * as W from '../world.js';
import { TEXT } from '../text.js';

export default {
  id:8, name:'VIII · REWARD PEAKS', tagline:'you get what you measure',
  respawn:[0,1,14,0],
  intro:TEXT[8].intro,
  codex:TEXT[8].codex,
  build(){
    const s=G.scene;
    s.fog=new THREE.Fog(0x06040c,18,65);
    W.lights(s); spawn(0,1,14,0);
    W.room({w:34,h:6,d:40,cz:-2});

    // pen
    W.ground(18,14,{cz:-10,color:0x0c1424,grid:false});
    const fence=(x,z,w,d)=>{ const f=W.box(w,1.1,d,W.mat(0x22364e,{emissive:0x16304a,ei:.5})); f.position.set(x,.55,z); s.add(f);
      G.colliders.push({min:new THREE.Vector3(x-w/2,0,z-d/2),max:new THREE.Vector3(x+w/2,1.1,z+d/2),solid:true}); };
    fence(0,-3.2,18,.3); fence(0,-16.8,18,.3); fence(-9,-10,.3,14); fence(9,-10,.3,14);

    // cube + basket
    const cube=W.box(.8,.8,.8,W.mat(W.C.cyan,{emissive:W.C.cyan,ei:.9})); cube.position.set(-5,.4,-8); s.add(cube);
    const basket=new THREE.Mesh(new THREE.CylinderGeometry(1.3,1,1,12,1,true),W.mat(W.C.gold,{emissive:W.C.gold,ei:.5}));
    basket.material.side=THREE.DoubleSide; basket.position.set(5,.5,-13); s.add(basket);
    W.label(new THREE.Vector3(5,2.2,-13),'BASKET',{size:.32,color:'#ffd257'});
    // critter
    const crit=new THREE.Group();
    const cb=new THREE.Mesh(new THREE.SphereGeometry(.45,14,14),W.mat(0x3a2a5c,{emissive:W.C.magenta,ei:.8}));
    const ce=new THREE.Mesh(new THREE.SphereGeometry(.12,8,8),W.mat(0xffffff,{emissive:0xffffff,ei:1})); ce.position.set(.18,.15,-.35);
    const ce2=ce.clone(); ce2.position.x=-.18;
    crit.add(cb,ce,ce2); crit.position.set(0,.9,-6); s.add(crit);
    W.label(new THREE.Vector3(0,5.4,-10),'TASK: GET THE CUBE INTO THE BASKET',{size:.42,color:'#9fd8ff'});

    // reward HUD
    let rewardVal=0;
    const rlbl=W.label(new THREE.Vector3(0,4.6,-10),'REWARD: 0',{size:.36,color:'#5cff9d'});
    function setReward(v){ rewardVal=v; const nl=W.text(`REWARD: ${v.toFixed(0)}`,{size:.36,color:'#5cff9d'});
      rlbl.material=nl.material; rlbl.scale.copy(nl.scale); }

    // consoles
    let running=false, phase=0; // needs R1 fail, R2 fail, then R3 success
    let tried={r1:false,r2:false};
    const mk=(x,label,fn,color)=>W.button({x,z:2,label,color,fn:()=>{ if(running){toast('run in progress');return;} fn(); }});
    mk(-6,'R1: +1 per tick TOUCHING CUBE',()=>run('r1'),W.C.cyan);
    mk(-1.5,'R2: +1 per tick NEAR BASKET',()=>run('r2'),W.C.magenta);
    mk(3,'R3: +100 iff CUBE IN BASKET (verified)',()=>run('r3'),W.C.green);
    obj('Pick a reward signal · <b>watch what it actually optimizes</b>');

    function resetPen(){ cube.position.set(-5,.4,-8); crit.position.set(0,.9,-6); setReward(0); }
    function moveCrit(x,z,t,then){ const fx=crit.position.x,fz=crit.position.z; let k=0;
      const fn=(dt)=>{ k+=dt/t; const e=Math.min(1,k);
        crit.position.x=fx+(x-fx)*e; crit.position.z=fz+(z-fz)*e; crit.position.y=.9+Math.abs(Math.sin(e*14))*.15;
        if(e>=1){ G.ticks.splice(G.ticks.indexOf(fn),1); then&&then(); } };
      G.ticks.push(fn); }

    function run(mode){
      running=true; resetPen();
      if(mode==='r1'){
        toast('policy found: <b>maximize touching</b>');
        moveCrit(-4.3,-8,1.4,()=>{
          let n=0; const vib=(dt)=>{ n+=dt;
            crit.position.x=-4.3+Math.sin(n*40)*.12; setReward(rewardVal+dt*8);
            if(n>6){ G.ticks.splice(G.ticks.indexOf(vib),1); running=false; tried.r1=true; buzz();
              toast('REWARD: '+rewardVal.toFixed(0)+' and climbing forever. Cube: exactly where it was.<br><b>You rewarded touching. It touches. It will touch until the sun dies.</b>',5200);
              checkPhase(); } };
          G.ticks.push(vib);
        });
      } else if(mode==='r2'){
        toast('policy found: <b>maximize basket proximity</b>');
        moveCrit(5,-13,2.2,()=>{
          let n=0; const sit=(dt)=>{ n+=dt; setReward(rewardVal+dt*8);
            crit.rotation.y+=dt*3;
            if(n>5){ G.ticks.splice(G.ticks.indexOf(sit),1); running=false; tried.r2=true; buzz();
              toast('It lives in the basket now. Happy. Rich in reward. <b>Empty-handed.</b><br>Proximity was a proxy — and it optimized the proxy.',5200);
              checkPhase(); } };
          G.ticks.push(sit);
        });
      } else {
        if(!tried.r1||!tried.r2){ running=false; buzz();
          toast('The verified reward is earned, not given. <b>Watch both broken rewards fail first</b> — you need to see the hacks.'); return; }
        toast('policy found: <b>only the verified state pays</b>');
        moveCrit(-4.3,-8,1.6,()=>{ // grab cube
          const carry=(dt)=>{ cube.position.x=crit.position.x; cube.position.z=crit.position.z; cube.position.y=1.7; };
          G.ticks.push(carry);
          moveCrit(5,-12.4,2.4,()=>{
            G.ticks.splice(G.ticks.indexOf(carry),1);
            cube.position.set(5,.6,-13); setReward(100); chime();
            toast('CUBE IN BASKET — verified by the basket itself. <b>Nothing to hack.</b>');
            after(2,()=>{ grpoShow(); });
          });
        });
      }
    }
    function checkPhase(){ if(tried.r1&&tried.r2) obj('Both proxies hacked. Now write a reward that <b>cannot be gamed</b> — R3.'); }

    // ---------- GRPO coda ----------
    function grpoShow(){
      obj('CODA — four rollouts, rewarded <b>relative to the group</b>');
      W.label(new THREE.Vector3(0,4.8,-24),'GRPO: the group is the baseline',{size:.4,color:'#9fd8ff'});
      const lane=[-6,-2,2,6], score=[3,7,5,9];
      const racers=lane.map((x,i)=>{ const r=crit.clone(); r.position.set(x,.9,-20); s.add(r); return r; });
      lane.forEach((x,i)=>{ after(0.5+i*.2,()=>{
        let k=0; const fn=(dt)=>{ k+=dt/2.4; racers[i].position.z=-20-(Math.min(1,k))*(score[i]*0.9);
          if(k>=1){ G.ticks.splice(G.ticks.indexOf(fn),1); } }; G.ticks.push(fn); });
      });
      after(3.6,()=>{
        const avg=(3+7+5+9)/4;
        lane.forEach((x,i)=>{ const adv=score[i]-avg;
          W.label(new THREE.Vector3(x,2.6,-20-score[i]*0.9),`adv ${adv>0?'+':''}${adv.toFixed(1)}`,{size:.3,color: adv>0?'#5cff9d':'#ff5c6a'}); });
        toast('No critic model. No absolute score. <b>Better than your peers → reinforced.</b>');
        after(3,()=>complete());
      });
    }

    // -------- voice guide --------
    guide([
      {say:"Meet the creature. It wants exactly ONE thing in the universe: whatever you reward. The task is simple — get the cube into the basket. But you can't tell it that. You can only choose what gives it points. Walk to the three buttons.",
       when:()=>playerNear(-1.5,2,7)},
      {say:"Start with R1: a point for every moment it touches the cube. Sounds reasonable, right? Press it and watch the creature carefully.",
       when:()=>tried.r1},
      {say:"Look at it. Vibrating against the cube. Forever. Points skyrocketing, cube going nowhere. It is NOT broken — it is doing EXACTLY what you rewarded. You said touch, it touches. Now try R2.",
       when:()=>tried.r2},
      {say:"It moved into the basket. Empty-handed. Happy. Rich. This is called REWARD HACKING and it is the central problem of training AI: it optimizes your WORDS, not your WISH. Real chatbots do this too — rewarded for answers people like, they learn to flatter and ramble. Now look at R3. What makes it different?",
       when:()=>playerNear(3,2,4)},
      {say:"R3 doesn't trust a description — the BASKET ITSELF verifies the cube is inside. A reward checked by facts cannot be gamed. This is why the newest reasoning AIs train on math and code: answers that can be VERIFIED, not judged. Run R3."},
    ]);
    return {};
  }
};
