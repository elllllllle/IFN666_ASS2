# Reading Tracker API

GitHub Repository: https://github.com/elllllllle/IFN666_ASS2

Written by Elle Koedduang for Queensland University of Technology, IFN666 Web and Mobile Application Development.

## Purpose

The **Reading Tracker API** is a backend service built using **Express.js** that enables users to track their reading activity, manage books, organise personal shelves, and authenticate securely. It supports creating, updating, deleting, and retrieving books, reading logs, and shelves. This API is designed to provide a secure and efficient backend for a personal reading tracking application, similar to Goodreads.

## API Endpoints

### **Authentication**
- `POST /api/auth/register` – Register a new user.
- `POST /api/auth/login` – Login an existing user and receive a JWT token.

### **Books**
- `GET /api/books` – Retrieve all books. Supports search by `title`, `author`, `genre`, and sorting via query parameters. Supports pagination via `page` and `limit` query parameters.
- `POST /api/books` – Create a new book. *(Requires authentication)*
- `GET /api/books/:id` – Retrieve a specific book by ID.
- `PUT /api/books/:id` – Update a book by ID. *(Requires authentication)*
- `DELETE /api/books/:id` – Delete a book by ID. *(Requires authentication)*

### **Reading Logs**
All reading log endpoints require authentication. Users can only access their own reading logs.

- `GET /api/reading-logs` – Retrieve all reading logs for the logged-in user. Supports filtering by `status` and sorting via query parameters. Supports pagination.
- `POST /api/reading-logs` – Create a new reading log entry.
- `GET /api/reading-logs/:id` – Retrieve a specific reading log by ID.
- `PUT /api/reading-logs/:id` – Update a reading log by ID.
- `DELETE /api/reading-logs/:id` – Delete a reading log by ID.

### **Shelves**
All shelf endpoints require authentication. Users can only access their own shelves.

- `GET /api/shelves` – Retrieve all shelves for the logged-in user. Supports search by `name` and sorting. Supports pagination.
- `POST /api/shelves` – Create a new shelf.
- `GET /api/shelves/:id` – Retrieve a specific shelf by ID.
- `PUT /api/shelves/:id` – Update a shelf by ID.
- `DELETE /api/shelves/:id` – Delete a shelf by ID.
- `POST /api/shelves/:id/books` – Add a book to a shelf.
- `DELETE /api/shelves/:id/books/:bookId` – Remove a book from a shelf.

## Features

- **User Authentication:** Users can register, log in, and authenticate using JWT Bearer tokens.
- **Book Management:** Full CRUD operations for books, with search by title, author, and genre.
- **Reading Log Tracking:** Users can log their reading activity, tracking status (want-to-read, reading, completed), progress percentage, rating, and review.
- **Shelf Management:** Users can organise books into named shelves, with support for public or private visibility.
- **Input Validation:** All POST and PUT endpoints validate incoming data using `express-validator`, returning clear error messages for invalid or missing fields.
- **Search & Sort:** GET all endpoints support query-parameter-based search and sorting, handled at the database layer using Mongoose.
- **Pagination:** GET all endpoints support pagination via `page` and `limit` query parameters, with navigation links returned in HTTP response `Link` headers.
- **Error Handling:** Meaningful HTTP status codes and error messages are returned for all failure cases (400, 401, 403, 404, 409, 500).

## Application Architecture

The **Reading Tracker API** follows a **RESTful, decoupled architecture** with the following structure:

- **Express.js** handles HTTP requests, routing, and middleware.
- **MongoDB** is used as the document database, accessed through **Mongoose** with defined schemas and model references.
- **JWT Authentication** secures protected endpoints. Users must log in to receive a Bearer token, which must be included in the `Authorization` header of subsequent requests.
- **Caddy** is used as a reverse proxy to route public HTTPS traffic to the Node.js server running on localhost.
- The application is divided into modules for separation of concerns:

### Folder Structure

```
server/
├── API-collection.json       # Hoppscotch API collection for testing
├── README.md                 # Project documentation
├── package.json              # Node project file and dependencies
├── server.js                 # Application entry point
└── src/
    ├── controllers/          # Business logic for each resource
    │   ├── authController.js
    │   ├── bookController.js
    │   ├── readingLogController.js
    │   └── shelfController.js
    ├── middleware/            # Reusable middleware functions
    │   ├── authenticateToken.js
    │   ├── authValidation.js
    │   ├── bookValidation.js
    │   ├── readingLogValidation.js
    │   ├── shelfValidation.js
    │   ├── validate.js
    │   ├── validateMongoId.js
    │   └── validatePaginateQueryParams.js
    ├── models/               # Mongoose schemas and models
    │   ├── Book.js
    │   ├── ReadingLog.js
    │   ├── Shelf.js
    │   └── User.js
    ├── routes/               # Express routers for each resource
    │   ├── index.js
    │   ├── authRouter.js
    │   ├── bookRouter.js
    │   ├── readingLogRouter.js
    │   └── shelfRouter.js
    └── utils/                # Helper functions
        └── generatePaginationLinks.js
```

## Dependencies

The **Reading Tracker API** uses the following dependencies, listed in `package.json`:

- **express** – Web framework for handling HTTP requests and routing.
- **mongoose** – MongoDB ODM library for schema definition and database interaction.
- **mongoose-paginate-v2** – Pagination plugin for Mongoose models.
- **bcrypt** – For hashing and verifying user passwords.
- **jsonwebtoken** – For generating and validating JWT tokens.
- **express-async-handler** – Simplifies async error handling in Express route handlers.
- **express-validator** – For validating and sanitising incoming request data.
- **cors** – For enabling Cross-Origin Resource Sharing.

To install all dependencies, run:

```bash
npm install
```

To start the server in development mode:

```bash
nodemon server.js
```

## How to Contribute

Contributions to the Reading Tracker API are welcome. To contribute:

1. **Fork** the repository and clone it to your local machine.
2. **Create a new branch** for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and **commit** them with clear, descriptive messages:
   ```bash
   git commit -m "Add feature: your feature description"
   ```
4. **Push** your changes to your forked repository:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Submit a **Pull Request** to the main repository for review.

Please ensure your contributions follow the existing code style, are well-documented, and do not break existing functionality.

## How to Report Issues

To report a bug or issue with the Reading Tracker API:

1. **Check the Issues page** on GitHub to see if the issue has already been reported.
2. If not, create a new issue and include:
   - A clear **description of the issue**.
   - **Steps to reproduce** the problem.
   - **Expected behaviour** vs **actual behaviour**.
   - Any relevant **error messages**, **logs**, or **screenshots**.
3. We will review and respond to issues as promptly as possible.
