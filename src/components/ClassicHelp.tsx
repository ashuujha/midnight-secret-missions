export function ClassicRules() {
  return (
    <>
      <ol className="rules-list">
        <li>
          <strong>52 cats. 2–4 friends.</strong> Deal every card: 26 each with
          two players, 18/17/17 with three, 13 each with four. There are four of
          each rank.
        </li>
        <li>
          <strong>Play cards. Sell a story.</strong> Select one or more cards
          and place them face down. Your claim uses the required rank: “2
          Queens,” for example. The number is exact; the rank can be a lie.
        </li>
        <li>
          <strong>Trust… or BLUFF!</strong> Opponents respond clockwise.
          Everyone trusts? Cards stay in the pile. The next player claims the
          next rank: A → 2 → … → K → A.
        </li>
        <li>
          <strong>Risk the whole pile.</strong> A challenge reveals only that
          turn’s cards. Any wrong rank? The liar takes the entire pile. All
          correct? The challenger takes it.
        </li>
        <li>
          <strong>Make your last lie count.</strong> An empty hand wins only
          after everyone trusts the final play or its challenge is settled. Get
          caught and you’re back in the game.
        </li>
      </ol>
      <p className="notice">
        Remember there are only four of each rank. Count your own cards, watch
        the pile grow, and decide whether that claim is worth the risk.
      </p>
    </>
  );
}
export function ClassicPrivacy() {
  return (
    <>
      <p>
        <strong>Only your hand opens in your browser.</strong> Live players
        jointly shuffle an encrypted 52-card deck. Every shuffle and card
        transfer must preserve the original cards.
      </p>
      <p>
        <strong>Public:</strong> seats, hand sizes, required rank, pile size,
        chosen encrypted card slots, declarations, responses, and results. A
        challenge reveals only the cards in that play. Previously revealed cards
        can be remembered and tracked.
      </p>
      <p>
        <strong>Private:</strong> unchallenged ranks, shuffle choices, and table
        keys. The entire artwork catalog downloads together, so requesting an
        image does not identify your hand.
      </p>
      <p>
        <strong>Your prover is trusted with private inputs.</strong> Use a proof
        server running on your own device for privacy from the proving service.
        A remote server, including a local bridge that forwards remotely,
        receives your table keys. If all players use it, its operator could
        reconstruct the deck.
      </p>
      <p>
        <strong>Stay at the table.</strong> Live shuffles, challenges, and pile
        transfers need the relevant players online. This version cannot force a
        disconnected player to continue. Keep the browser data used to join; it
        contains your private table key.
      </p>
      <p className="notice">
        Practice runs locally against bots; it makes no blockchain transactions.
        Live play uses a new V4 contract. The cryptographic game protocol has
        not received an independent security audit.
      </p>
    </>
  );
}
