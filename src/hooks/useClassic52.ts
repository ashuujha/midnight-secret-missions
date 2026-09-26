import { useCallback, useEffect, useRef, useState } from "react";
import { useMidnight } from "./useMidnight";
import { readClassicInvite } from "../game/classic-invite";
import type { ClassicView } from "../game/classic-rules";
import type { Action, Session, Snapshot } from "../midnight/classic52";
import type {
  TransactionResult,
  TransactionStage,
} from "../midnight/cat-bluff";
import { friendlyCircuitError } from "../utils/errors";
import { startTablePolling } from "../utils/table-polling";
const valid = (s: string) => /^[a-f0-9]{64}$/i.test(s);
const load = () => import("../midnight/classic52");
const configured =
  import.meta.env.VITE_CLASSIC_CONTRACT_ADDRESS?.trim() ||
  (import.meta.env.DEV
    ? localStorage.getItem("cat-bluff-v4-dev-contract") || ""
    : "");
export function useClassic52(active: boolean) {
  const wallet = useMidnight();
  const invite = useRef(readClassicInvite(location.search));
  const [contract, setContract] = useState(
    invite.current?.contract || configured,
  );
  const [room, setRoom] = useState(
    invite.current?.room ||
      sessionStorage.getItem(`classic52-room:${configured}`) ||
      "",
  );
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null),
    [view, setView] = useState<ClassicView | null>(null);
  const [busy, setBusy] = useState(false),
    [stage, setStage] = useState<TransactionStage>("preparing"),
    [started, setStarted] = useState(0);
  const [error, setError] = useState(""),
    [readError, setReadError] = useState(""),
    [result, setResult] = useState<TransactionResult | null>(null);
  const current = useRef<Snapshot | null>(null),
    confirmedHeight = useRef(0),
    lock = useRef(false),
    polling = useRef(false),
    version = useRef(0),
    mounted = useRef(true);
  const identity = `${active}:${wallet.networkId}:${wallet.address}:${contract}`;
  const identityRef = useRef(identity);
  identityRef.current = identity;
  const scope = `${identity}:${room}`;
  const [appliedScope, setAppliedScope] = useState("");
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      version.current++;
    };
  }, []);
  const apply = useCallback(
    async (
      s: Snapshot,
      privateSession: Session | null,
      expectedIdentity: string,
    ) => {
      const c = await load();
      if (!mounted.current || identityRef.current !== expectedIdentity) return;
      if (c.isOlderSnapshot(s, current.current, confirmedHeight.current)) return;
      if (current.current?.room === s.room && s.blockHeight === current.current.blockHeight &&
          s.revision === current.current.revision) {
        setReadError("");
        return;
      }
      const v = c.toView(s, privateSession);
      current.current = s;
      setSnapshot(s);
      setView(v);
      setAppliedScope(`${expectedIdentity}:${s.room}`);
      setReadError("");
    },
    [],
  );
  useEffect(() => {
    version.current++;
    current.current = null;
    confirmedHeight.current = 0;
    setSnapshot(null);
    setView(null);
    setError("");
    setReadError("");
    setResult(null);
  }, [scope]);
  const refresh = useCallback(async () => {
    if (
      !active ||
      !valid(contract) ||
      !valid(room) ||
      lock.current ||
      polling.current
    )
      return;
    polling.current = true;
    const generation = version.current;
    try {
      const c = await load();
      const privateSession = wallet.address
        ? c.loadSession(wallet.address, contract, room)
        : null;
      const s = await c.readTable(contract, room, wallet.networkId, { background: true });
      if (generation === version.current && !lock.current)
        await apply(s, privateSession, identity);
      return true;
    } catch (e) {
      if (mounted.current && generation === version.current)
        setReadError(
          e instanceof Error ? e.message : "The table could not be refreshed.",
        );
      return false;
    } finally {
      polling.current = false;
    }
  }, [
    active,
    contract,
    room,
    wallet.address,
    wallet.networkId,
    identity,
    apply,
  ]);
  useEffect(() => {
    if (!active || !valid(contract) || !valid(room)) return;
    return startTablePolling(refresh);
  }, [refresh, active, contract, room]);
  useEffect(() => {
    if (
      !active ||
      !snapshot ||
      !view ||
      view.viewer < 0 ||
      appliedScope !== scope
    )
      return;
    const t = snapshot.state,
      mine = view.viewer;
    let circuit: import("../midnight/classic52").Circuit | undefined;
    if (t.status === 1n && t.step === BigInt(mine)) circuit = "shuffleDeck";
    else if (t.status === 2n && t.step === BigInt(mine)) circuit = "shareDeal";
    else if (t.status === 3n) {
      if (t.phase === 0n && t.turn === BigInt(mine)) circuit = "playCards";
      else if (t.phase === 1n && t.responder === BigInt(mine))
        circuit = "passClaim";
      else if (t.phase === 2n && t.actor === BigInt(mine))
        circuit = "revealTurn";
      else if (
        t.phase === 3n &&
        snapshot.owners.some(
          (o, i) => o === 4 && snapshot.custodians[i] === mine,
        )
      )
        circuit = "transferPile";
    }
    if (circuit)
      void load()
        .then((c) => c.prefetch(circuit!))
        .catch(() => {});
  }, [active, snapshot?.revision, view?.viewer, appliedScope, scope]);
  const act = useCallback(
    async (action: Action) => {
      if (lock.current) return false;
      if (!wallet.connectedAPI || !wallet.address) {
        setError("Connect Lace before taking a live seat.");
        return false;
      }
      if (!valid(contract)) {
        setError("Classic 52 needs its new V4 contract.");
        return false;
      }
      lock.current = true;
      version.current++;
      setBusy(true);
      setStarted(Date.now());
      setStage("preparing");
      setError("");
      setResult(null);
      const usable = () => mounted.current && identityRef.current === identity;
      try {
        const c = await load();
        const nextRoom = action.kind === "create" ? c.randomHex() : room;
        if (!valid(nextRoom))
          throw new Error("Create a room or open an invitation first.");
        let session =
          action.kind === "create"
            ? c.newSession()
            : c.loadSession(wallet.address, contract, nextRoom);
        if (!session && action.kind === "join") session = c.newSession();
        if (!session)
          throw new Error(
            "Your private table key is in the browser used to join. Return to that browser.",
          );
        let fresh: Snapshot | null = null;
        if (action.kind !== "create") {
          fresh = await c.readTable(contract, nextRoom, wallet.networkId);
          if (
            action.kind !== "join" &&
            current.current &&
            fresh.revision !== current.current.revision
          ) {
            await apply(fresh, session, identity);
            throw new Error(
              "The table has moved ahead. Review the current turn and try again.",
            );
          }
        }
        if (!usable()) return false;
        c.saveSession(wallet.address, contract, nextRoom, session);
        setRoom(nextRoom);
        sessionStorage.setItem(`classic52-room:${contract}`, nextRoom);
        const receipt = await c.transact(
          wallet.connectedAPI,
          wallet.networkId,
          contract,
          nextRoom,
          session,
          action,
          fresh,
          (s) => {
            if (usable()) setStage(s);
          },
        );
        if (!usable()) return false;
        confirmedHeight.current = Number(receipt.blockHeight);
        setResult(receipt);
        // A confirmed transaction remains successful even if the follow-up indexer read fails.
        try {
          const updated = await c.readTable(
            contract,
            nextRoom,
            wallet.networkId,
          );
          if (c.isOlderSnapshot(updated, current.current, confirmedHeight.current))
            throw new Error("Indexer is behind the confirmed move.");
          await apply(updated, session, identity);
        } catch {
          if (usable())
            setReadError(
              "Your transaction confirmed. Waiting for the indexer to refresh the table. Do not repeat the move.",
            );
        }
        return true;
      } catch (e) {
        if (usable()) setError(friendlyCircuitError(e, wallet.networkId));
        return false;
      } finally {
        lock.current = false;
        if (mounted.current) setBusy(false);
      }
    },
    [
      wallet.connectedAPI,
      wallet.address,
      wallet.networkId,
      contract,
      room,
      identity,
      apply,
    ],
  );
  const deploy = async () => {
    if (lock.current || !wallet.connectedAPI) return;
    lock.current = true;
    version.current++;
    setBusy(true);
    setStarted(Date.now());
    setStage("preparing");
    setError("");
    const usable = () => mounted.current && identityRef.current === identity;
    try {
      const c = await load();
      const address = await c.deploy(
        wallet.connectedAPI,
        wallet.networkId,
        (s) => {
          if (usable()) setStage(s);
        },
      );
      if (!usable()) return;
      localStorage.setItem("cat-bluff-v4-dev-contract", address);
      setContract(address);
      setRoom("");
      current.current = null;
      setSnapshot(null);
      setView(null);
    } catch (e) {
      if (usable()) setError(friendlyCircuitError(e, wallet.networkId));
    } finally {
      lock.current = false;
      if (mounted.current) setBusy(false);
    }
  };
  const clearRoom = () => {
    if (lock.current) return;
    version.current++;
    setRoom("");
    setSnapshot(null);
    setView(null);
    current.current = null;
    setError("");
    setReadError("");
    setResult(null);
    invite.current = null;
    sessionStorage.removeItem(`classic52-room:${contract}`);
    history.replaceState(null, "", "/");
  };
  return {
    wallet,
    contract,
    room,
    snapshot: appliedScope === scope ? snapshot : null,
    view: appliedScope === scope ? view : null,
    busy,
    stage,
    started,
    error: error || wallet.error,
    readError,
    result,
    act,
    deploy,
    refresh,
    clearRoom,
    invited: !!invite.current,
  };
}
