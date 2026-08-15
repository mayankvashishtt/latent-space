// THE ACADEMY — a walkable library of all 38 lessons, in plain words, with voice.
import * as THREE from 'three';
import { G, spawn, loadLevel, obj, guide, playerNear } from '../engine.js';
import * as W from '../world.js';
import { WINGS } from '../academy_data.js';

export default {
  id:10, name:'THE ACADEMY',
  tagline:'every lesson of the course, in plain words',
  respawn:[0,1,40,0],
  intro:`
    <p><b>Welcome to the Academy.</b> Every lesson of the full 38-lecture course lives here,
    rewritten in plain, everyday words.</p>
    <p>Five wings, in learning order. Walk to any glowing desk and press <code>E</code> —
    the voice will read the lesson to you.</p>
    <p class="quote">This place is always open. Come back whenever a chamber confuses you.</p>`,
  build(){
    const s=G.scene;
    s.background=new THREE.Color(0x060810);
    s.fog=new THREE.Fog(0x060810, 24, 90);
    W.lights(s,{amb:.5,sun:.5});
    spawn(0,1,40,0);

    // grand hall
    W.ground(64,110,{cz:-8,color:0x0c1220});
    for(const sx of [-32,32]){ const wall=W.box(0.8,10,110,W.mat(0x1a2436,{rough:.85})); wall.position.set(sx,5,-8); s.add(wall);
      G.colliders.push({min:new THREE.Vector3(sx-0.4,0,-63),max:new THREE.Vector3(sx+0.4,10,47),solid:true}); }
    const back=W.box(64,10,0.8,W.mat(0x1a2436,{rough:.85})); back.position.set(0,5,46); s.add(back);
    G.colliders.push({min:new THREE.Vector3(-32,0,45.6),max:new THREE.Vector3(32,10,46.4),solid:true});
    const front=W.box(64,10,0.8,W.mat(0x1a2436,{rough:.85})); front.position.set(0,5,-62); s.add(front);
    G.colliders.push({min:new THREE.Vector3(-32,0,-62.4),max:new THREE.Vector3(32,10,-61.6),solid:true});

    // warm light columns
    for(let i=0;i<5;i++){ const l=new THREE.PointLight(0xffd8a0, 8, 30); l.position.set(0,7,34-i*22); s.add(l); }

    // exit portal back to hub
    W.portalGate({x:0,z:42,name:'BACK TO THE BRAIN',sub:'return to the main hall',locked:false,done:false,fn:()=>loadLevel(0)});

    // ---- wings: one row per wing, desks along x ----
    let z=28;
    for(const wing of WINGS){
      const hex='#'+wing.color.toString(16).padStart(6,'0');
      W.label(new THREE.Vector3(0,6.4,z), wing.name, {size:.62,color:hex,bold:true});
      const strip=W.box(56,.06,.35,W.mat(wing.color,{emissive:wing.color,ei:.9})); strip.position.set(0,.08,z+2.2); s.add(strip);
      const n=wing.items.length;
      const perRow=Math.min(n,7);
      wing.items.forEach((it,i)=>{
        const row=Math.floor(i/perRow), col=i%perRow;
        const rowCount=Math.min(perRow, n-row*perRow);
        const x=(col-(rowCount-1)/2)*8;
        const dz=z-2-row*6.5;
        W.terminal({x, z:dz, label:it.t.split('·')[0].trim(), color:wing.color,
          title:it.t, sub:wing.name,
          html: it.b + `<p style="margin-top:14px;font-size:13px;color:#7fa8cc">Full notes →
            <a href="https://github.com/mayankvashishtt/ai-ml-bootcamp-archive/tree/main/${it.p}" target="_blank">${it.p}</a></p>`});
      });
      const rows=Math.ceil(n/perRow);
      z-=6.5*rows+9;
    }

    obj('THE ACADEMY — walk to any desk, press <b>E</b>, and listen · exit portal is behind you');
    guide([
      {who:'nova', say:"Welcome to the Academy. All thirty-eight lessons of the course live in this hall, rewritten in plain words. Five wings, in learning order — foundations first, extras at the far end. Walk to any glowing desk and press E, and I'll read it to you.",
       when:()=>G.player.pos.z<20},
      {who:'bit', say:"Nothing here is locked and nothing is timed, so browse like it's a bookshop. When you're done LISTENING and want to start DOING again, the exit ring takes you back to my brain. Don't track mud."},
    ]);

    return {};
  }
};
