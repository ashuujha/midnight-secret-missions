import { createTableService } from "../server/table-service.js";

export default createTableService({
  contract: process.env.VITE_CLASSIC_CONTRACT_ADDRESS ?? "",
  network: process.env.VITE_MIDNIGHT_NETWORK ?? "preprod",
});
