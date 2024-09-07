import { generateIdFromEntropySize } from "lucia"; // gagamitin para sa id ng admin
import { randomBytes } from "crypto";
import { hash } from "@node-rs/argon2";
import { db } from "./src/server/db";
import { users } from "./src/server/db/schema";
import { eq } from "drizzle-orm";

const username = process.env.USER_NAME;
if (!username) {
  console.error("No USER_NAME!");
  process.exit(-1);
}

const existingUser = await db.query.users.findFirst({
  where: eq(users.username, username),
});

if (existingUser) {
  console.error("Duplicate na teh :( Ibahin mo username!");
  process.exit(-1);
}

const password = process.env.PASS_WORD;
if (!password) {
  console.error("No PASS_WORD!");
  process.exit(-1);
}

const userId = generateIdFromEntropySize(10);
const salt = randomBytes(16);
const hashed = await hash(password, {
  // Minimum requirments for hashing password
  salt: salt,
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
});

console.log("WARNING! MAIIBA ANG USERID EVERY RUN!!!!");
console.log("-------------------------------");
console.log("Username:", username);
console.log("Password:", password);
console.log("User id:", userId);
console.log("Salt:", salt.toString());
console.log("Hashed:", hashed);
console.log("-------------------------------");

await db.insert(users).values({
  id: userId,
  username: username,
  password: hashed,
  salt: salt,
});

console.log("Check mo na sa https://supabase.com/dashboard/projects");
process.exit(-1);
