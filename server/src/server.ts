import { connectDatabase } from './database/db';
import app from './app';

const port = process.env.PORT || 3000;

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  const error = err as Error;
  console.error(error.name, error.message);
  process.exit(1);
});

connectDatabase();

const server = app.listen(port, () => {
  console.log(`App running on ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  const error = err as Error;
  console.error(error.name, error.message);
  server.close(() => {
    process.exit(1);
  });
});
