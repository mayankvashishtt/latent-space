// HUB — The Residual Stream. A luminous corridor through the model; one gate per mechanism.
import * as THREE from 'three';
import { G, spawn, loadLevel, obj, panel, guide, playerNear } from '../engine.js';
import * as W from '../world.js';
import { TEXT } from '../text.js';

export default {
  id:0, name:'THE RESIDUAL STREAM',
  tagline:'the signal path through the model',
  respawn:[0,1,52,0],
  intro:TEXT[0].intro,
  build(){
    const s=G.scene;
    s.fog = new THREE.Fog(0x04060e, 20, 95);
    W.lights(s,{amb:.4,sun:.5});
    spawn(0,1,52,0); // face -z (down the corridor)

    // corridor
    W.ground(16,130,{cz:0});
    const wallM=W.mat(W.C.steel,{rough:.85});
    for(const sx of [-8,8]){ const wall=W.box(0.8,7,130,wallM); wall.position.set(sx,3.5,0); s.add(wall); }
    G.colliders.push(...[-8,8].map(sx=>{ const m=W.box(0.8,7,130,wallM); m.position.set(sx,3.5,0); return {min:new THREE.Vector3(sx-0.4,0,-65),max:new THREE.Vector3(sx+0.4,7,65),solid:true}; }));
    // glowing rails
    for(const sx of [-7.4,7.4]){ const r=W.box(0.15,0.15,130, W.mat(W.C.cyan,{emissive:W.C.cyan,ei:1.4}));
      r.position.set(sx,0.1,0); s.add(r); }

    // flowing data
    const st=W.stream({count:700, area:[13,6,126], dir:[0,0,-1], speed:9, cy:3.4});

    const LV = [
      {i:1,  name:'I · THE NEURON',      sub:'linear separability',    z: 42, side:-1},
      {i:2,  name:'II · DESCENT',        sub:'the loss landscape',     z: 42, side: 1},
      {i:3,  name:'III · THE TOKENIZER', sub:'what the model sees',    z: 26, side:-1},
      {i:4,  name:'IV · EMBEDDING SPACE',sub:'meaning as geometry',    z: 26, side: 1},
      {i:5,  name:'V · ATTENTION',       sub:'the engine of context',  z: 10, side:-1},
      {i:6,  name:'VI · THE ARCHIVE',    sub:'retrieval & context rot',z: 10, side: 1},
      {i:7,  name:'VII · AGENT FOUNDRY', sub:'tools · loop · harness', z: -6, side:-1},
      {i:8,  name:'VIII · REWARD PEAKS', sub:'RL & Goodhart',          z: -6, side: 1},
      {i:9,  name:'IX · THE GAUNTLET',   sub:'injection & safety',     z:-22, side:-1},
      {i:10, name:'X · OUTPUT HEAD',     sub:'the final forward pass', z:-46, side: 0},
    ];
    for(const L of LV){
      const locked = G.progress < L.i-1;
      const done   = G.progress >= L.i;
      const x = L.side===0 ? 0 : L.side*5.6;
      W.portalGate({x, z:L.z, name:L.name, sub:L.sub, locked, done, fn:()=>loadLevel(L.i)});
    }

    // THE ACADEMY — library of all 38 lessons, always open, behind spawn
    W.portalGate({x:0, z:60, name:'THE ACADEMY', sub:'all 38 lessons in plain words · always open',
      locked:false, done:false, fn:()=>loadLevel(11)});

    // codex terminal near spawn
    W.terminal({x:-5.5,z:50, yaw:0.9, label:'THE CODEX', title:'THE CODEX', sub:'what each chamber teaches',
      html:`
      <p style="font-size:14px;line-height:2">
      <b>I Neuron</b> → weights, bias, linear collapse, XOR &nbsp;<code>week-02</code><br>
      <b>II Descent</b> → gradients, learning rate, local minima &nbsp;<code>week-02</code><br>
      <b>III Tokenizer</b> → BPE, the strawberry problem &nbsp;<code>week-03</code><br>
      <b>IV Embedding Space</b> → meaning as geometry, vector math &nbsp;<code>week-03 · s06</code><br>
      <b>V Attention</b> → Q/K/V, the budget, causal mask, KV cache &nbsp;<code>week-04</code><br>
      <b>VI Archive</b> → RAG, hybrid search, context rot &nbsp;<code>week-09 · week-10</code><br>
      <b>VII Agent Foundry</b> → tools, loop, harness quality &nbsp;<code>week-08 · week-17</code><br>
      <b>VIII Reward Peaks</b> → reward hacking, verifiable rewards &nbsp;<code>week-14 · week-15</code><br>
      <b>IX Gauntlet</b> → prompt injection, least privilege &nbsp;<code>s04</code><br>
      <b>X Output Head</b> → softmax, temperature, everything at once &nbsp;<code>s07</code></p>
      <p style="font-size:13px;color:#7fa8cc;margin-top:14px">Full 38-lecture archive:
      <a href="https://github.com/mayankvashishtt/ai-ml-bootcamp-archive" target="_blank">ai-ml-bootcamp-archive</a>.
      Topics not yet built as chambers (scale &amp; MoE, inference cost, multimodal vision, world models…) are
      designed as future <em>Expansion Chambers</em> — see the README.</p>`});

    obj(`MAIN HALL — <b>${G.progress}/10</b> rooms finished · walk to a glowing ring, press E${G.progress>=10?' · <b style="color:#ffd257">ALL DONE!</b>':''}`);

    // golden state on completion
    if(G.progress>=10){ s.fog=new THREE.Fog(0x0e0a04,20,95);
      const gl=new THREE.PointLight(W.C.gold,20,80); gl.position.set(0,6,-46); s.add(gl); }


    // -------- voice guide --------
    if(G.progress===0){
      guide([
        {say:"Hello. You are a tiny piece of information — a token — traveling through an AI brain. I will be your guide. Walk forward down the hallway.",
         when:()=>G.player.pos.z<46},
        {say:"See the glowing rings on the left and right? Each one is a room, and each room will make you DO one big idea of AI with your own hands. They unlock in order. The first one — THE NEURON — is glowing on your left. Walk into it and press E. Or, if you want everything explained in plain words first, THE ACADEMY is behind you."},
      ]);
    }
    return { update:null, dispose(){}, tick:G.ticks.push(dt=>st.update(dt)) };
  }
};
