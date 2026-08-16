// III · THE TOKENIZER — run BPE by hand, then hit the strawberry wall.
import * as THREE from 'three';
import { G, spawn, obj, toast, complete, chime, buzz, onTick, hold, dropHeld, guide, playerNear, insight, after } from '../engine.js';
import * as W from '../world.js';
import { TEXT } from '../text.js';

export default {
  id:2, name:'II · THE TOKENIZER', tagline:'what the model sees',
  respawn:[0,1,14,0],
  intro:TEXT[2].intro,
  codex:TEXT[2].codex,
  build(){
    const s=G.scene;
    s.fog=new THREE.Fog(0x04060e,18,60);
    W.lights(s); spawn(0,1,14,0);
    W.room({w:34,h:6,d:34,cz:0,gaps:['n']});
    W.room({w:26,h:7,d:30,cz:-33,gaps:['s']});

    // ---------------- ROOM A: BPE ----------------
    let seq='low lower lowest'.split('').map(ch=>ch===' '?'·':ch); // tokens as chars, '·' = space marker
    let tiles=[], bridges=[];
    const tileY=1.7, span=()=> (seq.length-1)*1.9;

    function layout(){
      tiles.forEach(t=>{ s.remove(t.grp); s.remove(t.lbl); });
      bridges.forEach(b=>{ s.remove(b.m); }); bridges=[]; tiles=[];
      const x0=-span()/2;
      seq.forEach((tok,i)=>{
        const w=Math.max(1.2,0.55*tok.length+0.6);
        const grp=W.box(w,1.2,0.35, W.mat(tok==='·'?0x22364e:W.C.deep,{emissive:tok==='·'?0x22364e:0x1a5a7a, ei:.8}));
        grp.position.set(x0+i*1.9, tileY, -4); s.add(grp);
        const lbl=W.text(tok==='·'?'␣':tok,{size:.55,color:'#bfe8ff',bold:true});
        lbl.position.set(x0+i*1.9, tileY+1.1, -4); s.add(lbl);
        tiles.push({grp,lbl,tok,i});
      });
      // merge handles between adjacent non-space pairs
      for(let i=0;i<seq.length-1;i++){
        if(seq[i]==='·'||seq[i+1]==='·') continue;
        const m=new THREE.Mesh(new THREE.SphereGeometry(.22,12,12),W.mat(W.C.magenta,{emissive:W.C.magenta,ei:1.1}));
        m.position.set(-span()/2+i*1.9+0.95, tileY-1.0, -4); s.add(m);
        const pair=seq[i]+seq[i+1];
        m.userData.pair=[i,pair];
        bridges.push({m, i, pair});
      }
      bridges.forEach(b=>{
        const {m,i,pair}=b;
        m.userData.interact={prompt:`merge "${pair}"`, fn:()=>attempt(i,pair)};
        G.interactables.push(m);
      });
    }
    function counts(){
      const c={};
      for(let i=0;i<seq.length-1;i++){ if(seq[i]==='·'||seq[i+1]==='·') continue;
        const p=seq[i]+seq[i+1]; c[p]=(c[p]||0)+1; }
      return c;
    }
    let merges=0;
    const scoreLbl=W.label(new THREE.Vector3(0,5,-4),'MERGES 0 / 3',{size:.45,color:'#9fd8ff'});
    function attempt(i,pair){
      const c=counts(); const best=Math.max(...Object.values(c));
      if(c[pair]===best){
        // merge every occurrence of this pair
        const out=[]; let k=0;
        while(k<seq.length){
          if(k<seq.length-1 && seq[k]!=='·'&&seq[k+1]!=='·' && seq[k]+seq[k+1]===pair){ out.push(pair); k+=2; }
          else { out.push(seq[k]); k++; }
        }
        seq=out; merges++;
        if(merges===1) after(1.0,()=>insight('You just built a token', `
          <p>That glued pair is now <b>one token</b> — one "word" in the machine's private language.
          And the rule you followed is the ENTIRE algorithm: <em>count every neighboring pair,
          glue the most frequent one, repeat.</em> It's called Byte-Pair Encoding, and this exact
          rule, run millions of times over the whole internet, built ChatGPT's vocabulary.</p>
          <p><b>Why chunks at all?</b> A computer needs a fixed list of parts. Whole words? English
          alone has 170,000+ — too many, and new slang breaks it. Single letters? Then "understanding"
          takes 13 painful steps to read. Chunks are the perfect middle: common words become ONE chunk,
          rare words split into familiar pieces, and NOTHING is ever unreadable.</p>
          <p><b>The strange part:</b> nobody chooses the chunks. Counting does. That's why real AI
          tokens look weird — "artificial" splits into "art·ificial", which makes no sense to a human.
          Frequency doesn't care about meaning. Keep gluing — two more.</p>`));
        toast(`MERGED "${pair}" ×${c[pair]} — new token added to vocabulary`);
        scoreLbl.material.map.dispose();
        const nl=W.text(`MERGES ${merges} / 3`,{size:.45,color:'#9fd8ff'}); scoreLbl.material=nl.material; scoreLbl.scale.copy(nl.scale);
        // clear old interactables of bridges
        bridges.forEach(b=>{ const ix=G.interactables.indexOf(b.m); if(ix>=0)G.interactables.splice(ix,1); });
        layout();
        if(merges>=3){ doorA.open(); chimeAll(); toast('VOCABULARY BUILT — "low" is now ONE token. Proceed north.'); obj('ROOM B — the monoliths ask a question'); }
      } else {
        buzz(); toast(`"${pair}" appears ${c[pair]}×. Another pair appears ${best}×.<br><b>BPE always merges the MOST FREQUENT pair.</b>`,3600);
      }
    }
    const chimeAll=()=>{ chime(); };
    layout();
    const doorA=W.door({x:0,z:-17,axis:'x'});
    obj('ROOM A — <b>merge the most frequent adjacent pair</b> · 3 merges to build the vocabulary');

    let triedMono=false, opened=0, insSealed=false;
    // ---------------- ROOM B: STRAWBERRY ----------------
    // three opaque token monoliths
    const toks=[['STR',9821],['AW',675],['BERRY',19772]];
    const letterGroups=[];
    toks.forEach(([t,id],i)=>{
      const x=-7+i*7;
      const mono=W.box(3.6,4.2,1.2, W.mat(0x101b30,{emissive:0x14335c, ei:.5}));
      mono.position.set(x,2.1,-38); s.add(mono);
      const col={min:new THREE.Vector3(x-1.8,0,-38.6),max:new THREE.Vector3(x+1.8,4.2,-37.4),solid:true}; G.colliders.push(col);
      W.label(new THREE.Vector3(x,4.9,-38),`token #${id}`,{size:.34,color:'#5f86ab'});
      mono.userData.tok=t; mono.userData.x=x; mono.userData.opened=false;
      mono.userData.interact={prompt:'detokenize (requires ray)', fn:()=>{
        if(!hasRay){ triedMono=true;
          if(!insSealed){ insSealed=true; after(1.2,()=>insight('What the AI actually sees', `
            <p>Sealed, right? <b>This is the AI's entire experience of the word STRAWBERRY:</b>
            three chunk-numbers. #STR, #AW, #BERRY. The letters S-T-R-A-W... don't exist for it.
            They were thrown away by the chopping machine you just built, before the AI ever
            saw anything.</p>
            <p>Now you understand the internet's favorite gotcha: "ChatGPT can't count the R's in
            strawberry, lol." It's not stupidity. <b>It's blindness.</b> Asking it to count letters
            inside a chunk is like asking you to count the brushstrokes in a photo of a painting —
            the information simply isn't in what you were given.</p>
            <p>This gives you a rule worth remembering forever: <b>if it's not visible in the tokens,
            the AI cannot know it.</b> Before calling an AI dumb, ask: could it even SEE what I asked
            about? You, however, get a cheat — find the green ray.</p>`)); }
          buzz(); toast('The surface is sealed. Token IDs have no letters inside — <b>find the DETOKENIZER RAY</b>.'); return; }
        if(mono.userData.opened) return; mono.userData.opened=true; opened++;
        mono.material.opacity=.12; mono.material.transparent=true; mono.material.emissiveIntensity=.15;
        t.split('').forEach((ch,k)=>{
          const l=W.text(ch,{size:.7,color: ch==='R'?'#ff5c6a':'#cfe6ff',bold:true});
          l.position.set(x-((t.length-1)*0.45)+k*0.9, 2.1, -37.1); s.add(l); letterGroups.push(l);
        });
        toast(`token #${id} → letters revealed`);
      }};
      G.interactables.push(mono);
    });
    W.label(new THREE.Vector3(0,6.2,-38),'HOW MANY R’S IN STRAWBERRY?',{size:.55,color:'#ffd257',bold:true});
    W.label(new THREE.Vector3(0,5.5,-38),'place that many orbs on the altar',{size:.3,color:'#8fb8d8'});

    // detokenizer ray pickup
    let hasRay=false; 
    const rayM=new THREE.Mesh(new THREE.ConeGeometry(.3,1.1,8),W.mat(W.C.green,{emissive:W.C.green,ei:1.6}));
    rayM.rotation.z=Math.PI/2; rayM.position.set(11,1.4,-30); rayM.userData.baseY=1.4; rayM.userData.bob=.12; G.animated.push(rayM); s.add(rayM);
    W.label(new THREE.Vector3(11,2.5,-30),'DETOKENIZER RAY',{size:.3,color:'#5cff9d'});
    rayM.userData.interact={prompt:'take detokenizer ray', fn:()=>{ hasRay=true; s.remove(rayM);
      const ix=G.interactables.indexOf(rayM); if(ix>=0)G.interactables.splice(ix,1);
      toast('RAY ACQUIRED — the model never gets one of these.'); }};
    G.interactables.push(rayM);

    // orb dispenser + altar
    let carried=0, placed=0; 
    const disp=W.button({x:-10,z:-30,label:'TAKE ORB',color:W.C.cyan,fn:()=>{
      if(carried>=5){ toast('hands full'); return; } carried++;
      toast(`carrying ${carried} orb${carried>1?'s':''}`); }});
    const altar=new THREE.Mesh(new THREE.CylinderGeometry(1.3,1.6,1,10),W.mat(0x1a2440,{emissive:0x2a4a7a,ei:.6}));
    altar.position.set(0,.5,-44); s.add(altar); G.colliders.push({min:new THREE.Vector3(-1.5,0,-45.4),max:new THREE.Vector3(1.5,1,-42.6),solid:true});
    const placedOrbs=[];
    const altarLbl=W.label(new THREE.Vector3(0,2.4,-44),'ALTAR · 0',{size:.4,color:'#bfe8ff'});
    altar.userData.interact={prompt:'place / submit orbs', fn:()=>{
      if(carried>0){ placed+=carried; carried=0;
        while(placedOrbs.length<placed && placedOrbs.length<6){
          const o=new THREE.Mesh(new THREE.SphereGeometry(.3,14,14),W.mat(W.C.gold,{emissive:W.C.gold,ei:1.2}));
          o.position.set(-0.9+ (placedOrbs.length%3)*0.9, 1.35, -44 + (placedOrbs.length>2?0.7:0)); s.add(o); placedOrbs.push(o);
        }
        const nl=W.text(`ALTAR · ${placed}`,{size:.4,color:'#bfe8ff'}); altarLbl.material=nl.material; altarLbl.scale.copy(nl.scale);
        toast(`${placed} placed — submit again to answer`); return;
      }
      if(placed===3){ chime(); toast('CORRECT — three R’s. You could count them. <b>You had the letters.</b>');
        setTimeout(()=>complete(),1000); }
      else { buzz(); placed=0; placedOrbs.forEach(o=>s.remove(o)); placedOrbs.length=0;
        const nl=W.text('ALTAR · 0',{size:.4,color:'#bfe8ff'}); altarLbl.material=nl.material; altarLbl.scale.copy(nl.scale);
        toast('WRONG. Without the letters you are guessing — <b>exactly like the model.</b> Crack the monoliths first.',3800); }
    }};
    G.interactables.push(altar);


    // -------- voice guide --------
    guide([
      {who:'bit', say:"Okay, confession time. I can't read. Letters mean nothing to me. Before I see any text, a machine chops it into chunks called tokens — and today YOU are building that machine. Go to the floating letters.",
       when:()=>playerNear(0,-2,7)},
      {who:'nova', say:"They spell: low, lower, lowest. The pink dots between letters are glue buttons. One rule: always glue the pair of letters that appears MOST OFTEN. Look carefully — which pair shows up three times? Press E on it.",
       when:()=>merges>=1},
      {who:'bit', say:"And boom — that pair is now ONE chunk. This exact recipe — count, glue the winner, repeat — built my entire vocabulary from the whole internet. Nobody chose my words. Counting did. Two more glues.",
       when:()=>merges>=3},
      {who:'nova', say:"Vocabulary built — 'low' is one chunk now. Through the door, dear. There's a question waiting for you.",
       when:()=>triedMono||playerNear(0,-38,10)},
      {who:'bit', say:"Ah yes. THE question. How many R's in strawberry. Humans ask me this constantly and then screenshot my answer for laughs. Go ahead — press E on a block.",
       when:()=>triedMono},
      {who:'nova', say:"Sealed shut. And THIS is exactly what Bit sees — chunk numbers, zero letters. He's not being silly when he gets it wrong; he's blind. You, though, get a cheat he never gets. Find the green ray, on the right.",
       when:()=>hasRay},
      {who:'nova', say:"Now crack open all three blocks and count the R's with your own eyes.",
       when:()=>opened>=3},
      {who:'bit', say:"Count the red letters. Grab that many orbs from the dispenser, drop them on the altar, then submit. And hey — if you ever catch me failing this question online... now you know it's not my fault."},
    ]);
    return {};
  }
};
