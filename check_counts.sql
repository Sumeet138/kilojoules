SELECT 'class_bookings' AS tbl, COUNT(*) AS n FROM class_bookings
UNION ALL SELECT 'workout_history', COUNT(*) FROM workout_history
UNION ALL SELECT 'diet_plans', COUNT(*) FROM diet_plans
UNION ALL SELECT 'bmi_records', COUNT(*) FROM bmi_records
UNION ALL SELECT 'transactions', COUNT(*) FROM transactions;
