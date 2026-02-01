-- Drop the existing 'friendfy' database to start fresh (useful during development/testing)
Drop database friendfy;
-- Create the 'friendfy' database if it doesn't already exist
create database if not exists friendfy;
-- Select the 'friendfy' database for use in the following commands
use friendfy;

-- Create a table to store detailed information about system administrators 
create table Admin_info (
 admin_id int primary key auto_increment,        						-- Unique ID for each admin, auto-incremented
    a_fname varchar(50) not null,          								-- Admin's first name
    a_lname varchar(50) not null,         								-- Admin's last name
    a_birthdate date not null,            								-- Admin's birthdate
    a_phonenumber varchar(10) not null,         						-- Admin's phone number (10 digits)
    a_email varchar(100) not null,          							-- Admin's email address
    a_pass varchar(100),            									-- Admin's password (optional, may be stored elsewhere)
    a_gender enum('Male', 'Female', 'Non-binary', 'Other') not null  	-- Admin's gender
);

-- Create a table for admin login credentials and activity tracking
create table Admin_login (
 admin_id int,               											-- References the admin_info table
 a_username varchar(50) not null,         								-- Admin's chosen login username
    a_password varchar(100) not null,         							-- Admins' password
    a_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP       					-- Timestamp of login record creation
);

-- Create a table to store information about users of the platform
create table Users (
 user_id int primary key auto_increment,        						-- Unique ID for each user, auto-increment
 u_username varchar(50) not null unique,        						-- User's unique username
    u_password varchar(100) not null,         							-- User's password
    u_fname varchar(50) not null,          								-- User's first name
    u_lname varchar(50) not null,          								-- User's last name
    u_birthdate date not null,           								-- User's birthdate
    u_email varchar(100) not null,          							-- User's email address
    u_gender enum('Male', 'Female', 'Non-binary', 'Other') not null, 	-- User's gender
    u_phonenumber varchar(10) not null,         						-- User's phone number
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP      				-- Record creation timestamp
);

select * from admin_info;
select * from admin_login;

-- Create a table to store event details available to users
create table Events (
 event_id int primary key auto_increment,        						-- Unique event ID
    e_img varchar(200),             									-- Image file name or path
    e_name varchar(50) not null,          								-- Name of the event
    e_start_date date not null,           								-- Event start date
    e_end_date date not null,           								-- Event end date
    e_category varchar(50),            									-- Category (e.g., Sports, Social)
    e_status enum('Available', 'Full', 'Canceled') not null,   			-- Current status of event
    e_location varchar(100),           									-- Location of the event
    e_details varchar(500),            									-- Event description/details
    participant int             										-- Number of participants
);

-- Sample data
-- Insert example admin data into Admin_info (10 admin users with diverse details)
INSERT INTO Admin_info (a_fname, a_lname, a_birthdate, a_phonenumber, a_email, a_gender) VALUES
('Pat', 'Skibidi', '2004-09-09', '0809999999', 'pat.skibidi@example.com', 'Female'),
('Bonus', 'Dopdop', '1990-08-14', '0823456789', 'bonus.nuay@example.com', 'Female'),
('Pupae', 'Takahashi', '1982-07-02', '0908765432', 'pupae.t@example.jp', 'Non-binary'),
('Fai', 'Focus', '1995-12-05', '3105551212', 'fai.f@example.com', 'Female'),
('Good', 'Mitra', '1988-05-30', '9876543210', 'good.m@example.in', 'Male'),
('Linda', 'Johansson', '1993-09-17', '0701234567', 'linda.j@example.se', 'Female'),
('Noah', 'Brown', '1987-11-12', '4165557890', 'noah.b@example.ca', 'Male'),
('Chloe', 'Martin', '1991-04-28', '0145789632', 'chloe.m@example.fr', 'Female'),
('Alex', 'Taylor', '1996-07-15', '0298765432', 'alex.t@example.au', 'Non-binary'),
('Olaf', 'Frozen', '1998-02-20', '0831234567', 'olaf.f@example.com', 'Other');

-- Insert admin login credentials linked to the admin_info records by admin_id
INSERT INTO Admin_login (a_username, a_password, a_date, admin_id) VALUES
('patt_admin', 'pat9999', NOW(), 1),
('bonuay_admin', 'nuay4567', NOW(), 2),
('pupae_admin', 'pupae890', NOW(), 3),
('fai_admin', 'fai3210', NOW(), 4),
('good_admin', 'gd7654', NOW(), 5),
('linda_admin', 'lin9999', NOW(), 6),
('noah_admin', 'noa8888', NOW(), 7),
('chloe_admin', 'chlo123', NOW(), 8),
('alex_admin', 'alex555', NOW(), 9),
('olaf_admin', 'olaf7777', NOW(), 10);

