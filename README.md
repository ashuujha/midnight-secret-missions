# Secret Missions

![CI](https://github.com/ashuujha/midnight-secret-missions/actions/workflows/ci.yml/badge.svg)

> A multiplayer Midnight game where everyone sees your moves, but your mission stays private until a proof earns your point.

Secret Missions is a [separate public project](https://github.com/ashuujha/midnight-secret-missions) built from the working wallet and proof integration in the [Midnight Private Counter](https://github.com/ashuujha/midnight-private-counter). It is currently a **local, testnet-ready prototype**. A new Preprod contract address and live deployment will be listed here only after they are verified; the counter's address is deliberately not reused.

![Secret Missions desktop preview](screenshots/desktop-preview.png)

The [mobile preview](screenshots/mobile-preview.png) shows the responsive first screen. Both captures were taken locally before the new contract was deployed.

## Live Demo

Deployment pending. Run the local app with the steps below. The interface loads without a contract address, but joining and moves require a deployed Secret Missions contract.

In local development, you can connect a funded Preprod Lace wallet and select **Deploy with Lace** from the deployment notice. Save the returned address, reload to play locally, and add it to `VITE_CONTRACT_ADDRESS` when publishing the shared site. This action is only shown in local development.

## Contract Address

| Network | Address |
| --- | --- |
| Preprod | Pending deployment and on-chain verification |

## What This Does

Players connect a Midnight-enabled Lace wallet and join a shared world. The browser creates a random 32-byte player secret and selects one of eight three-stop missions. The contract records a player ID and a commitment to the mission **before** any moves. Each player then submits five public visits to Harbor, Library, Observatory, or Market. The mission's three stops must appear in order; the two remaining visits may be decoys. A final claim circuit checks the hidden mission against the public visits and awards one public leaderboard point. Every join, visit, and claim is a signed Midnight transaction.

This first season is asynchronous: players compete on a shared leaderboard without a timer or financial prizes. Each identity can join once and claim one point. The game is meant to demonstrate public action plus private intent; it is not yet a hardened esports or wagering system.

## Privacy Model

- **PUBLIC:** player ID, mission commitment, ordered visits, claimed status, scores, and transaction activity.
- **PRIVATE:** the player's random secret and mission number are held by the browser and supplied as private witnesses during proving. The secret is saved in this browser's local storage so play can continue after a reload.
- **PROVED without revealing:** that the mission fixed at join time appears as an ordered subsequence of the five public visits and has not already earned a point.

## Privacy Claim

An on-chain observer can see where a player went, when they submitted transactions, and whether they earned a point. The contract does not publish which of the eight missions the player held, and a successful claim does not reveal the mission number. A route may still let an observer **infer** the mission, especially when the visits match only one possible objective. Privacy is therefore about hiding the mission witness from the ledger, not guaranteeing that gameplay never gives clues.

The selected prover is another trust boundary. A hosted proof service may receive private proving inputs; use a prover you trust if the mission must remain unknown to the service operator. The secret is stored in plain local storage for this prototype, so anyone with access to the browser profile can recover it. Clearing browser storage loses the player's ability to make further moves or claim their point.

## Fairness and Current Scope

The browser chooses the mission randomly for honest players, and the ledger commitment prevents changing it after joining. A modified client can choose its own mission before joining. The current proof establishes **completion of the committed mission**, not fair mission assignment. A production competitive version will add a commit-then-randomize round setup, wallet or credential binding, mission recovery, and explicit round deadlines before introducing prizes.

## Tech Stack

Compact smart contract and Midnight Preprod; React 19, TypeScript, Vite 7; Midnight.js 4.1; Lace wallet connector; local or configured hosted proof server. The contract is in [`contracts/secret-missions.compact`](contracts/secret-missions.compact), and generated proving assets live in `managed/secret-missions`.

## Prerequisites

- Node.js 22 and npm.
- Compact CLI 0.5.2 with compiler 0.31.1. [Compact installation guide](https://docs.midnight.network/compact/compilation-and-tooling).
- Lace with Midnight Preprod enabled, tNIGHT registered to generate tDUST, and a working proof service. The configured proof server must support the three compiled circuits (`join`, `visit`, `claim`).
- A deployed Secret Missions contract address for live transactions.

## Setup & Run Locally

```bash
cd /home/ashu/Projects/Midnight-Secret-Missions
npm ci
npm run compile
cat > .env.local <<'EOF'
VITE_MIDNIGHT_NETWORK=preprod
# After deploying: VITE_CONTRACT_ADDRESS=YOUR_NEW_64_CHARACTER_CONTRACT_ADDRESS
# Optional: VITE_PROOF_SERVER_URL=https://your-proof-server.example
EOF
npm run dev
```

Open the URL printed by Vite. Connect Lace, receive a mission, record five visits, and claim. If `VITE_PROOF_SERVER_URL` is omitted, the app delegates circuit proving to Lace's configured provider. A site-level hosted prover setting does not change Lace's own proof server used for transaction balancing.

If **Deploy with Lace** fails while a `/check` request is pending or fails, inspect the proof-server URL in Lace's Midnight settings. Deployment has no game-circuit proof to send through the dApp's provider; Lace uses its own configured prover to balance the transaction. For the shared demo prover, set Lace to the base URL `https://midnight-counter-prover.onrender.com` (without `/check` or `/ready`), open its [`/ready` endpoint](https://midnight-counter-prover.onrender.com/ready) until it responds, then retry. The free Render instance may need time to wake after inactivity. If `/check` still fails, note its HTTP status and host; a healthy `/ready` response alone does not prove that a wallet transaction can be balanced.

## Run Tests

```bash
npm test
npm run build
```

The contract suite covers mission commitment, ordered visits, successful scoring, wrong routes, mission swapping, duplicate claims, and invalid actions.

![Six passing contract tests](screenshots/test-output.png)

## CI/CD

[GitHub Actions](.github/workflows/ci.yml) runs on pushes to `main` and pull requests. It installs Node 22 and the Compact compiler, compiles the contract, runs tests, builds the production dApp, and checks the deployment script. The [first main-branch run passed](https://github.com/ashuujha/midnight-secret-missions/actions/runs/36164716354). Hosting configuration is in [`vercel.json`](vercel.json); deployment requires a new Vercel project with this folder as its root and the environment values above.

## Preprod Deployment

The [`deploy/deploy.ts`](deploy/deploy.ts) script supports a new funded Preprod deployer wallet. It stores wallet recovery data in the ignored `.midnight-state.json` file; back it up privately and never commit it. A compatible proof server must be reachable from the machine running the script. To deploy after funding tNIGHT and generating tDUST:

```bash
npm run compile
MIDNIGHT_PROOF_SERVER_URL=https://YOUR_PROOF_SERVER npm run deploy:preprod
```

The command records the new address locally. Verify the contract with the Preprod indexer, then set `VITE_CONTRACT_ADDRESS` for the frontend, update this README, and deploy the separate Vercel site. The existing counter contract cannot be used for this game.

## Product Proposal

See [PROPOSAL.md](PROPOSAL.md) for the product, privacy rationale, data model, and Mainnet feasibility.

## Development Status

- Contract compilation, six local tests, and production build pass.
- Preprod deployment, a verified address, a live Vercel URL, and a full wallet transaction test are still required.
- The [public repository](https://github.com/ashuujha/midnight-secret-missions), more than 10 meaningful commits, and passing CI badge are ready.
