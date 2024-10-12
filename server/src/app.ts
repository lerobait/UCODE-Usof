import express from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import AppError from './utils/appError';
import authRouter from './routes/auth.routes';
import globalErrorHandler from './controllers/errorController';

const app = express();

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(xss());
app.use(compression());

app.use('/api/auth', authRouter);

app.all(
  '*',
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  },
);

app.use(globalErrorHandler);

export default app;
