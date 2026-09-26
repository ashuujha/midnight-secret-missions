# Cat Bluff
![CI](https://github.com/ashuujha/midnight-secret-trail/actions/workflows/ci.yml/badge.svg)

> 52 meme cats. Four of every rank. Lie to your friends—or risk picking up the whole pile.

**Classic 52 release status:** the new 2–4 player rules, joint private shuffle, practice table and V4 contract are implemented. Local compiled-circuit tests and the production build pass. **V4 still needs a new Lace deployment and a complete multiplayer Preprod playthrough.** The existing V3 deployment remains the earlier five-cat game; its address cannot run the new rules.

![Classic 52 practice table](screenshots/classic52-table.png)

[Mobile](screenshots/classic52-mobile.png) · [Dark theme](screenshots/classic52-dark.png). Screenshots show local practice, not blockchain transactions.

## Live Demo

[Current production site](https://cat-bluff-ashuu.vercel.app/) · [Public repository](https://github.com/ashuujha/midnight-secret-trail)

In the Classic 52 build, choose **Try a practice round**, pick 2, 3 or 4 players, then **Deal the cats**. You play against local bots. Practice needs no wallet and generates no proof.

For live play after V4 deployment, choose **Play with friends**, connect Lace and create a room. Send **Invite friends** to 1–3 people. Each joins with their own wallet and browser. The host can start with **two, three or four players**. Invitations contain public room and contract IDs; they never include table keys or hands.

Existing V3 invitation links still open the earlier five-cat table. The new lobby also includes **Open earlier five-cat tables**. No V3 contract or saved hand is migrated or overwritten.

## Contract Address

| Version | Network | Address / deployment status |
| --- | --- | --- |
| Classic 52 V4 | Preprod | Deployment pending: requires a new Lace signature. Set `VITE_CLASSIC_CONTRACT_ADDRESS` to its returned address. |
| Earlier Cat Bluff V3 | Preprod | [`3cc6418a04b9d1e6deab06e5711e4e3c3876e697ba412202f932ebe030bc917e`](https://preprod.midnightexplorer.com/contracts/0x3cc6418a04b9d1e6deab06e5711e4e3c3876e697ba412202f932ebe030bc917e) — schema 3 and seven circuit verifier keys checked; earlier five-cat rules |

V4 has **schema 4 and ten public circuits**. The V3 address belongs only in `VITE_CAT_BLUFF_CONTRACT_ADDRESS`. A frontend deployment does not deploy a contract. Do not use an older Secret Trail address for either card game.

## What This Does

1. **Deal every cat.** A single 52-card deck contains 13 ranks and four physical copies of each. Each card has its own cat meme image. Two players get 26 each; three get 18/17/17; four get 13 each.
2. **Play face down.** Select one or more cards. The required rank starts at Ace. Playing two cards declares “2 Aces.” The quantity is exact; the ranks may be a lie.
3. **Trust or BLUFF!** Opponents respond clockwise. If everyone trusts, the cards stay face down in the central pile. The next player claims the next rank: A → 2 → … → K → A.
4. **Risk the entire pile.** A challenge opens only the cards from that turn. Any wrong rank means the bluffer takes the whole pile. An honest play means the challenger takes it. Earlier unchallenged cards are not publicly revealed during pickup.
5. **Survive your final claim.** An empty hand wins only after the final play is passed by every opponent or its challenge and pile transfer finish. A caught final bluff returns the pile to the player instead of declaring a winner.
6. **Play again.** The host starts another round in the same room, with a fresh joint shuffle.

There are no extra cards, replacement draws, stakes, coins, powers or artificial game timers. The growing pile supplies the risk. You can reason from your hand, the four-copy limit, opponents' hand counts and the public history. A passed claim is recorded as **trusted**, not as a proven lie or truth.

### Live shuffle and pickup

There is no hosted dealer. Players register separate identity and encryption keys, then each privately permutes and re-randomizes the full encrypted deck. A circuit checks every shuffle is a permutation of exactly the original 52 cards. Each participant then removes their encryption layer from other players' assigned cards; each recipient's layer remains. The recipient opens their own hand locally.

Setup needs one shuffle and one deal transaction per player, after room creation, joins and the host's start. On a challenged pickup, each contributor returns all pile cards still encrypted under their key in a single re-encryption proof. Cards already encrypted for the recipient need no extra transfer. Only the recipient opens their newly received pile cards; other contributors do not receive that new plaintext hand. The next turn starts after the pickup is complete.

**Cooperation limit:** everyone must remain available for setup, opening a challenged play and returning their contributed pile cards. An absent or malicious player can stall the room. There is no timeout that labels silence a proved lie. Browser key recovery and disconnect recovery remain release limitations.

### Interface and performance

The table centers the required rank, the public claim and the pile at risk. Your hand is a selectable rank-sorted grid; opponents show only counts. History records declarations, responses and challenge results. Original cat meme images and short recorded reactions are self-hosted, with a coordinated light/dark theme, mute and animation controls. Reduced-motion preferences are respected.

All **52 card faces download together as one catalog**, including in live mode. The server therefore receives no image request tied to an individual private card. Source bytes are preserved; [media credits](public/media-credits.json) list all 52 origins. No generated cat imagery is used.

Practice does not load the Midnight proving runtime. Live circuits load on demand; their keys are cached and the next relevant circuit is prefetched. Ordinary plays move owned encrypted slots without re-shuffling the deck. Private shuffle, opening and transfer proofs are substantially larger than play/pass proofs. The UI reports actual proof, wallet, submission and confirmation stages, not a simulated success.

A fresh local proof-server 8.1.0 run produced proofs for all ten circuit types: ordinary play/pass/call took approximately **0.8–1.1 seconds**, start-round about **4.9 seconds**, and the heavier shuffle, deal, reveal and transfer operations approximately **6–20 seconds**. These are single-machine synthetic-state measurements, excluding downloads, wallet balancing and chain confirmation. The fixed public card encodings reduce the start-round proving key from about 21 MB to 11 MB. The prover used several GB of memory; repeated runs across multiple contract builds exhausted a 3.5 GB Docker VM, so plan memory headroom and restart after changing builds. A 512 MB free service is not a validated host for this protocol.

**No live speed guarantee:** proof generation, Lace balancing and network confirmation still take time. V4's complete live latency has not yet been measured. The protocol and generated proving material are more substantial than V3; a small free hosted prover may be insufficient.

## Privacy Model

- **PUBLIC:** room IDs, pseudonymous seats, public encryption keys, encrypted deck, opaque card-slot ownership, hand sizes, required rank, chosen slots, pile size, quantities, responses, history, challenge openings, results and winner.
- **PRIVATE:** identity and encryption secrets, shuffle permutation and blinding values, unchallenged plaintext cards and the remaining hand. Table keys persist locally under the wallet, contract and room.
- **PROVED without revealing the rest of a hand:** knowledge of a seat's secret; a valid permutation and re-encryption of the original deck; correct private dealing; legal ownership of selected physical cards; truthful opening of the challenged cards; and unchanged plaintext during private pile transfers.

## Privacy Claim

An observer can see who acts, how many cards move and which opaque slots move. Before a challenge, ciphertexts do not publish their ranks. A challenge deliberately discloses **all actual cards from that play**, whether the claim was true or false. Previous reveals and slot continuity allow memory, tracking and deduction. Public counts can also narrow possible hands; the game does not promise to hide information logically implied by play.

**Two-player deduction:** with all 52 cards dealt between two players, each starting hand is the complement of the other. A player can therefore infer the opponent’s initial hand even though the app never decrypts or sends it to them. Which encrypted slots correspond to those cards, and which cards were played face down, remain hidden until disclosed or deduced. With three or four players, the unknown cards are distributed across multiple hands; collusion can still remove that uncertainty.

The joint shuffle uses ElGamal-style encryption over Midnight's Jubjub operations. Privacy relies on the cryptographic assumptions, private keys and at least one honest, unpredictable shuffle contribution. The client uses cryptographic randomness and rejection-sampled Fisher–Yates; the circuit proves a valid permutation, **not that a participant chose their randomness honestly**. Colluding players can share their hands. The protocol has not received an independent security audit.

**A prover sees private inputs.** A hosted prover receives table secrets needed by its circuits. If everyone uses one service, that operator could reconstruct the whole deck or impersonate seats. For privacy from a proving service, run a compatible prover on your own device. A localhost bridge that forwards requests to Render is still remote proving. V4 intentionally defaults to Lace's provider and does not inherit V3's hosted-prover environment variable; explicitly setting `VITE_CLASSIC_PROOF_SERVER_URL` opts into that trust.

Only the local player's key is used to decrypt their hand in live UI state. Opponent ciphertexts are public but their plaintext hands are never sent through a game API or logged. Someone with access to the browser profile can read the saved private key. Keep the same browser, wallet and site origin; deleting browser data can make participation unrecoverable. A card catalog is public artwork, not a list of dealt cards.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Interface | Existing React 19, TypeScript, Vite 7 and custom CSS |
| V4 contract | Compact 0.31.1, schema 4, ten public circuits |
| Network / wallet | Midnight Preprod / Lace connector API 4 |
| Client | Midnight.js 4.1.1, Compact runtime 0.16 |
| Tests | Node test runner via tsx; real compiled-circuit simulation |
| CI / hosting | GitHub Actions / Vercel |

| Responsibility | File |
| --- | --- |
| V4 ledger, shuffle, deal, play and pickup | [`contracts/cat-bluff52.compact`](contracts/cat-bluff52.compact) |
| Practice rules and restricted bot views | [`src/game/classic-rules.ts`](src/game/classic-rules.ts) |
| V4 Midnight adapter and private key recovery | [`src/midnight/classic52.ts`](src/midnight/classic52.ts) |
| Confirmed table polling and wallet actions | [`src/hooks/useClassic52.ts`](src/hooks/useClassic52.ts) |
| New table inside the existing app shell | [`src/components/ClassicGame.tsx`](src/components/ClassicGame.tsx) |
| Preserved V3 implementation | `contracts/cat-bluff.compact`, `src/midnight/cat-bluff.ts`, existing table in `src/App.tsx` |

## Prerequisites

- Node.js 22 and npm.
- Compact CLI 0.5.2, compiler 0.31.1; [official tooling guide](https://docs.midnight.network/compact/compilation-and-tooling).
- Live players: Lace on Preprod, usable tDUST and a working proof server.
- Two separate wallet/browser profiles to test a real multiplayer round. Practice needs none.

## Setup & Run Locally

```bash
git clone https://github.com/ashuujha/midnight-secret-trail.git
cd midnight-secret-trail
npm ci
compact update 0.31.1
npm run compile
cat > .env.local <<'ENV'
VITE_MIDNIGHT_NETWORK=preprod
# Keep the earlier contract available for existing rooms:
VITE_CAT_BLUFF_CONTRACT_ADDRESS=3cc6418a04b9d1e6deab06e5711e4e3c3876e697ba412202f932ebe030bc917e
# Fill this only after deploying V4 through Lace:
VITE_CLASSIC_CONTRACT_ADDRESS=
# Omit VITE_CLASSIC_PROOF_SERVER_URL to use Lace's configured prover.
ENV
npm run dev
```

Open the Vite URL. **Try a practice round** gives an instant local game. To deploy V4, choose **Play with friends → Set up live play → Connect Lace → Deploy Classic 52 with Lace**. Approve in Lace. Copy the returned address into `VITE_CLASSIC_CONTRACT_ADDRESS` locally and in Vercel, then rebuild. Local development also remembers the deployment address in that browser. The earlier CLI deployment script still deploys V3; use the new browser action for V4.

Live test sequence:

1. Create a room, copy its invitation and join from a second profile. Test three/four seats separately if available.
2. Host starts. Each player submits their shuffle in order, then each submits the private deal share in order.
3. Check the hand sizes sum to 52. Each profile should display only its own card faces.
4. Play multiple cards; let all opponents trust and observe the pile remain.
5. Challenge both an honest and a false claim. Open the challenged cards and complete required private pile transfers. Check the entire pile reaches the correct player.
6. Verify that a final claim still permits a challenge, record transaction receipts, and test a rematch.

If Lace points to `http://localhost:6300`, a compatible **real local proof server** must run there for device-only proving. The existing `npm run proof:bridge` instead forwards Lace requests to a hosted service and shares private inputs with that service. It is not a privacy-preserving replacement for a local prover. Site environment variables do not change Lace's own proving setting.

## Run Tests

```bash
npm test
npm run build
npm run typecheck:deploy
# Recompile both card contracts, test, build, check the earlier deployment CLI:
npm run check
```

[Test output screenshot](screenshots/classic52-tests.png) shows selected contract checks and the complete **79-passing-test** summary. Tests cover full 2/3/4-player joint deals, 52 unique physical cards, inability to decrypt another player's cards with one's own key, invalid permutations and openings, ownership, turn order, whole-pile pickup, private re-encryption, final claims and rematches. Practice simulations check conservation throughout long games and expose only each bot's own hand. Earlier V3 and trail regressions remain included.

For an optional real local-prover benchmark, run a compatible proof server on port 6301, then:

```bash
npm run benchmark:proof
# Optional local endpoint override:
CLASSIC_BENCHMARK_PROVER=http://127.0.0.1:6301 npm run benchmark:proof
```

The benchmark creates synthetic keys, proves all ten circuit types against locally constructed state, and prints timings only. It never submits a transaction or uses a wallet. It is separate from CI and rejects remote prover URLs.

These tests execute compiled circuits locally. They do **not** by themselves prove that a live prover accepted a transaction or that two Lace wallets completed a game. Browser checks separately exercise card selection, gameplay, themes, media, accessibility, mobile layout and missing-wallet errors.

## CI/CD

[CI](.github/workflows/ci.yml) runs on pushes to `main` and pull requests. It installs Node 22 and pinned Compact, runs `npm ci`, compiles V3 and V4, executes tests, builds the production app and typechecks the existing deployment CLI. The title badge tracks `main`; inspect the release PR's checks for branch-specific validation.

Vercel runs `npm run build:vercel`: install the pinned compiler when needed, compile V4, then typecheck and build. Large V4 keys and ZKIR are generated during builds rather than committed. `scripts/copy-zk-assets.mjs` copies them to `/classic52/`; legacy proving assets keep their original URLs. A clean checkout needs `npm run compile` before `npm run dev` or `npm run build`.

Keep V3's environment variable for old rooms, add V4's separate address after verifying its deployment, and test a preview before promotion. Do not promote a build as a working V4 multiplayer release until the new address and full wallet flow have been verified.

## Product Proposal

See [PROPOSAL.md](PROPOSAL.md) for product/users, Midnight rationale, data model and Mainnet scope. Approval of this revised card mechanic is not represented as granted.

## Demo Video

A new Classic 52 video remains pending. Show two real profiles: connect, create/invite/join, private shuffle/deal, a face-down multi-card claim, BLUFF!, opening and whole-pile pickup. Include a real confirmed receipt, passing tests and the CI run. Do not substitute the earlier counter or route-game video for this game.

## Submission Checklist

- ✓ Public repository and implementation documentation.
- ✓ Classic 52 contract compiles; local rule and compiled-circuit tests pass.
- ✓ CI workflow and badge included; release checks must pass before promotion.
- ✓ Existing V3 Preprod address retained for earlier rooms.
- ✗ New V4 Preprod deployment/address and complete live multiplayer verification.
- ✗ Verified Classic 52 production release.
- ✗ Current game demo video.
- ✗ Dedicated product X profile linked here.
- ✓ Repository already exceeds 15 meaningful commits; no artificial commit padding.

## Media Credits

[All image, recording and font sources](public/media-credits.json). Third-party media retains its original rights and is not licensed under the repository's code licence. Self-hosted fonts include their licence files in `public/fonts/`.
