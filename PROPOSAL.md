# Product Proposal

## What is the product, and who uses it?

Cat Bluff is a **Consumer & Social / Gaming** product for 2–4 friends who enjoy deception, deduction and cat memes. It adapts the familiar Cheat/Bluff card game: one conserved 52-card deck, four cards of every rank, and a distinct meme visual for each physical card. Players know their own hands, see opponents' hand counts, and take turns declaring the required rank while placing one or more cards face down. The rank follows Ace through King, then repeats.

Opponents may trust a claim or call BLUFF. A challenge opens only the latest play. If any card has the wrong rank, the bluffer picks up the entire central pile; an honest play makes the challenger pick it up. Unchallenged cards accumulate, increasing the cost of a mistaken challenge. The first empty hand wins only after its final claim is resolved. Memory, the four-copy limit, a player's remaining hand count and the size of the pile create the decisions; there are no stakes, tokens, XP, special powers or artificial delays.

The app retains its existing React, Lace and Midnight integration, with an instant local practice mode and shareable live rooms. The revised V4 contract adds a joint private shuffle instead of a hosted dealer. The previously deployed V3 five-cat game remains separate and available to existing rooms. The card-game concept evolved from the approved secret-mission proposal; this document does not claim the revised mechanic has already received program approval.

## Why Midnight specifically?

Fair card play requires two properties that conflict on a fully transparent ledger: opponents must not see hidden hands, yet they must verify that nobody duplicates cards, swaps a challenged card or invents a pickup. Midnight lets private witnesses constrain public encrypted state. Each participant proves a valid private permutation and re-randomization of the original deck, then contributes a verified partial decryption that leaves the recipient's encryption intact. No individual dealer receives the complete plaintext deck.

The same verification boundary enforces legal card ownership, response order, challenge openings and private re-encryption during pile pickup. Only challenged cards become public; other cards remain encrypted to their current holder. This makes privacy part of the bluffing mechanic itself. A server-authoritative game could offer private hands too, but players would have to trust that server's dealing and adjudication.

A full two-player deal mathematically reveals the opponent’s starting hand as the complement of one’s own, although face-down selections and encrypted-slot identities remain hidden. Three- and four-player tables preserve more uncertainty about individual hands; collusion can reduce it.

The claim has limits: ciphertext slot movements and counts are public; previously revealed cards remain deducible; players can collude; a circuit cannot force honest random choice or an absent player to cooperate. A remote prover receives private inputs, including table keys, and must be trusted. A local prover is needed for privacy from that service. The protocol requires independent review before making stronger competitive-security claims.

## Data Model

| Data Point | Type | Disclosed To |
| --- | --- | --- |
| Room, pseudonymous player IDs, public encryption keys and seats | Public ledger | Everyone |
| Encrypted 52-card deck, opaque slot owners and encryption custodians | Public ledger | Everyone; ciphertext is not plaintext hand composition |
| Hand counts, central pile size, required rank and selected opaque slots | Public ledger | Everyone |
| Declarations, responses, challenge result, revealed current-turn cards and winner | Public ledger | Everyone; challenged card identities are deliberately public |
| Identity secret and per-table encryption secret | Private browser state / witness when required | Player and selected prover; not published to the ledger |
| Shuffle permutation and re-randomization values | Private witness | Contributing player and selected prover |
| Current private hand | Locally decrypted data | Its owner; deductions from previous public reveals remain possible |
| Shuffle, deal, opening and pickup validity | Zero-knowledge proof | Verifiers learn validity and specified public outputs |

## Mainnet Feasibility

The V4 implementation is bounded to four players and 52 cards, with ten public circuits. It preserves the existing app and V3 deployment, adds a fully playable local practice implementation, and tests actual compiled circuits for 2/3/4-player deals, conservation, private ownership, false openings, whole-pile transfers and rematches. The V4 contract compiles, 90 tests pass and the app builds. It is deployed on Preprod at `616618c2dd897208bc75fdf25a912fad5567d97935d002a199b8a528b1def946`; schema 4 and all ten verifier keys were checked on-chain. Local synthetic-state proving has also succeeded for all ten circuits. A complete multi-wallet Preprod playthrough and live latency measurement remain necessary before production promotion.

Joint shuffling introduces meaningful setup cost: each player contributes a shuffle and a private deal share. Challenge pickup can require multiple contributors to re-encrypt their pile cards. Ordinary plays do not repeat the shuffle. Circuit material is cached and prefetched, but actual proving, bandwidth, tDUST and confirmation costs must be measured before claiming satisfactory live gameplay. A free prover with limited memory may not support the largest circuits.

A casual, non-financial Mainnet pilot could be considered by Level 6 if Preprod validation, independent cryptographic/contract review, browser-key recovery, disconnect handling and measured load/latency meet release criteria. The current cooperative protocol can stall when someone refuses to open or transfer cards; resolving that without exposing private hands is an explicit next-stage design problem. Mainnet readiness should follow those results, not a successful frontend build. Rewards, gambling, marketplaces and ranked competition are outside the base release.
