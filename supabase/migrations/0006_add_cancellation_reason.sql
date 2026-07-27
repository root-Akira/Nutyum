-- Add cancellation_reason column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;

-- Backfill existing cancelled orders
-- Strategy:
--   1. Extract reason from orders.notes using [Cancellation reason: ...] pattern
--   2. Normalize "Not provided" → "Cancelled by customer"
--   3. Fall back to order_status_logs.notes for the cancelled transition
--   4. Skip generic "Status updated by admin" entries
UPDATE orders
SET cancellation_reason =
  CASE
    WHEN notes ~ '\[Cancellation reason: [^\]]+\]' THEN
      CASE
        WHEN substring(notes from '\[Cancellation reason: (.*?)\]') = 'Not provided'
        THEN 'Cancelled by customer'
        ELSE substring(notes from '\[Cancellation reason: (.*?)\]')
      END
    ELSE (
      SELECT trim(notes)
      FROM order_status_logs
      WHERE order_id = orders.id
        AND to_status = 'cancelled'
        AND notes IS NOT NULL
        AND notes != ''
        AND notes != 'Status updated by admin'
      ORDER BY changed_at DESC LIMIT 1
    )
  END
WHERE status = 'cancelled'
  AND cancellation_reason IS NULL;
