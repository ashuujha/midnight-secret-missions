import { inviteUrl, readInvite } from "./cat-bluff";
export function classicInvite(
  origin: string,
  room: string,
  contract: string,
): string {
  const url = new URL(inviteUrl(origin, room, contract));
  url.searchParams.set("game", "classic52");
  return url.toString();
}
export function readClassicInvite(search: string) {
  return new URLSearchParams(search).get("game") === "classic52"
    ? readInvite(search)
    : null;
}
