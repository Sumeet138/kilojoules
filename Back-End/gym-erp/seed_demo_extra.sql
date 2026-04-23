-- ============================================================
-- SUPPLEMENTAL DEMO DATA: Bookings, Workouts, Diet Plans
-- Run AFTER seed_data.sql has been executed
-- ============================================================

USE gym;

-- ============================================================
-- CLASS BOOKINGS
-- (BookingStatus: BOOKED, ATTENDED, CANCELLED, NO_SHOW)
-- ============================================================

-- arjun_sharma bookings
INSERT IGNORE INTO class_bookings (member_id, fitness_class_id, booking_date, status, created_at)
SELECT m.id, fc.id, DATE_SUB(CURDATE(), INTERVAL 20 DAY), 'ATTENDED', NOW()
FROM members m JOIN fitness_classes fc ON fc.class_name = 'Morning Yoga Flow'
WHERE m.username = 'arjun_sharma';

INSERT IGNORE INTO class_bookings (member_id, fitness_class_id, booking_date, status, created_at)
SELECT m.id, fc.id, DATE_SUB(CURDATE(), INTERVAL 14 DAY), 'ATTENDED', NOW()
FROM members m JOIN fitness_classes fc ON fc.class_name = 'Zumba Dance Fitness'
WHERE m.username = 'arjun_sharma';

INSERT IGNORE INTO class_bookings (member_id, fitness_class_id, booking_date, status, created_at)
SELECT m.id, fc.id, DATE_SUB(CURDATE(), INTERVAL 7 DAY), 'ATTENDED', NOW()
FROM members m JOIN fitness_classes fc ON fc.class_name = 'Power Lifting Bootcamp'
WHERE m.username = 'arjun_sharma';

INSERT IGNORE INTO class_bookings (member_id, fitness_class_id, booking_date, status, created_at)
SELECT m.id, fc.id, CURDATE(), 'BOOKED', NOW()
FROM members m JOIN fitness_classes fc ON fc.class_name = 'Fat Burn HIIT'
WHERE m.username = 'arjun_sharma';

INSERT IGNORE INTO class_bookings (member_id, fitness_class_id, booking_date, status, created_at)
SELECT m.id, fc.id, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'CANCELLED', NOW()
FROM members m JOIN fitness_classes fc ON fc.class_name = 'CrossFit WOD'
WHERE m.username = 'arjun_sharma';

-- kavya_patel bookings
INSERT IGNORE INTO class_bookings (member_id, fitness_class_id, booking_date, status, created_at)
SELECT m.id, fc.id, DATE_SUB(CURDATE(), INTERVAL 18 DAY), 'ATTENDED', NOW()
FROM members m JOIN fitness_classes fc ON fc.class_name = 'Morning Yoga Flow'
WHERE m.username = 'kavya_patel';

INSERT IGNORE INTO class_bookings (member_id, fitness_class_id, booking_date, status, created_at)
SELECT m.id, fc.id, DATE_SUB(CURDATE(), INTERVAL 10 DAY), 'ATTENDED', NOW()
FROM members m JOIN fitness_classes fc ON fc.class_name = 'Zumba Dance Fitness'
WHERE m.username = 'kavya_patel';

INSERT IGNORE INTO class_bookings (member_id, fitness_class_id, booking_date, status, created_at)
SELECT m.id, fc.id, CURDATE(), 'BOOKED', NOW()
FROM members m JOIN fitness_classes fc ON fc.class_name = 'Pilates Core'
WHERE m.username = 'kavya_patel';

-- rahul_gupta bookings
INSERT IGNORE INTO class_bookings (member_id, fitness_class_id, booking_date, status, created_at)
SELECT m.id, fc.id, DATE_SUB(CURDATE(), INTERVAL 15 DAY), 'ATTENDED', NOW()
FROM members m JOIN fitness_classes fc ON fc.class_name = 'Power Lifting Bootcamp'
WHERE m.username = 'rahul_gupta';

INSERT IGNORE INTO class_bookings (member_id, fitness_class_id, booking_date, status, created_at)
SELECT m.id, fc.id, DATE_SUB(CURDATE(), INTERVAL 8 DAY), 'ATTENDED', NOW()
FROM members m JOIN fitness_classes fc ON fc.class_name = 'CrossFit WOD'
WHERE m.username = 'rahul_gupta';

