-- CMS Content Management Table
CREATE TABLE cms_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default content for each section
INSERT INTO cms_content (section_key, content) VALUES 
('hero', '{
  "welcome_text": "WELCOME",
  "main_heading": "Your Career, Your Pace",
  "sub_heading": "Your Aveyo.",
  "description": "Join the fastest-growing sales team in the country. Earn more, travel more, live more.",
  "cta_primary": "JOIN AVEYO",
  "cta_secondary": "LOGIN",
  "background_video": "/videos/aveyoWEB1a.mp4",
  "copyright": "© 2025 MYAVEYO"
}'),

('inside_blocks', '{
  "blocks": [
    {
      "id": "001",
      "title": "The Culture",
      "description": "We keep it real. We celebrate wins, push each other to be better, and never forget to have fun along the way.",
      "background_image": "/images/unlmtd.png"
    },
    {
      "id": "002", 
      "title": "The Training",
      "description": "From day one, you will get hands-on training that actually works. No fluff, just real skills that help you close deals and build lasting relationships.",
      "background_image": "/images/presentation.png"
    },
    {
      "id": "003",
      "title": "The Lifestyle", 
      "description": "Work hard, live well. Flexible schedules, remote options, and the freedom to design your career around the life you want to live.",
      "background_image": "/images/WEBSITE PHOTO.png"
    },
    {
      "id": "004",
      "title": "The Growth",
      "description": "Your potential is unlimited here. Clear advancement paths, mentorship programs, and opportunities to lead from day one.",
      "background_image": "/images/growth.png"
    }
  ],
  "section_title": "On The Inside",
  "section_number": "(4)",
  "cta_button": "APPLY NOW"
}'),

('sales', '{
  "section_number": "(3)",
  "section_title": "Sales.",
  "description": "We are not just another sales company. We are a community of driven individuals who believe in the power of authentic relationships and genuine value.",
  "background_logo": "/aveyoSalesLogo.svg"
}');

-- Create indexes for better performance
CREATE INDEX idx_cms_content_section_key ON cms_content(section_key);
CREATE INDEX idx_cms_content_published ON cms_content(is_published);

-- Enable Row Level Security (optional)
ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users (adjust as needed)
CREATE POLICY "Enable all operations for authenticated users" ON cms_content
  FOR ALL USING (true);
