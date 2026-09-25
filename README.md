# Secret Trail

![CI](https://github.com/ashuujha/midnight-secret-missions/actions/workflows/ci.yml/badge.svg)

> A multiplayer bluffing game where everyone sees your moves, but only you know which stops fulfill your secret mission.

**Release status:** Secret Trail is the next version of the [public Secret Missions repository](https://github.com/ashuujha/midnight-secret-missions). Its new contract and frontend are on the `feature/secret-trail-challenges` branch. The [current Vercel site](https://midnight-secret-missions.vercel.app/) and Preprod address below still run the earlier Secret Missions rules. Secret Trail needs a fresh Preprod deployment and a complete wallet playthrough before the new version can replace them.

![Secret Trail desktop preview](screenshots/secret-trail-desktop-preview.png)

[Mobile preview](screenshots/secret-trail-mobile-preview.png) · These show the local V2 interface before its Preprod deployment.

## Live Demo

[Play the currently deployed Secret Missions game](https://midnight-secret-missions.vercel.app/). This is the previous version, not a Secret Trail challenge demo.

A dedicated Secret Trail product X profile and a one-minute video of its full wallet flow have not been published yet.

## Contract Address

| Version | Network | Address | Status |
| --- | --- | --- | --- |
| Secret Missions V1 | Preprod | [`41faea462a257e1f01f171eea6a279e2746cc4165a80e0ba5d05b6fc5c5cda7e`](https://preprod.midnightexplorer.com/contracts/0x41faea462a257e1f01f171eea6a279e2746cc4165a80e0ba5d05b6fc5c5cda7e) | Live; incompatible with Secret Trail |
| Secret Trail V2 | Preprod | Pending Lace deployment | Contract compiled and tested locally |

Never point the Secret Trail frontend at the V1 address. The two contracts have different ledger schemas and circuits.

## What This Does

Each player receives one of eight private three-stop routes through Museum, Cafe, Stadium, Park, and Mall. They make exactly five public visits. The three mission stops must occur in order; the remaining two visits can be decoys. A commitment to the mission is recorded before the first visit, and a zero-knowledge proof verifies the route at the end without revealing the mission number or labeling the decoys.

Other registered players can watch a run after its first move and spend one of their three challenge tokens to challenge it. The runner then has a 20-minute deadline to finish five moves and prove the route. A valid proof gives the runner one point and burns the challenger's staked token. If the runner forfeits or misses the deadline, the challenger gets one point and their token back. Any registered player may settle an expired challenge for the original challenger. A settled player can start a fresh round with a new private mission and salt.

Challenge tokens and points have **no monetary value**. Level 1 is implemented here. Levels 2–4—longer routes, extra decoys, time constraints, and branching missions—are planned, not playable yet.

## Privacy Model

- **PUBLIC:** player ID, round, mission commitment, every location visited and its order, run/challenge status, challenger ID, deadline, score, and challenge-token balance.
- **PRIVATE:** identity secret, mission number, random commitment salt, and which visits the player intends as decoys. These live in the player's browser and are supplied as private witnesses for proving.
- **PROVED without revealing:** the committed mission's three locations occurred in order within the five public visits, before the challenge deadline when challenged.

## Privacy Claim

An on-chain observer sees the entire five-visit trail and whether a proof succeeded. The contract does not publish the secret mission or decoy labels. Observers can still **infer** possible missions from the trail; some trails may fit only one of the eight templates. The game hides the witness from the ledger, not every clue from other players.

A hosted prover may receive private proving inputs. The prototype stores the player's secret and mission in browser local storage; someone with access to that browser profile can read them, and clearing storage loses the ability to act as that player. A modified browser can choose its mission before joining, so the current proof establishes completion of a **committed** mission, not fair mission assignment. Multiple browser identities can also manipulate a leaderboard; no financial rewards should depend on this version.

## Tech Stack

Compact smart contract and Midnight Preprod; React 19, TypeScript, Vite 7; Midnight.js 4.1; Lace wallet connector; local or configured hosted proof server. The new contract is [`contracts/secret-trail.compact`](contracts/secret-trail.compact), with generated proving assets in `managed/secret-trail`. The previous V1 contract remains in the repo for reference.

## Prerequisites

- Node.js 22 and npm.
- Compact CLI 0.5.2 with compiler 0.31.1; see the [Compact installation guide](https://docs.midnight.network/compact/compilation-and-tooling).
- Lace with Midnight Preprod enabled, usable tDUST, and a working proof service.
- A **new Secret Trail Preprod contract address** for live transactions.

## Setup & Run Locally

```bash
git clone https://github.com/ashuujha/midnight-secret-missions.git
cd midnight-secret-missions
git switch feature/secret-trail-challenges
npm ci
npm run compile
cat > .env.local <<'EOF'
VITE_MIDNIGHT_NETWORK=preprod
VITE_CONTRACT_ADDRESS=YOUR_NEW_SECRET_TRAIL_CONTRACT_ADDRESS
VITE_PROOF_SERVER_URL=https://midnight-counter-prover.onrender.com
EOF
npm run dev
```

Open the Vite URL, connect Lace, receive a mission, make five visits, and claim a point. For two-player testing, use distinct browser profiles and wallets to issue a challenge between visits. A wallet transaction is required for every visit; keep the tab open through proof generation, Lace approval, and Preprod confirmation.

The app can also deploy a new contract from its **Deploy with Lace** button in local development when `VITE_CONTRACT_ADDRESS` is unset. After deployment, record the address and reload. Do not reuse the V1 address. Alternatively, `npm run deploy:preprod` uses the [deployment script](deploy/deploy.ts) and a separately funded Preprod wallet; its ignored `.midnight-state.json` contains recovery data and must stay private.

Lace 2.4 may expose only a **Local** proof server at `http://localhost:6300`. In that case, run `npm run proof:bridge` in a separate local terminal while using Lace. The bridge forwards Lace's `/check` and `/prove` requests to the hosted Render prover. This sends wallet proving data to that service and only works while the bridge is running. The app's `VITE_PROOF_SERVER_URL` setting does not change Lace's own server used for transaction balancing. The free Render service can sleep after inactivity, so the first proof may take longer despite asset prefetching; see [Render's free-service behavior](https://render.com/docs/free#spinning-down-on-idle).

## Run Tests

```bash
npm test
npm run build
npm run typecheck:deploy
```

The suite checks the earlier contract, the new challenge and replay rules, and proving-asset caching. `npm run check` recompiles the new contract and runs all of these checks.

## CI/CD

[GitHub Actions](.github/workflows/ci.yml) runs on pushes to `main` and pull requests. It installs Node 22 and the Compact compiler, compiles the Secret Trail contract, runs tests, builds the production app, and typechecks the deployment script. The badge above currently reflects `main`, which still hosts V1. The feature branch needs a pull request and passing CI before the V2 deployment can replace it.

## Product Proposal

The [product proposal](PROPOSAL.md) explains the player experience, Midnight privacy requirement, data model, and Mainnet work.

## Demo Video

A one-minute **Secret Trail** recording is still needed: connect Lace; show a private route; make five public visits with two decoys; have another player challenge the run; generate a valid proof; show the runner's point and the challenger's lost token. The earlier [counter video](https://youtu.be/Xa65AHEurZg) demonstrates a different dApp and is not this game's video.

## Submission Checklist

- ✓ Public GitHub repository and full documentation for this branch.
- ✓ Compact contract compiles and local gameplay tests pass.
- ✓ CI workflow and badge present; V2 pull-request run pending.
- ✗ New Secret Trail Preprod contract and live V2 URL.
- ✗ Full two-wallet live playthrough and game video.
- ✗ Dedicated product X profile link.
- ✓ At least 15 meaningful commits already exist in the repository; new V2 work is on its own feature branch.
