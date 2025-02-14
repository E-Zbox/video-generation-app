import cron from "node-cron";
// utils/api
import { generatePictoryToken } from "@/utils/api/pictory";

export default async function () {
  cron.schedule("*/15 * * * *", async () => {
    console.log("I run 15 minutes");
    console.log(new Date());

    const { data, error, success } = await generatePictoryToken();
  });
}
