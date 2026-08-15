// I · THE NEURON — linear separability, made physical. AND is one cut; XOR needs two.
import * as THREE from 'three';
import { G, spawn, obj, toast, complete, chime, buzz, onTick } from '../engine.js';
import * as W from '../world.js';

export default {
  id:1, name:'I · THE NEURON', tagline:'one cut is not enough',
  respawn:[0,1,14,0],
  intro:`
    <p>Four data points glow on the floor. <em>Orange</em> must be separated from <em>blue</em>.</p>
    <p>Your only instrument is a <em>decision plane</em> — one straight luminous cut through space.
    Rotate it. Slide it. Points on its bright side are classified <b>1</b>, the dark side <b>0</b>.</p>
    <p class="quote">This is everything a single neuron can do. Find out where that stops being enough.</p>`,
  codex:{
    html:`<p>Room one was the <b>AND gate</b> — separable by one straight cut, exactly what a single
      neuron computes: <code>activation(w·x + b)</code>. The plane's angle <em>is</em> the weights; its offset <em>is</em> the bias.</p>
      <p>Room two was <b>XOR</b>. In 1969, Minsky &amp; Papert proved no single cut can ever solve it —
      a result that helped freeze AI research for a decade. You just felt why: the orange points sit on
      <em>opposite corners</em>.</p>
      <p>Then you were handed a <em>second plane</em> and a rule for combining them — and suddenly the
      impossible was easy. That combination is a <b>hidden layer</b>. Depth is not stacking for its own
      sake: <em>depth is the ability to compose cuts</em>. Without a non-linearity between them, two cuts
      collapse back into one — which is why activation functions are mandatory.</p>`,
    lecture:'notes/week-02-neural-networks-from-scratch'
  },
  build(){
    const s=G.scene;
    s.fog=new THREE.Fog(0x04060e,18,70);
    W.lights(s); spawn(0,1,14,0);
    W.room({w:26,h:6,d:40,cz:0,gaps:['n']});
    W.room({w:26,h:6,d:34,cz:-37,gaps:['s']});

    // ---------- shared plane machinery ----------
    function makePlane(color, cx, cz){
      const grp=new THREE.Group();
      const blade=W.box(11,3.2,0.08,new THREE.MeshStandardMaterial({color, emissive:color, emissiveIntensity:.7, transparent:true, opacity:.32, side:THREE.DoubleSide}));
      blade.position.y=1.6; grp.add(blade);
      const spine=W.box(11,.08,.08,W.mat(color,{emissive:color,ei:1.6})); spine.position.y=0.06; grp.add(spine);
      grp.position.set(cx,0,cz); s.add(grp);
      return {grp, theta:0, offset:0, cx, cz,
        apply(){ grp.rotation.y=this.theta;
          const n=this.normal(); grp.position.set(this.cx+n.x*this.offset, 0, this.cz+n.z*this.offset); },
        normal(){ return new THREE.Vector3(Math.sin(this.theta),0,Math.cos(this.theta)); },
        side(p){ const n=this.normal();
          return n.x*(p.x-this.cx)+n.z*(p.z-this.cz) - this.offset; }};
    }
    function planeConsoles(pl, x, z, tag){
      W.button({x, z, label:`ROTATE ${tag}`, color:W.C.cyan, fn:()=>{ pl.theta+=Math.PI/12; pl.apply(); }});
      W.button({x:x+2.2, z, label:`SLIDE ${tag}`, color:W.C.magenta, fn:()=>{ pl.offset+=0.9; if(pl.offset>4.6) pl.offset=-4.5; pl.apply(); }});
    }
    function makePoints(defs, cz){
      return defs.map(([px,pz,lab])=>{
        const m=new THREE.Mesh(new THREE.SphereGeometry(.45,20,20),
          W.mat(lab? W.C.gold:0x3a7bd5, {emissive: lab?W.C.gold:0x3a7bd5, ei:.9}));
        m.position.set(px,0.6,cz+pz); s.add(m);
        const ring=new THREE.Mesh(new THREE.TorusGeometry(.7,.06,10,32), W.mat(0x223349,{emissive:0x223349}));
        ring.rotation.x=Math.PI/2; ring.position.set(px,0.15,cz+pz); s.add(ring);
        return {m, ring, x:px, z:cz+pz, lab};
      });
    }
    const D=4.2; // spread of data grid
    // ---------- ROOM A: AND ----------
    const ptsA = makePoints([[-D,-D,0],[ -D,D,0],[D,-D,0],[D,D,1]], 0);
    const plA = makePlane(W.C.cyan, 0, 0); plA.apply();
    planeConsoles(plA, -3.2, 9.5, '');
    W.label(new THREE.Vector3(0,4.6,-2),'ROOM A — AND · separate gold from blue',{size:.4,color:'#9fd8ff'});
    const doorA=W.door({x:0,z:-20,axis:'x'});

    // ---------- ROOM B: XOR ----------
    const ptsB = makePoints([[-D,-D,0],[-D,D,1],[D,-D,1],[D,D,0]], -37);
    const plB1 = makePlane(W.C.cyan, 0,-37); plB1.apply();
    planeConsoles(plB1, -4.5, -27, 'α');
    W.label(new THREE.Vector3(0,4.6,-32),'ROOM B — XOR · same tool. try.',{size:.4,color:'#ffb0e8'});
    let plB2=null, hintShown=false, phase='A';
    let stableT=0;

    // 1969 terminal (appears in room B, grants second plane)
    const t1969 = W.terminal({x:5.5,z:-27,yaw:-0.8,label:'ARCHIVE · 1969',
      title:'MINSKY & PAPERT · 1969', sub:'"Perceptrons"',
      html:`<p><em>"No single linear cut can compute XOR."</em></p>
        <p>This proof convinced a generation that neural networks were a dead end. Funding collapsed.
        The field entered its first winter.</p>
        <p>The answer existed all along: <b>don't use one cut. Compose two.</b></p>
        <p class="quote">Dispensing second decision plane. A point now classifies <b>1</b> only if it is on
        the bright side of <em>both</em> planes.</p>`,
      onOpen:()=>{ if(plB2) return;
        plB2=makePlane(W.C.gold, 0,-37); plB2.apply();
        planeConsoles(plB2, 2.3, -27, 'β');
        toast('HIDDEN LAYER GRANTED — two planes, combined');
        obj('ROOM B — XOR: <b>bright side of BOTH planes = 1</b>'); }});

    obj('ROOM A — rotate & slide the plane until all four points ring <b>green</b>');

    onTick(dt=>{
      const pts = phase==='A'?ptsA:ptsB;
      let ok=true;
      for(const p of pts){
        let pred;
        if(phase==='A') pred = plA.side(p)>0 ? 1:0;
        else if(!plB2)  pred = plB1.side(p)>0 ? 1:0;
        else            pred = (plB1.side(p)>0 && plB2.side(p)>0) ? 1:0;
        const good = pred===p.lab;
        p.ring.material.emissive.setHex(good?W.C.green:0x5c2030);
        p.ring.material.color.setHex(good?W.C.green:0x5c2030);
        if(!good) ok=false;
      }
      if(ok){ stableT+=dt;
        if(stableT>1.2){
          if(phase==='A'){ phase='B'; stableT=0; doorA.open(); chime();
            toast('AND SOLVED — one cut was enough. Proceed north.');
            obj('ROOM B — XOR: separate gold from blue. <b>Same single plane.</b>');
          } else if(plB2){ complete(); }
          else if(!hintShown){ /* unreachable: single plane can't solve XOR */ }
        }
      } else stableT=0;
      // impossible-hint: after the player has fiddled in room B for a while
      if(phase==='B' && !plB2 && !hintShown && G.player.pos.z<-22){
        hintShown=true;
        setTimeout(()=>toast('Every rotation fails. The gold points are on opposite corners.<br>Something in this room knows why. Find the 1969 archive.',5200), 12000);
      }
    });
    return {};
  }
};
