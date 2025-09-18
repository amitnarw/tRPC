import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./trpcRrouter.ts";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors())

app.use("/test", (req, res) =>
  res.json({ data: "Backend working", error: null })
);

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
  })
);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
