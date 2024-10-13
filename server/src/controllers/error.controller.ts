import { Request, Response } from 'express';
import {
  ValidationError,
  DatabaseError,
  UniqueConstraintError,
} from 'sequelize';
import AppError from '../utils/appError';

const handleSequelizeValidationError = (err: ValidationError) => {
  const errors = err.errors.map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleUniqueConstraintError = (err: UniqueConstraintError) => {
  const message = `Duplicate field value: ${err.errors[0].value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleDatabaseError = (err: DatabaseError) => {
  const message = `Database error: ${err.message}`;
  return new AppError(message, 500);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err: AppError, req: Request, res: Response) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  console.error('ERROR 💥', err);
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const sendErrorProd = (err: AppError, req: Request, res: Response) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    console.error('ERROR 💥', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  console.error('ERROR 💥', err);
  return res.status(500).json({
    status: 'error',
    message: 'Please try again later.',
  });
};

const globalErrorHandler = (err: Error, req: Request, res: Response) => {
  const error = err as AppError;
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let customError = { ...error };
    customError.message = error.message;

    if (error instanceof ValidationError)
      customError = handleSequelizeValidationError(error);
    if (error instanceof UniqueConstraintError)
      customError = handleUniqueConstraintError(error);
    if (error instanceof DatabaseError)
      customError = handleDatabaseError(error);

    if (error.name === 'JsonWebTokenError') customError = handleJWTError();
    if (error.name === 'TokenExpiredError')
      customError = handleJWTExpiredError();

    sendErrorProd(customError, req, res);
  }
};

export default globalErrorHandler;
