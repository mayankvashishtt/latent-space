// II · DESCENT — you ARE gradient descent: fog-blind on a loss landscape, feeling for downhill.
import * as THREE from 'three';
import { G, spawn, obj, toast, complete, hudBar, onTick, buzz, blip, panel, guide, playerNear } from '../engine.js';
import * as W from '../world.js';
import { TEXT } from '../text.js';

export default {
  id:2, name:'II · DESCENT', tagline:'find the minimum you cannot see',
  respawn:[0,20,66,0],
  intro:TEXT[2].intro,
  codex:TEXT[2].codex,
  build(){
    const s=G.scene;
    s.fog=new THREE.Fog(0x05070f, 3, 16);          // heavy fog: local information only
    s.background=new THREE.Color(0x05070f);
    W.lights(s,{amb:.3,sun:.25});

    // ----- height function: one global min + two local minima -----
    const g2=(x,z,cx,cz,d,sig)=> d*Math.exp(-(((x-cx)**2+(z-cz)**2)/(2*sig*sig)));
    const H=(x,z)=> 20
      - g2(x,z,  0,-58, 24, 16)      // global minimum bowl (deep)
      - g2(x,z,-30,  8, 13, 10)      // local minimum A
      - g2(x,z, 34,-14, 12,  9)      // local minimum B
      + g2(x,z,  6, 20,  6, 22)      // broad hill
      + Math.sin(x*0.25)*0.7 + Math.cos(z*0.21)*0.7;

    // terrain mesh
    const SIZE=170, SEG=120;
    const geo=new THREE.PlaneGeometry(SIZE,SIZE,SEG,SEG); geo.rotateX(-Math.PI/2);
    const pos=geo.attributes.position;
    for(let i=0;i<pos.count;i++){ const x=pos.getX(i), z=pos.getZ(i); pos.setY(i, H(x,z)); }
    geo.computeVertexNormals();
    const terr=new THREE.Mesh(geo, new THREE.MeshStandardMaterial({color:0x0e1a2e, roughness:.9, metalness:.1,
      emissive:0x07101f, wireframe:false}));
    s.add(terr);
    const wire=new THREE.Mesh(geo.clone(), new THREE.MeshBasicMaterial({color:0x1d3f66, wireframe:true, transparent:true, opacity:.35}));
    wire.position.y+=0.03; s.add(wire);
    G.groundSampler=(x,z)=> (Math.abs(x)<SIZE/2&&Math.abs(z)<SIZE/2)? H(x,z) : null;

    spawn(0, H(0,66)+1, 66, Math.PI);

    // ----- gradient arrow at feet -----
    const arrow=new THREE.Group();
    const shaft=W.box(.1,.1,1.6,W.mat(W.C.green,{emissive:W.C.green,ei:2})); shaft.position.z=-0.8;
    const tip=new THREE.Mesh(new THREE.ConeGeometry(.28,.6,10),W.mat(W.C.green,{emissive:W.C.green,ei:2}));
    tip.rotation.x=-Math.PI/2; tip.position.z=-1.8;
    arrow.add(shaft,tip); s.add(arrow);

    // ----- goal + decoys -----
    const goal=W.beacon(0,H(0,-58)+1.4,-58,W.C.gold,.8);
    W.label(new THREE.Vector3(0,H(0,-58)+3.2,-58),'GLOBAL MINIMUM',{size:.5,color:'#ffd257'});
    const mkDecoy=(x,z,name)=>{
      W.beacon(x,H(x,z)+1.2,z,W.C.red,.55);
      W.terminal({x:x+1.8,z:z, label:'CRYSTAL', title:name, sub:'loss = 2.31 — not zero',
        html:`<p>The gradient here is flat in every direction. It <em>feels</em> like the bottom.
        It is not — this is a <b>local minimum</b>.</p>
        <p class="quote">The kick-pad beside you is <em>momentum</em>. Step on it.</p>`});
      // momentum kick pad
      const pad=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,.25,20),W.mat(W.C.magenta,{emissive:W.C.magenta,ei:1.2}));
      pad.position.set(x-2,H(x-2,z)+.15,z); s.add(pad);
      return {x:x-2,z};
    };
    const pads=[mkDecoy(-30,8,'LOCAL MINIMUM · A'), mkDecoy(34,-14,'LOCAL MINIMUM · B')];

    // ----- budget + LR modes -----
    let budget=1, mode=2;
    const bar=hudBar('compute','COMPUTE BUDGET');
    const lrBar=hudBar('lr','STEP MODE — 2 · NORMAL');
    lrBar.set(0.55);
    const modeSet=m=>{ mode=m; G.player.friction = m===3?0.06:1;
      G.player.speedMul = m===1?0.5 : m===3?1.7 : 1;
      lrBar.set(m===1?0.2:m===2?0.55:1, `STEP MODE — ${m} · ${m===1?'CAREFUL':m===2?'NORMAL':'RECKLESS'}`);
      blip(m===3?200:m===1?900:600,.1,'triangle',.15); };
    const keyHandler=e=>{ if(e.code==='Digit1')modeSet(1); if(e.code==='Digit2')modeSet(2); if(e.code==='Digit3')modeSet(3); };
    addEventListener('keydown',keyHandler);

    obj('Descend to the <b>GLOBAL MINIMUM</b> before compute runs out · <b>1/2/3</b> step modes');

    let lastY=null, doneFlag=false;
    onTick(dt=>{
      const P=G.player.pos;
      // gradient (numeric)
      const e=0.6, gx=(H(P.x+e,P.z)-H(P.x-e,P.z))/(2*e), gz=(H(P.x,P.z+e)-H(P.x,P.z-e))/(2*e);
      const gl=Math.hypot(gx,gz);
      arrow.position.set(P.x,H(P.x,P.z)+0.25,P.z);
      if(gl>0.01) arrow.rotation.y=Math.atan2(gx,gz); // face downhill (-grad)
      arrow.visible = gl>0.015;
      const sc=Math.min(1.6,.5+gl*1.2); arrow.scale.set(sc,sc,sc);

      const moving = Math.hypot(G.player.vel.x,G.player.vel.z)>0.5;

      // budget drain: uphill costs 3x
      if(moving){
        const up = lastY!==null && P.y>lastY+0.005;
        budget -= dt*(0.012 + (up?0.03:0))*(mode===1?0.7:mode===3?1.25:1);
        bar.set(budget);
        if(budget<=0){ buzz(); toast('COMPUTE EXHAUSTED — run re-initialized'); budget=1; bar.set(1);
          spawn(0,H(0,66)+1,66,Math.PI); }
      }
      lastY=P.y;

      // momentum pads: launch toward global min
      for(const p of pads){ if(!G.player.frozen && Math.hypot(P.x-p.x,P.z-p.z)<1.4 && G.player.onGround){
        const dir=new THREE.Vector3(0-P.x,0,-58-P.z).normalize();
        G.player.vel.y=11; G.player.vel.x=dir.x*16; G.player.vel.z=dir.z*16;
        const oldFric=G.player.friction; G.player.friction=0.02; blip(150,.4,'sawtooth',.2);
        setTimeout(()=>{ G.player.friction = mode===3?0.06:1; },1400);
        toast('MOMENTUM — carried beyond the bowl');
      }}

      // win
      if(!doneFlag && Math.hypot(P.x-0,P.z+58)<3.4){ doneFlag=true;
        toast('LOSS ≈ 0.02 — converged'); setTimeout(()=>complete(),900); }
    });


    // -------- voice guide --------
    guide([
      {say:"Dark, isn't it? This whole landscape is a map of MISTAKES — the higher the ground, the more wrong the AI is. Somewhere out there is the deepest valley. Look at your feet: the green arrow always points downhill. Take a few steps where it points.",
       when:()=>!playerNear(0,66,9)},
      {say:"Good. That arrow is called the GRADIENT — and it is the ONLY thing a real AI can sense while training. No map. No view. Just the slope underfoot. Now watch your energy bar as you walk: uphill drains it three times faster.",
       when:()=>budget<0.93},
      {say:"Energy is your compute budget — real training runs have one too. Now try your speed modes. Press 3.",
       when:()=>mode===3},
      {say:"Whoa — slippery! That is a learning rate that is too BIG: you move fast but slide right past the goal. This is exactly how real training explodes. Now press 1.",
       when:()=>mode===1},
      {say:"Careful mode: precise, but you would run out of budget before arriving. Too small a learning rate fails too — just slower. Press 2 and let's move.",
       when:()=>mode===2},
      {say:"Perfect. Follow the arrow downhill. One warning: some valleys FEEL like the bottom but are not — if you find a RED crystal, you are trapped in a fake valley. Look for the pink pad next to it: that is MOMENTUM, and it will throw you out.",
       when:()=>doneFlag || pads.some(p=>playerNear(p.x,p.z,9)) || playerNear(0,-58,16)},
      {say:"You're close to something. If it glows RED — fake bottom, use the pad. If it glows GOLD — that is the true minimum. Go touch it."},
    ]);
    return { dispose(){ removeEventListener('keydown',keyHandler); G.groundSampler=null; G.player.speedMul=1; G.player.friction=1; } };
  }
};
