// LATENT SPACE — shared world-building toolkit.
import * as THREE from 'three';
import { G, addCollider, interact, panel, tween, blip, whoosh } from './engine.js';

export const C = { cyan:0x54e0ff, magenta:0xff4fd8, gold:0xffd257, green:0x5cff9d, red:0xff5c6a,
                   deep:0x0a1020, steel:0x18243a, dark:0x0d1526 };

export function mat(color, {emissive=0x000000, ei=1, rough=0.55, metal=0.25}={}){
  return new THREE.MeshStandardMaterial({color, emissive, emissiveIntensity:ei, roughness:rough, metalness:metal});
}
export function box(w,h,d,m){ return new THREE.Mesh(new THREE.BoxGeometry(w,h,d), m); }

export function lights(scene,{amb=0.45, sun=0.8, sunPos=[10,30,10]}={}){
  scene.add(new THREE.HemisphereLight(0x8fb8ff, 0x0a0f1e, amb));
  const d=new THREE.DirectionalLight(0xcfe4ff, sun); d.position.set(...sunPos); scene.add(d);
}

export function ground(w,d,{y=0,color=C.dark,cx=0,cz=0,grid=true}={}){
  const g = box(w,0.5,d, mat(color,{rough:.85}));
  g.position.set(cx,y-0.25,cz); G.scene.add(g); addCollider(g);
  if(grid){
    const gh = new THREE.GridHelper(Math.max(w,d), Math.round(Math.max(w,d)/2), 0x2a5580, 0x18304c);
    gh.position.set(cx,y+0.02,cz); G.scene.add(gh);
  }
  return g;
}

export function room({w=20,h=6,d=20,cx=0,cz=0,y=0,color=C.steel,gaps=[],accent=C.cyan,decor=true}={}){
  ground(w,d,{y,cx,cz});
  const wallM = mat(color,{rough:.8,emissive:0x0a1626,ei:.35});
  const mk=(ww,dd,x,z)=>{ const m=box(ww,h,dd,wallM); m.position.set(x,y+h/2,z); G.scene.add(m); addCollider(m); return m; };
  if(!gaps.includes('n')) mk(w,0.6, cx, cz-d/2);
  if(!gaps.includes('s')) mk(w,0.6, cx, cz+d/2);
  if(!gaps.includes('w')) mk(0.6,d, cx-w/2, cz);
  if(!gaps.includes('e')) mk(0.6,d, cx+w/2, cz);
  if(decor){
    // glowing corner columns
    for(const [px,pz] of [[cx-w/2+1,cz-d/2+1],[cx+w/2-1,cz-d/2+1],[cx-w/2+1,cz+d/2-1],[cx+w/2-1,cz+d/2-1]]){
      const col=new THREE.Mesh(new THREE.CylinderGeometry(.28,.38,h,8), mat(0x101a2c,{emissive:accent,ei:.35,rough:.4}));
      col.position.set(px,y+h/2,pz); G.scene.add(col);
      const cap=new THREE.Mesh(new THREE.SphereGeometry(.32,10,10), mat(accent,{emissive:accent,ei:1.4}));
      cap.position.set(px,y+h+.2,pz); G.scene.add(cap);
    }
    // floor edge trim
    const trim=(ww,dd,x,z)=>{ const t=box(ww,.08,dd,mat(accent,{emissive:accent,ei:1.1})); t.position.set(x,y+.05,z); G.scene.add(t); };
    trim(w-1,.14, cx, cz-d/2+.6); trim(w-1,.14, cx, cz+d/2-.6);
    trim(.14,d-1, cx-w/2+.6, cz); trim(.14,d-1, cx+w/2-.6, cz);
    // warm room light
    const rl=new THREE.PointLight(0xbcd8ff, 10, Math.max(w,d)*1.4); rl.position.set(cx,y+h-0.8,cz); G.scene.add(rl);
    // floating shards
    for(let k=0;k<5;k++){
      const sh=new THREE.Mesh(new THREE.TetrahedronGeometry(.22+Math.random()*.2),
        mat(accent,{emissive:accent,ei:1.1}));
      sh.position.set(cx+(Math.random()-.5)*(w-4), y+h-1.2-Math.random()*1.6, cz+(Math.random()-.5)*(d-4));
      sh.userData.spin=.5+Math.random(); sh.userData.baseY=sh.position.y; sh.userData.bob=.15;
      G.animated.push(sh); G.scene.add(sh);
    }
  }
}

