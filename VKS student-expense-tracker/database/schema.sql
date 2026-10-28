-- Create expenses table for Student Expense Tracker
CREATE TABLE IF NOT EXISTS expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public access for demonstration/educational project purposes
-- Note: In production, restrict this to authenticated users.
CREATE POLICY "Allow public access to expenses"
    ON expenses
    FOR ALL
    USING (true)
    WITH CHECK (true);
