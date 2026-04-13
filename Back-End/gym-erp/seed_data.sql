-- ============================================================
-- GYM MANAGEMENT SYSTEM - DEMO SEED DATA (Indian Users)
-- Run AFTER backend has started once (so JPA creates tables)
-- ============================================================

USE gym;

-- ============================================================
-- ADMINS
-- ============================================================
INSERT IGNORE INTO admins (admin_id, username, password, email, first_name, last_name, phone, created_at)
VALUES
  ('ADM001', 'vikram_admin', 'Demo@1234', 'vikram.admin@demo.com', 'Vikram', 'Mehta',    '9123456789', NOW()),
  ('ADM002', 'sneha_admin',  'Demo@1234', 'sneha.admin@demo.com',  'Sneha',  'Kulkarni', '9988001122', NOW());

-- ============================================================
-- TRAINERS
-- ============================================================
INSERT IGNORE INTO trainers (trainer_id, username, password, email, first_name, last_name, phone, specialization, certification_level, bio, created_at)
VALUES
  ('TRN001', 'priya_trainer', 'Demo@1234', 'priya.trainer@demo.com', 'Priya', 'Nair',  '9988776655', 'Yoga, Zumba, Strength Training',      'ACE Certified Personal Trainer', 'Certified trainer with 6+ years of experience in yoga, zumba and strength training.', NOW()),
  ('TRN002', 'rohit_trainer', 'Demo@1234', 'rohit.trainer@demo.com', 'Rohit', 'Verma', '9911223344', 'Bodybuilding, Powerlifting, CrossFit', 'NSCA-CSCS Certified',            'Ex-national level powerlifter with 9 years of coaching experience.',                NOW()),
  ('TRN003', 'divya_trainer', 'Demo@1234', 'divya.trainer@demo.com', 'Divya', 'Reddy', '9944556677', 'Pilates, HIIT, Weight Loss',           'ISSA Certified Fitness Trainer', 'Specializes in weight loss transformation and functional fitness for women.',         NOW());

-- ============================================================
-- MEMBERS
-- ============================================================
INSERT IGNORE INTO members (member_id, username, password, email, first_name, last_name, phone, dob, age, gender, height_cm, weight_kg, health_conditions, fitness_goals, trainer_preference, created_at)
VALUES
  ('MEM001', 'arjun_sharma',  'Demo@1234', 'arjun.sharma@demo.com',  'Arjun',  'Sharma',  '9876543210', '1998-03-12', 26, 'MALE',   175.0, 72.0, 'None',                     'Weight loss and muscle gain',          'Male trainer',   NOW()),
  ('MEM002', 'kavya_patel',   'Demo@1234', 'kavya.patel@demo.com',   'Kavya',  'Patel',   '9845001234', '2000-07-22', 24, 'FEMALE', 162.0, 55.0, 'Mild asthma',              'Improve stamina and flexibility',      'Female trainer', NOW()),
  ('MEM003', 'rahul_gupta',   'Demo@1234', 'rahul.gupta@demo.com',   'Rahul',  'Gupta',   '9712345678', '1995-11-05', 29, 'MALE',   180.0, 90.0, 'Lower back pain',          'Fat loss and core strengthening',      'Any',            NOW()),
  ('MEM004', 'ananya_iyer',   'Demo@1234', 'ananya.iyer@demo.com',   'Ananya', 'Iyer',    '9632587410', '2001-02-14', 23, 'FEMALE', 158.0, 52.0, 'None',                     'Toning and overall fitness',           'Female trainer', NOW()),
  ('MEM005', 'kiran_desai',   'Demo@1234', 'kiran.desai@demo.com',   'Kiran',  'Desai',   '9558774433', '1993-09-30', 31, 'MALE',   172.0, 85.0, 'Diabetes Type 2',          'Weight management and endurance',      'Any',            NOW()),
  ('MEM006', 'meera_singh',   'Demo@1234', 'meera.singh@demo.com',   'Meera',  'Singh',   '9001234567', '1997-05-18', 27, 'FEMALE', 165.0, 60.0, 'None',                     'Build strength and muscle definition', 'Male trainer',   NOW()),
  ('MEM007', 'suresh_pillai', 'Demo@1234', 'suresh.pillai@demo.com', 'Suresh', 'Pillai',  '9445566778', '1990-12-01', 34, 'MALE',   168.0, 78.0, 'Hypertension (controlled)','Cardiovascular fitness and weight loss','Any',            NOW());

