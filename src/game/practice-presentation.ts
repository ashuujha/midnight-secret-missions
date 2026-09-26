import {
  declaration,
  type ClassicAction,
  type ClassicView,
} from "./classic-rules";

/** Uses only the same public snapshot displayed at the practice table. */
export function practiceActor(view: ClassicView): number | null {
  if (view.phase === "finished" || view.phase === "transfer") return null;
  return view.phase === "play"
    ? view.turn
    : view.phase === "respond"
      ? view.responder
      : (view.latest?.actor ?? null);
}

export function practiceRecap(
  before: ClassicView,
  after: ClassicView,
  actor: number,
  kind: ClassicAction["kind"],
): string {
  const name = (seat: number) => after.players[seat]?.name ?? "A player";
  const latest = after.latest;
  if (!latest) return "Your hand is ready. Take your time choosing a card.";
  if (kind === "play") {
    return `${name(actor)} played ${latest.quantity} face-down and claimed ${declaration(latest.quantity, latest.rank)}. The actual ranks stay hidden.`;
  }
  if (kind === "call") {
    return `${name(actor)} called BLUFF on ${name(latest.actor)}. Next, only that submission will turn face up.`;
  }
  if (kind === "pass") {
    return latest.outcome === "passed"
      ? `Everyone trusted the claim. All ${after.pileSize} cards stay hidden in the pile. ${after.phase === "finished" ? `${name(after.winner!)} wins!` : "The required rank advances."}`
      : `${name(actor)} trusted the claim. ${name(after.responder)} gets the next decision.`;
  }
  if (
    (latest.outcome === "truth" || latest.outcome === "bluff") &&
    latest.receiver !== undefined
  ) {
    const reason =
      latest.outcome === "truth"
        ? "Every revealed card matched. The claim was true."
        : "At least one revealed card didn’t match. Caught bluffing!";
    return `${reason} ${name(latest.receiver)} takes the entire ${before.pileSize}-card pile.${after.phase === "finished" ? ` ${name(after.winner!)} wins!` : ""}`;
  }
  return "That turn has resolved. Check the pile and hand sizes before continuing.";
}
