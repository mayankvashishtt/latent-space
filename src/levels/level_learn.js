// I · THE LEARNING MACHINE — one journey, three acts:
//   Act 1: a neuron is one straight cut (AND)
//   Act 2: the cut that cannot exist (XOR, 1969, hidden layers)
//   Act 3: the floor opens — descend the loss landscape to learn the weights for real
import * as THREE from 'three';
import { G, spawn, obj, toast, complete, chime, buzz, blip, onTick, hudBar, guide, playerNear } from '../engine.js';
import * as W from '../world.js';
import { TEXT } from '../text.js';

const Y=24;                    // platform height — the valley of training waits below

export default {
  id:1, name:'I · THE LEARNING MACHINE', tagline:'cut · compose · descend',
  respawn:[0,Y+1,9,0],
  intro:TEXT[1].intro,
  codex:TEXT[1].codex,
  build(){
    const s=G.scene;
    s.fog=new THREE.Fog(0x05070f, 22, 90);
    W.lights(s,{amb:.5,sun:.55});
    spawn(0,Y+1,9,0);

    // ================= ACT 1 — THE CUT (AND) =================
    W.room({w:24,h:6,d:26,cz:-1,y:Y,gaps:['n'],accent:W.C.cyan});
    function makePlane(color, cx, cz){
      const grp=new THREE.Group();
      const blade=W.box(9,3.0,0.08,new THREE.MeshStandardMaterial({color, emissive:color, emissiveIntensity:.7, transparent:true, opacity:.32, side:THREE.DoubleSide}));
      blade.position.y=1.5; grp.add(blade);
      const spine=W.box(9,.09,.09,W.mat(color,{emissive:color,ei:1.6})); spine.position.y=0.06; grp.add(spine);
      const sideA=W.text('◄ GOLD SIDE',{size:.3,color:'#ffd257'}); sideA.position.set(0,3.4,1.0); grp.add(sideA);
      const sideB=W.text('BLUE SIDE ►',{size:.3,color:'#6ea8ff'}); sideB.position.set(0,3.4,-1.0); grp.add(sideB);
      grp.position.set(cx,Y,cz); s.add(grp);
      return {grp, theta:0, offset:0, cx, cz,
        apply(){ grp.rotation.y=this.theta;
          const n=this.normal(); grp.position.set(this.cx+n.x*this.offset, Y, this.cz+n.z*this.offset); },
        normal(){ return new THREE.Vector3(Math.sin(this.theta),0,Math.cos(this.theta)); },
        side(p){ const n=this.normal(); return n.x*(p.x-this.cx)+n.z*(p.z-this.cz) - this.offset; }};
    }
    function planeConsoles(pl, x, z, tag){
      W.button({x, z, y:Y, label:`ROTATE ${tag}`, color:W.C.cyan, fn:()=>{ pl.theta+=Math.PI/12; pl.apply(); }});
      W.button({x:x+2.2, z, y:Y, label:`SLIDE ${tag}`, color:W.C.magenta, fn:()=>{ pl.offset+=0.9; if(pl.offset>4.2) pl.offset=-4.2; pl.apply(); }});
    }
    function makePoints(defs, cz){
      return defs.map(([px,pz,lab])=>{
        const m=new THREE.Mesh(new THREE.SphereGeometry(.42,20,20),
          W.mat(lab? W.C.gold:0x3a7bd5, {emissive: lab?W.C.gold:0x3a7bd5, ei:.9}));
        m.position.set(px,Y+.55,cz+pz); s.add(m);
        const ring=new THREE.Mesh(new THREE.TorusGeometry(.66,.06,10,32), W.mat(0x223349,{emissive:0x223349}));
        ring.rotation.x=Math.PI/2; ring.position.set(px,Y+.12,cz+pz); s.add(ring);
        return {m, ring, x:px, z:cz+pz, lab};
      });
    }
    const D=3.6;
    // live decision-region overlay: tiles glow gold where the current cut(s) classify "gold"
    function buildZone(cx,cz,pred){
      const grp=new THREE.Group(); const tiles=[]; const R=6.2, STEP=0.92;
      const geo=new THREE.PlaneGeometry(0.84,0.84); geo.rotateX(-Math.PI/2);
      const matq=new THREE.MeshBasicMaterial({color:0xffd257,transparent:true,opacity:0.16,depthWrite:false});
      for(let x=-R;x<=R;x+=STEP) for(let z=-R;z<=R;z+=STEP){
        const q=new THREE.Mesh(geo,matq); q.position.set(cx+x,Y+0.08,cz+z); grp.add(q);
        tiles.push({q,x:cx+x,z:cz+z});
      }
      s.add(grp);
      return { update(){ for(const t of tiles) t.q.visible=!!pred(t); } };
    }
    const ptsA = makePoints([[-D,-D,0],[-D,D,0],[D,-D,0],[D,D,1]], -3);
    const plA = makePlane(W.C.cyan, 0, -3); plA.apply();
    planeConsoles(plA, -2.8, 7, '');
    const doorA=W.door({x:0,z:-14,y:Y,axis:'x'});

    // ---- STUCK? SHOW ME — animate the solution while narrating ----
    let solving=false;
    function animPlane(pl, thetaTo, offsetTo, dur, then){
      const t0=pl.theta, o0=pl.offset; let k=0;
      const fn=(dt)=>{ k+=dt/dur; const e=Math.min(1,k), sm=e*e*(3-2*e);
        pl.theta=t0+(thetaTo-t0)*sm; pl.offset=o0+(offsetTo-o0)*sm; pl.apply();
        if(e>=1){ G.ticks.splice(G.ticks.indexOf(fn),1); then&&then(); } };
      G.ticks.push(fn);
    }
    function solveAct1(){
      if(solving||phase!=='A') return; solving=true;
      toast('Watch the wall — and watch the gold glow follow it.',3200);
      animPlane(plA, Math.PI/4, 2.7, 3.2, ()=>{ solving=false;
        toast('The glow now covers ONLY the gold ball. One cut was enough — for THIS pattern.',4200); });
    }
    function solveAct2(){
      if(solving||phase!=='B') return; solving=true;
      if(!plB2){
        toast('First: the 1969 archive grants the second wall…',2600);
        plB2=makePlane(W.C.gold, 0,-28); plB2.apply();
        planeConsoles(plB2, 2.0, -19, 'β');
      }
      toast('Watch: both walls turn to the SAME diagonal, facing OPPOSITE ways…',3600);
      animPlane(plB1, Math.PI/4, -2.7, 3.2, ()=>{
        animPlane(plB2, Math.PI/4+Math.PI, -2.7, 3.2, ()=>{ solving=false;
          toast('See the glowing CORRIDOR between them? Both golds inside, both blues outside.<br><b>Two cuts made a shape one cut never could. That is a hidden layer.</b>',5600); });
      });
    }
    // H anywhere in this chamber = show me
    function flyToGoal(){
      toast('AUTO-DESCENT ENGAGED — converging…',3200);
      G.player.frozen=true;
      const from=G.player.pos.clone(); let k=0;
      const fn=(dt)=>{ k+=dt/4.5; const e=Math.min(1,k), sm=e*e*(3-2*e);
        const x=from.x+(0-from.x)*sm, z=from.z+(GOALZ-from.z)*sm;
        const h=(G.groundSampler&&G.groundSampler(x,z))??from.y;
        G.player.pos.set(x, Math.max(h, from.y+(h-from.y)*sm)+0.1, z);
        G.player.vel.set(0,0,0);
        G.player.yaw += (Math.atan2(x-0, z-GOALZ) - G.player.yaw)*0.1;
        if(e>=1){ G.ticks.splice(G.ticks.indexOf(fn),1); G.player.frozen=false; } };
      G.ticks.push(fn);
    }
    let lastShowT=0;
    function breadcrumbs(){
      const P=G.player.pos;
      toast('Gold lights mark the way — the beam is the goal.<br><b>Press H again to AUTO-FINISH this section.</b>',4600);
      const crumbs=[];
      for(let k=1;k<=12;k++){
        const t=k/12, x=P.x+(0-P.x)*t, z=P.z+(GOALZ-P.z)*t;
        const h=G.groundSampler? (G.groundSampler(x,z)??P.y) : P.y;
        const c=new THREE.Mesh(new THREE.SphereGeometry(.32,10,10),W.mat(W.C.gold,{emissive:W.C.gold,ei:1.8}));
        c.position.set(x,h+1.1,z); s.add(c); crumbs.push(c);
        const l=new THREE.PointLight(W.C.gold,4,8); l.position.copy(c.position); s.add(l); crumbs.push(l);
      }
      setTimeout(()=>crumbs.forEach(c=>s.remove(c)), 14000);
    }
    G.showMe=()=>{
      if(landed){ const now=performance.now();
        if(now-lastShowT<25000) flyToGoal();
        else { lastShowT=now; breadcrumbs(); } return; }
      if(phase==='A') solveAct1();
      else if(act<2.5) solveAct2();
      else toast('walk to the ledge past the gold door and <b>jump off</b> — then press H out there');
    };
    const mkShowBtn=(x,z,fn)=>{
      W.button({x,z,y:Y,label:'SHOW ME · or press H',color:W.C.green,fn});
      const c=W.beacon(x,Y+2.6,z,W.C.green,.38);
      W.label(new THREE.Vector3(x,Y+3.5,z),'STUCK?',{size:.4,color:'#5cff9d',bold:true});
    };
    mkShowBtn(4.8,7,solveAct1);
    mkShowBtn(6.2,-19,solveAct2);

    // ================= ACT 2 — THE IMPOSSIBLE CUT (XOR) =================
    W.room({w:24,h:6,d:26,cz:-28,y:Y,gaps:['s','n'],accent:W.C.magenta});
    const ptsB = makePoints([[-D,-D,0],[-D,D,1],[D,-D,1],[D,D,0]], -28);
    const plB1 = makePlane(W.C.cyan, 0,-28); plB1.apply();
    const zoneA=buildZone(0,-3, p=> plA.side(p)>0 );
    const zoneB=buildZone(0,-28, p=> plB2 ? (plB1.side(p)>0 && plB2.side(p)>0) : plB1.side(p)>0 );
    planeConsoles(plB1, -4.2, -19, 'α');
    let plB2=null, phase='A', stableT=0;
    W.terminal({x:8.5,z:-22,y:Y,yaw:-0.9,label:'ARCHIVE · 1969',
      title:'MINSKY & PAPERT · 1969', sub:'the proof that froze AI',
      html:`<p><em>"No single straight cut can compute XOR."</em></p>
        <p>This proof convinced the world neural networks were a dead end. Funding vanished.
        The field entered its first winter — over exactly the puzzle in front of you.</p>
        <p class="quote">Dispensing a second plane. New rule: a ball counts as GOLD only where the
        <b>gold glow of BOTH planes overlaps</b> — watch the glowing zone on the floor.</p>
        <p><b>The winning shape is a CORRIDOR:</b> make the two walls parallel along the diagonal,
        facing opposite ways, with both gold balls inside the strip between them.</p>`,
      onOpen:()=>{ if(plB2) return;
        plB2=makePlane(W.C.gold, 0,-28); plB2.apply();
        planeConsoles(plB2, 2.0, -19, 'β');
        toast('HIDDEN LAYER GRANTED — two planes, combined'); }});
    const doorB=W.door({x:0,z:-41,y:Y,axis:'x',color:W.C.gold});
    // exit ledge over the void
    W.ground(10,7,{y:Y,cz:-44.5});
    W.label(new THREE.Vector3(0,Y+3.4,-46),'⬇ THE VALLEY OF TRAINING ⬇',{size:.46,color:'#ffd257',bold:true});
    W.label(new THREE.Vector3(0,Y+1.6,-47.4),'JUMP OFF HERE',{size:.34,color:'#5cff9d',bold:true});
    { const edge=W.box(9,.12,.3,W.mat(W.C.green,{emissive:W.C.green,ei:1.6})); edge.position.set(0,Y+.06,-47.7); s.add(edge); }

    // ================= ACT 3 — DESCENT (the loss landscape) =================
    const TZC=-130;   // terrain z-center; region z in [-45,-215] — starts under the ledge
    const g2=(x,z,cx,cz,dep,sig)=> dep*Math.exp(-(((x-cx)**2+(z-cz)**2)/(2*sig*sig)));
    const H=(x,z)=>{ const zz=z-TZC;   // local coords centered at TZC
      return 16
      - g2(x,zz,  0,-52, 22, 15)
      - g2(x,zz,-28, 10, 12, 10)
      - g2(x,zz, 30,-10, 11,  9)
      + g2(x,zz,  6, 30,  5, 20)
      + Math.sin(x*0.25)*0.7 + Math.cos(zz*0.21)*0.7; };
    const SIZE=170, SEG=110;
    const geo=new THREE.PlaneGeometry(SIZE,SIZE,SEG,SEG); geo.rotateX(-Math.PI/2);
    const pos=geo.attributes.position;
    for(let k=0;k<pos.count;k++){ const x=pos.getX(k), z=pos.getZ(k)+TZC; pos.setY(k,H(x,z)); pos.setZ(k,z); }
    geo.computeVertexNormals();
    s.add(new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:0x11203a,roughness:.9,emissive:0x081226})));
    const wire=new THREE.Mesh(geo.clone(),new THREE.MeshBasicMaterial({color:0x2a5580,wireframe:true,transparent:true,opacity:.3}));
    wire.position.y+=0.04; s.add(wire);
    G.groundSampler=(x,z)=> (Math.abs(x)<SIZE/2 && z>TZC-SIZE/2 && z<TZC+SIZE/2)? H(x,z) : null;

    // gradient arrow
    const arrow=new THREE.Group();
    const shaft=W.box(.1,.1,1.6,W.mat(W.C.green,{emissive:W.C.green,ei:2})); shaft.position.z=-0.8;
    const tip=new THREE.Mesh(new THREE.ConeGeometry(.28,.6,10),W.mat(W.C.green,{emissive:W.C.green,ei:2}));
    tip.rotation.x=-Math.PI/2; tip.position.z=-1.8;
    arrow.add(shaft,tip); arrow.scale.set(1.7,1.7,1.7); arrow.visible=false; s.add(arrow);
    const arrowL=new THREE.PointLight(W.C.green,6,10); arrow.add(arrowL);

    // goal + decoys + pads
    const GOALZ=TZC-52;
    W.beacon(0,H(0,GOALZ)+1.4,GOALZ,W.C.gold,.8);
    { // beam of light — visible through the fog, always tells you WHERE
      const beam=new THREE.Mesh(new THREE.CylinderGeometry(.7,1.6,90,12,1,true),
        new THREE.MeshBasicMaterial({color:W.C.gold,transparent:true,opacity:.22,side:THREE.DoubleSide,depthWrite:false,fog:false}));
      beam.position.set(0,H(0,GOALZ)+45,GOALZ); s.add(beam);
      beam.userData.spin=.4; G.animated.push(beam);
      const gl=new THREE.PointLight(W.C.gold,30,60); gl.position.set(0,H(0,GOALZ)+6,GOALZ); s.add(gl);
    }
    W.label(new THREE.Vector3(0,H(0,GOALZ)+3.4,GOALZ),'GLOBAL MINIMUM',{size:.55,color:'#ffd257',bold:true});
    const mkDecoy=(x,zz,name)=>{ const z=TZC+zz;
      W.beacon(x,H(x,z)+1.2,z,W.C.red,.55);
      W.terminal({x:x+1.9,z,label:'CRYSTAL',title:name,sub:'loss = 2.31 — not zero',
        html:`<p>Flat in every direction. It FEELS like the bottom. It is not — a <b>local minimum</b>.</p>
        <p class="quote">The pink pad is <b>momentum</b>. Step on it.</p>`});
      const pad=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,.25,20),W.mat(W.C.magenta,{emissive:W.C.magenta,ei:1.2}));
      pad.position.set(x-2.2,H(x-2.2,z)+.15,z); s.add(pad);
      return {x:x-2.2,z};
    };
    const pads=[mkDecoy(-28,10,'LOCAL MINIMUM · A'), mkDecoy(30,-10,'LOCAL MINIMUM · B')];

    // budget + modes (activate on landing)
    let act=1, budget=1, mode=2, doneFlag=false, bar=null, lrBar=null, landed=false;
    const modeSet=m=>{ if(act<3) return; mode=m;
      G.player.friction = m===3?0.06:1; G.player.speedMul = m===1?0.5 : m===3?1.7 : 1;
      lrBar&&lrBar.set(m===1?0.2:m===2?0.55:1, `STEP MODE — ${m} · ${m===1?'CAREFUL':m===2?'NORMAL':'RECKLESS'}`);
      blip(m===3?200:m===1?900:600,.1,'triangle',.15); };
    const keyH=e=>{ if(e.code==='Digit1')modeSet(1); if(e.code==='Digit2')modeSet(2); if(e.code==='Digit3')modeSet(3); };
    addEventListener('keydown',keyH);

    obj('ACT 1 — move the wall of light: <b>gold on its GOLD side, blue on its BLUE side</b>');

    let lastY=null, stuckT=0;
    onTick(dt=>{
      if(act<3){ zoneA.update(); zoneB.update(); }
      if(phase==='B' && act<2.5){ stuckT+=dt;
        if(stuckT>75){ stuckT=-9999;
          toast('No shame in it — press <b>H</b> (or the green SHOW ME button) and watch the solution happen.',5200); } }
      // ----- classification feedback -----
      if(act<3){
        const pts = phase==='A'?ptsA:ptsB;
        let ok=true;
        for(const p of pts){
          let pred;
          if(phase==='A') pred = plA.side(p)>0?1:0;
          else if(!plB2)  pred = plB1.side(p)>0?1:0;
          else            pred = (plB1.side(p)>0 && plB2.side(p)>0)?1:0;
          const good=pred===p.lab;
          p.ring.material.emissive.setHex(good?W.C.green:0x5c2030);
          p.ring.material.color.setHex(good?W.C.green:0x5c2030);
          if(!good) ok=false;
        }
        if(ok){ stableT+=dt;
          if(stableT>1.2){
            stableT=0;
            if(phase==='A'){ phase='B'; doorA.open(); chime();
              obj('ACT 2 — same wall, new balls. <b>Try it.</b>'); }
            else if(plB2){ act=2.5; doorB.open(); chime();
              obj('ACT 3 — walk to the ledge and <b>step off</b> into the valley'); }
          }
        } else stableT=0;
      }
      // ----- detect the drop -----
      if(!landed && G.player.pos.z<-46 && G.player.pos.y<Y-4){
        landed=true; act=3;
        s.fog.near=8; s.fog.far=36;                      // foggy, but navigable
        bar=hudBar('compute','COMPUTE BUDGET'); bar.set(1);
        lrBar=hudBar('lr','STEP MODE — 2 · NORMAL'); lrBar.set(0.55);
        arrow.visible=true;
        G.waypoint={pos:new THREE.Vector3(0,H(0,GOALZ)+3,GOALZ), label:'GLOBAL MINIMUM'};
        obj('ACT 3 — follow the arrow to the <b>GLOBAL MINIMUM</b> · keys <b>1/2/3</b> = step size');
      }
      if(act<3) return;
      // ----- descent mechanics -----
      const P=G.player.pos;
      const e=0.6, gx=(H(P.x,P.z)!==null? (H(P.x+e,P.z)-H(P.x-e,P.z))/(2*e):0),
                   gz=(H(P.x,P.z+e)-H(P.x,P.z-e))/(2*e);
      const gl=Math.hypot(gx,gz);
      arrow.position.set(P.x,(G.groundSampler(P.x,P.z)??P.y)+0.25,P.z);
      if(gl>0.01) arrow.rotation.y=Math.atan2(gx,gz);
      arrow.visible = act===3 && gl>0.015;
      const moving=Math.hypot(G.player.vel.x,G.player.vel.z)>0.5;
      if(moving && landed){
        const up = lastY!==null && P.y>lastY+0.005;
        budget -= dt*(0.011 + (up?0.028:0))*(mode===1?0.7:mode===3?1.25:1);
        bar.set(budget);
        if(budget<=0){ buzz(); toast('COMPUTE EXHAUSTED — run re-initialized'); budget=1; bar.set(1);
          spawn(0,Y+1,-44,0); G.player.friction=1; G.player.speedMul=1; }
      }
      lastY=P.y;
      for(const p of pads){ if(!G.player.frozen && Math.hypot(P.x-p.x,P.z-p.z)<1.4 && G.player.onGround){
        const dir=new THREE.Vector3(0-P.x,0,GOALZ-P.z).normalize();
        G.player.vel.y=11; G.player.vel.x=dir.x*16; G.player.vel.z=dir.z*16;
        G.player.friction=0.02; blip(150,.4,'sawtooth',.2);
        setTimeout(()=>{ G.player.friction = mode===3?0.06:1; },1400);
        toast('MOMENTUM — carried beyond the bowl');
      }}
      if(!doneFlag && Math.hypot(P.x-0,P.z-GOALZ)<3.6){ doneFlag=true; G.waypoint=null;
        toast('LOSS ≈ 0.02 — converged'); setTimeout(()=>complete(),900); }
    });

    // ================= voice guide =================
    const _t0=plA.theta,_o0=plA.offset;
    const okA=()=>{let n=0;for(const p of ptsA){if((plA.side(p)>0?1:0)===p.lab)n++;}return n;};
    guide([
      {who:'nova', task:'Walk to the two glowing buttons ahead',
       say:"Welcome to the Learning Machine. See the gold and blue balls, and the wall of light between them? Walk down to the two buttons.",
       when:()=>playerNear(-1.8,7,4.5)},
      {who:'bit', task:'Press E on ROTATE — watch the wall and the rings',
       say:"That wall is one of MY brain cells — a neuron. It does exactly one thing: cuts the room in two. Gold side, blue side. Press E on ROTATE and watch the rings under the balls.",
       when:()=>plA.theta!==_t0||plA.offset!==_o0},
      {who:'nova', task:'Make all 4 rings GREEN — rotate & slide the wall',
       say:"Green ring means that ball is on the correct side, red means wrong. Get all four green. ROTATE turns the wall, SLIDE shifts it.",
       when:()=>okA()>=3},
      {who:'bit', task:'One ring left — keep adjusting',
       say:"Three green, one grumpy. Come on. Even my single brain cell believes in you.",
       when:()=>phase==='B'},
      {who:'nova', task:'ACT 2 — go north and try the same trick',
       say:"One straight cut was enough — for THAT pattern. Door's open. New room, new balls. Same wall. Go try.",
       when:()=>G.player.pos.z<-20 && (plB1.theta!==0||plB1.offset!==0)},
      {who:'bit', task:'Try every angle… then find the 1969 ARCHIVE terminal',
       say:"See the gold glow on the floor? That's everything your cut counts as gold — always one half of the room, whatever you do. But the gold balls are on OPPOSITE corners, so no half can ever hold both without a blue one. Someone proved that in 1969 and froze my whole field for a decade. There's an archive about it in this room — go press E on it.",
       when:()=>plB2!==null},
      {who:'nova', task:'Make a diagonal CORRIDOR: walls parallel, facing opposite ways, gold balls inside the glow',
       say:"Watch the floor — the gold glow shows exactly which area counts as gold right now. With two walls the glow is where BOTH gold sides overlap. Your target shape is a corridor: turn both walls to the same diagonal, facing opposite directions, so the glowing strip covers both gold balls and misses both blue ones.",
       when:()=>act>=2.5},
      {who:'bit', task:'Walk to the ledge and STEP OFF',
       say:"Beautiful. But here's the thing — YOU positioned those cuts by hand. I have billions of them. Nobody positions mine by hand. Want to feel how they actually get set? The gold door is open. Walk to the ledge... and step off. Trust me. Sort of.",
       when:()=>landed},
      {who:'nova', task:'Follow the green arrow DOWNHILL to the gold light',
       say:"Welcome to the valley of training. This whole landscape is made of MISTAKES — the height of the ground is how wrong the AI is. See that gold beam of light far ahead? That is the deepest valley — the best possible settings. The fog means you can never see the map, only the slope under your feet: the green arrow. It is called the gradient, and it is the ONLY sense a training run has. Follow it toward the beam.",
       when:()=>budget<0.94},
      {who:'bit', task:'Try step modes: press 3, then 1, then settle on 2',
       say:"Watch your compute budget — climbing costs triple. And try your step sizes: press 3 for reckless. Go on. I want you to feel what a too-big learning rate does.",
       when:()=>mode===3},
      {who:'nova', task:'Feel the slide… then press 2 and descend',
       say:"Slippery, isn't it! Fast — and you slide straight past everything. That's how training explodes. Press 2, settle down, and follow the arrow. Beware valleys that FEEL like the bottom: red crystal means trap, and the pink pad beside it — momentum — throws you out.",
       when:()=>doneFlag||pads.some(p=>playerNear(p.x,p.z,9))||playerNear(0,GOALZ,16)},
      {who:'bit', task:'Reach the GOLD crystal — the true minimum',
       say:"You're close to something. Red glow? Fake bottom, use the pad. Gold glow? That's the real minimum — the exact spot where my cuts land after training. Go touch it. You'll have done, by hand, what gradient descent does to me a billion times a day."},
    ]);

    return { dispose(){ removeEventListener('keydown',keyH); G.groundSampler=null; G.player.speedMul=1; G.player.friction=1; } };
  }
};
