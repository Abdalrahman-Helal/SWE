import { pool } from "../lib/db.js";
import type { DBUserRow, DBUserWithPasswordRow, User } from "../types/user.js";

// find user by email
export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await pool.query<DBUserRow>(
    "SELECT id, email, role, created_at FROM users WHERE email = $1",[email]
  );
  return result.rows[0] ?? null;
}


export async function createUser(email: string, passwordHash: string): Promise<User> {
  const result = await pool.query<DBUserRow>(
    `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, role, created_at`,
    [email, passwordHash]
  );
  return result.rows[0]!
}


export async function findUserByEmailWithPassword(email: string): Promise<DBUserWithPasswordRow| null> {
  const result = await pool.query<DBUserWithPasswordRow>(
    `SELECT id, email, role, password_hash, created_at FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0] ?? null;
}