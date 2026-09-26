type Environment = {
  visible: () => boolean;
  online: () => boolean;
  subscribe: (resume: () => void) => () => void;
  random: () => number;
};

// One read at a time; pause background/offline tabs and spread retries across players.
export function startTablePolling(
  refresh: () => Promise<boolean | void>,
  env: Environment = {
    visible: () => !document.hidden,
    online: () => navigator.onLine,
    subscribe: (resume) => {
      document.addEventListener("visibilitychange", resume);
      window.addEventListener("online", resume);
      window.addEventListener("offline", resume);
      return () => {
        document.removeEventListener("visibilitychange", resume);
        window.removeEventListener("online", resume);
        window.removeEventListener("offline", resume);
      };
    },
    random: Math.random,
  },
) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let stopped = false, running = false, failures = 0;
  const available = () => !stopped && env.visible() && env.online();
  const schedule = (delay: number) => {
    clearTimeout(timer);
    if (available()) timer = setTimeout(() => void tick(), delay);
  };
  const tick = async () => {
    if (!available() || running) return;
    running = true;
    try { failures = await refresh() === false ? failures + 1 : 0; }
    catch { failures++; }
    finally {
      running = false;
      schedule(Math.min(30000, 4000 * 2 ** Math.min(failures, 3)) + env.random() * 1000);
    }
  };
  const unsubscribe = env.subscribe(() => {
    clearTimeout(timer);
    if (!running) schedule(failures ? Math.min(30000, 4000 * 2 ** Math.min(failures, 3)) : env.random() * 400);
  });
  schedule(env.random() * 400);
  return () => {
    stopped = true;
    clearTimeout(timer);
    unsubscribe();
  };
}