INSERT IGNORE INTO class_bookings (member_id, fitness_class_id, booking_date, status, created_at)
SELECT m.id, fc.id, CURDATE(), 'BOOKED', NOW()
FROM members m JOIN fitness_classes fc ON fc.class_name = 'Power Lifting Bootcamp'
WHERE m.username = 'rahul_gupta';

-- meera_singh bookings
INSERT IGNORE INTO class_bookings (member_id, fitness_class_id, booking_date, status, created_at)
SELECT m.id, fc.id, DATE_SUB(CURDATE(), INTERVAL 12 DAY), 'ATTENDED', NOW()
FROM members m JOIN fitness_classes fc ON fc.class_name = 'Pilates Core'
WHERE m.username = 'meera_singh';

INSERT IGNORE INTO class_bookings (member_id, fitness_class_id, booking_date, status, created_at)
SELECT m.id, fc.id, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'ATTENDED', NOW()
FROM members m JOIN fitness_classes fc ON fc.class_name = 'Zumba Dance Fitness'
WHERE m.username = 'meera_singh';

INSERT IGNORE INTO class_bookings (member_id, fitness_class_id, booking_date, status, created_at)
SELECT m.id, fc.id, CURDATE(), 'BOOKED', NOW()
FROM members m JOIN fitness_classes fc ON fc.class_name = 'Morning Yoga Flow'
WHERE m.username = 'meera_singh';

-- kiran_desai bookings
INSERT IGNORE INTO class_bookings (member_id, fitness_class_id, booking_date, status, created_at)
SELECT m.id, fc.id, DATE_SUB(CURDATE(), INTERVAL 9 DAY), 'ATTENDED', NOW()
FROM members m JOIN fitness_classes fc ON fc.class_name = 'Fat Burn HIIT'
WHERE m.username = 'kiran_desai';

INSERT IGNORE INTO class_bookings (member_id, fitness_class_id, booking_date, status, created_at)
SELECT m.id, fc.id, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'NO_SHOW', NOW()
FROM members m JOIN fitness_classes fc ON fc.class_name = 'Morning Yoga Flow'
WHERE m.username = 'kiran_desai';

-- Update current_enrollment counts based on BOOKED+ATTENDED
UPDATE fitness_classes fc SET current_enrollment = (
  SELECT COUNT(*) FROM class_bookings cb
  WHERE cb.fitness_class_id = fc.id AND cb.status IN ('BOOKED','ATTENDED')
);

-- ============================================================
-- WORKOUT HISTORY
-- ============================================================

-- arjun_sharma workouts (last 3 weeks, varied exercises)
INSERT IGNORE INTO workout_history (member_id, trainer_id, workout_date, exercise_name, sets, reps, weight_kg, duration_minutes, notes, created_at)
SELECT m.id, t.id, DATE_SUB(CURDATE(), INTERVAL 21 DAY), 'Bench Press', 4, 10, 70.0, 45, 'Felt strong today', NOW()
FROM members m JOIN trainers t ON t.username = 'rohit_trainer' WHERE m.username = 'arjun_sharma';

INSERT IGNORE INTO workout_history (member_id, trainer_id, workout_date, exercise_name, sets, reps, weight_kg, duration_minutes, notes, created_at)
SELECT m.id, t.id, DATE_SUB(CURDATE(), INTERVAL 19 DAY), 'Squats', 4, 12, 80.0, 50, 'Added 5kg from last session', NOW()
FROM members m JOIN trainers t ON t.username = 'rohit_trainer' WHERE m.username = 'arjun_sharma';

INSERT IGNORE INTO workout_history (member_id, trainer_id, workout_date, exercise_name, sets, reps, weight_kg, duration_minutes, notes, created_at)
SELECT m.id, t.id, DATE_SUB(CURDATE(), INTERVAL 16 DAY), 'Deadlift', 3, 8, 100.0, 40, 'Personal best!', NOW()
FROM members m JOIN trainers t ON t.username = 'rohit_trainer' WHERE m.username = 'arjun_sharma';

INSERT IGNORE INTO workout_history (member_id, trainer_id, workout_date, exercise_name, sets, reps, weight_kg, duration_minutes, notes, created_at)
SELECT m.id, t.id, DATE_SUB(CURDATE(), INTERVAL 14 DAY), 'Pull-ups', 4, 8, NULL, 30, 'Body weight only', NOW()
FROM members m JOIN trainers t ON t.username = 'rohit_trainer' WHERE m.username = 'arjun_sharma';

