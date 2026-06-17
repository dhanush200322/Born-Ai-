-- 02_add_user_id.sql
-- Add user_id column to the agents table referencing auth.users(id)
ALTER TABLE agents ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create an index on user_id for fast retrieval
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON agents(user_id);
