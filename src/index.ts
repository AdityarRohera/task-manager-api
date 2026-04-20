
import express, { urlencoded } from 'express'
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




// Database connection 
const connection = async() => {
    await connectToDb()
    app.listen(port, () => {
        console.log(`App listening  on URL ${`http://localhost:${port}`}`)
    })
}

connection();