INSERT IGNORE INTO workout_history (member_id, trainer_id, workout_date, exercise_name, sets, reps, weight_kg, duration_minutes, notes, created_at)
SELECT m.id, t.id, DATE_SUB(CURDATE(), INTERVAL 12 DAY), 'Shoulder Press', 3, 12, 40.0, 35, NULL, NOW()
FROM members m JOIN trainers t ON t.username = 'rohit_trainer' WHERE m.username = 'arjun_sharma';

INSERT IGNORE INTO workout_history (member_id, trainer_id, workout_date, exercise_name, sets, reps, weight_kg, duration_minutes, notes, created_at)
SELECT m.id, t.id, DATE_SUB(CURDATE(), INTERVAL 9 DAY), 'Barbell Row', 4, 10, 65.0, 40, 'Back day', NOW()
FROM members m JOIN trainers t ON t.username = 'rohit_trainer' WHERE m.username = 'arjun_sharma';

INSERT IGNORE INTO workout_history (member_id, trainer_id, workout_date, exercise_name, sets, reps, weight_kg, duration_minutes, notes, created_at)
SELECT m.id, t.id, DATE_SUB(CURDATE(), INTERVAL 7 DAY), 'Bench Press', 4, 10, 72.5, 45, 'Increased weight by 2.5kg', NOW()
FROM members m JOIN trainers t ON t.username = 'rohit_trainer' WHERE m.username = 'arjun_sharma';

INSERT IGNORE INTO workout_history (member_id, trainer_id, workout_date, exercise_name, sets, reps, weight_kg, duration_minutes, notes, created_at)
SELECT m.id, t.id, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'Leg Press', 4, 15, 120.0, 35, NULL, NOW()
FROM members m JOIN trainers t ON t.username = 'rohit_trainer' WHERE m.username = 'arjun_sharma';

INSERT IGNORE INTO workout_history (member_id, trainer_id, workout_date, exercise_name, sets, reps, weight_kg, duration_minutes, notes, created_at)
SELECT m.id, t.id, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'Tricep Dips', 3, 12, NULL, 25, 'Superset with push-ups', NOW()
FROM members m JOIN trainers t ON t.username = 'rohit_trainer' WHERE m.username = 'arjun_sharma';

INSERT IGNORE INTO workout_history (member_id, trainer_id, workout_date, exercise_name, sets, reps, weight_kg, duration_minutes, notes, created_at)
SELECT m.id, t.id, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Deadlift', 3, 8, 105.0, 40, 'New PR - 105kg!', NOW()
FROM members m JOIN trainers t ON t.username = 'rohit_trainer' WHERE m.username = 'arjun_sharma';

-- kavya_patel workouts
INSERT IGNORE INTO workout_history (member_id, trainer_id, workout_date, exercise_name, sets, reps, weight_kg, duration_minutes, notes, created_at)
SELECT m.id, t.id, DATE_SUB(CURDATE(), INTERVAL 15 DAY), 'Yoga Flow', 1, 1, NULL, 60, 'Morning session - felt amazing', NOW()
FROM members m JOIN trainers t ON t.username = 'priya_trainer' WHERE m.username = 'kavya_patel';

INSERT IGNORE INTO workout_history (member_id, trainer_id, workout_date, exercise_name, sets, reps, weight_kg, duration_minutes, notes, created_at)
SELECT m.id, t.id, DATE_SUB(CURDATE(), INTERVAL 10 DAY), 'Treadmill Run', 1, 1, NULL, 30, '5km at 8kph', NOW()
FROM members m JOIN trainers t ON t.username = 'priya_trainer' WHERE m.username = 'kavya_patel';

INSERT IGNORE INTO workout_history (member_id, trainer_id, workout_date, exercise_name, sets, reps, weight_kg, duration_minutes, notes, created_at)
SELECT m.id, t.id, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'Zumba Dance', 1, 1, NULL, 60, 'High energy session!', NOW()
FROM members m JOIN trainers t ON t.username = 'priya_trainer' WHERE m.username = 'kavya_patel';

