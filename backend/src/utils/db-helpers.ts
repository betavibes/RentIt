import { pool } from '../config/database';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export const findUserByEmail = async (email: string) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

export const findUserById = async (id: string) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

export const createUser = async (data: {
  email: string;
  phone?: string;
  full_name: string;
  password: string;
}) => {
  const id = uuidv4();
  const passwordHash = await bcryptjs.hash(
    data.password,
    parseInt(process.env.BCRYPT_ROUNDS || '10')
  );

  const result = await pool.query(
    `INSERT INTO users (id, email, phone, full_name, password_hash, role_id, is_active, created_at, updated_at)
     SELECT $1, $2, $3, $4, $5, r.id, true, NOW(), NOW()
     FROM roles r WHERE r.name = 'customer'
     RETURNING id, email, phone, full_name, is_active, created_at`,
    [id, data.email, data.phone, data.full_name, passwordHash]
  );

  return result.rows[0];
};

export const updateUserProfile = async (
  userId: string,
  data: {
    full_name?: string;
    phone?: string;
    gender?: string;
    size?: string;
    college?: string;
  }
) => {
  const fields: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  if (data.full_name !== undefined) {
    fields.push(`full_name = $${paramCount++}`);
    values.push(data.full_name);
  }
  if (data.phone !== undefined) {
    fields.push(`phone = $${paramCount++}`);
    values.push(data.phone);
  }
  if (data.gender !== undefined) {
    fields.push(`gender = $${paramCount++}`);
    values.push(data.gender);
  }
  if (data.size !== undefined) {
    fields.push(`size = $${paramCount++}`);
    values.push(data.size);
  }
  if (data.college !== undefined) {
    fields.push(`college = $${paramCount++}`);
    values.push(data.college);
  }

  if (fields.length === 0) return null;

  fields.push(`updated_at = NOW()`);
  values.push(userId);

  const result = await pool.query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING id, email, full_name, phone, gender, size, college, role, is_active`,
    values
  );

  return result.rows[0];
};

export const validatePassword = async (plainPassword: string, hash: string): Promise<boolean> => {
  return bcryptjs.compare(plainPassword, hash);
};

export const storeOTP = async (email: string, otp: string) => {
  const result = await pool.query(
    `INSERT INTO otp_verifications (email, otp, created_at, expires_at)
     VALUES ($1, $2, NOW(), NOW() + INTERVAL '10 minutes')
     ON CONFLICT (email) DO UPDATE SET otp = $2, created_at = NOW(), expires_at = NOW() + INTERVAL '10 minutes'
     RETURNING email, created_at`,
    [email, otp]
  );
  return result.rows[0];
};

export const verifyOTP = async (email: string, otp: string) => {
  const result = await pool.query(
    `SELECT * FROM otp_verifications WHERE email = $1 AND otp = $2 AND expires_at > NOW()`,
    [email, otp]
  );
  
  if (result.rows.length > 0) {
    await pool.query(
      `DELETE FROM otp_verifications WHERE email = $1`,
      [email]
    );
    return true;
  }
  
  return false;
};
