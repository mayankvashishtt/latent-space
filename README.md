# LATENT SPACE

**A 3D game played inside a neural network.** You are a token — a spark of information — traveling
through a vast model toward its Output Head. Ten chambers stand in your way, and each one *is* a
mechanism of modern AI: you don't read about gradient descent, you're dropped blind onto a loss
landscape and have to feel your way downhill.

> **Play it:** https://mayankvashishtt.github.io/latent-space/
> Desktop + keyboard + mouse. Chrome/Edge/Firefox. No install, no build, no assets to download.

---

## Design philosophy: Portal, not PowerPoint

Nobody out-renders Counter-Strike from a repo — and nobody needs to. *Portal* beat bigger games with
a fraction of the assets because **its mechanics were its ideas**. That's the bet here:

- **The rooms are the concepts.** The attention chamber doesn't explain softmax — it hands you a pool
  of exactly 1.00 and makes you spend it. The reward level doesn't warn you about Goodhart's Law —
  it lets you write a bad reward and watch a creature exploit it with terrifying sincerity.
- **Failure is the curriculum.** You *will* pick the wrong scroll with the semantic lantern, get owned
  by a wall sign, and watch your drone flail with a vague tool description. Every failure is scripted
  to be the exact failure the real technology has.
- **Nothing lectures until you've already felt it.** Each chamber ends with a short codex — *after*
  you've solved it — linking to the full lecture in the
  [38-lecture course archive](https://github.com/mayankvashishtt/ai-ml-bootcamp-archive).

Aesthetic: neon-Tron minimalism — emissive geometry, bloom, fog, and a data-stream sky. It renders
gorgeously in a browser and never apologizes for not being photoreal.

---

## The ten chambers

| # | Chamber | You physically… | Which teaches |
|---|---|---|---|
| I | **The Neuron** | rotate one glowing cut through data — then hit XOR, where no single cut can ever work | weights & bias, linear separability, Minsky 1969, why hidden layers exist |
| II | **Descent** | walk a fog-blind loss landscape with only a gradient arrow, a compute budget, and three step modes | gradient descent, learning rate (careful/normal/reckless), local minima, momentum |
| III | **The Tokenizer** | merge the most frequent pairs to build a vocabulary — then try counting the R's in `[STR][AW][BERRY]` | BPE, and why the strawberry failure is perception, not reasoning |
| IV | **Embedding Space** | carry misfiled words home by *meaning*, then ride KING − MAN + WOMAN to QUEEN | meaning as geometry, vector arithmetic, the date-blob that foreshadows RAG's failure |
| V | **Attention** | spend an attention pool that always sums to 1.00 — then the sentence changes under you | Q/K/V routing, softmax budget, causal mask (−∞ glass), the KV-cache choice |
| VI | **The Archive** | watch semantic glow fail on `2024-09-15`, grep it instead, then shred junk context to pass the reading gate | dense vs exact retrieval, hybrid search, context rot, "be surgical" |
| VII | **Agent Foundry** | write a drone's tool descriptions and watch the loop run — vague words produce a flailing agent | agent = LLM + tools + loop, errors-as-observations, harness quality |
| VIII | **Reward Peaks** | choose the reward signal; the creature optimizes what you *wrote*, not what you *meant* | reward hacking, Goodhart's Law, verifiable rewards (RLVR), GRPO |
| IX | **The Gauntlet** | a wall sign hijacks your courier; a prompt filter fails; revoking one tool wins | prompt injection, why filters lose, least privilege, the lethal trifecta |
| X | **Output Head** | a no-hints speedrun of everything, ending at the softmax gate with a temperature dial | all of it — plus logits, temperature, and sampling |

Progress saves automatically (`localStorage`). Chambers unlock in order; the hub corridor —
**The Residual Stream** — tracks your completion and turns gold at 10/10.

---

## Controls

`W A S D` move · mouse look · `SPACE` jump · `E` interact · `SHIFT` run · `1/2/3` step modes (Descent only)

## Run locally

Any static server works (ES modules need http, not `file://`):

```bash
git clone https://github.com/mayankvashishtt/latent-space
cd latent-space
python3 -m http.server 8080     # then open http://localhost:8080
```

No build step. No dependencies to install — Three.js loads from CDN via import map.

## Tech

- **Three.js** (r160) + UnrealBloom post-processing, all geometry procedural — zero binary assets
- Hand-rolled first-person controller, AABB collision, terrain height sampling
- WebAudio synth for every sound (no audio files)
- ~3,000 lines of vanilla ES modules; each level is one self-contained file over a shared engine/world toolkit

```
index.html          shell, HUD, menu, import map
src/engine.js       renderer, player, physics, interaction, panels, audio
src/world.js        rooms, terminals, doors, portals, text sprites, particles
src/levels/hub.js   the Residual Stream
src/levels/level01–10.js
```

---

## Coverage & the Expansion Chambers (roadmap)

The ten chambers cover the spine of the [course archive](https://github.com/mayankvashishtt/ai-ml-bootcamp-archive)
(38 lectures): neural nets, training, tokenization, embeddings, attention, RAG, agents, RLHF/RLVR,
safety, and sampling. The remaining lectures are **designed as future chambers** — each has a one-line
game concept ready:

| Expansion chamber | Lecture(s) | Concept |
|---|---|---|
| **The Fine-Tunery** | w12–13 | sculpt a frozen giant with tiny LoRA chisels; full-tuning crushes you under 4× memory blocks |
| **The Preference Courts** | w14 | judge pairs of answers; watch your inconsistent verdicts train a monster |
| **The Shipyard at Scale** | s10 | route tokens through a MoE — only 2 of 64 expert doors light per token |
| **The Cost Meter** | s5 | a speedrun where every token in your context bills you; prompt-cache checkpoints |
| **The Eye** | s9 | see the world as 16×16 patches; read a sign that dissolves below patch resolution |
| **The Memory Palace** | w18 | facts that supersede each other; a similarity-ghost keeps fetching the stale one |
| **The Orchestra** | s12 | command sub-drones whose reports lose detail at every handoff — the telephone game, playable |
| **The Dreamer** | s13 | plan 10 steps in an imagined world and watch compounding error make it fiction |
| **The Observatory** | w24 | replay a failed run as a walkable trace-tree and find the span that lied |
| **The Reading Room** | w20 | triage papers against the clock; missing-baseline traps everywhere |

PRs welcome. A chamber needs: one mechanic that *is* the idea, one scripted failure, one codex.

---

*Companion to the [AI-ML bootcamp archive](https://github.com/mayankvashishtt/ai-ml-bootcamp-archive) —
38 lectures, 760 quiz questions, a final exam, and the notes every codex links into.*
