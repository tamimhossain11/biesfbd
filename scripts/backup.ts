// Manual / cron backup: `npm run backup`
import { PrismaClient } from "@prisma/client";
import { runDailyBackup } from "../src/lib/backup";

const db = new PrismaClient();
runDailyBackup(db)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
