# Product Proposal

## What is the product, and who uses it?

Cat Bluff is a casual multiplayer card game for small groups of friends who enjoy bluffing, deduction and meme culture. It falls under **Consumer & Social / Gaming**. Each of 2–4 players receives five private cat cards. On a turn, a player commits a card face down and publicly claims which cat it is. The claim may be a lie. Opponents pass or challenge in seat order. If challenged, the player proves whether the claim matches the committed card: an honest claim makes the challenger draw two; a bluff makes the bluffer draw two. The first player with an empty hand after their final claim is settled wins.

The experience starts with an instant, clearly labelled practice game against Miso, then introduces wallet play and invitation links. The core release includes private committed hands, turn-based rooms, claim resolution, penalties, deadlines and a winner. It has no money stakes or token rewards. It evolves the previously approved secret-mission game into face-down card bluffing; approval of this revised mechanic still needs to be confirmed with the program if required.

## Why Midnight specifically?

A transparent smart contract that checks a hidden card normally needs to learn the card or trust an off-chain referee. Midnight's private witnesses let Cat Bluff verify that a player consumed a card from their committed hand and that a challenged claim is true or false without publishing the remaining cards or their salts. Public commitments prevent changing the played card after seeing a challenge.

The disclosure is deliberate: a true verdict confirms the publicly claimed cat; a false verdict excludes that cat but does not name the actual card. Counts, turns and results remain publicly checkable. Midnight provides the verification boundary for hidden-hand integrity and public outcomes. It does not automatically guarantee a fair shuffle or hide inputs from a separately trusted remote proving service.

## Data Model

| Data Point | Type | Disclosed To |
| --- | --- | --- |
| Room ID, pseudonymous player IDs, seats and turn | Public ledger | Everyone |
| Hand sizes, pending penalty counts, salted hand and card commitments | Public ledger | Everyone |
| Claimed cat, passes, challenger, response/proof deadline, result and winner | Public ledger | Everyone |
| Player identity secret and commitment salts | Private witness / browser storage | Player and the selected prover where required |
| Hand composition, pending draw composition and played-card opening | Private witness / browser storage | Player and the selected prover where required |
| Proof of card ownership, exact hand update and true/false claim result | Zero-knowledge proof | Verifiers learn validity and the disclosed result, not the remaining hand |

## Mainnet Feasibility

The MVP has bounded operations: five cat types, at most four players per room and seven public circuits. Browser practice, circuit execution tests and the production build are implemented. The new Cat Bluff contract is deployed on Preprod at `3cc6418a04b9d1e6deab06e5711e4e3c3876e697ba412202f932ebe030bc917e`; its schema and all seven circuit entrypoints were verified through the public indexer. A complete two-wallet game still needs live verification.

A casual Mainnet pilot without prizes may be feasible after successful Preprod testing, an independent contract review and measured proving/load tests. The main readiness gaps are fair dealing, private-state recovery, abandoned-turn handling, robust reconnects and the hosted-prover trust model. Currently the browser chooses initial and penalty cards; the circuit enforces counts and committed-card use but cannot prove unbiased randomness. A competitive release therefore needs a verifiable private shuffle/deal protocol before rewards can be trusted. Multiple identities and colluding players also require an explicit policy and, if rewards are introduced, Sybil resistance.

Level 4 targets the card-game core and documented Preprod validation. Level 5 can address private dealing, recovery and multiplayer failure cases. Level 6 should require measured latency, security and privacy review, reliable proving infrastructure, and a release decision based on those results. Mainnet deployment should not be described as ready merely because the UI builds.
