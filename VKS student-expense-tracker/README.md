# Student Expense Tracker (SpendWise)

A complete, beginner-friendly full-stack web application designed for college students to track their daily pocket money, textbooks, dorm supplies, and campus expenses.

## 🚀 Project Overview & Features
- **Frontend**: Responsive HTML5, CSS3, and Vanilla JavaScript with real-time budget calculations, search, category filters, and modal editing.
- **Backend**: Node.js and Express.js REST API with comprehensive CRUD endpoints.
- **Database**: Supabase PostgreSQL for persistent data storage with Row Level Security (RLS) enabled.
- **Features**:
  - Add, edit, delete, and view expenses.
  - Search and filter by title and category.
  - Live monthly budget tracker with remaining budget alerts.

---

## 🛠️ Prerequisites
- [Node.js](https://nodejs.org/) installed on your computer.
- A free account on [Supabase](https://supabase.com/).

---

## ⚙️ Supabase Setup & SQL Schema
1. Create a new project in Supabase.
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Paste and run the contents of `database/schema.sql`:
```sql
CREATE TABLE IF NOT EXISTS expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to expenses"
    ON expenses
    FOR ALL
    USING (true)
    WITH CHECK (true);
```
4. Copy your project **URL** and **anon/public API key** from Project Settings > API.

---

## 📦 Installation & Configuration

### 1. Backend Setup
Open your terminal inside the `backend` directory:
```bash
cd backend
npm install
npm install express cors dotenv @supabase/supabase-js ws
npm install --save-dev nodemon
```

### 2. Environment Variables
Create a `.env` file inside the `backend/` directory (you can copy `.env.example`):
```env
PORT=5000
SUPABASE_URL=your_actual_supabase_url
SUPABASE_KEY=your_actual_supabase_anon_key
```

### 3. Running the Application
Start the backend development server:
```bash
npm run dev
```
The server will start at `http://localhost:5000`.

To run the frontend:
- Open `frontend/index.html` directly in your browser or serve it using a local static server (e.g., Live Server in VS Code).

---

## 🔌 API Endpoints
- `GET /api/expenses` - Retrieve all expenses
- `POST /api/expenses` - Create a new expense
- `PUT /api/expenses/:id` - Update an expense by ID
- `DELETE /api/expenses/:id` - Delete an expense by ID

---

## ❓ Beginner-Friendly Viva Questions & Answers

1. **Q: What is the purpose of Express.js in this project?**
   - **A:** Express.js is a minimal and flexible Node.js web application framework that provides robust features to build our REST API endpoints (GET, POST, PUT, DELETE) and handle HTTP requests from the frontend.

2. **Q: Why do we use Supabase instead of storing data in an array on the frontend?**
   - **A:** Storing data in frontend memory (arrays) means it will be lost when the page refreshes. Supabase provides a persistent PostgreSQL database in the cloud so user expenses are saved securely and reliably.

3. **Q: What is Row Level Security (RLS) in PostgreSQL?**
   - **A:** RLS is a security feature that allows you to control which rows users can access or modify in a database table based on security policies. In this student project, we added a public policy for educational ease, but in production, users would only access their own data.

4. **Q: How does the frontend communicate with the backend?**
   - **A:** The frontend communicates with the backend using the browser's native `Fetch API`, sending asynchronous HTTP requests (JSON payloads) to our Express server endpoints.

5. **Q: Why must environment variables like Supabase keys be kept on the backend?**
   - **A:** Keeping secret keys on the backend prevents unauthorized users from inspecting client-side code and gaining unauthorized direct access or administrative privileges to your database.
