import { configureStore } from "@reduxjs/toolkit";
import memberReducer from "./slices/memberSlice";
import trainerReducer from "./slices/trainerSlice";
import adminReducer from "./slices/adminSlice";
import fitnessClassReducer from "./slices/fitnessClassSlice";
import classBookingReducer from "./slices/classBookingSlice";
import bmiReducer from "./slices/bmiSlice";
import workoutHistoryReducer from "./slices/workoutHistorySlice";
import dietPlanReducer from "./slices/dietPlanSlice";
import transactionReducer from "./slices/transactionSlice";
import notificationReducer from "./slices/notificationSlice";
import membershipReducer from "./slices/membershipSlice";

const store = configureStore({
  reducer: {
    member: memberReducer,
    trainer: trainerReducer,
    admin: adminReducer,
    fitnessClass: fitnessClassReducer,
    classBooking: classBookingReducer,
    bmi: bmiReducer,
    workoutHistory: workoutHistoryReducer,
    dietPlan: dietPlanReducer,
    transaction: transactionReducer,
    notification: notificationReducer,
    membership: membershipReducer,
  },
});

export default store;
