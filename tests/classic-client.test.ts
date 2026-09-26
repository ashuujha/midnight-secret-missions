import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { DECK } from "../src/game/classic-cards";
import { classicInvite, readClassicInvite } from "../src/game/classic-invite";
import { readInvite, inviteUrl } from "../src/game/cat-bluff";
import {
  newSession,
  saveSession,
  loadSession,
} from "../src/midnight/classic52";
describe("Classic 52 artwork, invitations and private-key recovery", () => {
  it("has 52 fixed physical identities, four of every rank and distinct original images", () => {
    assert.equal(DECK.length, 52);
    assert.deepEqual(
      DECK.map((c) => c.id),
      Array.from({ length: 52 }, (_, i) => i),
    );
    for (const rank of new Set(DECK.map((c) => c.rank)))
      assert.equal(DECK.filter((c) => c.rank === rank).length, 4);
    const art = JSON.parse(
      readFileSync(new URL("../public/deck-art.json", import.meta.url), "utf8"),
    );
    const credits = JSON.parse(
      readFileSync(
        new URL("../public/media-credits.json", import.meta.url),
        "utf8",
      ),
    ).classic52Deck.cards;
    assert.equal(Object.keys(art).length, 52);
    assert.equal(new Set(Object.values(art)).size, 52);
    for (const c of DECK) {
      assert.match(art[c.id], /^data:image\/(png|jpeg);base64,/);
      const bytes = Buffer.from(art[c.id].split(",")[1], "base64");
      assert.equal(
        createHash("sha256").update(bytes).digest("hex"),
        credits[c.id].sha256,
      );
      assert(credits[c.id].source.startsWith("https://"));
    }
  });
  it("separates V4 invitations while preserving existing V3 room links", () => {
    const room = "a".repeat(64),
      contract = "b".repeat(64),
      origin = "https://example.org";
    const legacy = new URL(inviteUrl(origin, room, contract));
    assert.equal(readClassicInvite(legacy.search), null);
    assert.deepEqual(readInvite(legacy.search), { room, contract });
    const classic = new URL(classicInvite(origin, room, contract));
    assert.deepEqual(readClassicInvite(classic.search), { room, contract });
    assert(!classic.href.includes("secret"));
    assert.equal(readClassicInvite("?game=classic52&room=invalid"), null);
  });
  it("recovers keys only in the wallet/contract/room scope and refuses corrupt replacement", () => {
    const storage = new Map<string, string>();
    const old = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
      },
    });
    try {
      const session = newSession();
      assert.equal(session.key.length, 62);
      assert(BigInt("0x" + session.key) > 0n);
      saveSession("wallet", "contract", "room", session);
      assert.deepEqual(loadSession("wallet", "contract", "room"), session);
      assert.equal(loadSession("another-wallet", "contract", "room"), null);
      assert.equal(loadSession("wallet", "another-contract", "room"), null);
      assert.equal(loadSession("wallet", "contract", "another-room"), null);
      const key = [...storage.keys()][0];
      const broken = JSON.stringify({ ...session, key: "0".repeat(62) });
      storage.set(key, broken);
      assert.throws(() => loadSession("wallet", "contract", "room"), /damaged/);
      assert.equal(storage.get(key), broken);
      storage.set(key, JSON.stringify({ ...session, id: "0".repeat(64) }));
      assert.throws(() => loadSession("wallet", "contract", "room"), /damaged/);
    } finally {
      if (old) Object.defineProperty(globalThis, "localStorage", old);
      else Reflect.deleteProperty(globalThis, "localStorage");
    }
  });
});
