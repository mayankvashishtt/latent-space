// The course, divided into 4 worlds. Each world finished = one star. 4 stars open the final gate.

export const WORLDS = [
{ key:'w1', name:'WORLD 1 · HOW A MACHINE LEARNS', color:'#54e0ff',
  blurb:'One big journey: make a brain cell\'s cut, meet the cut that can\'t exist, then step off the edge and BECOME the training algorithm.',
  chambers:[
    {i:1, n:'I · The Learning Machine', d:'three acts — one straight cut, the impossible XOR, and a blind descent through the valley of training'},
  ]},
{ key:'w2', name:'WORLD 2 · HOW IT READS AND THINKS', color:'#5cff9d',
  blurb:'How does text become thought? Three machines stand between letters and meaning — you will operate all three by hand.',
  chambers:[
    {i:2, n:'II · The Tokenizer',    d:'AI can\'t read letters, only chunks — build the chunk machine, then meet the strawberry problem'},
    {i:3, n:'III · Embedding Space', d:'every word is a LOCATION on a map of meaning — file lost words, then compute KING−MAN+WOMAN'},
    {i:4, n:'IV · Attention',        d:'a budget that always sums to 1 decides which words matter — spend it, and watch meaning move'},
  ]},
{ key:'w3', name:'WORLD 3 · HOW YOU BUILD WITH IT', color:'#ff9d5c',
  blurb:'Now the model is a tool in YOUR hands. Learn why AI search fails on exact facts, and why an agent is only as good as your instructions.',
  chambers:[
    {i:5, n:'V · The Archive',    d:'meaning-search fails hard on a simple date — fix it with exact-match, then survive context rot'},
    {i:6, n:'VI · Agent Foundry', d:'a robot in a think-act-observe loop — your tool descriptions decide whether it succeeds'},
  ]},
{ key:'w4', name:'WORLD 4 · HOW YOU TAME IT', color:'#ff4fd8',
  blurb:'The dangerous part. AI does what you REWARD, not what you want — and anyone who can write text can try to hijack it.',
  chambers:[
    {i:7, n:'VII · Reward Peaks', d:'pick a creature\'s reward and watch it exploit your exact words — Goodhart\'s law, playable'},
    {i:8, n:'VIII · The Gauntlet', d:'a wall sign hijacks your robot — filters fail, removing the dangerous power wins'},
  ]},
];

export const FINAL = { i:9, n:'IX · OUTPUT HEAD', d:'the final test — every idea at once, no hints, then the softmax gate', needs:4 };
export const ACADEMY = { i:10, n:'THE ACADEMY', d:'all 38 course lessons in plain words — always open, never locked' };