-- ============================================================
-- MEMBERSHIP PLANS
-- (PlanType enum: MONTHLY, QUARTERLY, ANNUAL)
-- ============================================================
INSERT IGNORE INTO membership_plans (plan_name, plan_type, price, duration_days, description, is_active, created_at)
VALUES
  ('Silver Monthly',   'MONTHLY',   999.00,  30,  '1-month basic gym access with locker facility',                   1, NOW()),
  ('Gold Quarterly',   'QUARTERLY', 2499.00, 90,  '3-month all-inclusive plan with trainer sessions',               1, NOW()),
  ('Diamond Annual',   'ANNUAL',    7999.00, 365, '12-month plan with full access, personal trainer and diet plan', 1, NOW()),
  ('Student Special',  'MONTHLY',   699.00,  30,  'Monthly plan for students with valid college ID',                 1, NOW());

-- ============================================================
-- MEMBERSHIPS (members subscribed to plans)
-- (MembershipStatus: ACTIVE / PaymentStatus: PAID)
-- ============================================================
INSERT IGNORE INTO member_memberships (member_id, plan_id, start_date, end_date, status, payment_status, created_at)
SELECT m.id, p.id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL p.duration_days DAY), 'ACTIVE', 'PAID', NOW()
FROM members m JOIN membership_plans p ON p.plan_name = 'Gold Quarterly'
WHERE m.username = 'arjun_sharma';

INSERT IGNORE INTO member_memberships (member_id, plan_id, start_date, end_date, status, payment_status, created_at)
SELECT m.id, p.id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL p.duration_days DAY), 'ACTIVE', 'PAID', NOW()
FROM members m JOIN membership_plans p ON p.plan_name = 'Silver Monthly'
WHERE m.username = 'kavya_patel';

INSERT IGNORE INTO member_memberships (member_id, plan_id, start_date, end_date, status, payment_status, created_at)
SELECT m.id, p.id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL p.duration_days DAY), 'ACTIVE', 'PAID', NOW()
FROM members m JOIN membership_plans p ON p.plan_name = 'Diamond Annual'
WHERE m.username = 'rahul_gupta';

INSERT IGNORE INTO member_memberships (member_id, plan_id, start_date, end_date, status, payment_status, created_at)
SELECT m.id, p.id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL p.duration_days DAY), 'ACTIVE', 'PAID', NOW()
FROM members m JOIN membership_plans p ON p.plan_name = 'Diamond Annual'
WHERE m.username = 'meera_singh';

-- ============================================================
-- FITNESS CLASSES
-- (ClassType: YOGA, HIIT, ZUMBA, CROSSFIT, PILATES, SPINNING, BOXING, STRENGTH)
-- (scheduled_day: DayOfWeek string e.g. MONDAY)
-- (scheduled_time: TIME e.g. 06:00:00)
-- ============================================================
INSERT IGNORE INTO fitness_classes (class_name, class_type, trainer_id, scheduled_day, scheduled_time, duration_minutes, capacity, current_enrollment, description, is_active, created_at)
SELECT 'Morning Yoga Flow', 'YOGA', t.id, 'MONDAY', '06:00:00', 60, 15, 0,
  'Energising morning yoga session for all fitness levels', 1, NOW()
FROM trainers t WHERE t.username = 'priya_trainer';