-- Insert 10 sample events with different categories, statuses, and participation numbers
INSERT INTO Events (e_img, e_name, e_start_date, e_end_date, e_category, e_status, e_location, e_details, participant) VALUES
('img1.jpg', 'Sunrise Yoga', '2025-05-10', '2025-05-10', 'Sports & Wellness', 'Available', 'Skibidi Field', 'Start your day with a peaceful sunrise yoga session.', 25),
('img2.jpg', 'Art Jamming Night', '2025-05-12', '2025-05-12', 'Creative & Hobbies', 'Available', 'Skibidi Center', 'Express yourself with paints and music.', 18),
('img3.jpg', 'Beach Volleyball', '2025-05-14', '2025-05-14', 'Sports & Wellness', 'Full', 'Skibidi Court', 'Fun and competitive volleyball games.', 32),
('img4.jpg', 'Sketching Workshop', '2025-05-16', '2025-05-16', 'Creative & Hobbies', 'Available', 'Skibidi Center', 'Learn the basics of sketching from a professional artist.', 20),
('img5.jpg', 'Neighborhood Potluck', '2025-05-18', '2025-05-18', 'Community & Social', 'Canceled', 'Skibidi Field', 'Bring a dish to share and meet your neighbors.', 50),
('img6.jpg', 'Tennis Tournament', '2025-05-20', '2025-05-20', 'Sports & Wellness', 'Available', 'Skibidi Court', 'Open tournament for all tennis enthusiasts.', 16),
('img7.jpg', 'DIY Candle Making', '2025-05-22', '2025-05-22', 'Creative & Hobbies', 'Full', 'Skibidi Center', 'Craft your own beautiful scented candles.', 12),
('img8.jpg', 'Charity Fun Run', '2025-05-24', '2025-05-24', 'Community & Social', 'Available', 'Skibidi Field', 'Run for a cause and help raise funds.', 100),
('img9.jpg', 'Pilates for Beginners', '2025-05-26', '2025-05-26', 'Sports & Wellness', 'Available', 'Skibidi Court', 'Introductory class to strengthen your core.', 20),
('img10.jpg', 'Photography Basics', '2025-05-28', '2025-05-28', 'Creative & Hobbies', 'Available', 'Skibidi Center', 'Learn how to capture beautiful moments.', 15);

-- Insert 10 sample users with usernames, passwords, personal info, and gender
INSERT INTO Users (u_username, u_password, u_fname, u_lname, u_birthdate, u_email, u_gender, u_phonenumber) VALUES
('jason123', 'pass123', 'Jason', 'Wong', '2000-06-15', 'jason.w@example.com', 'Male', '0845671234'),
('emma_rocks', 'emm321', 'Emma', 'Johnson', '1999-04-09', 'emma.j@example.com', 'Female', '0812349876'),
('leo_best', 'leo000', 'Leonardo', 'Bianchi', '1997-11-22', 'leo.b@example.it', 'Male', '0897654321'),
('sana_kpop', 'sana777', 'Sana', 'Minatozaki', '1996-12-29', 'sana.m@example.jp', 'Female', '0824567890'),
('harry_magic', 'potter007', 'Harry', 'Potter', '1990-07-31', 'harry.p@example.uk', 'Male', '0712345678'),
('lisa_blackpink', 'lalisa', 'Lalisa', 'Manoban', '1997-03-27', 'lisa.m@example.com', 'Female', '0865432198'),
('johnny_bravo', 'johnbrav', 'Johnny', 'Bravo', '1988-12-01', 'johnny.b@example.com', 'Male', '0891234567'),
('mei_chan', 'mei123', 'Mei', 'Chen', '1995-01-08', 'mei.c@example.cn', 'Female', '0987654321'),
('bts_jk', 'btsforever', 'Jungkook', 'Jeon', '1997-09-01', 'jk.j@example.kr', 'Male', '0109876543'),
('irene_redvelvet', 'ireneluv', 'Irene', 'Bae', '1991-03-29', 'irene.b@example.kr', 'Female', '0101234567');