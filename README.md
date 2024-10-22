# USOF Application API

This is the API for the USOF (User Stack Overflow Forum) application. Follow the instructions below to set up and run the project.

## Prerequisites

Before you begin, ensure that you have the following installed and configured:

- [TypeScript](https://www.typescriptlang.org/)
- [MySQL](https://dev.mysql.com/downloads/mysql/)
- [Postman](https://www.postman.com/) (for API testing)
- [Mailtrap](https://mailtrap.io/) (for testing email functionality)
- [AWS S3](https://aws.amazon.com/s3/) (for file storage)

## Getting Started

1. **Clone the repository**:

   ```bash
   git clone <your-repository-url>
   ```

2. **Install dependencies**:

   Navigate to the project folder and run:

   ```bash
   npm install
   ```

3. **Navigate to the server directory:**:

   ```bash
   cd server
   ```

4. **Configure environment variables:**:

   Rename the example.env file to config.env:

   ```bash
   mv example.env config.env
   ```

   Then, update config.env with your own credentials for MySQL, AWS S3, and Mailtrap.

5. **Build the project:**:

   Compile the TypeScript code by running:

   ```bash
   npm run build
   ```

6. **Run migrations:**:

   Apply the database migrations:

   ```bash
   npm run migrate
   ```

   If there are issues with migrations, you can undo them with:

   ```bash
   npm run migrate:undo
   ```

7. **Start the server:**:

   Finally, start the project:

   ```bash
   npm run start
   ```

8. **API Documentation:**:
   You can explore the API documentation using this link: [API Documentation](https://documenter.getpostman.com/view/34523688/2sAXxY5V2S).

9. **Accessing the Admin Panel:**
   To access the admin panel, you need to comment out the following line in `server/routes/user.routes.ts`:

   ```typescript
   // router.use(restrictTo('admin'));
   ```

   After that, use the Update User route to set the user's role to "admin".