INSERT IGNORE INTO fitness_classes (class_name, class_type, trainer_id, scheduled_day, scheduled_time, duration_minutes, capacity, current_enrollment, description, is_active, created_at)
SELECT 'Power Lifting Bootcamp', 'STRENGTH', t.id, 'WEDNESDAY', '07:00:00', 75, 12, 0,
  'High intensity strength training for intermediate to advanced members', 1, NOW()
FROM trainers t WHERE t.username = 'rohit_trainer';

INSERT IGNORE INTO fitness_classes (class_name, class_type, trainer_id, scheduled_day, scheduled_time, duration_minutes, capacity, current_enrollment, description, is_active, created_at)
SELECT 'Zumba Dance Fitness', 'ZUMBA', t.id, 'TUESDAY', '09:00:00', 60, 20, 0,
  'Fun and energetic Zumba dance workout for all levels', 1, NOW()
FROM trainers t WHERE t.username = 'priya_trainer';

INSERT IGNORE INTO fitness_classes (class_name, class_type, trainer_id, scheduled_day, scheduled_time, duration_minutes, capacity, current_enrollment, description, is_active, created_at)
SELECT 'Fat Burn HIIT', 'HIIT', t.id, 'THURSDAY', '08:00:00', 45, 18, 0,
  'High intensity interval training targeting full body fat loss', 1, NOW()
FROM trainers t WHERE t.username = 'divya_trainer';

INSERT IGNORE INTO fitness_classes (class_name, class_type, trainer_id, scheduled_day, scheduled_time, duration_minutes, capacity, current_enrollment, description, is_active, created_at)
SELECT 'CrossFit WOD', 'CROSSFIT', t.id, 'FRIDAY', '06:30:00', 60, 10, 0,
  'Workout of the day - intense CrossFit functional training', 1, NOW()
FROM trainers t WHERE t.username = 'rohit_trainer';

INSERT IGNORE INTO fitness_classes (class_name, class_type, trainer_id, scheduled_day, scheduled_time, duration_minutes, capacity, current_enrollment, description, is_active, created_at)
SELECT 'Pilates Core', 'PILATES', t.id, 'SATURDAY', '10:00:00', 50, 14, 0,
  'Core strengthening and posture improvement through pilates', 1, NOW()
FROM trainers t WHERE t.username = 'divya_trainer';

-- ============================================================
-- BMI RECORDS
-- (BMICategory: UNDERWEIGHT, NORMAL, OVERWEIGHT, OBESE)
-- ============================================================
INSERT IGNORE INTO bmi_records (member_id, height_cm, weight_kg, bmi, category, record_date, notes, created_at)
SELECT m.id, 175.0, 72.0, ROUND(72.0/(1.75*1.75),1), 'NORMAL',    CURDATE(), 'Initial recording', NOW() FROM members m WHERE m.username = 'arjun_sharma';

INSERT IGNORE INTO bmi_records (member_id, height_cm, weight_kg, bmi, category, record_date, notes, created_at)
SELECT m.id, 162.0, 55.0, ROUND(55.0/(1.62*1.62),1), 'NORMAL',    CURDATE(), 'Initial recording', NOW() FROM members m WHERE m.username = 'kavya_patel';

INSERT IGNORE INTO bmi_records (member_id, height_cm, weight_kg, bmi, category, record_date, notes, created_at)
SELECT m.id, 180.0, 90.0, ROUND(90.0/(1.80*1.80),1), 'OVERWEIGHT', CURDATE(), 'Initial recording', NOW() FROM members m WHERE m.username = 'rahul_gupta';

INSERT IGNORE INTO bmi_records (member_id, height_cm, weight_kg, bmi, category, record_date, notes, created_at)
SELECT m.id, 165.0, 60.0, ROUND(60.0/(1.65*1.65),1), 'NORMAL',    CURDATE(), 'Initial recording', NOW() FROM members m WHERE m.username = 'meera_singh';

