// THE ORIGIN STORY — shown once, before anything else. Starts from absolute zero:
// why machines have "brain cells" at all. Earns the word "neuron" before the game uses it.
import { G, panel } from './engine.js';

const PAGES=[
{ title:'YOU', sub:'the story begins', html:`
  <p style="font-size:17px">Somewhere out in the world, a person just typed a question into an AI.</p>
  <p style="font-size:17px"><b>That question is you.</b></p>
  <p>To become an answer, you must travel all the way through the machine's brain — in one side,
  out the other. And you will, walking, with your own feet.</p>
  <p>But before you take a single step, you deserve to know what this place IS.
  How did a machine get a <em>brain</em>?</p>
  <p class="quote">The story takes one minute. It starts with a problem computers couldn't solve
  for thirty years.</p>`},

{ title:'THE RECIPE PROBLEM', sub:'why computers were stuck', html:`
  <p>A computer is the world's most obedient recipe-follower. Tell it
  <em>"add these numbers, then sort this list"</em> — perfect, a billion times a second, never a
  mistake.</p>
  <p>Now try writing the recipe for this: <b>recognize your grandmother's face.</b></p>
  <p>Go on — step 1? "Look for grey hair"? Lots of people have grey hair. "Measure the nose"?
  From which angle? In what lighting? Wearing glasses? Smiling?</p>
  <p><b>You can do it instantly — but you cannot say HOW you do it.</b> And if you can't say how,
  you can't write the recipe. No recipe, no program.</p>
  <p class="quote">For ~30 years computers stayed like this: superhuman at math,
  hopeless at anything a human toddler finds easy. Faces. Voices. Language.</p>`},

{ title:'THE WILD IDEA', sub:'1950s — copy the thing that learns', html:`
  <p>Then some scientists asked a strange question:</p>
  <p style="font-size:17px"><b>"What DOES recognize grandma without a recipe? A brain.
  So... what if we copy the brain?"</b></p>
  <p>Here's what they knew: your brain is about <b>86 billion tiny cells</b>, called
  <b>neurons</b>. And each one, on its own, is almost embarrassingly dumb. A neuron just:</p>
  <p style="text-align:center;font-size:16px">
  <b>1.</b> listens to its neighbor cells &nbsp;→&nbsp;
  <b>2.</b> weighs how much it trusts each one &nbsp;→&nbsp;
  <b>3.</b> shouts, or stays quiet</p>
  <p>That's it. That's the whole cell. No cell knows your grandmother.</p>
  <p class="quote">But 86 billion of them, constantly adjusting <em>how much they listen to each
  other</em>... become you. Nobody writes recipes into a child's brain. It adjusts itself.
  <b>It learns.</b></p>`},

{ title:'THE COPY', sub:'the math brain-cell', html:`
  <p>So the scientists built a copy of ONE brain cell — not from flesh, from <b>math</b>:</p>
  <pre style="background:#0d1830;padding:14px 18px;border-radius:6px;color:#9fd8ff;font-size:13px;line-height:1.9;overflow-x:auto">
 numbers in  →  × how-much-do-I-listen  →  add up  →  shout / stay quiet
 (the inputs)      (the "weights")                     (the answer)</pre>
  <p>They named it after the original: an artificial <b>NEURON</b>. One alone is useless —
  it can only make one simple yes/no split.</p>
  <p>But connect thousands... millions... let the weights adjust themselves from examples instead
  of recipes — and machines started doing the impossible. Reading faces. Hearing speech.
  <b>Talking.</b></p>
  <p class="quote">ChatGPT is this. Literally this. About a trillion math brain-cells and
  nothing else. Your phone's face unlock — a few million of them. The spam filter — a few
  hundred. <b>One brick, different sizes of wall.</b></p>`},

{ title:'YOUR JOURNEY', sub:'the brain, opened up for you', html:`
  <p>The world you're standing in is one of those artificial brains — <b>opened up so you can
  walk through it.</b></p>
  <p>Two voices will travel with you: <b style="color:#54e0ff">NOVA</b>, a teacher who loves this
  machine — and <b style="color:#ffd257">BIT</b>, who IS the machine, and has opinions about you
  being in here.</p>
  <p><b>The route:</b> four worlds, nine chambers. Each chamber is one part of the brain — and you
  won't read about any of them. You'll <em>operate</em> each one with your hands. Finish a world,
  earn a star. Four stars open the <b>Output Head</b> — the exit — and you leave this brain the
  way every answer does.</p>
  <p class="quote">First stop: they've prepared ONE math brain-cell for you, life-size, its two
  knobs exposed. Time to hold the brick.</p>
  <p style="font-size:12.5px;color:#7fa8cc">M = journey map · L = your lesson log · H = stuck?
  auto-solve · TASK card (top-left) always shows your next move</p>`},
];

export function initStory(){
  G.storyIntro=(done)=>{
    let pg=0;
    const show=()=>{
      if(pg>=PAGES.length){ done&&done(); return; }
      const p=PAGES[pg];
      const last = pg===PAGES.length-1;
      panel({ title:p.title, sub:'the origin story · '+(pg+1)+'/'+PAGES.length+' · '+p.sub, html:p.html,
        buttons:[{label: last?'★ Begin the journey':'Next →', primary:true, gold:last, fn:()=>{ pg++; show(); }}]});
    };
    show();
  };
}
initStory();