INSERT IGNORE INTO workout_history (member_id, trainer_id, workout_date, exercise_name, sets, reps, weight_kg, duration_minutes, notes, created_at)
SELECT m.id, t.id, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'Dumbbell Lunges', 3, 12, 10.0, 25, NULL, NOW()
FROM members m JOIN trainers t ON t.username = 'priya_trainer' WHERE m.username = 'kavya_patel';

-- rahul_gupta workouts
INSERT IGNORE INTO workout_history (member_id, trainer_id, workout_date, exercise_name, sets, reps, weight_kg, duration_minutes, notes, created_at)
SELECT m.id, t.id, DATE_SUB(CURDATE(), INTERVAL 18 DAY), 'Deadlift', 5, 5, 130.0, 60, 'Heavy day', NOW()
FROM members m JOIN trainers t ON t.username = 'rohit_trainer' WHERE m.username = 'rahul_gupta';

INSERT IGNORE INTO workout_history (member_id, trainer_id, workout_date, exercise_name, sets, reps, weight_kg, duration_minutes, notes, created_at)
SELECT m.id, t.id, DATE_SUB(CURDATE(), INTERVAL 14 DAY), 'Back Squat', 5, 5, 110.0, 55, 'Powerlifting style', NOW()
FROM members m JOIN trainers t ON t.username = 'rohit_trainer' WHERE m.username = 'rahul_gupta';

INSERT IGNORE INTO workout_history (member_id, trainer_id, workout_date, exercise_name, sets, reps, weight_kg, duration_minutes, notes, created_at)
SELECT m.id, t.id, DATE_SUB(CURDATE(), INTERVAL 7 DAY), 'Barbell Row', 4, 8, 80.0, 40, NULL, NOW()
FROM members m JOIN trainers t ON t.username = 'rohit_trainer' WHERE m.username = 'rahul_gupta';

INSERT IGNORE INTO workout_history (member_id, trainer_id, workout_date, exercise_name, sets, reps, weight_kg, duration_minutes, notes, created_at)
SELECT m.id, t.id, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'Bench Press', 5, 5, 90.0, 45, 'Focusing on core lifts', NOW()
FROM members m JOIN trainers t ON t.username = 'rohit_trainer' WHERE m.username = 'rahul_gupta';

-- meera_singh workouts
INSERT IGNORE INTO workout_history (member_id, trainer_id, workout_date, exercise_name, sets, reps, weight_kg, duration_minutes, notes, created_at)
SELECT m.id, t.id, DATE_SUB(CURDATE(), INTERVAL 12 DAY), 'Pilates Core', 1, 1, NULL, 50, 'Core strength session', NOW()
FROM members m JOIN trainers t ON t.username = 'divya_trainer' WHERE m.username = 'meera_singh';

INSERT IGNORE INTO workout_history (member_id, trainer_id, workout_date, exercise_name, sets, reps, weight_kg, duration_minutes, notes, created_at)
SELECT m.id, t.id, DATE_SUB(CURDATE(), INTERVAL 6 DAY), 'Cable Rows', 3, 12, 30.0, 30, NULL, NOW()
FROM members m JOIN trainers t ON t.username = 'divya_trainer' WHERE m.username = 'meera_singh';

INSERT IGNORE INTO workout_history (member_id, trainer_id, workout_date, exercise_name, sets, reps, weight_kg, duration_minutes, notes, created_at)
SELECT m.id, t.id, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'Dumbbell Shoulder Press', 4, 10, 15.0, 35, 'Great pump', NOW()
FROM members m JOIN trainers t ON t.username = 'divya_trainer' WHERE m.username = 'meera_singh';

-- ============================================================
-- DIET PLANS
-- ============================================================

-- arjun_sharma - High Protein Bulking (by rohit_trainer)
INSERT IGNORE INTO diet_plans (member_id, trainer_id, plan_name, description, total_calories, protein_grams, carbs_grams, fats_grams, created_at)
SELECT m.id, t.id,
  'High Protein Bulk',
  'Calorie surplus plan for muscle gain. Focus on whole foods and 6 meals/day.',
  3200, 220, 350, 80, NOW()
FROM members m JOIN trainers t ON t.username = 'rohit_trainer' WHERE m.username = 'arjun_sharma';

