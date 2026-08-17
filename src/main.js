// LATENT SPACE — entry point.
import { boot } from './engine.js';
import './map.js';
import './story.js';
import hub from './levels/hub.js';
import learn from './levels/level_learn.js';
import tok from './levels/level03.js';
import emb from './levels/level04.js';
import att from './levels/level05.js';
import arc from './levels/level06.js';
import fon from './levels/level07.js';
import rew from './levels/level08.js';
import gau from './levels/level09.js';
import out from './levels/level10.js';

boot([hub, learn, tok, emb, att, arc, fon, rew, gau, out]);