// canvas-texture text sprite
export function text(str,{size=0.5, color='#bfe8ff', bold=false, glow=true}={}){
  const cv=document.createElement('canvas'); const s=64;
  const ctx=cv.getContext('2d'); ctx.font=`${bold?'700':'400'} ${s}px "Segoe UI", sans-serif`;
  const wpx=Math.ceil(ctx.measureText(str).width)+40;
  cv.width=wpx; cv.height=s+40;
  const c2=cv.getContext('2d'); c2.font=ctx.font; c2.textBaseline='middle';
  if(glow){ c2.shadowColor=color; c2.shadowBlur=18; }
  c2.fillStyle=color; c2.fillText(str,20,cv.height/2);
  const tx=new THREE.CanvasTexture(cv); tx.anisotropy=4;
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tx,transparent:true,depthWrite:false}));
  sp.scale.set(size*wpx/s, size*cv.height/s, 1);
  return sp;
}
export function label(pos,str,opts={}){ const t=text(str,opts); t.position.copy(pos); G.scene.add(t); return t; }

export function pillar(x,z,{h=2.6,r=0.5,color=C.steel,emissive=0,y=0}={}){
  const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r*1.15,h,8), mat(color,{emissive,ei:.9}));
  m.position.set(x,y+h/2,z); G.scene.add(m); addCollider(m); return m;
}

export function crystal(color=C.cyan, s=0.5){
  const m=new THREE.Mesh(new THREE.OctahedronGeometry(s), mat(color,{emissive:color, ei:1.6, rough:.2}));
  m.userData.spin=1.2; G.animated.push(m); return m;
}
export function beacon(x,y,z,color=C.cyan,s=0.5){
  const c=crystal(color,s); c.position.set(x,y,z); c.userData.baseY=y; c.userData.bob=0.12;
  G.scene.add(c);
  const l=new THREE.PointLight(color, 6, 12); l.position.set(x,y,z); G.scene.add(l);
  return c;
}

export function terminal({x,z,yaw=0, y=0, label:lb='TERMINAL', title='', sub='', html='', onOpen=null, color=C.cyan}={}){
  const grp=new THREE.Group();
  const base=box(0.9,1.1,0.5, mat(C.steel)); base.position.y=0.55;
  const scr=box(1.15,0.8,0.08, mat(0x061423,{emissive:color, ei:.55})); scr.position.set(0,1.55,0); scr.rotation.x=-0.25;
  grp.add(base,scr); grp.position.set(x,y,z); grp.rotation.y=yaw;
  G.scene.add(grp); addCollider(grp);
  const t=text(lb,{size:.28,color:'#7fd8ff'}); t.position.set(x,y+2.25,z); G.scene.add(t);
  interact(grp, lb, ()=>{ panel({title,sub,html,buttons:[{label:'Close',primary:true, fn:onOpen||undefined}]}); if(onOpen&&!html) onOpen(); });
  return grp;
}

export function button({x,z,y=0,label:lb='ACTIVATE',color=C.cyan,fn,small=false}={}){
  const grp=new THREE.Group();
  const ped=box(small?0.5:0.7, 1.0, small?0.5:0.7, mat(C.steel)); ped.position.y=0.5;
  const btn=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.26,0.14,16), mat(color,{emissive:color, ei:1.2}));
  btn.position.y=1.08; grp.add(ped,btn);
  grp.position.set(x,y,z); G.scene.add(grp); addCollider(grp);
  const t=text(lb,{size:.22,color:'#9fe0ff'}); t.position.set(x,y+1.7,z); G.scene.add(t);
  interact(grp, lb, ()=>fn&&fn(grp));
  return {grp, btn, txt:t, setLabel(s){ t.material.map.dispose(); const nt=text(s,{size:.22,color:'#9fe0ff'}); nt.position.copy(t.position); G.scene.remove(t); G.scene.add(nt); Object.assign(t,{material:nt.material,scale:nt.scale}); G.scene.remove(nt); G.scene.add(t); }};
}

