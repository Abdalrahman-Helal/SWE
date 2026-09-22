

DROP TABLE IF EXISTS basics.app_events;

CREATE TABLE basics.app_events(
  -- UUID is a universally unique identifier, which is a 128-bit number used to identify information in computer systems

  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,

  -- JSONB is a data type for storing JSON (JavaScript Object Notation) data in a binary format
  metadata JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO basics.app_events (event_name , metadata)
VALUES(
  'sign_up',
  '{"browser": "chrome"}'
),
(
  'sign_in',
  '{"user": "Helal"}'
);

SELECT * FROM basics.app_events;

SELECT 
  event_name,
  metadata ->> 'browser' AS browser

FROM basics.app_events
where metadata ? 'browser';
