
import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors'
import { connectToDb } from './config/dbConnect';


// Global variables 
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());




// import api's Routes
import userRoute from './routes/userRoute';
import taskRoute from './routes/taskRoute';
app.use('/api/v1' , userRoute);
app.use('/api/v1' , taskRoute);

// Handle malformed JSON body errors from express.json()
app.use((err: any, req: any, res: any, next: any) => {
    if (err instanceof SyntaxError && (err as any).status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Invalid JSON body' });
    }
    next(err);
});



// Database connection 
const connection = async() => {
    await connectToDb()
    app.listen(port, () => {
        console.log(`App listening  on URL ${`http://localhost:${port}`}`)
    })
}

connection();

