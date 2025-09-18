import { initTRPC } from "@trpc/server";
import { z } from "zod";
import prisma from "./prisma.ts";

const t = initTRPC.create();

export const appRouter = t.router({
  getUser: t.procedure
    .input(
      z.object({
        type: z.enum(["id", "email", "name"]),
        value: z.number().or(z.string()),
      })
    )
    .query(async ({ input }) => {
      let whereClause: any = {};
      if (input?.type === "id") {
        whereClause.id = Number(input?.value);
      } else if (input?.type === "name") {
        whereClause.name = input?.value;
      } else if (input?.type === "email") {
        whereClause.email = input?.value;
      }
      const userData = await prisma.user.findFirst({
        where: whereClause,
      });
      return { data: userData, error: null };
    }),
  createUser: t.procedure
    .input(z.object({ name: z.string().min(2), email: z.email() }))
    .mutation(async ({ input }) => {
      const result = await prisma.user.create({
        data: { name: input?.name, email: input?.email },
      });
      return { data: result, error: null };
    }),
});

export type AppRouter = typeof appRouter;
