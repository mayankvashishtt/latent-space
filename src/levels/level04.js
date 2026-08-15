// IV · EMBEDDING SPACE — meaning as geometry: file misplaced words, then RIDE king−man+woman.
import * as THREE from 'three';
import { G, spawn, obj, toast, complete, chime, buzz, onTick, hold, dropHeld, guide, playerNear } from '../engine.js';
import * as W from '../world.js';
import { TEXT } from '../text.js';

export default {
  id:3, name:'III · EMBEDDING SPACE', tagline:'meaning is a place',
  respawn:[0,1,30,0],
  intro:TEXT[3].intro,
  codex:TEXT[3].codex,
  build(){
    const s=G.scene;
    s.background=new THREE.Color(0x02030a);
    s.fog=new THREE.Fog(0x02030a,30,110);
    W.lights(s,{amb:.35,sun:.3});
    spawn(0,1,30,0);
    W.ground(90,90,{color:0x070d1a});

    // starfield
    const stg=new THREE.BufferGeometry(); const sp=new Float32Array(1200*3);
    for(let i=0;i<1200;i++){ sp[i*3]=(Math.random()-.5)*160; sp[i*3+1]=Math.random()*50+5; sp[i*3+2]=(Math.random()-.5)*160; }
    stg.setAttribute('position',new THREE.BufferAttribute(sp,3));
    s.add(new THREE.Points(stg,new THREE.PointsMaterial({color:0x3a5a8a,size:.25})));

    // ---------- clusters ----------
    const clusters={
      ANIMALS:{x:-24,z:-6,color:0x5cff9d,words:['cat','dog','wolf','horse']},
      VEHICLES:{x:24,z:-6,color:0x54e0ff,words:['car','truck','train','boat']},
      ROYALTY:{x:0,z:-30,color:0xffd257,words:['king','queen','prince','throne']},
      FOOD:{x:0,z:8,color:0xff9d5c,words:['bread','apple','soup','rice']},
    };
    for(const [name,cl] of Object.entries(clusters)){
      W.label(new THREE.Vector3(cl.x,6,cl.z),name,{size:.5,color:'#'+cl.color.toString(16).padStart(6,'0')});
      const ring=new THREE.Mesh(new THREE.TorusGeometry(7,.07,8,64),W.mat(cl.color,{emissive:cl.color,ei:.5}));
      ring.rotation.x=Math.PI/2; ring.position.set(cl.x,.1,cl.z); s.add(ring);
      cl.words.forEach((wd,i)=>{
        const a=i/cl.words.length*Math.PI*2;
        const t=W.text(wd,{size:.55,color:'#cfe6ff'});
        t.position.set(cl.x+Math.cos(a)*4.2, 2.2+Math.sin(i*2.1)*.5, cl.z+Math.sin(a)*4.2); s.add(t);
      });
    }
    // date blob (foreshadow)
    const dates=['2024-09-15','2024-03-22','1999-01-01'];
    dates.forEach((d,i)=>{ const t=W.text(d,{size:.34,color:'#7a8aa5'});
      t.position.set(-2+i*0.5, 2.0+i*0.35, 26); t.userData.baseY=t.position.y; t.userData.bob=.06+i*.02; G.animated.push(t); s.add(t); });
    W.label(new THREE.Vector3(-1,4,26),'??? — every date is the same word here',{size:.28,color:'#5f6f88'});

    // ---------- task 1: misplaced words ----------
    const misplaced=[
      {word:'puppy', from:{x:24,z:2}, home:'ANIMALS'},
      {word:'bus',   from:{x:-24,z:2},home:'VEHICLES'},
      {word:'cake',  from:{x:3,z:-24},home:'FOOD'},
    ];
    let filed=0, carrying=null, pickedOnce=false;
    misplaced.forEach(mp=>{
      const t=W.text(mp.word,{size:.6,color:'#ff5c6a',bold:true});
      t.position.set(mp.from.x,1.8,mp.from.z); t.userData.baseY=1.8; t.userData.bob=.15; G.animated.push(t); s.add(t);
      t.userData.interact={prompt:`pick up "${mp.word}" (it doesn't belong here)`, fn:()=>{
        if(carrying){ toast('already carrying a word'); return; }
        carrying=mp; hold(t); pickedOnce=true;
        const ix=G.interactables.indexOf(t); if(ix>=0)G.interactables.splice(ix,1);
        obj(`carry <b>"${mp.word}"</b> to the cluster where it belongs · press E near the right ring`);
      }};
      G.interactables.push(t); mp.sprite=t;
    });
    obj('THREE WORDS ARE MISFILED — carry each to the cluster where it <b>means</b> something');

    onTick(()=>{
      if(!carrying) return;
      // drop check near any cluster
      if(G.keys['KeyE'] && !G.player.frozen){
        G.keys['KeyE']=false;
        for(const [name,cl] of Object.entries(clusters)){
          if(Math.hypot(G.player.pos.x-cl.x,G.player.pos.z-cl.z)<7.5){
            if(name===carrying.home){
              const spm=carrying.sprite; dropHeld();
              spm.material.color=new THREE.Color(0xcfe6ff);
              spm.position.set(cl.x+(Math.random()-.5)*4, 2.2, cl.z+(Math.random()-.5)*4);
              spm.userData.baseY=2.2; s.add(spm);
              filed++; carrying=null; chime();
              toast(`"${spm===null?'':''}${name}" accepts the word — distance is meaning. ${filed}/3 filed`);
              if(filed===3){ obj('ALL FILED — a platform has risen on <b>KING</b>. Board it.'); buildRide(); }
              else obj('carry the remaining misfiled words home');
            } else { buzz(); toast(`This cluster rejects it — wrong neighborhood of meaning.`); }
            return;
          }
        }
        toast('no cluster near enough');
      }
    });

    // ---------- task 2: vector ride ----------
    function buildRide(){
      const R=clusters.ROYALTY;
      const plat=new THREE.Mesh(new THREE.CylinderGeometry(2.2,2.4,.5,12),W.mat(W.C.gold,{emissive:W.C.gold,ei:.7}));
      plat.position.set(R.x-4.2,0.25,R.z); s.add(plat);
      const platCol=G.colliders[G.colliders.push({min:new THREE.Vector3(R.x-6.4,0,R.z-2.2),max:new THREE.Vector3(R.x-2,0.5,R.z+2.2),solid:true})-1];
      W.label(new THREE.Vector3(R.x-4.2,2.6,R.z),'THE KING PLATFORM',{size:.4,color:'#ffd257'});

      let seq=[], riding=false;
      const target=['−MAN','+WOMAN'];
      const opts=[['−MAN',W.C.cyan],['+WOMAN',W.C.magenta],['+PLURAL',0x8a9dc0],['−ROYAL',0x8a9dc0]];
      opts.forEach(([lb,color],i)=>{
        W.button({x:R.x-8+i*2.4, z:R.z+5.5, label:lb, color, fn:()=>{
          if(riding) return;
          seq.push(lb); toast(`vector chosen: KING ${seq.join(' ')}`);
          if(seq.length===2){
            riding=true;
            const good = seq[0]===target[0]&&seq[1]===target[1];
            // animate the platform carrying the player
            const from={x:R.x-4.2,z:R.z};
            const to = good? {x:R.x, z:R.z-12} : {x:R.x-4.2+(Math.random()*20-10), z:R.z+14};
            const T=2.6; let t=0;
            const rideTick=(dt)=>{
              t+=dt/T; const k=Math.min(1,t), e=1-Math.pow(1-k,3);
              const nx=from.x+(to.x-from.x)*e, nz=from.z+(to.z-from.z)*e;
              plat.position.x=nx; plat.position.z=nz;
              platCol.min.set(nx-2.2,0,nz-2.2); platCol.max.set(nx+2.2,0.5,nz+2.2);
              // carry player if standing on it
              if(Math.hypot(G.player.pos.x-nx,G.player.pos.z-nz)<2.6 && G.player.pos.y<1.2){
                G.player.pos.x=nx; G.player.pos.z=nz; }
              if(k>=1){ G.ticks.splice(G.ticks.indexOf(rideTick),1);
                if(good){ chime(); toast('ARRIVED: <b>QUEEN</b> — the gender direction is the same vector everywhere.');
                  const q=W.beacon(to.x,2.2,to.z,W.C.gold,.7);
                  W.label(new THREE.Vector3(to.x,4,to.z),'QUEEN',{size:.7,color:'#ffd257',bold:true});
                  setTimeout(()=>complete(),1600);
                } else { buzz(); toast('You drifted into the void between meanings. Resetting.',3000);
                  setTimeout(()=>{ plat.position.set(from.x,0.25,from.z);
                    platCol.min.set(from.x-2.2,0,from.z-2.2); platCol.max.set(from.x+2.2,0.5,from.z+2.2);
                    seq=[]; riding=false; },1600); }
              }
            };
            G.ticks.push(rideTick);
          }
        }});
      });
      W.label(new THREE.Vector3(R.x-5.5,3.6,R.z+5.5),'CHOOSE TWO VECTORS · KING _ _ = ?',{size:.34,color:'#9fd8ff'});
    }

    // -------- voice guide --------
    guide([
      {who:'nova', say:"Welcome to the prettiest place in the whole brain — the map of meaning. Every word Bit knows lives here as a location. Animals cluster over there, vehicles there, food there. Go walk toward any glowing circle.",
       when:()=>playerNear(-24,-6,10)||playerNear(24,-6,10)||playerNear(0,8,10)||playerNear(0,-30,12)},
      {who:'bit', say:"It's my filing system, and SOMEONE — not naming names — misfiled three words. They're glowing red. Find one and press E to pick it up.",
       when:()=>pickedOnce},
      {who:'nova', say:"Got it! Now carry it to the circle where its MEANING belongs. Stand inside the ring and press E to drop it. The circle will judge for itself.",
       when:()=>filed>=1},
      {who:'bit', say:"Accepted. Notice it didn't care about spelling — only about the neighborhood. Puppy lives near dog because of what it MEANS. That's how I store everything. Two more, please. My filing anxiety is real.",
       when:()=>filed>=3},
      {who:'nova', say:"All filed! Now for my favorite trick in all of AI. A platform just rose on the word KING. Go stand on it.",
       when:()=>playerNear(-4.2,-30,3.5)},
      {who:'bit', say:"Because meanings are positions, you can do MATH on them. King, minus man, plus woman, equals... well. Pick exactly those two vectors with the buttons. Pick wrong and you'll drift into the void between meanings. It's fine. Probably."},
    ]);
    return {};
  }
};