-- arjun_sharma - Pre-workout Nutrition (by rohit_trainer)
INSERT IGNORE INTO diet_plans (member_id, trainer_id, plan_name, description, total_calories, protein_grams, carbs_grams, fats_grams, created_at)
SELECT m.id, t.id,
  'Pre-Workout Fuel Plan',
  'Optimized nutrition timing around workouts. High carbs pre-workout, protein post-workout.',
  2800, 180, 320, 60, NOW()
FROM members m JOIN trainers t ON t.username = 'rohit_trainer' WHERE m.username = 'arjun_sharma';

-- kavya_patel - Weight Loss Plan (by priya_trainer)
INSERT IGNORE INTO diet_plans (member_id, trainer_id, plan_name, description, total_calories, protein_grams, carbs_grams, fats_grams, created_at)
SELECT m.id, t.id,
  'Lean & Clean Deficit',
  'Moderate calorie deficit for steady fat loss. High protein to preserve muscle mass.',
  1600, 130, 150, 45, NOW()
FROM members m JOIN trainers t ON t.username = 'priya_trainer' WHERE m.username = 'kavya_patel';

-- rahul_gupta - Diabetic-Friendly Plan (by rohit_trainer)
INSERT IGNORE INTO diet_plans (member_id, trainer_id, plan_name, description, total_calories, protein_grams, carbs_grams, fats_grams, created_at)
SELECT m.id, t.id,
  'Low GI Performance Plan',
  'Diabetes-friendly diet with low glycemic index carbs. Steady energy throughout the day.',
  2200, 160, 200, 70, NOW()
FROM members m JOIN trainers t ON t.username = 'rohit_trainer' WHERE m.username = 'rahul_gupta';

-- meera_singh - Toning Plan (by divya_trainer)
INSERT IGNORE INTO diet_plans (member_id, trainer_id, plan_name, description, total_calories, protein_grams, carbs_grams, fats_grams, created_at)
SELECT m.id, t.id,
  'Lean Toning Diet',
  'Balanced macros for muscle definition. High protein, moderate carbs, healthy fats.',
  1900, 150, 180, 55, NOW()
FROM members m JOIN trainers t ON t.username = 'divya_trainer' WHERE m.username = 'meera_singh';

-- kiran_desai - Endurance Plan (by divya_trainer)
INSERT IGNORE INTO diet_plans (member_id, trainer_id, plan_name, description, total_calories, protein_grams, carbs_grams, fats_grams, created_at)
SELECT m.id, t.id,
  'Cardio Endurance Plan',
  'Carb-forward plan to support cardiovascular training and weight management.',
  2000, 130, 240, 50, NOW()
FROM members m JOIN trainers t ON t.username = 'divya_trainer' WHERE m.username = 'kiran_desai';

-- ============================================================
-- MORE BMI RECORDS (history for charts - multiple entries)
-- ============================================================
INSERT IGNORE INTO bmi_records (member_id, height_cm, weight_kg, bmi, category, record_date, notes, created_at)
SELECT m.id, 175.0, 76.0, ROUND(76.0/(1.75*1.75),1), 'OVERWEIGHT', DATE_SUB(CURDATE(), INTERVAL 60 DAY), 'Before joining', NOW()
FROM members m WHERE m.username = 'arjun_sharma';

INSERT IGNORE INTO bmi_records (member_id, height_cm, weight_kg, bmi, category, record_date, notes, created_at)
SELECT m.id, 175.0, 74.5, ROUND(74.5/(1.75*1.75),1), 'OVERWEIGHT', DATE_SUB(CURDATE(), INTERVAL 45 DAY), 'Month 1 check-in', NOW()
FROM members m WHERE m.username = 'arjun_sharma';

INSERT IGNORE INTO bmi_records (member_id, height_cm, weight_kg, bmi, category, record_date, notes, created_at)
SELECT m.id, 175.0, 73.0, ROUND(73.0/(1.75*1.75),1), 'NORMAL', DATE_SUB(CURDATE(), INTERVAL 30 DAY), 'Good progress!', NOW()
FROM members m WHERE m.username = 'arjun_sharma';

INSERT IGNORE INTO bmi_records (member_id, height_cm, weight_kg, bmi, category, record_date, notes, created_at)
SELECT m.id, 162.0, 57.0, ROUND(57.0/(1.62*1.62),1), 'NORMAL', DATE_SUB(CURDATE(), INTERVAL 60 DAY), 'Before joining', NOW()
FROM members m WHERE m.username = 'kavya_patel';

