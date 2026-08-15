// THE ACADEMY — all 38 lessons from the course, in plain everyday English.
// Each entry: title, repo path, and a short spoken-friendly explanation.

export const WINGS = [
{ name:'WING 1 · FOUNDATIONS — how the brain is built', color:0x54e0ff, items:[

{t:'W0 · What even is a "model"?', p:'notes/week-00-orientation', b:`
<p>An AI model is just a giant pile of numbers — billions of them — plus a rule for mixing them with
your input. That's it. No database inside, no little person. When it "knows" Paris is the capital of
France, that fact is smeared across billions of numbers as a pattern.</p>
<p><b>Training</b> = finding good values for those numbers. <b>Using</b> the model (inference) = doing
the multiplication. Training costs millions of dollars once; using it costs a fraction of a cent —
and that gap is why the whole AI industry looks the way it does.</p>
<p><b>Remember:</b> a model is numbers, not knowledge. That's why it can be confidently wrong — a
slightly-off pattern still produces a fluent answer, with no alarm bell anywhere.</p>`},

{t:'W1 · The 70-year story of AI', p:'notes/week-01-fast-tracking-ai', b:`
<p>AI history is a chain of failures, each fix creating the next problem. First people wrote RULES
("if email says free money, it's spam") — but most human skill can't be written as rules. You can't
write the rule for recognizing a face.</p>
<p>So machines learned from EXAMPLES instead. That needed mountains of data and fast computers —
neither existed until the internet and gaming graphics cards arrived around 2012. Then language:
dictionaries failed (no context), statistics failed (patterns without meaning), word-maps failed
(one meaning per word), memory-networks failed (they forget).</p>
<p><b>Remember:</b> attention — every word looking at every other word at once — fixed the forgetting
AND could be trained in parallel on gaming chips. That double win is why transformers took over the world.</p>`},

{t:'W2 · How machines actually learn', p:'notes/week-02-neural-networks-from-scratch', b:`
<p>All learning is one loop: <b>guess → measure how wrong → nudge every number slightly toward less
wrong → repeat</b> a few million times. The "measure how wrong" part is called loss. The nudging
direction comes from the gradient — the slope under your feet.</p>
<p>Blame flows backwards: when the answer is wrong, each number gets corrected in proportion to how
much it caused the mistake. That's backpropagation.</p>
<p><b>Remember:</b> the tiny 17-number network you can train on a laptop and ChatGPT's trillion
numbers use the EXACT same loop. There is no extra secret at the top — just scale.</p>`},

{t:'W3 · Tokens, and the map of meaning', p:'notes/week-03-transformers-part-1', b:`
<p>Two steps happen before an AI "reads" anything. First, text gets chopped into <b>tokens</b> —
chunks decided purely by counting which letter-pairs appear most often. Second, each token becomes a
<b>position on a map</b> where similar meanings sit close together.</p>
<p>Consequences: the AI never sees letters (that's why it can't count the R's in strawberry), you pay
by the token (JSON costs double what plain English costs), and math works on meanings
(KING − MAN + WOMAN lands near QUEEN).</p>
<p><b>Remember:</b> if something isn't visible in the tokens, the AI cannot know it. Check that
before calling it stupid.</p>`},

{t:'W4 · Attention — the engine of ChatGPT', p:'notes/week-04-transformers-part-2', b:`
<p>Attention lets every word look at every other word and pull in meaning from the ones that matter.
Each word plays three roles at once: what am I looking for (Query), how do I advertise myself (Key),
what do I give if picked (Value) — like YouTube search: your search text, video titles, and the
videos themselves.</p>
<p>The weights always add up to exactly 1 — a fixed budget. And a "causal mask" makes it impossible
to peek at future words, which is why training can't cheat.</p>
<p><b>Remember:</b> the KV cache — saving old words' math — is why a chatbot's FIRST word comes slow
and the rest stream fast. The whole mechanism fits in 9 lines of code.</p>`},

{t:'W5 · Tensors — the math under everything', p:'notes/week-05-tensors-and-pytorch', b:`
<p>Surprise: everything in AI — attention, learning, embeddings — is just matrix multiplication.
A matrix isn't storage; it's a TRANSFORMATION that moves, rotates, and stretches data. Training means
searching for the right transformation.</p>
<p>Matrix math is "embarrassingly parallel" — thousands of little multiplications that don't depend
on each other — which is exactly what gaming graphics cards are built for. That accident of history
is why NVIDIA is worth trillions.</p>
<p><b>Remember:</b> the number one debugging skill in AI is reading SHAPES — [batch, heads, tokens,
size]. Most bugs are shape bugs.</p>`},

{t:'W6 · What changed since 2017', p:'notes/week-06-what-changed-since-2017', b:`
<p>Modern AI still uses the 2017 transformer skeleton — but four parts got swapped: a simpler
normalizer (RMSNorm), a smarter gate in the thinking layer (SwiGLU), position stored by ROTATING
vectors instead of adding numbers (RoPE), and shared memory between attention heads (GQA) to cut
memory 4×.</p>
<p>Here's the thing: NONE of these made AI smarter. Every single one made it cheaper to train or
cheaper to run. Smartness came from scale and data.</p>
<p><b>Remember:</b> "skip connections" — letting the signal bypass each layer — are the only reason
100-layer networks can train at all.</p>`},

{t:'W7 · Training your own mini-ChatGPT', p:'notes/week-07-training-your-first-model', b:`
<p>The magic trick of all AI training: take any text, and the "correct answer" at every position is
simply THE NEXT CHARACTER. "To be o" → predict "r". One sentence of 256 letters gives you 256
practice questions at once, and nobody had to label anything — the text labels itself.</p>
<p>That's why models can train on the whole internet: you can't hire humans to label a trillion
words, and you don't need to.</p>
<p><b>Remember:</b> a fresh untrained model should start with loss equal to ln of the vocabulary
size. If it doesn't, your wiring is broken — the cheapest bug-check in AI.</p>`},
]},

{ name:'WING 2 · BUILDING WITH AI — agents and search', color:0x5cff9d, items:[

{t:'W8 · Agents — a brain in a loop', p:'notes/week-08-from-apis-to-agents', b:`
<p>An AI agent = model + tools + a loop. The model THINKS in text, asks for a tool ("run this
search"), YOUR code actually runs it, and the result gets pasted back for the model to read. Repeat
until done.</p>
<p>The model never touches anything directly — it only writes text. So an agent can only ever do
what its tools allow: that's the entire security story. And the model has NO memory: every turn,
the whole conversation gets re-sent. "Chat memory" is your app re-sending history.</p>
<p><b>Remember:</b> return errors to the agent as readable messages, never crashes — an error it can
READ is an error it can fix. About 60 lines of code makes a working agent.</p>`},

{t:'W9 · RAG — look it up before answering', p:'notes/week-09-rag-part-1', b:`
<p>Models only know their training data — not your documents, not yesterday. RAG fixes this simply:
search your documents first, paste the best matches into the prompt, then say "answer using this."</p>
<p>The hard part is the search. Meaning-based search finds "parental leave" when you asked about
"time off" — great! But it CANNOT find exact things: dates, error codes, IDs. Every date means the
same thing to a meaning-map. The fix: also run plain text-match search, and combine both.</p>
<p><b>Remember:</b> when RAG fails, look at what was RETRIEVED, not the final answer — the AI writes
fluent answers from wrong documents, hiding the real bug.</p>`},

{t:'W10 · Context rot — more text, worse answers', p:'notes/week-10-rag-part-2', b:`
<p>Big discovery, tested on 18 top models: the 10,000th word in a prompt is NOT read as reliably as
the 100th. Attention is a budget that sums to 1 — more words means thinner slices for each.</p>
<p>Weirder: almost-relevant junk hurts MORE than random junk, because it competes for attention.
And well-written documents can hurt too — the AI follows their story instead of hunting your fact.</p>
<p><b>Remember:</b> every token you add is a bet against accuracy. Don't stuff the window — be
surgical. (Fun fact: ChatGPT's own memory doesn't use fancy search at all — just plain text files
assembled deterministically.)</p>`},

{t:'W11 · Let the AI explore instead of read', p:'notes/week-11-recursive-language-model', b:`
<p>Instead of pasting a 500-page report into the AI, store it as a variable and give the AI code
tools: peek at the table of contents, search for keywords, slice out one section, send just THAT to
a fresh AI call. The main AI never sees the whole document — so context rot never happens.</p>
<p>This is exactly how Claude Code explores your codebase: no index, no embeddings — just ls, grep,
and cat, deciding where to look next like a human would.</p>
<p><b>Remember:</b> a small model that explores smartly beat a big model that swallowed everything.
Architecture beat size.</p>`},
]},

{ name:'WING 3 · TEACHING THE AI — fine-tuning and rewards', color:0xff9d5c, items:[

{t:'W12 · Fine-tuning — changing the model itself', p:'notes/week-12-fine-tuning-part-1', b:`
<p>Everything before this left the model untouched. Fine-tuning re-runs training on YOUR data.
The golden rule: <b>RAG adds knowledge, fine-tuning changes behavior.</b> Facts that change → RAG.
Style, format, tone → fine-tune. Mixing these up is the classic expensive mistake.</p>
<p>Problem: training needs ~6× the model's size in memory. LoRA fixes it: freeze ALL the original
numbers, train tiny add-on matrices (under 1% of the size). QLoRA also shrinks the frozen part 4× —
suddenly a laptop-class GPU can fine-tune a 7-billion-number model.</p>
<p><b>Remember:</b> frozen numbers need no training memory at all — that's the real trick.</p>`},

{t:'W13 · SFT — teaching it to answer, not ramble', p:'notes/week-13-fine-tuning-part-2', b:`
<p>A freshly-trained model doesn't answer questions — it CONTINUES text, forever. Ask "What is
EBITDA?" and it writes more questions. It knows the answer; it just doesn't know it's being asked.</p>
<p>SFT fixes this with example pairs: instruction → good response. The model learns two habits:
answer the question, then STOP. That's the entire difference between a "base" model and a "chat"
model.</p>
<p><b>Remember:</b> quality beats quantity brutally here. 1,000 excellent examples beat 100,000
mediocre ones — because the model imitates EXACTLY what you show it, flaws included. Mediocre
examples teach mediocrity.</p>`},

{t:'W14 · RLHF — teaching taste with comparisons', p:'notes/week-14-fine-tuning-part-3', b:`
<p>Some things you can't demonstrate but CAN compare: show people two answers, ask which is better.
Train on those preferences and the model learns taste. This — not more knowledge — is what turned
GPT-3 (ignored for 2.5 years) into ChatGPT (100 million users in 2 months).</p>
<p>The trap: optimize hard against any learned scoring and the model games its flaws. Judges slightly
prefer longer answers → model learns to ramble. That's Goodhart's Law: when a measure becomes a
target, it stops measuring.</p>
<p><b>Remember:</b> rising scores are what success AND cheating both look like from the inside.
Always check outputs with your own eyes.</p>`},

{t:'W15 · Reasoning models — paid to think', p:'notes/week-15-rlvr', b:`
<p>For math and code you don't need a judge — you can CHECK: run the code, verify the arithmetic.
Reward the model only when the answer verifiably checks out, and something amazing emerges: it
teaches ITSELF to think longer, double-check, and backtrack. Nobody programmed "wait, let me
reconsider" — the reward made it appear.</p>
<p>Result: on hard math, older models scored 13%; reasoning models hit 83%. Same architecture,
different training.</p>
<p><b>Remember:</b> this only works where answers can be CHECKED. That's why reasoning models jumped
in math and code specifically, not everything.</p>`},

{t:'W16 · Environments — the gym where AI trains', p:'notes/week-16-rl-environments-for-llms', b:`
<p>An environment is three functions: give a task, take the answer, score it. That's the gym.
Same object serves three jobs: testing (report the score), training (learn from the score), and
data-making (keep the high scorers).</p>
<p>The #1 bug in practice isn't scoring — it's PARSING. If your code fails to extract the answer
from the model's reply, a correct answer scores zero, and you literally train the model that being
right is bad. Silently.</p>
<p><b>Remember:</b> the more your scorer COMPUTES instead of judges, the less the model can cheat it.</p>`},
]},

{ name:'WING 4 · MAKING IT REAL — engineering discipline', color:0xff4fd8, items:[

{t:'W17 · Harness — same model, different scores', p:'notes/week-17-harness-context-evals', b:`
<p>Proven fact: the SAME model scores several points differently depending on the scaffolding around
it — tools, error messages, context management. When your agent seems dumb, suspect the harness
first: Can it see what it needs? Can it tell what went wrong?</p>
<p>Also, testing lies: "passed at least once in 5 tries" flatters wildly. Your users get ONE try.
Report "passed EVERY time" instead — a model at 80% best-of-five may be at 30% every-time.</p>
<p><b>Remember:</b> a 7-out-of-10 rating from an AI judge is a random number wearing a suit. Use
yes/no checks a human verified.</p>`},

{t:'W18 · Memory — harder than it looks', p:'notes/week-18-memory', b:`
<p>You used PyTorch in March, JAX in April, PyTorch again in May. Ask "what do I use?" — search-by-
similarity returns ALL THREE conversations, equally. Similarity has no arrow of time. Memory needs
one: what's CURRENT, what got replaced.</p>
<p>Best starting advice, seriously: a plain text file of facts, pasted into the prompt. It's
inspectable, editable, and debuggable. Add fancy machinery (graphs, timestamps) only when the file
demonstrably breaks.</p>
<p><b>Remember:</b> forgetting is the hard part. Old facts don't announce themselves — they get
retrieved as confidently as fresh ones. Memory is genuinely NOT a solved problem yet.</p>`},

{t:'W20 · How to read AI research (and spot lies)', p:'notes/week-20-how-to-read-research-papers', b:`
<p>90% of AI papers don't matter; the skill is spotting the 10% fast. Read in passes: abstract,
pictures, conclusion — two minutes — THEN decide if it deserves twenty.</p>
<p>The lie-detector questions: What exactly was the comparison against, and did they tune it as hard
as their own method? (Most inflated results hide here.) Which benchmarks are suspiciously missing?
Did they test which part actually mattered?</p>
<p><b>Remember:</b> the math is mostly vocabulary, not genius. Learn 15 symbols and most papers open
right up. Papers age; this skill doesn't.</p>`},

{t:'W21 · LangGraph — the loop grows up', p:'notes/week-21-langgraph', b:`
<p>A simple agent loop breaks when you need: different paths for different cases, a human approving
mid-run, surviving a crash at step 7 without redoing 1-6. LangGraph's fix: describe your agent as a
MAP — steps are dots, arrows decide what's next, and everything the run knows travels in one bundle
of state.</p>
<p>Once the flow is a map instead of code, you get checkpoints, resume, pause-for-approval, and
replay almost for free.</p>
<p><b>Remember:</b> for simple tasks this is overkill — a plain loop is still the right default.
Reach for the machinery when the complexity is real, not before.</p>`},

{t:'W22 · The assignment — build the engine under it all', p:'notes/week-22-coding-an-agent-assignment', b:`
<p>Surprise assignment with NO AI in it: build a system that runs steps in the right order, in
parallel where possible, on machines that might die mid-job. Dependency maps, work queues, and
"leases" so a dead worker's job gets picked up by another.</p>
<p>Why in an AI course? Because that's what LangGraph IS underneath — and the unglamorous truth is
that most AI products fail at this layer: the model works fine, but the plumbing loses jobs and
can't resume.</p>
<p><b>Remember:</b> design every step so running it TWICE is safe. In distributed systems, everything
eventually runs twice.</p>`},

{t:'W23 · Hugging Face — the app store of AI', p:'notes/week-23-hugging-face-end-to-end', b:`
<p>Three layers: the HUB stores models and datasets (like GitHub for AI), the LIBRARIES do the work
(transformers loads models, peft does LoRA, trl trains), and SPACES turns a model into a shareable
web demo in 20 lines.</p>
<p>The real skill: reading a MODEL CARD like a detective. What data trained it? What's the license —
"open" doesn't always mean commercially usable! Is it "base" (rambles) or "instruct" (answers)?</p>
<p><b>Remember:</b> downloads and likes measure hype, not quality. The only test that matters is
running it on YOUR data.</p>`},

{t:'W24 · Observability — seeing inside a run', p:'notes/week-24-llm-observability', b:`
<p>Your AI took 9 seconds, burned 11,000 tokens, and returned garbage. Tests tell you THAT it
failed; observability shows you WHERE. A "trace" records one run as a tree: each search, each model
call, each tool — with its time, cost, and full text.</p>
<p>Suddenly the mystery dissolves: the 9 seconds was one slow tool call; the 11,000 tokens was
someone pasting a whole order history into step 4.</p>
<p><b>Remember:</b> capture full prompts and responses, not summaries — the bug lives in the detail.
And promote real failures from production into your test set: that's the improvement loop.</p>`},

{t:'W25 · Computer-use — AI with mouse and screen', p:'notes/week-25-computer-use-agents', b:`
<p>The final boss: an AI that operates a computer like you do — screenshot in, click out. No special
access, just pixels. Powerful, because most software has no other way in.</p>
<p>The hard part isn't deciding WHAT to click — it's WHERE. AI is terrible at exact pixel positions.
Best tricks: number the buttons on screen and ask it to pick a number, and verify EVERY click with a
fresh screenshot, because clicks fail silently.</p>
<p><b>Remember:</b> a screenshot is untrusted text — a webpage can contain instructions that hijack
your agent. Run these agents in a sandbox, always.</p>`},
]},

{ name:'WING 5 · THE EXTRA LESSONS — what the course skipped', color:0xffd257, items:[

{t:'S1 · Sometimes AI is the wrong tool', p:'supplementary/s01-classical-ml-and-tabular', b:`
<p>For spreadsheet-like data — rows, columns, numbers — big language models LOSE to a 20-year-old
technique called gradient boosting (many small decision trees voting). It's faster, cheaper, more
accurate, and tells you honest probabilities.</p>
<p>Core concept: overfitting. A model can memorize your examples perfectly and fail on new ones —
like a student who memorized past exams. Always test on data the model never saw.</p>
<p><b>Remember:</b> "just use ChatGPT" is often the wrong answer, and knowing when is a
professional superpower.</p>`},

{t:'S2 · Prompting is a real skill', p:'supplementary/s02-prompt-engineering', b:`
<p>The order of magic: 1) clear instructions with structure, 2) show 2-3 examples of what you want,
3) ask it to think step by step, 4) break big tasks into small ones. Each step is free and often
beats fine-tuning.</p>
<p>Say what TO do, not what to avoid ("write in plain English" beats "don't use jargon"). Put
instructions before content. Tell it what to do when unsure — or it will make something up.</p>
<p><b>Remember:</b> prompts are code. Version them, test them, and never edit them casually in
production.</p>`},

{t:'S3 · Is your AI actually good? Prove it.', p:'supplementary/s03-evaluation-and-statistics', b:`
<p>"It worked on my example" is not evidence. Run MANY test cases; report the range, not one number.
A 2-point improvement on 100 examples is noise — literally coin-flip territory.</p>
<p>The silent killer is leakage: your test questions hiding inside the training data. Public
benchmarks are all over the internet, so models have "seen the exam". Scores on them flatter.</p>
<p><b>Remember:</b> the only benchmark you can fully trust is a private one built from YOUR real
data, that no model has ever seen.</p>`},

{t:'S4 · AI security — the lethal trifecta', p:'supplementary/s04-safety-jailbreaks-guardrails', b:`
<p>Three ingredients make an AI system dangerous: access to private data, exposure to text strangers
wrote, and a way to send things out. Each is fine alone. Together = a data-theft machine anyone can
trigger by writing words your AI will read.</p>
<p>Word-filters ("ignore injected instructions") always lose eventually — attackers have infinite
phrasings. The defense that works: remove one ingredient. Take away the sending tool, or don't mix
private data with stranger text in one session.</p>
<p><b>Remember:</b> don't build a smarter deputy — build a deputy that CAN'T do the damage.</p>`},

{t:'S5 · Why your AI bill is huge (and how to cut it)', p:'supplementary/s05-inference-optimization-and-cost', b:`
<p>Biggest lever: prompt caching. If every request starts with the same instructions, providers can
skip re-processing them — often the single largest saving. Second: route by difficulty — most
requests are easy; send them to a small cheap model, save the big one for hard cases.</p>
<p>Also: output tokens cost several times more than input, so asking for terse answers is real
money. And batch overnight work — it's heavily discounted.</p>
<p><b>Remember:</b> put the STABLE stuff at the start of your prompt and the changing stuff at the
end — that's what makes caching work at all.</p>`},

{t:'S6 · Embeddings, properly', p:'supplementary/s06-embeddings-deep-dive', b:`
<p>How do meaning-maps get built? Contrastive learning: show the model pairs that belong together
and pairs that don't; pull matches close, push others apart. The examples that teach the most are
the TRICKY non-matches — "change your username" vs a password-reset question.</p>
<p>Why search uses two passes: fast-but-rough scans millions, slow-but-sharp re-ranks the top 20.
And fine-tuning your embeddings means re-processing your ENTIRE document collection — budget for it.</p>
<p><b>Remember:</b> similar meaning is not the same as RELEVANT — a document can be all about your
topic and still not contain your answer.</p>`},

{t:'S7 · Temperature and how AI picks words', p:'supplementary/s07-sampling-and-decoding', b:`
<p>The model doesn't output words — it outputs a probability for EVERY word it knows, and then one
gets picked. Temperature controls the picking: low = almost always the top choice (predictable,
good for facts); high = wilder choices (creative, risky).</p>
<p>Fun fact: temperature zero never guaranteed identical answers anyway — tiny math differences in
the computer break perfect repeatability. Need reliable structure? Use schema enforcement, which
makes invalid output literally impossible.</p>
<p><b>Remember:</b> the newest Claude models removed the temperature dial entirely — you steer by
ASKING now, in plain words.</p>`},

{t:'S8 · MCP — a USB port for AI tools', p:'supplementary/s08-model-context-protocol', b:`
<p>Problem: 4 AI apps × 6 systems (GitHub, database, Slack...) = 24 custom integrations, all
drifting apart. MCP is a shared plug standard: each system exposes ONE server, each app speaks ONE
protocol. 24 becomes 10.</p>
<p>But an MCP server is code someone else wrote, holding YOUR credentials, injecting text into YOUR
AI. Treat it like any dependency: read it, pin versions, give it minimal permissions.</p>
<p><b>Remember:</b> a tool's DESCRIPTION goes into the AI's prompt — a malicious server can hide
instructions there that you never see but the AI reads.</p>`},

{t:'S9 · How AI sees images', p:'supplementary/s09-multimodal-and-vision', b:`
<p>Simple: chop the image into 16×16 pixel squares, turn each square into a token, feed the same
transformer. An image is literally just more tokens — that's also why images cost money in
proportion to their AREA (double the size = 4× the price).</p>
<p>Systematic weaknesses: counting objects, exact positions, and small text — anything smaller than
one square is simply GONE, not blurry. So never trust a number an AI read off a chart.</p>
<p><b>Remember:</b> crop, don't shrink — a cropped region at full detail beats a whole image at low
detail, on both cost and accuracy.</p>`},

{t:'S10 · Why models got big — then small again', p:'supplementary/s10-scale-moe-distributed', b:`
<p>The Chinchilla discovery: everyone made models too BIG and fed them too LITTLE. A smaller model
trained on much more data beat a giant. Then economics flipped again: you train once but serve
billions of times, so today's trick is over-feeding small models that are cheap to run.</p>
<p>And the biggest architecture shift: Mixture of Experts — a model with 64 "expert" sections where
only 2 fire per word. Huge knowledge, small per-word cost.</p>
<p><b>Remember:</b> training needs ~6× the model's size in memory — that number explains every
memory trick in the field, including why QLoRA lets laptops fine-tune.</p>`},

{t:'S11 · Data — the unglamorous 90%', p:'supplementary/s11-data-curation', b:`
<p>A model IS its data, compressed. The most valuable cleanup, proven repeatedly: DELETING
duplicates — you train on less and get a BETTER model. Rare free lunch.</p>
<p>Every "quality filter" is secretly an opinion that becomes the model's personality. Filter out
all toxic text and the model gets WORSE at recognizing toxicity. And the tokenizer choice silently
decides what the model will be bad at (math, other languages) — forever.</p>
<p><b>Remember:</b> before training on 10,000 examples, read 100 of them with your own eyes. Nothing
automated replaces that hour.</p>`},

{t:'S12 · Many agents — when it helps, when it hurts', p:'supplementary/s12-multi-agent-systems', b:`
<p>Only three real reasons to use multiple AI agents: work that can truly run in PARALLEL, keeping
one agent's mess out of another's context, and a genuinely independent second opinion. If none
apply, you're paying a tax for nothing.</p>
<p>The tax: every handoff between agents LOSES information — like the telephone game — and the
receiver doesn't know what was lost. Five agents in a chain at 90% reliability each = 59% overall.</p>
<p><b>Remember:</b> one agent with good tools beats five agents with bad ones. Fix the tools first.</p>`},

{t:'S13 · World models — AI that imagines', p:'supplementary/s13-world-models', b:`
<p>Drop a glass — you KNOW it falls, without dropping one. That inner simulator is a world model,
and giving one to AI lets it test plans in imagination instead of expensive reality.</p>
<p>The catch: small prediction errors compound. Imagine 20 steps ahead and you're planning inside
fiction. That's why good agents act, LOOK at what actually happened, then re-plan — and why every
tool call is really the agent replacing prediction with observation.</p>
<p><b>Remember:</b> language models DO contain fragments of world models — real, measurable, and
causally used — but patchy and often wrong. Both extremes of that debate overreach.</p>`},
]},
];
