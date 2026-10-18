// Automatic daily database backup while the server is running.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.NODE_ENV !== "production") return;
  const { db } = await import("./lib/db");
  const { runDailyBackup, lastBackupAge } = await import("./lib/backup");
  const DAY = 24 * 60 * 60 * 1000;

  const tick = async () => {
    try {
      if ((await lastBackupAge()) >= DAY - 60_000) await runDailyBackup(db);
    } catch (e) {
      console.error("[backup] failed", e);
    }
  };
  setTimeout(tick, 30_000);
  setInterval(tick, 60 * 60 * 1000).unref();
}
