import { useCallback, useEffect, useRef, useState } from "react";
import { startTablePolling } from "../utils/table-polling";
import { useMidnight } from "./useMidnight";
import { readInvite, type Table } from "../game/cat-bluff";
import type {
  Action,
  HandState,
  TransactionResult,
  TransactionStage,
} from "../midnight/cat-bluff";
import { friendlyCircuitError } from "../utils/errors";
import { warmProofServer } from "../midnight/prover-readiness";

const invite = readInvite(window.location.search);
export const configuredContract =
  import.meta.env.VITE_CAT_BLUFF_CONTRACT_ADDRESS?.trim() ||
  (import.meta.env.DEV
    ? localStorage.getItem("cat-bluff-dev-contract") || ""
    : "");
const validAddress = (value: string) => /^[0-9a-f]{64}$/i.test(value);
const loadClient = () => import("../midnight/cat-bluff");
export function useCatBluff(active: boolean) {
  const wallet = useMidnight();
  const [contract, setContract] = useState(
    invite?.contract || configuredContract,
  );
  const [room, setRoom] = useState(
    invite?.room ||
      sessionStorage.getItem(`cat-bluff-room:${configuredContract}`) ||
      "",
  );
  const [table, setTable] = useState<Table | null>(null);
  const [hand, setHand] = useState<HandState | null>(null);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState<TransactionStage>("preparing");
  const [error, setError] = useState("");
  const [result, setResult] = useState<TransactionResult | null>(null);
  const [started, setStarted] = useState(0);
  const [readError, setReadError] = useState("");
  const lock = useRef(false),
    generation = useRef(0),
    polling = useRef(false);
  const handRef = useRef<HandState | null>(null);
  const persist = useCallback((h: HandState) => {
    handRef.current = h;
    setHand(h);
  }, []);
  useEffect(() => {
    generation.current++;
    setTable(null);
    handRef.current = null;
    setHand(null);
    if (!active || !wallet.address || !room || !contract) return;
    let cancelled = false;
    void loadClient()
      .then((c) => {
        if (!cancelled) {
          const h = c.loadHand(wallet.address!, contract, room);
          handRef.current = h;
          setHand(h);
        }
      })
      .catch((e) => {
        if (!cancelled)
          setError(
            e instanceof Error
              ? e.message
              : "Your saved hand could not be opened.",
          );
      });
    return () => {
      cancelled = true;
    };
  }, [active, wallet.address, room, contract, persist]);
  const refresh = useCallback(async () => {
    if (
      !active ||
      !validAddress(contract) ||
      !validAddress(room) ||
      polling.current ||
      lock.current
    )
      return;
    polling.current = true;
    const version = generation.current;
    try {
      const c = await loadClient();
      const snapshot = await c.readTable(contract, room, wallet.networkId);
      if (generation.current !== version || lock.current) return;
      setTable(snapshot.table);
      setReadError("");
      const h = handRef.current;
      if (wallet.address && h && snapshot.commitments[h.id]) {
        const next = c.reconcileHand(
          h,
          snapshot.commitments[h.id],
          snapshot.table.players.find((p) => p.id === h.id)!.penalties,
        );
        c.saveHand(wallet.address, contract, room, next);
        persist(next);
      }
      return true;
    } catch (e) {
      if (generation.current === version)
        setReadError(
          e instanceof Error ? e.message : "The table could not be refreshed.",
        );
      return false;
    } finally {
      polling.current = false;
    }
  }, [active, contract, room, wallet.networkId, wallet.address, persist]);
  useEffect(() => {
    if (!active || !validAddress(contract) || !validAddress(room)) return;
    return startTablePolling(refresh);
  }, [refresh, active, contract, room]);
  useEffect(() => {
    if (!active) return;
    void warmProofServer().catch(() => {});
    void loadClient()
      .then((c) => {
        const mine = hand && table?.players.findIndex((p) => p.id === hand.id);
        const circuit = !table
          ? "createRoom"
          : mine === -1 || !hand
            ? "joinRoom"
            : table.phase === 2
              ? "proveClaim"
              : table.phase === 1
                ? "passClaim"
                : "playCard";
        void c.prefetch(circuit).catch(() => {});
        if (table?.phase === 1) void c.prefetch("callBluff").catch(() => {});
      })
      .catch(() => {});
  }, [active, table?.phase, !!table, hand?.id]);
  const act = useCallback(
    async (action: Action) => {
      if (lock.current || !wallet.connectedAPI || !wallet.address) return false;
      if (!validAddress(contract)) {
        setError("Deploy the Cat Bluff contract first.");
        return false;
      }
      lock.current = true;
      generation.current++;
      setBusy(true);
      setStarted(Date.now());
      setStage("preparing");
      setError("");
      setResult(null);
      try {
        const c = await loadClient();
        const nextRoom = action.kind === "create" ? c.randomHex() : room;
        if (!validAddress(nextRoom))
          throw new Error("Open an invitation or create a table first.");
        let h =
          action.kind === "create"
            ? c.createHand()
            : c.loadHand(wallet.address, contract, nextRoom);
        if (!h && action.kind === "join") h = c.createHand();
        if (!h)
          throw new Error(
            "Your private hand is in the browser used to join. Return to that browser and wallet.",
          );
        // Refresh before spending a hand, especially after an uncertain transaction result.
        if (action.kind !== "create" && action.kind !== "join") {
          const snapshot = await c.readTable(
            contract,
            nextRoom,
            wallet.networkId,
          );
          const player = snapshot.table.players.find((p) => p.id === h!.id);
          if (!player) throw new Error("This wallet has not joined the table.");
          h = c.reconcileHand(h, snapshot.commitments[h.id], player.penalties);
        }
        const save = (next: HandState) => {
          c.saveHand(wallet.address!, contract, nextRoom, next);
          persist(next);
        };
        save(h);
        setRoom(nextRoom);
        sessionStorage.setItem(`cat-bluff-room:${contract}`, nextRoom);
        const tx = await c.transact(
          wallet.connectedAPI,
          wallet.networkId,
          contract,
          nextRoom,
          h,
          action,
          save,
          setStage,
        );
        setResult(tx);
        const snapshot = await c.readTable(
          contract,
          nextRoom,
          wallet.networkId,
        );
        setTable(snapshot.table);
        setReadError("");
        return true;
      } catch (e) {
        setError(friendlyCircuitError(e, wallet.networkId));
        return false;
      } finally {
        lock.current = false;
        setBusy(false);
      }
    },
    [
      wallet.connectedAPI,
      wallet.address,
      wallet.networkId,
      contract,
      room,
      persist,
    ],
  );
  const deploy = async () => {
    if (lock.current || !wallet.connectedAPI) return;
    lock.current = true;
    generation.current++;
    setBusy(true);
    setStarted(Date.now());
    setStage("preparing");
    setError("");
    try {
      const c = await loadClient();
      const address = await c.deploy(
        wallet.connectedAPI,
        wallet.networkId,
        setStage,
      );
      localStorage.setItem("cat-bluff-dev-contract", address);
      setContract(address);
      setRoom("");
    } catch (e) {
      setError(friendlyCircuitError(e, wallet.networkId));
    } finally {
      lock.current = false;
      setBusy(false);
    }
  };
  return {
    wallet,
    contract,
    room,
    table,
    hand,
    busy,
    stage,
    error: error || wallet.error,
    readError,
    result,
    started,
    act,
    deploy,
    refresh,
    invited: !!invite,
    clearRoom: () => {
      if (!lock.current) {
        setRoom("");
        setTable(null);
        setReadError("");
        sessionStorage.removeItem(`cat-bluff-room:${contract}`);
        history.replaceState(null, "", "/");
      }
    },
  };
}
