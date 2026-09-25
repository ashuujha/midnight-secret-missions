# Product Proposal

## What is the product, and who uses it?

Secret Trail is an asynchronous multiplayer strategy game for players who enjoy bluffing and deduction. A player receives a private ordered route of three locations, then makes five public visits. Two visits can be decoys. Other players watch the trail and may stake a challenge token if they think the route cannot be proved. The runner earns a point by proving that the committed route appears in the five visits. If the runner forfeits or misses the challenge deadline, the challenger earns the point and gets the token back. Players can start another round with a new private mission.

The first playable level has five locations, eight possible missions, three route stops, two decoys, and a 20-minute challenge deadline. Challenge tokens are in-game counters with no monetary value. Later levels may add longer routes, more decoys, time constraints, and branching objectives; those are not part of this release.

## Why Midnight specifically?

On a transparent chain, verifying a specific route normally requires publishing it, which would reveal which visits were decoys. Midnight lets the browser commit to a mission before the first move, then prove that the private mission occurs in the ordered public trail without writing the mission or decoy labels to the ledger. Everyone sees the visits, challenge stakes, deadlines, and scores. The verifier learns that the committed condition was met, not the route itself.

## Data Model

| Data Point | Type | Disclosed To |
| --- | --- | --- |
| Player ID, round number, mission commitment | Public ledger | Everyone |
| Five ordered location visits | Public ledger | Everyone |
| Run and challenge status, challenger ID, deadline, scores, challenge tokens | Public ledger | Everyone |
| Identity secret, mission number, mission salt, and decoy interpretation | Private witness stored in the player's browser | Player and any prover the player chooses to trust |
| Proof that the committed route appears in order within the five visits | Zero-knowledge proof | Verifiers learn validity, not the route |

## Mainnet Feasibility

The first level has bounded computation: eight route templates and five visits per round. Contract tests cover a successful proof, challenge win and loss, forfeit, replay, and authorization. A new Preprod deployment and a complete wallet playthrough are still required before this version can be called live.

Mainnet competition needs a fair mission-assignment protocol. The current browser selects a mission, so a modified client can choose an easy one. Public trails may narrow the route to one possibility, and multiple browser identities can manipulate a leaderboard. Before prizes or financial stakes, the game also needs identity or Sybil resistance, recovery for lost private state, privacy analysis of route inference, load tests, and a clear trust model for hosted proving services.
