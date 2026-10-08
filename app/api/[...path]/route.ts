// Every request under /api goes to the inkan app in server/app.ts: one line, all methods.
import { handlers } from "@inkanjs/next";
import { app } from "@/server/app";

export const { GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS } = handlers(app);
