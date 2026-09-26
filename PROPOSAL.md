# Product Proposal

## What is the product, and who uses it?

Cat Bluff is a **Consumer & Social / Gaming** card game for 2–4 friends. A single 52-card deck has four of each rank and a distinct cat meme for every physical card. Players see their own hands and opponents' hand counts. Each turn, a player places cards face down and claims the required rank, which cycles from Ace to King.

Opponents trust the claim or call BLUFF. A challenge reveals that turn's cards: the liar picks up the entire pile, or the challenger does if the claim was honest. The first empty hand wins only after its final claim survives. The growing pile makes each challenge riskier and rewards memory, probability and reading opponents. There are no stakes or token rewards.

Cat Chaos adds a brief random meme/sound reaction independent of the played cards. It adds personality without changing the outcome. Players can learn through local practice, then invite friends to a live room.

This proposal describes Classic 52. Program approval of the revised card mechanic has not been confirmed.

## Why Midnight specifically?

Opponents need to verify legal moves without seeing hidden hands. Midnight lets private witnesses constrain public encrypted state: players prove valid shuffles, card ownership, challenge openings and pile transfers. Joint shuffling and verified partial decryption let each recipient open their own hand without giving an individual dealer the complete plaintext deck.

A transparent contract checking plaintext cards would expose hidden hands; a conventional server would have to be trusted to deal and adjudicate fairly. Midnight verifies these rules while deliberately revealing only challenged plays. Privacy is part of the bluffing mechanic.

Limits remain: a two-player starting hand is inferable as the complement of the other hand; public history and collusion support further deductions. Privacy needs at least one honest, unpredictable shuffle. A remote prover sees private inputs and must be trusted. The full privacy model and operational limits are in [README.md](README.md#privacy-claim).

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
| Cat Chaos reaction | Local presentation, sampled independently of cards | The current viewer; no card information or new ledger state |

## Mainnet Feasibility

Classic 52 has local practice, compiled-circuit tests and a verified Preprod deployment; [README.md](README.md#contract-address) records the address and release status. A complete multi-wallet Preprod round and live latency measurements are still needed.

The bounded scope—52 cards, 2–4 players and ten circuits—makes a casual Mainnet pilot a possible Level 6 target. Before that, measure proving time, memory, bandwidth, tDUST and confirmation latency, especially during joint setup and pile pickup. Cached assets do not remove proving costs.

Release also needs independent cryptographic/contract review, private-key recovery and disconnect handling. A player refusing to open or transfer cards can currently stall a room; that must be addressed without exposing hands. Mainnet readiness depends on these results. Gambling, marketplaces and financial rewards remain outside scope.
