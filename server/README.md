# Reading Tracker Backend (REST API)

Written by Elle for Queensland University of Technology, IFN666 Web and Mobile Application Development.

## Purpose

The **Reading Tracker Backend** is a RESTful API built with Node.js and Express, providing the server-side functionality for the Reading Tracker web application. It handles user authentication, book management, reading logs, and shelf management, with data persisted in a MongoDB database.

## Features

- **User Authentication:** Register and log in with JWT-based authentication.
- **Book Management:** Create, read, update, and delete books with search, sort, and pagination.
- **Reading Logs:** Track reading status, progress, ratings, and reviews per user.
- **Shelf Management:** Create and manage custom bookshelves with book associations.
- **Input Validation:** Request validation using express-validator.
- **Pagination:** Paginated responses with Link header navigation.

## How to Contribute

To contribute to the development of this project:

1. **Fork** the repository and clone it to your local machine.
2. **Create a new branch** for your feature or bug fix.
3. Make your changes, ensuring you follow the existing code style and structure.
4. **Commit** your changes with clear and descriptive commit messages.
5. **Push** your changes to your forked repository.
6. **Submit a Pull Request** for review.

Ensure your code passes any relevant tests, and provide clear documentation for new features or bug fixes.

## Dependencies

The **Reading Tracker Backend** relies on the following dependencies, listed in the `package.json` file:

- **express**: Web framework for Node.js.
- **mongoose**: MongoDB object modelling for Node.js.
- **mongoose-paginate-v2**: Pagination plugin for Mongoose.
- **bcrypt**: Password hashing library.
- **jsonwebtoken**: JWT generation and verification.
- **express-validator**: Middleware for validating and sanitising request data.
- **express-async-handler**: Simplifies error handling in async Express routes.
- **cors**: Enables Cross-Origin Resource Sharing.
- **dotenv**: Loads environment variables from a `.env` file.

To install these dependencies, simply run:

```bash
npm install
```

## Application Architecture

The **Reading Tracker Backend** follows a **layered architecture**, separating concerns across routes, controllers, middleware, and models:

- **Routes:** Define API endpoints and map them to controller functions.
- **Controllers:** Handle request logic and interact with models.
- **Middleware:** Reusable functions for authentication, validation, and pagination.
- **Models:** Mongoose schemas defining the data structure for each resource.
- **Utils:** Helper functions used across the application.

### Folder Structure

```
server/
├── API-collection.json           # Hoppscotch API collection for testing
├── README.md                     # Project documentation
├── package.json                  # Node project file and dependencies
├── server.js                     # Application entry point
└── src/
    ├── controllers/              # Business logic for each resource
    │   ├── authController.js
    │   ├── bookController.js
    │   ├── readingLogController.js
    │   └── shelfController.js
    ├── middleware/               # Reusable middleware functions
    │   ├── authenticateToken.js  # JWT authentication middleware
    │   ├── authValidation.js     # Validation rules for auth routes
    │   ├── bookValidation.js     # Validation rules for book routes
    │   ├── readingLogValidation.js # Validation rules for reading log routes
    │   ├── shelfValidation.js    # Validation rules for shelf routes
    │   ├── validate.js           # Shared validation error handler
    │   ├── validateMongoId.js    # MongoDB ObjectId validation
    │   └── validatePaginateQueryParams.js # Pagination query validation
    ├── models/                   # Mongoose schemas and models
    │   ├── Book.js
    │   ├── ReadingLog.js
    │   ├── Shelf.js
    │   └── User.js
    ├── routes/                   # Express routers for each resource
    │   ├── index.js              # Root router
    │   ├── authRouter.js
    │   ├── bookRouter.js
    │   ├── readingLogRouter.js
    │   └── shelfRouter.js
    └── utils/                    # Helper functions
        └── generatePaginationLinks.js
```

## Environment Variables

