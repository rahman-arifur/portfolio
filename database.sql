CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    technologies JSON,
    github_link VARCHAR(500),
    demo_link VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contests table
CREATE TABLE IF NOT EXISTS contests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contest_name VARCHAR(255) NOT NULL,
    rank VARCHAR(100) NOT NULL,
    team_name VARCHAR(255),
    standing_link VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data for testing

-- Sample projects
INSERT INTO projects (name, description, technologies, github_link, demo_link) VALUES
('E-commerce Website', 'A full-stack e-commerce website with user authentication, product catalog, and payment integration.', '["HTML", "CSS", "JavaScript", "PHP", "MySQL"]', 'https://github.com/username/ecommerce', 'https://demo.example.com/ecommerce'),
('Task Management App', 'A responsive task management application with drag-and-drop functionality and real-time updates.', '["React", "Node.js", "MongoDB", "Socket.io"]', 'https://github.com/username/taskmanager', 'https://demo.example.com/taskmanager'),
('Weather Dashboard', 'A weather dashboard that displays current weather and forecasts using external APIs.', '["JavaScript", "CSS", "API Integration"]', 'https://github.com/username/weather', 'https://demo.example.com/weather'),
('Portfolio Website', 'A responsive portfolio website showcasing projects and skills with smooth animations.', '["HTML", "CSS", "JavaScript", "PHP"]', 'https://github.com/username/portfolio', 'https://demo.example.com/portfolio'),
('Blog Platform', 'A content management system for blogging with user roles and comment system.', '["PHP", "MySQL", "Bootstrap", "jQuery"]', 'https://github.com/username/blog', 'https://demo.example.com/blog');

-- Sample contests
INSERT INTO contests (contest_name, rank, team_name, standing_link) VALUES
('Codeforces Round #850', '42', 'SoloParticipant', 'https://codeforces.com/contest/standings'),
('AtCoder Beginner Contest 290', '15', NULL, 'https://atcoder.jp/contests/standings'),
('Google Code Jam 2024', '156', 'CodeWarrior', 'https://codingcompetitions.withgoogle.com/codejam'),
('LeetCode Weekly Contest 385', '23', NULL, 'https://leetcode.com/contest/standings'),
('HackerRank Hour of Code', '8', 'TeamAlpha', 'https://www.hackerrank.com/contests/standings'),
('TopCoder SRM 850', '67', NULL, 'https://www.topcoder.com/challenges/standings');

-- Index for better performance
CREATE INDEX idx_projects_created_at ON projects(created_at);
CREATE INDEX idx_contests_created_at ON contests(created_at);
CREATE INDEX idx_messages_created_at ON messages(created_at);
