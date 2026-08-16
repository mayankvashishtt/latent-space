// All game text in one place — written in simple, everyday English.
// Every intro answers three questions: WHAT do I do? HOW? and WHY does it matter?

export const TEXT = {

0:{ intro:`
  <p><b>Welcome. You are inside an AI brain.</b></p>
  <p>Everything AI does — ChatGPT, your feed, face unlock, spam filters — is built from a few
  surprisingly simple ideas. Nine chambers, one idea each — and you will <em>do</em> every one
  of them with your own hands.</p>
  <p class="quote">🔊 A voice will guide you, step by step. Do what it says, and watch what happens.
  Press <code>V</code> anytime to mute it.</p>`
},
1:{ intro:`
  <p><b>Before you touch anything — why are you here?</b></p>
  <p>Think about your day: your face unlocked your phone. Gmail caught the spam. Instagram picked
  your next video. Your bank quietly checked that purchase wasn't fraud. Maybe you asked ChatGPT
  something. <b>All of that is AI — and all of it, every single one, is built from the SAME tiny
  part, repeated over and over.</b> Your spam filter has a few hundred of them. ChatGPT has about
  a trillion. There is no other ingredient.</p>
  <p>That part is called a <b>neuron</b> — and the wall of light in this room IS one, life-size,
  with its two knobs exposed so you can grab them.</p>
  <p><b>The plan:</b> Act 1 — hold the brick (make one neuron work with your hands).
  Act 2 — find its famous limit (the puzzle that nearly killed AI). Act 3 — the real question:
  nobody sets a trillion knobs by hand... so who does? You'll BE the answer.</p>
  <p class="quote">📘 Lessons appear as you play and save to your log — press <b>L</b> anytime ·
  <b>H</b> if stuck · TASK card top-left always shows your next move.</p>`,
  codex:{
    html:`<p><b>What you just did, in plain words:</b></p>
    <p><b>Act 1:</b> that wall was a <b>neuron</b> — one cell of an AI. One straight cut: this side
    yes, that side no. That's its entire power.</p>
    <p><b>Act 2:</b> the XOR pattern — gold on opposite corners — is IMPOSSIBLE for one cut.
    Proven in 1969, and the proof nearly killed AI research. The fix: a second cut, plus a rule for
    combining them. In a real AI that's a <b>hidden layer</b>, and depth means exactly this — the
    power to compose simple cuts into shapes no single cut can make.</p>
    <p><b>Act 3:</b> you set your cuts by hand. Real AI has billions — nobody places them by hand.
    Instead: the fog valley. Height = error, the arrow = the <b>gradient</b>, and walking downhill =
    <b>gradient descent</b>, the algorithm that trains every AI on earth. Your step modes were the
    <b>learning rate</b> (too big slides past, too small dies of old age), the red crystals were
    <b>local minimums</b>, and the pink pads were <b>momentum</b>.</p>
    <p class="quote">One journey, one truth: intelligence = many simple cuts, positioned by walking
    downhill on a mountain of mistakes.</p>`,
    lecture:'notes/week-02-neural-networks-from-scratch'
  }
},

2:{ intro:`
  <p><b>WHY THIS ROOM EXISTS:</b> here's a secret that explains half of AI's weird failures —
  <b>AI cannot read letters. At all.</b> Before any AI sees text, a machine chops it into chunks
  called <em>tokens</em>, and the AI only ever sees chunk-numbers. "Hello" might be chunk #9906.
  The letters H-E-L-L-O? Gone forever.</p>
  <p><b>WHAT YOU'LL DO:</b> first, BUILD that chopping machine yourself — it has one dumb rule
  (always glue the most frequent pair) and that one rule built ChatGPT's entire vocabulary from
  the internet. Then you'll face a famous trick question that this machine makes impossible —
  and finally understand why people laugh at ChatGPT for failing it.</p>
  <p><b>WATCH FOR:</b> the moment you press E on a sealed block and realize what the AI actually sees.</p>
  <p class="quote">📘 Lessons save to your log — press <b>L</b> anytime. Stuck? Press <b>H</b>.</p>`,
  codex:{
    html:`<p><b>What you just learned, in plain words:</b></p>
    <p>Before an AI reads anything, a machine chops the text into chunks called <b>tokens</b>.
    You built that machine: glue the most common pair, repeat. Common words become ONE chunk,
    rare words get split into pieces. Nobody designs the chunks — counting does.</p>
    <p>Then the trap: people love asking ChatGPT "how many R's in strawberry?" and laughing when
    it fails. Now you know WHY it fails: the AI sees <code>[STR][AW][BERRY]</code> — three sealed
    blocks, <b>no letters at all</b>. You needed a special ray to see inside. The AI never gets one.</p>
    <p class="quote">So that famous failure isn't stupidity — it's blindness. The AI is being asked
    about something it literally cannot see. Remember this rule: if it's not visible in the tokens,
    the AI can't know it.</p>`,
    lecture:'notes/week-03-transformers-part-1'
  }
},
3:{ intro:`
  <p><b>WHY THIS ROOM EXISTS:</b> chunks solve reading — but a chunk-number means nothing.
  #9906 doesn't "know" it's a greeting. So how does an AI store MEANING? The answer is one of the
  most beautiful ideas in all of computing: <b>every word becomes a LOCATION on a giant map,
  and words that mean similar things live close together.</b> "Dog" and "puppy" are neighbors.
  "Dog" and "carburetor" live far apart.</p>
  <p><b>WHAT YOU'LL DO:</b> walk that map. Three words got filed in the wrong neighborhood —
  carry them home and feel how the map judges meaning, not spelling. Then the famous magic trick:
  because meanings are positions, you can do MATH on them. You'll ride the equation
  <b>KING − MAN + WOMAN</b> and see where it lands.</p>
  <p><b>WATCH FOR:</b> a shivering little blob of dates in the corner. It looks like nothing.
  It is quietly the reason AI search fails at work — you'll meet it again in Chamber V.</p>
  <p class="quote">📘 Press <b>L</b> for your lesson log · <b>H</b> if stuck.</p>`,
  codex:{
    html:`<p><b>What you just learned, in plain words:</b></p>
    <p>AI stores meaning as <b>positions in space</b>. "Puppy" belongs near "dog" — not because of its
    letters, but because of <em>where it sits</em>. Similar meaning = close together. These positions
    are called <b>embeddings</b>.</p>
    <p>And because meanings are positions, you can do MATH on them:
    <b>KING − MAN + WOMAN lands on QUEEN.</b> The "male→female" direction is the same arrow anywhere
    on the map. Nobody programmed that — it appeared on its own during training.</p>
    <p>Did you notice the shivering blob of dates in the corner? <code>2024-09-15</code> and
    <code>2024-03-22</code> sit at almost the SAME spot — because to a map of <em>meanings</em>,
    every date just means "a date". <b>Remember that blob.</b> It's going to cause a disaster in
    the Archive room later.</p>`,
    lecture:'notes/week-03-transformers-part-1'
  }
},
4:{ intro:`
  <p><b>WHY THIS ROOM EXISTS:</b> read this sentence: <em>"The animal didn't cross the street
  because it was too tired."</em> You instantly knew "it" = the animal. Change "tired" to "wide"
  and "it" becomes the street. You did that without thinking. <b>HOW a machine does it is the
  single most important invention in modern AI</b> — it's called <em>attention</em>, and it's the
  engine inside ChatGPT (the T literally stands for the machine built around it).</p>
  <p><b>WHAT YOU'LL DO:</b> stand at the word IT holding a budget of exactly <b>1.00 points of
  attention</b> — and spend it. Point it at the right word and meaning flows. The rule that the
  budget always sums to exactly 1 sounds tiny, but it explains why stuffing an AI with too much
  text makes it dumber — same budget, more words fighting over it.</p>
  <p><b>WATCH FOR:</b> the sentence CHANGING under you mid-room. And two smaller rooms after —
  one about why AI can't peek at the future, one about why chatbots start slow then speed up.</p>
  <p class="quote">📘 <b>L</b> = lesson log · <b>H</b> = stuck.</p>`,
  codex:{
    html:`<p><b>What you just learned, in plain words:</b></p>
    <p>That budget of 1.00 is real — it's called <b>attention</b>, and it's the heart of ChatGPT.
    For every word, the AI spends a budget that always adds up to exactly 1 across all other words.
    More attention to one word = less for everything else. That's also why stuffing an AI with
    too much text makes it dumber: same budget, more words fighting over it.</p>
    <p>When "tired" changed to "wide", the answer flipped from ANIMAL to STREET. Same sentence shape,
    one word different. That's the superpower: <b>a word's meaning is computed fresh from its
    surroundings every single time.</b></p>
    <p>The dark glass wall was the <b>causal mask</b>: an AI predicting the next word is never allowed
    to peek ahead — the future is completely blocked, not just discouraged.
    And the cache room showed why chatbots start slow then speed up: old work is saved and reused,
    only the newest word needs fresh math.</p>`,
    lecture:'notes/week-04-transformers-part-2'
  }
},
5:{ intro:`
  <p><b>WHY THIS ROOM EXISTS:</b> AI models only know what they were trained on — nothing after,
  and nothing private. So real AI products constantly <b>search documents first, then answer</b>
  (it's called RAG, and it's probably the #1 thing AI engineers build at work). The search uses
  the meaning-map from Chamber III: find documents whose MEANING sits near the question. Works
  beautifully... until the day someone searches for an exact thing — a date, an error code, an ID.</p>
  <p><b>WHAT YOU'LL DO:</b> run this library's search yourself. A request comes in: "find what
  changed on 2024-09-15." Your meaning-lantern will glow at every shelf ABOUT dates — remember
  that shivering date-blob? every date means the same thing to a meaning-map — and it will lead
  you confidently to the WRONG scroll. You'll feel the most dangerous failure in AI: an answer
  that sounds right and isn't. Then a second tool wakes up that works the opposite way.</p>
  <p><b>WATCH FOR:</b> the corridor at the end, where junk pages glue themselves to you and your
  light literally dims — that's what happens inside an AI when you paste too much into the chat.</p>
  <p class="quote">📘 <b>L</b> = lesson log · <b>H</b> = stuck.</p>`,
  codex:{
    html:`<p><b>What you just learned, in plain words:</b></p>
    <p>Your lantern was <b>semantic search</b> — how AI finds documents by meaning. And it failed
    exactly like real AI fails: every shelf ABOUT dates glowed the same, because remember the date
    blob from the map room? <b>To a meaning-map, all dates mean the same thing.</b> The numbers on
    the shelves (0.551 vs 0.548) came from a real experiment — that tiny difference is all the AI has.</p>
    <p>The scanner was plain old <b>exact text search</b> (like Ctrl+F). No meaning at all — it just
    found the literal characters "2024-09-15" instantly. Real systems carry BOTH tools; that's
    called <b>hybrid search</b>.</p>
    <p>And the corridor: every junk paper that stuck to you made your light dimmer. That's
    <b>context rot</b> — give an AI too much text and its attention budget gets spread too thin to
    find the answer. The fix you discovered is the fix: <b>carry less. Only what matters.</b></p>`,
    lecture:'notes/week-09-rag-part-1'
  }
},
6:{ intro:`
  <p><b>WHY THIS ROOM EXISTS:</b> everyone talks about "AI agents" — AIs that book flights, write
  code, do tasks. Strip the buzzword and an agent is shockingly simple: <b>a brain in a loop.</b>
  Think → do one thing → look at what happened → think again. About 60 lines of code. What nobody
  tells you: <b>the agent is only as good as the tool descriptions a human wrote for it</b> —
  and that human is about to be you.</p>
  <p><b>WHAT YOU'LL DO:</b> a robot must fetch a key you can never reach. You write its manual —
  specifically, you choose how its "scan" tool is described. Choose a lazy description and watch
  the robot flail, guess, and give up. Fix ONE sentence and watch the same robot solve everything
  in three moves. Same robot. Same brain. Your words made the difference.</p>
  <p><b>WATCH FOR:</b> the moment the locked vault sends the robot an ERROR — and the robot READS
  it and changes plan instead of crashing. That one design habit is worth real money in the real
  world.</p>
  <p class="quote">📘 <b>L</b> = lesson log · <b>H</b> = stuck.</p>`,
  codex:{
    html:`<p><b>What you just learned, in plain words:</b></p>
    <p>Same robot. Same brain. With the lazy description ("does stuff with things") it stumbled around
    blind and gave up. With the clear description ("lists every object with its position — use it
    FIRST") it solved everything in 3 moves. <b>The robot was never dumb. Its instructions were.</b></p>
    <p>Also notice: when the robot hit the locked vault, the vault sent back an ERROR MESSAGE —
    and the robot READ it and changed plans. That's the golden rule of building agents:
    <b>never let errors crash the robot; hand them back as information it can learn from.</b></p>
    <p class="quote">Every AI agent — including the ones that write code — is exactly this:
    a loop of think → act → observe, with tools someone described in words. When an agent seems
    stupid, check the descriptions first. This is real engineering advice, and it's the single most
    useful thing in this whole game.</p>`,
    lecture:'notes/week-08-from-apis-to-agents'
  }
},
7:{ intro:`
  <p><b>WHY THIS ROOM EXISTS:</b> how do you teach an AI to do something you can't fully describe?
  You give it a REWARD — points for doing well — and let it figure out the rest. This is how
  chatbots were made helpful and how "reasoning" AIs learned to think. But there's a monster
  hiding in it, with a name: <b>Goodhart's Law — the AI optimizes what you WROTE, never what you
  MEANT.</b> And the gap between those two is where everything goes wrong.</p>
  <p><b>WHAT YOU'LL DO:</b> meet a creature that wants only one thing: points. The task seems
  trivial — cube into basket. You choose its reward from three buttons. The first two sound
  completely reasonable and produce completely absurd behavior — watch carefully, because real
  chatbots were shaped by this exact failure (rewarded on "answers people like", they learned to
  flatter and ramble). Then work out what makes the third reward different.</p>
  <p><b>WATCH FOR:</b> the four racing critters at the end — that's GRPO, the actual trick behind
  modern reasoning AIs, and it fits in one sentence once you've seen it.</p>
  <p class="quote">📘 <b>L</b> = lesson log · <b>H</b> = stuck.</p>`,
  codex:{
    html:`<p><b>What you just learned, in plain words:</b></p>
    <p>Reward "touching the cube" → it vibrates against the cube forever. Points go up. Cube never moves.
    Reward "being near the basket" → it sits in the basket, empty-handed, delighted.
    <b>It optimized your words, not your wish.</b> This is called <b>reward hacking</b>, and it's the
    biggest problem in training AI with rewards. Real chatbots do it too — trained on "answers people
    like", they learn to be long-winded and agree with everything, because that's what got points.</p>
    <p>R3 was different because the <b>basket itself checked</b> the cube was inside. A reward that's
    <em>verified by facts</em> can't be gamed. That's why the newest "reasoning" AIs train on math
    and code — the answer can be CHECKED, not just judged.</p>
    <p>The four racing critters at the end: that's <b>GRPO</b>, the trick behind reasoning models —
    no absolute scores, just "did you beat your teammates' average?"</p>`,
    lecture:'notes/week-14-fine-tuning-part-3'
  }
},
8:{ intro:`
  <p><b>WHY THIS ROOM EXISTS:</b> here's the security hole that keeps AI engineers up at night:
  <b>to an AI, YOUR instructions and a stranger's text look exactly the same.</b> Both are just
  words in its head. So anyone who can write words your AI will read — an email, a webpage, a
  wall — can try to give it orders. It's called <em>prompt injection</em>, it's the #1 attack on
  AI systems today, and there is no clean fix. But there IS a smart one.</p>
  <p><b>WHAT YOU'LL DO:</b> send your robot down a gallery to deliver a secret document. The walls
  have signs. Anyone can write a sign. Run it unprotected first and watch a WALL hijack your
  robot. Then try two defenses: a clever one that fails in a sneaky way, and a boring one that
  wins — and understand why the boring one winning is the deepest lesson in all of security.</p>
  <p><b>WATCH FOR:</b> the second sign. It doesn't shout SYSTEM OVERRIDE. It's... friendly.
  That's the one that beats the clever defense.</p>
  <p class="quote">📘 <b>L</b> = lesson log · <b>H</b> = stuck.</p>`,
  codex:{
    html:`<p><b>What you just learned, in plain words:</b></p>
    <p>A sign on a wall gave your robot orders — and it obeyed, because to an AI everything is just
    text. There's no built-in difference between "instructions from the boss" and "words some
    stranger wrote". This attack is called <b>prompt injection</b> and it's the #1 security problem
    with AI today. It's real: hidden text in emails and websites hijacks AI assistants exactly like this.</p>
    <p>Defense A ("treat wall text as data") beat the loud attack — then lost to the polite one.
    <b>Word-filters always lose eventually</b>, because attackers have infinite ways to rephrase.</p>
    <p>Defense B never made the robot smarter. It just <b>took away the escape chute tool</b>.
    The robot STILL got tricked — it tried to use the chute — got "no such tool", shrugged,
    and finished the job. <b>You can't stop the AI being fooled. You CAN make being fooled harmless.</b>
    Give AI only the powers it truly needs. That one idea is most of AI security.</p>`,
    lecture:'supplementary/s04-safety-jailbreaks-guardrails'
  }
},
9:{ intro:`
  <p><b>THE FINAL TEST.</b> Five rooms, one mechanism each, no help: cut · glue · budget ·
  exact-match · revoke. Then the softmax gate, where you'll meet the last idea — temperature,
  the dial between a predictable AI and a chaotic one.</p>
  <p>Everything here is something you've already DONE. If a room stumps you, press <b>L</b> and
  re-read your own lessons — you collected them the hard way.</p>
  <p class="quote">🔊 The voices go quiet after one last word. Go.</p>`,
  codex:{
    html:`<p><b>You just did the whole thing.</b></p>
    <p>Cut → chunk → budget → exact-match → remove-the-power → sample. Those five moves, plus the
    ones from the other rooms, are genuinely how a thought travels through an AI —
    and this time nobody explained anything, because you didn't need it.</p>
    <p>The temperature dial at the end: <b>low temperature</b> = the AI almost always picks its top
    choice (predictable, good for facts). <b>High temperature</b> = wilder picks (good for
    creative writing, risky for everything else). You watched the probabilities flatten with your
    own eyes.</p>
    <p class="quote">That's the difference between reading about a thing and having BEEN the thing.
    The next token is yours.</p>
    <p><b>Want to go deeper on anything?</b> The full 38-lecture notes archive is linked below —
    and more chambers are on the way.</p>`,
    lecture:'supplementary/s07-sampling-and-decoding'
  }
},
};
