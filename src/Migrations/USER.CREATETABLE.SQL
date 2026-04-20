

CREATE TABLE IF NOT EXISTS users(
	"UID" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"NAME" varchar(100) not null,
	"EMAIL" varchar(255) not Null,
	"PASSWORD" varchar(255) not null
)