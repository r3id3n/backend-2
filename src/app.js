import express from 'express';
import { engine } from 'express-handlebars';
import initPassport from './config/passport.config.js';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import sessionRouter from './routes/session.router.js';
import viewRouter from './routes/views.router.js';
const app = express();
const port = 8080;
import "./database.js";

app.use(express.static('src/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
initPassport();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use('/', viewRouter);
app.use('/api/sessions', sessionRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    });