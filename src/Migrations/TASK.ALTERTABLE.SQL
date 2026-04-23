

CREATE TYPE priorty_type AS ENUM ('HIGH', 'MEDIUM', 'LOW');
ALTER TABLE task
ADD column "PRIORTY" priorty_type default 'MEDIUM'

ALTER TABLE task 
add column "UPDATEDAT" timestamp with time zone DEFAULT CURRENT_TIMESTAMP;


ALTER TABLE task
ADD COLUMN "ASSIGNED_TO" uuid NOT NULL,
ADD CONSTRAINT fk_assigned_to
FOREIGN KEY ("ASSIGNED_TO") 
REFERENCES users ("UID");

