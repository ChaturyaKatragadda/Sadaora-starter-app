# Sadaora-starter-app

## Setup Instructions

Follow these steps to run the application locally:

**Prerequisites:**
- Node.js (v16 or later recommended)
- npm or yarn
- PostgreSQL server running
- pgAdmin 4

**Backend Setup:**
1.  **Clone the repository:**
    ```bash
    git clone (https://github.com/ChaturyaKatragadda/Sadaora-Starter-App) # Repository URL
    cd sadaora-app/backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install # or yarn install
    ```
3.  **Set up PostgreSQL Database:**
    * Connect to your PostgreSQL instance (e.g., using `psql` or pgAdmin).
    * Create a database named `sadaora_db`:
        ```sql
        CREATE DATABASE sadaora_db;
        ```
    * Connect to the `sadaora_db` database.
    * Run the SQL commands found in the assessment description (or provide a `schema.sql` file) to create the `users` and `profiles` tables, including the optional 
        `updated_at` trigger function.
        ```sql
        -- Example: If you put the schema in a file
        -- psql -U your_postgres_user -d sadaora_db -a -f path/to/schema.sql
        ```
4.  **Configure Environment Variables:**
    * Create a `.env` file in the `backend` directory:
        ```bash
        cp .env.example .env # If you create an example file
        # OR create it manually
        touch .env
        ```
    * Add the following content, adjusting connection details and JWT secret:
        ```env
        # backend/.env
        DATABASE_URL=postgresql://YOUR_PG_USER:YOUR_PG_PASSWORD@localhost:5432/sadaora_db
        JWT_SECRET=YOUR_SUPER_SECRET_RANDOM_JWT_KEY # Use a strong, random key
        PORT=3001 # Optional: Or any port you prefer for the backend
        ```
        *(Replace `YOUR_PG_USER`, `YOUR_PG_PASSWORD`, and `YOUR_SUPER_SECRET_RANDOM_JWT_KEY`)*
5.  **Run the backend server:**
    ```bash
    npm run dev # For development with nodemon
    # or
    npm start # For production start
    ```
    The backend should now be running (likely on `http://localhost:3001`).

**Frontend Setup:**

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend # From the backend directory
    # or cd sadaora-app/frontend from the root
    ```
2.  **Install dependencies:**
    ```bash
    npm install # or yarn install
    ```
3.  **Configure Environment Variables:**
    * Create a `.env` file in the `frontend` directory:
        ```bash
        touch .env
        ```
    * Add the backend API URL:
        ```env
        # frontend/.env
        VITE_API_BASE_URL=http://localhost:3001/api # Use the correct backend port and base path
        ```
4.  **Run the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend should now be running (likely on `http://localhost:5173` or similar) and connected to your local backend.

## Architectural Decisions
-- The application follows a standard client-server architecture with a React single-page application (SPA) frontend and a Node.js/Express RESTful API backend. State management on the frontend relies on React Context API (`AuthContext`) for handling user authentication state and JWT tokens, providing a centralized way to manage login status across components. Axios is used for API communication, configured with a base URL and automatic Authorization header injection based on the stored token.

-- On the backend, Express provides the routing and middleware framework. PostgreSQL was chosen as the database for its robustness and support for array types (used for 'interests' tags). Database interactions are handled via the `pg` library using a connection pool for efficiency. Authentication uses bcrypt for password hashing and JWT for session management, ensuring secure credential handling and stateless authorization for protected API routes via custom middleware. The API structure is organized into routes, controllers, and middleware for separation of concerns.

# Assumptions made are:- 
 - Assumed standard email/password authentication is sufficient (no OAuth).
 - Assumed profile 'interests' are simple text tags, stored as a PostgreSQL array.
 - The public feed should show profiles most recently *updated* first.