export function door({x,z,y=0,w=3.4,h=3.6,axis='x',color=C.magenta}={}){
  const m = axis==='x' ? box(w,h,0.5, mat(C.deep,{emissive:color, ei:.5}))
                       : box(0.5,h,w, mat(C.deep,{emissive:color, ei:.5}));
  m.position.set(x,y+h/2,z); G.scene.add(m);
  const col=addCollider(m);
  const st={mesh:m, isOpen:false,
    open(){ if(st.isOpen) return; st.isOpen=true; whoosh();
      tween(m.position,'y', y-h+0.1, 1.1, ()=>{}); setTimeout(()=>col.remove(), 400); },
    close(){ st.isOpen=false; tween(m.position,'y', y+h/2, 0.8); G.colliders.includes(col)||G.colliders.push(col); col.refresh&&setTimeout(()=>col.refresh(),900); }};
  return st;
}

export function portalGate({x,z,name,sub='',locked=false,done=false,fn}={}){
  const color = done?C.gold : locked?0x3a4a60 : C.cyan;
  const ring=new THREE.Mesh(new THREE.TorusGeometry(1.7,0.14,12,48), mat(color,{emissive:color, ei: locked?0.15:1.2}));
  ring.position.set(x,2.2,z); G.scene.add(ring);
  ring.userData.spin= locked?0.15:0.7; G.animated.push(ring);
  const core=new THREE.Mesh(new THREE.CircleGeometry(1.45,32),
    new THREE.MeshBasicMaterial({color, transparent:true, opacity:locked?0.05:0.22, side:THREE.DoubleSide}));
  core.position.set(x,2.2,z); G.scene.add(core);
  const t1=text(name,{size:.42,color: done?'#ffd257': locked?'#4a617d':'#bfe8ff', bold:true}); t1.position.set(x,4.6,z); G.scene.add(t1);
  if(sub){ const t2=text(sub,{size:.24,color:'#6f93b5'}); t2.position.set(x,4.05,z); G.scene.add(t2); }
  const st=text(done?'✓ COMPLETE':locked?'LOCKED':'ENTER',{size:.26,color: done?'#ffd257':locked?'#44586e':'#54e0ff'});
  st.position.set(x,0.55,z); G.scene.add(st);
  const hit=box(3.4,4.5,1.2,new THREE.MeshBasicMaterial({visible:false})); hit.position.set(x,2.2,z); G.scene.add(hit);
  if(!locked && fn) interact(hit, done?'re-enter '+name:'enter '+name, fn);
  if(!locked && !done){
    // beacon beam: "you are going HERE next"
    const beam=new THREE.Mesh(new THREE.CylinderGeometry(.28,.55,26,10,1,true),
      new THREE.MeshBasicMaterial({color, transparent:true, opacity:.14, side:THREE.DoubleSide, depthWrite:false}));
    beam.position.set(x,13,z); G.scene.add(beam);
    beam.userData.spin=0.5; G.animated.push(beam);
  }
  return ring;
}

export function stream({count=400, area=[60,10,120], dir=[0,0,1], speed=6, color=C.cyan, cx=0, cy=5, cz=0}={}){
  const geo=new THREE.BufferGeometry();
  const pos=new Float32Array(count*3);
  for(let i=0;i<count;i++){ pos[i*3]=cx+(Math.random()-.5)*area[0]; pos[i*3+1]=cy+(Math.random()-.5)*area[1]; pos[i*3+2]=cz+(Math.random()-.5)*area[2]; }
  geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
  const pts=new THREE.Points(geo, new THREE.PointsMaterial({color, size:.14, transparent:true, opacity:.7}));
  G.scene.add(pts);
  const d=new THREE.Vector3(...dir).normalize();
  return { pts, update(dt){ const a=geo.attributes.position.array;
      for(let i=0;i<count;i++){ a[i*3]+=d.x*speed*dt; a[i*3+1]+=d.y*speed*dt; a[i*3+2]+=d.z*speed*dt;
        if(Math.abs(a[i*3+2]-cz)>area[2]/2) a[i*3+2]=cz-Math.sign(d.z||1)*area[2]/2;
        if(Math.abs(a[i*3]-cx)>area[0]/2) a[i*3]=cx-Math.sign(d.x||1)*area[0]/2; }
      geo.attributes.position.needsUpdate=true; } };
}

// carryable orb/scroll factory
export function carryable(meshMaker, {x,z,y=1,prompt='pick up',onPick}={}){
  const m=meshMaker(); m.position.set(x,y,z); m.userData.baseY=y; m.userData.bob=.1; G.animated.push(m); G.scene.add(m);
  interact(m, prompt, ()=>{ onPick&&onPick(m); });
  return m;
}
