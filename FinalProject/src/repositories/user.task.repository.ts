import { pool } from "../lib/db.js";
import type { Task } from "../types/task.js";

type TaskRow = Task;


export async function createTask(
  userId: string,
  title: string
): Promise<Task> {
  const result = await pool.query<TaskRow>(
    `INSERT INTO support_task (title, user_id) VALUES ($1, $2) RETURNING id, title, status, user_id, created_at, updated_at`,
    [title, userId]
  );
  return result.rows[0]!;
}

export async function fetchTaskByUserId(userId:string): Promise<Task[]> { 
  const result = await pool.query<TaskRow>(`
    SELECT id, title, status, user_id, created_at, updated_at FROM support_task WHERE user_id = $1 ORDER BY created_at DESC
    `, [userId]);
  return result.rows;
}
// in the above func it why it doesn't return null , maybe the userId is wrong or how it will handle this in that case

export async function findTaskByIdAndUserId(userId: string, taskId: string): Promise<Task | null> {
  const result = await pool.query(`
    SELECT id, title, status, user_id, created_at, updated_at FROM support_task WHERE id = $1 AND user_id = $2
    `, [taskId, userId]);
  return result.rows[0] || null;
}

export async function updateTaskTitle(taskId: string,userId: string, title:string): Promise<Task | null> {
  const result = await pool.query(`
    UPDATE support_task SET title = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING id, title, status, user_id, created_at, updated_at`,[title, taskId, userId]);
  return result.rows[0] || null;
}


export async function deleteUserTassk(taskId: string,userId: string): Promise<boolean> {
  const result = await pool.query(`
    DELETE FROM support_task WHERE id = $1 AND user_id = $2 RETURNING id`, [taskId, userId]);
  return result.rowCount > 0;
}