Create a `.env` file at the root of the server directory with the following:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/reading-tracker
TOKEN_SECRET=your_jwt_secret_key
```

| Variable | Description | Example |
|---|---|---|
| PORT | Port the server runs on | 3000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/reading-tracker |
| TOKEN_SECRET | Secret key for JWT signing | your_jwt_secret_key |

## Running the Application (Development)

```bash
# Install dependencies
npm install

# Start with nodemon (auto-restart on file changes)
nodemon server.js

# Start without nodemon
node server.js
```

The API will be available at `http://localhost:3000/api`.

## Deploying to Production (IFN666 Server)

### Prerequisites
- Node.js installed on the server
- MongoDB running on the server
- Caddy web server configured

### Step 1 — Clone the repository on the server

```bash
cd /home/ubuntu
git clone https://github.com/elllllllle/IFN666_ASS2.git
cd IFN666_ASS2/server
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Create the `.env` file

```bash
nano .env
```

Add the following:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/reading-tracker
TOKEN_SECRET=your_jwt_secret_key
```

### Step 4 — Create a startup script

```bash
nano /home/ubuntu/startup/a02-api.sh
```

Add the following:

```bash
#!/bin/bash
cd /home/ubuntu/IFN666_ASS2/server
node --env-file=/home/ubuntu/IFN666_ASS2/server/.env server.js
```

Make it executable:

```bash
chmod +x /home/ubuntu/startup/a02-api.sh
```

### Step 5 — Enable and start the service

```bash
sudo systemctl enable ifn666-startup@a02-api
sudo systemctl start ifn666-startup@a02-api
```

Check the logs:

```bash
sudo journalctl -u ifn666-startup@a02-api -f
```

### Step 6 — Configure Caddy

Edit the Caddyfile:

```bash
sudo nano /etc/caddy/Caddyfile
```

Add the API handler before the frontend handler:

```
cassowary02.ifn666.com {
    handle /assessment02/api/* {
        uri strip_prefix /assessment02
        reverse_proxy localhost:3000
    }
    handle_path /assessment02* {
        root /var/www/html/assessment02
        try_files {path} /index.html
        file_server
    }
    log {
        output file /var/www/html/access.log
        format json
    }
}
```

### Step 7 — Restart Caddy

```bash
sudo systemctl restart caddy
```

The API will be available at `https://cassowary02.ifn666.com/assessment02/api`.

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /api/auth/register | Register a new user | No |
| POST | /api/auth/login | Login and receive JWT | No |
| GET | /api/books | Get all books (search, sort, paginate) | No |
| GET | /api/books/:id | Get a single book | No |
| POST | /api/books | Create a book | Yes |
| PUT | /api/books/:id | Update a book | Yes |
| DELETE | /api/books/:id | Delete a book | Yes |
| GET | /api/reading-logs | Get user's reading logs | Yes |
| GET | /api/reading-logs/:id | Get a single reading log | Yes |
| POST | /api/reading-logs | Create a reading log | Yes |
| PUT | /api/reading-logs/:id | Update a reading log | Yes |
| DELETE | /api/reading-logs/:id | Delete a reading log | Yes |
| GET | /api/shelves | Get user's shelves | Yes |
| GET | /api/shelves/:id | Get a single shelf | Yes |
| POST | /api/shelves | Create a shelf | Yes |
| PUT | /api/shelves/:id | Update a shelf | Yes |
| DELETE | /api/shelves/:id | Delete a shelf | Yes |
| POST | /api/shelves/:id/books | Add book to shelf | Yes |
| DELETE | /api/shelves/:id/books/:bookId | Remove book from shelf | Yes |

## How to Report Issues

If you encounter any issues with the **Reading Tracker Backend**, please follow these steps to report them:

1. Check the **Issues** page on the repository to see if your issue has already been reported.
2. If the issue has not been reported, **create a new issue** with the following details:
   - A clear description of the problem.
   - Steps to reproduce the issue, including any relevant code or error messages.
   - The expected behavior vs. the actual behavior.
   - Screenshots or logs (if applicable).
3. We will review the issue and provide updates as necessary.
