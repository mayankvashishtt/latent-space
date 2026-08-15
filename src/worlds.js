// The course, divided into 4 worlds of chambers that belong together.
// Complete every chamber in a world → earn its star. 4 stars unlock the final gate.

export const WORLDS = [
{ key:'w1', name:'WORLD 1 · HOW A MACHINE LEARNS', color:'#54e0ff',
  blurb:'Before anything can be smart, it has to learn. Here you don\'t study learning — you BECOME the learning algorithm.',
  chambers:[
    {i:1, n:'I · The Neuron',  d:'one brain cell can only draw ONE straight cut — find out where that breaks (and how layers fix it)'},
    {i:2, n:'II · Descent',    d:'walk a foggy valley blind, feeling for downhill — that is literally how all AI training works'},
  ]},
{ key:'w2', name:'WORLD 2 · HOW IT READS AND THINKS', color:'#5cff9d',
  blurb:'How does text become thought? Three machines stand between letters and meaning — you will operate all three by hand.',
  chambers:[
    {i:3, n:'III · The Tokenizer',   d:'AI can\'t read letters, only chunks — build the chunk machine, then meet the strawberry problem'},
    {i:4, n:'IV · Embedding Space',  d:'every word is a LOCATION on a map of meaning — file lost words, then compute KING−MAN+WOMAN'},
    {i:5, n:'V · Attention',         d:'a budget that always sums to 1 decides which words matter — spend it, and watch meaning move'},
  ]},
{ key:'w3', name:'WORLD 3 · HOW YOU BUILD WITH IT', color:'#ff9d5c',
  blurb:'Now the model is a tool in YOUR hands. Learn why AI search fails on exact facts, and why an agent is only as good as your instructions.',
  chambers:[
    {i:6, n:'VI · The Archive',      d:'meaning-search fails hard on a simple date — fix it with exact-match, then survive context rot'},
    {i:7, n:'VII · Agent Foundry',   d:'a robot in a think-act-observe loop — your tool descriptions decide whether it succeeds'},
  ]},
{ key:'w4', name:'WORLD 4 · HOW YOU TAME IT', color:'#ff4fd8',
  blurb:'The dangerous part. AI does what you REWARD, not what you want — and anyone who can write text can try to hijack it.',
  chambers:[
    {i:8, n:'VIII · Reward Peaks',   d:'pick a creature\'s reward and watch it exploit your exact words — Goodhart\'s law, playable'},
    {i:9, n:'IX · The Gauntlet',     d:'a wall sign hijacks your robot — filters fail, removing the dangerous power wins'},
  ]},
];

export const FINAL = { i:10, n:'X · OUTPUT HEAD', d:'the final test — every idea at once, no hints, then the softmax gate', needs:4 };
export const ACADEMY = { i:11, n:'THE ACADEMY', d:'all 38 course lessons in plain words, read aloud — always open, never locked' };
