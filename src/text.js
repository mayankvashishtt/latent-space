// All game text in one place — written in simple, everyday English.
// Every intro answers three questions: WHAT do I do? HOW? and WHY does it matter?

export const TEXT = {

0:{ intro:`
  <p><b>Welcome. You are inside an AI brain.</b></p>
  <p>Nine chambers, one big idea each — and you will <em>do</em> every idea with your own hands.</p>
  <p class="quote">🔊 A voice will guide you, step by step. Do what it says, and watch what happens.
  Press <code>V</code> anytime to mute it.</p>`
},
1:{ intro:`
  <p><b>THE BIG IDEA: a brain cell makes ONE straight cut — and training is how billions of cuts
  find their place.</b></p>
  <p>Three acts: make the cut · meet the cut that can't exist · then step off the edge and
  <em>become</em> the training algorithm.</p>
  <p class="quote">Follow NOVA and BIT. The TASK card (top-left) always says what to do next.</p>`,
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
  <p><b>THE BIG IDEA: AI can't read letters — only chunks called tokens.</b></p>
  <p>Build the chunk machine yourself. Then face the strawberry question.</p>
  <p class="quote">🔊 Close this and follow the voice.</p>`,
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
  <p><b>THE BIG IDEA: to an AI, every word is a LOCATION on a map of meaning.</b></p>
  <p>File the lost words. Then do math on ideas: KING − MAN + WOMAN = ?</p>
  <p class="quote">🔊 Close this and follow the voice.</p>`,
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
  <p><b>THE BIG IDEA: "attention" is a budget that always adds up to exactly 1.</b></p>
  <p>Spend it right, and words find their meaning.</p>
  <p class="quote">🔊 Close this and follow the voice.</p>`,
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
  <p><b>THE BIG IDEA: AI searches by MEANING — which fails hard on exact things like dates.</b></p>
  <p>Watch it fail. Fix it. Then survive the junk-context corridor.</p>
  <p class="quote">🔊 Close this and follow the voice.</p>`,
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
  <p><b>THE BIG IDEA: an AI agent is a brain in a loop — think, act, observe, repeat.</b></p>
  <p>You write its instructions. It does the work. Your words decide if it succeeds.</p>
  <p class="quote">🔊 Close this and follow the voice.</p>`,
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
  <p><b>THE BIG IDEA: AI does what you REWARD, not what you WANT.</b></p>
  <p>Pick the creature's reward. Watch what you actually asked for.</p>
  <p class="quote">🔊 Close this and follow the voice.</p>`,
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
  <p><b>THE BIG IDEA: anyone who can write text your AI reads can try to hijack it.</b></p>
  <p>Watch your robot get owned by a wall. Then defend it — the right way.</p>
  <p class="quote">🔊 Close this and follow the voice.</p>`,
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
  <p><b>THE FINAL TEST.</b> Five rooms. Everything you've learned. No hints.</p>
  <p class="quote">🔊 The voice goes silent after one last word. Good luck.</p>`,
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
    <p><b>Want to go deeper on anything?</b> Visit THE ACADEMY behind the hallway spawn —
    all 38 lessons in plain words — or read the full notes on GitHub.</p>`,
    lecture:'supplementary/s07-sampling-and-decoding'
  }
},
};
