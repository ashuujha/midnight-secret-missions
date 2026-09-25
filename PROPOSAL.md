# Product Proposal

## What is the product, and who uses it?

Secret Missions is an asynchronous competitive multiplayer game. Players join a shared Midnight contract, receive one private mission in their browser, and make up to five public visits to a four-location world. A mission is an ordered route of three locations; other visits can be placed between those stops. Players win a point only when a zero knowledge proof verifies that their public visit history contains their committed secret route. The current product is a testnet game for players, game communities, and developers exploring privacy as a game mechanic.

## Why Midnight specifically?

A transparent chain can verify a public route only if it knows the target route, which immediately gives away the player's objective. Midnight lets the player publish a commitment before moving, then prove later that the committed mission matches the ordered public actions without writing the mission to the ledger. Everyone can inspect the moves and the awarded point; the contract verifies the private condition. This creates strategic uncertainty in a shared public world.

## Data Model

| Data Point | Type | Disclosed To |
| --- | --- | --- |
| Player ID, derived from a random secret | Public ledger | Everyone |
| Mission commitment | Public ledger | Everyone |
| Five ordered location visits | Public ledger | Everyone |
| Claimed status and leaderboard score | Public ledger | Everyone |
| Identity secret and chosen mission route | Private witness in the player's browser | Player and any prover the player chooses to trust |
| Proof that the committed route occurs in the public visit order | Zero knowledge proof | Verifiers learn validity, not the route |

## Mainnet Feasibility

The contract's core proof is bounded: eight route templates, five visits, and one claim per player identity. This makes a Preprod demonstration realistic. Before a production game, mission assignment needs a fair randomness protocol so a modified client cannot choose its preferred route; rounds need explicit start/end rules, wallet or credential binding, recovery for private mission state, and load testing for simultaneous players. Remote proof services also need a clear trust model because they may receive private proving inputs. No financial reward is planned until those issues are addressed.
