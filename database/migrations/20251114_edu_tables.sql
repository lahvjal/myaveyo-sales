-- EDU Platform Tables Migration
-- Creates tables for courses, lessons, progress tracking, and notes

-- Courses Table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Lessons Table
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  duration_minutes INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Lesson Progress Table
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Lesson Notes Table
CREATE TABLE lesson_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_lessons_course_id ON lessons(course_id);
CREATE INDEX idx_lessons_sort_order ON lessons(sort_order);
CREATE INDEX idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);
CREATE INDEX idx_lesson_notes_user_id ON lesson_notes(user_id);
CREATE INDEX idx_lesson_notes_lesson_id ON lesson_notes(lesson_id);
CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_sort_order ON courses(sort_order);

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_notes ENABLE ROW LEVEL SECURITY;

-- Courses policies (all authenticated users can read published courses)
CREATE POLICY "Anyone can view published courses" ON courses
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can do anything with courses" ON courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Lessons policies (all authenticated users can read published lessons)
CREATE POLICY "Anyone can view published lessons" ON lessons
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can do anything with lessons" ON lessons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Lesson Progress policies (users can only see/modify their own progress)
CREATE POLICY "Users can view their own progress" ON lesson_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON lesson_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON lesson_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Lesson Notes policies (users can only see/modify their own notes)
CREATE POLICY "Users can view their own notes" ON lesson_notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes" ON lesson_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" ON lesson_notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" ON lesson_notes
  FOR DELETE USING (auth.uid() = user_id);

-- Regions Table (for managing regional variations)
CREATE TABLE regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add region column to lessons
ALTER TABLE lessons ADD COLUMN region TEXT NOT NULL DEFAULT 'california';

-- Create index for lessons region
CREATE INDEX idx_lessons_region ON lessons(region);

-- Enable RLS for regions
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;

-- Regions policies (all authenticated users can view active regions)
CREATE POLICY "Anyone can view active regions" ON regions
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can do anything with regions" ON regions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Insert initial regions
INSERT INTO regions (name, slug, sort_order) VALUES 
  ('California', 'california', 1),
  ('Illinois', 'illinois', 2);

-- Insert initial courses
INSERT INTO courses (title, description, slug, sort_order) VALUES
  ('Closer', 'Master the art of closing solar deals. Learn proven techniques and strategies to convert prospects into customers.', 'closer', 1),
  ('Setter', 'Learn how to set appointments and qualify leads effectively. Build the foundation for successful solar sales.', 'setter', 2);

