import * as z from "zod/v4";

export const appEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default(3000),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(10),
  ACCESS_TOKEN_SECRET: z.string().min(10),

  REFRESH_TOKEN_SECRET: z.string().min(10),

  // Convert both to number
  ACCESS_TOKEN_EXPIRES_IN: z
    .string()
    .transform((val) => Number(val))
    .default(0),
  REFRESH_TOKEN_EXPIRES_IN: z
    .string()
    .transform((val) => Number(val))
    .default(0),
});

export type AppEnv = z.infer<typeof appEnvSchema>;

// Validate process.env
let appEnv: AppEnv;

try {
  appEnv = appEnvSchema.parse(process.env);
} catch (error) {
  console.error("Environment variable validation error:", error);
  process.exit(1);
}

export { appEnv };