INSERT IGNORE INTO bmi_records (member_id, height_cm, weight_kg, bmi, category, record_date, notes, created_at)
SELECT m.id, 162.0, 56.0, ROUND(56.0/(1.62*1.62),1), 'NORMAL', DATE_SUB(CURDATE(), INTERVAL 30 DAY), 'Losing slowly', NOW()
FROM members m WHERE m.username = 'kavya_patel';

INSERT IGNORE INTO bmi_records (member_id, height_cm, weight_kg, bmi, category, record_date, notes, created_at)
SELECT m.id, 180.0, 94.0, ROUND(94.0/(1.80*1.80),1), 'OVERWEIGHT', DATE_SUB(CURDATE(), INTERVAL 60 DAY), 'Starting point', NOW()
FROM members m WHERE m.username = 'rahul_gupta';

INSERT IGNORE INTO bmi_records (member_id, height_cm, weight_kg, bmi, category, record_date, notes, created_at)
SELECT m.id, 180.0, 92.0, ROUND(92.0/(1.80*1.80),1), 'OVERWEIGHT', DATE_SUB(CURDATE(), INTERVAL 30 DAY), 'Down 2kg!', NOW()
FROM members m WHERE m.username = 'rahul_gupta';

-- ============================================================
-- MORE TRANSACTIONS (variety for admin dashboard)
-- ============================================================
INSERT IGNORE INTO transactions (member_id, transaction_type, amount, description, transaction_date, payment_method, status, created_at)
SELECT m.id, 'PERSONAL_TRAINER', 2000.00, 'Personal training - 10 sessions bundle', DATE_SUB(CURDATE(), INTERVAL 25 DAY), 'NET_BANKING', 'COMPLETED', NOW()
FROM members m WHERE m.username = 'rahul_gupta';

INSERT IGNORE INTO transactions (member_id, transaction_type, amount, description, transaction_date, payment_method, status, created_at)
SELECT m.id, 'MEMBERSHIP_FEE', 999.00, 'Silver Monthly renewal', DATE_SUB(CURDATE(), INTERVAL 30 DAY), 'UPI', 'COMPLETED', NOW()
FROM members m WHERE m.username = 'kavya_patel';

INSERT IGNORE INTO transactions (member_id, transaction_type, amount, description, transaction_date, payment_method, status, created_at)
SELECT m.id, 'SUPPLEMENT', 850.00, 'Whey protein 1kg', DATE_SUB(CURDATE(), INTERVAL 10 DAY), 'CASH', 'COMPLETED', NOW()
FROM members m WHERE m.username = 'arjun_sharma';

INSERT IGNORE INTO transactions (member_id, transaction_type, amount, description, transaction_date, payment_method, status, created_at)
SELECT m.id, 'SUPPLEMENT', 450.00, 'Creatine monohydrate', DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'UPI', 'COMPLETED', NOW()
FROM members m WHERE m.username = 'arjun_sharma';

INSERT IGNORE INTO transactions (member_id, transaction_type, amount, description, transaction_date, payment_method, status, created_at)
SELECT m.id, 'MEMBERSHIP_FEE', 699.00, 'Student Special plan', DATE_SUB(CURDATE(), INTERVAL 15 DAY), 'UPI', 'PENDING', NOW()
FROM members m WHERE m.username = 'ananya_iyer';

INSERT IGNORE INTO transactions (member_id, transaction_type, amount, description, transaction_date, payment_method, status, created_at)
SELECT m.id, 'PERSONAL_TRAINER', 1500.00, 'Personal training - 5 sessions', DATE_SUB(CURDATE(), INTERVAL 8 DAY), 'CARD', 'COMPLETED', NOW()
FROM members m WHERE m.username = 'meera_singh';

INSERT IGNORE INTO transactions (member_id, transaction_type, amount, description, transaction_date, payment_method, status, created_at)
SELECT m.id, 'OTHER', 300.00, 'Locker rental - 3 months', DATE_SUB(CURDATE(), INTERVAL 20 DAY), 'CASH', 'COMPLETED', NOW()
FROM members m WHERE m.username = 'kiran_desai';

-- ============================================================
SELECT '✅ Supplemental demo data inserted!' AS Result;
-- ============================================================
