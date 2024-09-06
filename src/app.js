import express from 'express';
import cors from 'cors';
import cookieParser from 'cookies-parser';

const app = express();

app.use(cors());
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use();
app.use(cookieParser());
app.use(express.static('public/css'));

export { app };
