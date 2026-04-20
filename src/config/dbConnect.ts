import {Pool} from 'pg'


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'TaskManagement',
  password: 'postgresql',
  port: 5432,
});

const connectToDb = async () => {
	try {
		await pool.connect();
		console.log("✅ Connected to PostgreSQL (pgAdmin)");
	} catch (err) {
		console.error("❌ PostgreSQL Connection Failed:", err);
	}
};


export {connectToDb , pool};