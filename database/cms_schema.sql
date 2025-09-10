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
  "main_heading": "Not Your Average Sales Gig.",
  "description": "UNLIMITED POTENTIAL. PROVEN METHODS. MASSIVE EARNINGS. REAL FREEDOM. AND A CULTURE THAT CARES. HERE, YOUR HARD WORK SPEAKS FOR ITSELF.",
  "copyright": "© 2025 myaveyo",
  "background_logo": "/aveyoSalesLogo.svg",
  "grid": {
    "large_image": {
      "url": "/images/donny-hammond.jpeg",
      "alt": "Sales representative"
    },
    "text_block": {
      "title": "A COMPLETELY KITTED TOOL KIT.",
      "content": "No limits, just wins. From your first deal to your biggest bonus, we set you up with the tools, training, and support you need to crush goals and climb fast. When you win, the whole team wins—and we celebrate every step of the way."
    },
    "button": {
      "text": "JOIN THE TEAM",
      "variant": "primary"
    },
    "stat_card_1": {
      "value": "540",
      "title": "Milestones Achieved",
      "description": "Career milestones achieved by Aveyo reps last year"
    },
    "stat_card_2": {
      "value": "850",
      "prefix": "$",
      "suffix": "K",
      "title": "Total Earned",
      "description": "By our reps in commissions and bonuses"
    },
    "bottom_image": {
      "url": "/images/Alpha Aveyo-4.jpeg",
      "alt": "Team photo"
    }
  }
}'),

('home_stats', '{
  "stats": [
    {
      "id": "1",
      "title": "Increase",
      "value": "10",
      "prefix": "",
      "suffix": "%",
      "description": "Monthly growth in sales performance",
      "icon": "📈",
      "order": 1
    },
    {
      "id": "2",
      "title": "Projects Sold",
      "value": "45",
      "prefix": "",
      "suffix": "",
      "description": "Successful projects completed this month",
      "icon": "🏠",
      "order": 2
    },
    {
      "id": "3",
      "title": "Revenue Generated",
      "value": "850",
      "prefix": "$",
      "suffix": "K",
      "description": "Total revenue generated this quarter",
      "icon": "💰",
      "order": 3
    },
    {
      "id": "4",
      "title": "Customer Satisfaction",
      "value": "98",
      "prefix": "",
      "suffix": "%",
      "description": "Based on customer reviews and feedback",
      "icon": "⭐",
      "order": 4
    }
  ]
}');

-- Create indexes for better performance
CREATE INDEX idx_cms_content_section_key ON cms_content(section_key);
CREATE INDEX idx_cms_content_published ON cms_content(is_published);

-- Enable Row Level Security (optional)
ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users (adjust as needed)
CREATE POLICY "Enable all operations for authenticated users" ON cms_content
  FOR ALL USING (true);
