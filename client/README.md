# Reading Tracker Frontend (React App)

GitHub Repository: https://github.com/elllllllle/IFN666_ASS2

Written by Elle Koedduang for Queensland University of Technology, IFN666 Web and Mobile Application Development.

## Purpose

The **Reading Tracker Frontend** is a React-based web application that provides users with a simple and intuitive interface to track their reading journey. It interacts with a backend REST API to handle user registration, authentication, book browsing, reading logs, and shelf management. The frontend is built to be a user-friendly client to the API, inspired by platforms like Goodreads.

## Features

- **User Authentication:** Register and log in to access personalised reading features.
- **Book Browsing:** Browse, search, and sort books with pagination support.
- **Reading Logs:** Track reading status (Want to Read, Currently Reading, Completed), progress, ratings, and reviews.
- **My Shelves:** Create and manage custom bookshelves to organise your reading collection.
- **Book Covers:** Automatically fetches book covers from the Open Library Covers API using ISBN.
- **Responsive Design:** Adapts to different screen sizes for mobile and desktop use.

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

The **Reading Tracker Frontend** relies on the following dependencies, listed in the `package.json` file:

- **react**: A JavaScript library for building user interfaces.
- **react-dom**: Provides DOM-specific methods for rendering React components.
- **react-router**: Used for routing and navigation between different views of the app.
- **@mantine/core**: A React component library for building the user interface.
- **@mantine/hooks**: Utility hooks for Mantine components.
- **@mantine/notifications**: Toast notification system for user feedback.
- **@tabler/icons-react**: Icon library used throughout the application.

To install these dependencies, simply run:

```bash
npm install
```

## Application Architecture

The **Reading Tracker Frontend** follows a **component-based architecture**, with React components serving as the building blocks of the user interface. The application is organised into several components and pages, each with a specific responsibility:

- **Components:** Reusable UI components specific to the application.
  - **Book:** Components for displaying book cards in the browse view.
  - **ReadingLog:** Components for managing reading log entries, including modals for adding and editing logs.
  - **Shelf:** Components for creating, editing, and displaying bookshelves.
- **Pages:** Components that correspond to specific views in the application.
  - **Home:** The main book browsing page with search, sort, and pagination.
  - **BookDetail:** Detailed view of a single book with reading log and shelf actions.
  - **MyBooks:** Personal library page combining reading logs and custom shelves.
  - **Login:** The login page for users to access the app.
  - **Register:** The registration page for new users.
  - **NoPage:** 404 page for unmatched routes.
- **Context:** Global state management using React Context API.
  - **AuthContext:** Manages authentication state, JWT token, and user session.

### Folder Structure

```
client/
├── public/
│   └── favicon.svg                   # Application favicon
├── src/
│   ├── components/
│   │   ├── Book/
│   │   │   └── BookCard.jsx          # Book card for browse view
│   │   ├── ReadingLog/
│   │   │   ├── AddToLogModal.jsx     # Modal for adding/editing reading logs
│   │   │   └── ReadingLogItem.jsx.   # Reading log list item
│   │   ├── Shelf/
│   │   │   ├── AddToShelfModal.jsx   # Modal for adding book to shelf
│   │   │   ├── CreateShelfModal.jsx  # Modal for creating a new shelf
│   │   │   ├── EditShelfModal.jsx    # Modal for editing shelf name
│   │   │   └── ShelfCard.jsx         # Shelf card component
│   │   └── ProtectedRoute.jsx        # Route guard for authenticated pages
│   ├── context/
│   │   └── AuthContext.jsx           # Global authentication context
│   ├── pages/
│   │   ├── BookDetail.jsx            # Single book detail view
│   │   ├── Home.jsx                  # Book browsing page
│   │   ├── Layout.jsx                # App shell with navigation
│   │   ├── Login.jsx                 # Login page
│   │   ├── MyBooks.jsx               # Personal library page
│   │   ├── NoPage.jsx                # 404 not found page
│   │   └── Register.jsx              # Registration page
│   ├── App.jsx                       # Main application component with routing
│   ├── main.jsx                      # Entry point for React
│   └── theme.css                     # Global theme overrides
├── .env
├── index.html
├── package.json
└── vite.config.js
```

## Environment Variables

Create a `.env` file at the root of the client directory with the following:

```
VITE_API_URL=http://localhost:3000/api
```

| Variable | Description | Example |
|---|---|---|
| VITE_API_URL | URL of the REST API backend | http://localhost:3000/api |

## Running the Application

```bash
# Development mode
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## How to Report Issues

If you encounter any issues with the **Reading Tracker Frontend**, please follow these steps to report them:

1. Check the **Issues** page on the repository to see if your issue has already been reported.
2. If the issue has not been reported, **create a new issue** with the following details:
   - A clear description of the problem.
   - Steps to reproduce the issue, including any relevant code or error messages.
   - The expected behavior vs. the actual behavior.
   - Screenshots or logs (if applicable).
3. We will review the issue and provide updates as necessary.