INSERT IGNORE INTO bmi_records (member_id, height_cm, weight_kg, bmi, category, record_date, notes, created_at)
SELECT m.id, 172.0, 85.0, ROUND(85.0/(1.72*1.72),1), 'OVERWEIGHT', CURDATE(), 'Initial recording', NOW() FROM members m WHERE m.username = 'kiran_desai';

-- ============================================================
-- TRANSACTIONS
-- (TransactionType: MEMBERSHIP_FEE, PERSONAL_TRAINER, SUPPLEMENT, OTHER)
-- (PaymentMethod: CASH, CARD, UPI, NET_BANKING)
-- (TransactionStatus: COMPLETED, PENDING, FAILED, REFUNDED)
-- ============================================================
INSERT IGNORE INTO transactions (member_id, transaction_type, amount, description, transaction_date, payment_method, status, created_at)
SELECT m.id, 'MEMBERSHIP_FEE', 2499.00, 'Gold Quarterly plan payment', CURDATE(), 'UPI',  'COMPLETED', NOW() FROM members m WHERE m.username = 'arjun_sharma';

INSERT IGNORE INTO transactions (member_id, transaction_type, amount, description, transaction_date, payment_method, status, created_at)
SELECT m.id, 'MEMBERSHIP_FEE', 999.00,  'Silver Monthly plan payment', CURDATE(), 'CASH', 'COMPLETED', NOW() FROM members m WHERE m.username = 'kavya_patel';

INSERT IGNORE INTO transactions (member_id, transaction_type, amount, description, transaction_date, payment_method, status, created_at)
SELECT m.id, 'MEMBERSHIP_FEE', 7999.00, 'Diamond Annual plan payment', CURDATE(), 'CARD', 'COMPLETED', NOW() FROM members m WHERE m.username = 'rahul_gupta';

INSERT IGNORE INTO transactions (member_id, transaction_type, amount, description, transaction_date, payment_method, status, created_at)
SELECT m.id, 'MEMBERSHIP_FEE', 7999.00, 'Diamond Annual plan payment', CURDATE(), 'UPI',  'COMPLETED', NOW() FROM members m WHERE m.username = 'meera_singh';

INSERT IGNORE INTO transactions (member_id, transaction_type, amount, description, transaction_date, payment_method, status, created_at)
SELECT m.id, 'PERSONAL_TRAINER', 1500.00, 'Personal training session - 5 sessions', CURDATE(), 'UPI', 'COMPLETED', NOW() FROM members m WHERE m.username = 'arjun_sharma';

-- ============================================================
-- NOTIFICATIONS
-- (RecipientType: MEMBER, TRAINER, ADMIN, ALL)
-- ============================================================
INSERT IGNORE INTO notifications (title, message, recipient_type, is_read, created_at)
VALUES
  ('Welcome to FitZone!',    'Your membership is now active. Start your fitness journey today!',       'ALL',     0, NOW()),
  ('New Class Added',        'Power Lifting Bootcamp added on Wednesdays at 7 AM. Book now!',         'MEMBER',  0, NOW()),
  ('Monthly Report Ready',   'Member activity report for this month is ready to review.',             'ADMIN',   0, NOW()),
  ('Class Reminder',         'Zumba Dance Fitness is scheduled for tomorrow at 9 AM.',               'MEMBER',  0, NOW()),
  ('New Member Joined',      'Ananya Iyer has joined. Please complete their fitness assessment.',     'TRAINER', 0, NOW()),
  ('Payment Received',       'Payment of Rs.2499 received from Arjun Sharma for Gold Quarterly.',    'ADMIN',   0, NOW()),
  ('Membership Expiring',    'Kavya Patel membership expires in 7 days. Send renewal reminder.',      'ADMIN',   0, NOW()),
  ('Diet Plan Assigned',     'Your trainer has created a new diet plan for you. Check it out!',      'MEMBER',  0, NOW());

-- ============================================================
SELECT '✅ Seed data inserted successfully!' AS Result;
-- ============================================================
