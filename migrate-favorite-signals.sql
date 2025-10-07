-- Migration script to update existing favorite_traffic_signals table
-- Run this if the table already exists with the old schema

-- If table exists with VARCHAR(500), alter it to VARCHAR(100)
DO $$ 
BEGIN
    -- Check if column exists and alter if needed
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'favorite_traffic_signals' 
        AND column_name = 'signalImageUrl'
    ) THEN
        -- Alter column length
        ALTER TABLE favorite_traffic_signals 
        ALTER COLUMN "signalImageUrl" TYPE VARCHAR(100);
        
        RAISE NOTICE 'Column signalImageUrl altered successfully';
    ELSE
        RAISE NOTICE 'Column signalImageUrl does not exist';
    END IF;
END $$;

-- Optionally clear existing data if it contains full URLs
-- UPDATE favorite_traffic_signals 
-- SET "signalImageUrl" = "signalId" 
-- WHERE LENGTH("signalImageUrl") > 100;

-- Verify the change
SELECT table_name, column_name, data_type, character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'favorite_traffic_signals' 
AND column_name = 'signalImageUrl';

