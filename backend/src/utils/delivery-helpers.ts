import { pool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export const schedulePickup = async (data: {
  rental_id: string;
  scheduled_date: Date;
  time_slot: string;
  pickup_address: string;
  notes?: string;
}) => {
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO pickup_requests (id, rental_id, scheduled_date, time_slot, pickup_address, notes, status, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, 'scheduled', NOW())
     RETURNING *`,
    [id, data.rental_id, data.scheduled_date, data.time_slot, data.pickup_address, data.notes]
  );
  return result.rows[0];
};

export const getPickupRequest = async (pickupId: string) => {
  const result = await pool.query(
    `SELECT pr.*, r.user_id, r.product_id, p.name as product_name
     FROM pickup_requests pr
     LEFT JOIN rentals r ON pr.rental_id = r.id
     LEFT JOIN products p ON r.product_id = p.id
     WHERE pr.id = $1`,
    [pickupId]
  );
  return result.rows[0];
};

export const getRentalPickup = async (rentalId: string) => {
  const result = await pool.query(
    `SELECT * FROM pickup_requests WHERE rental_id = $1 ORDER BY created_at DESC LIMIT 1`,
    [rentalId]
  );
  return result.rows[0];
};

export const updatePickupStatus = async (pickupId: string, status: string) => {
  const result = await pool.query(
    `UPDATE pickup_requests SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [status, pickupId]
  );
  return result.rows[0];
};

export const scheduleReturn = async (data: {
  rental_id: string;
  scheduled_date: Date;
  time_slot: string;
  return_address: string;
  notes?: string;
}) => {
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO return_requests (id, rental_id, scheduled_date, time_slot, return_address, notes, status, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, 'scheduled', NOW())
     RETURNING *`,
    [id, data.rental_id, data.scheduled_date, data.time_slot, data.return_address, data.notes]
  );
  return result.rows[0];
};

export const getReturnRequest = async (returnId: string) => {
  const result = await pool.query(
    `SELECT rr.*, r.user_id, r.product_id, p.name as product_name
     FROM return_requests rr
     LEFT JOIN rentals r ON rr.rental_id = r.id
     LEFT JOIN products p ON r.product_id = p.id
     WHERE rr.id = $1`,
    [returnId]
  );
  return result.rows[0];
};

export const getRentalReturn = async (rentalId: string) => {
  const result = await pool.query(
    `SELECT * FROM return_requests WHERE rental_id = $1 ORDER BY created_at DESC LIMIT 1`,
    [rentalId]
  );
  return result.rows[0];
};

export const updateReturnStatus = async (returnId: string, status: string) => {
  const result = await pool.query(
    `UPDATE return_requests SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [status, returnId]
  );
  return result.rows[0];
};

export const reportDamage = async (data: {
  rental_id: string;
  damage_type: string;
  severity: string;
  description: string;
  estimated_cost?: number;
  reported_by_user: boolean;
}) => {
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO damage_reports (
      id, rental_id, damage_type, severity, description, estimated_cost, reported_by_user, status, created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', NOW())
    RETURNING *`,
    [
      id,
      data.rental_id,
      data.damage_type,
      data.severity,
      data.description,
      data.estimated_cost,
      data.reported_by_user,
    ]
  );
  return result.rows[0];
};

export const getDamageReport = async (reportId: string) => {
  const result = await pool.query(
    `SELECT dr.*, r.user_id, r.product_id, p.name as product_name
     FROM damage_reports dr
     LEFT JOIN rentals r ON dr.rental_id = r.id
     LEFT JOIN products p ON r.product_id = p.id
     WHERE dr.id = $1`,
    [reportId]
  );
  return result.rows[0];
};

export const getRentalDamageReports = async (rentalId: string) => {
  const result = await pool.query(
    `SELECT * FROM damage_reports WHERE rental_id = $1 ORDER BY created_at DESC`,
    [rentalId]
  );
  return result.rows;
};

export const updateDamageReport = async (
  reportId: string,
  data: {
    status?: string;
    approved_cost?: number;
    notes?: string;
  }
) => {
  const fields: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  if (data.status) {
    fields.push(`status = $${paramCount++}`);
    values.push(data.status);
  }
  if (data.approved_cost) {
    fields.push(`approved_cost = $${paramCount++}`);
    values.push(data.approved_cost);
  }
  if (data.notes) {
    fields.push(`admin_notes = $${paramCount++}`);
    values.push(data.notes);
  }

  if (fields.length === 0) return null;

  fields.push(`updated_at = NOW()`);
  values.push(reportId);

  const result = await pool.query(
    `UPDATE damage_reports SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
    values
  );

  return result.rows[0];
};
