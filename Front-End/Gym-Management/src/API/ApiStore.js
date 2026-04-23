import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ===== MEMBER AUTH =====
export const registerMember = (formData) =>
  api.post("/members/register", formData, { headers: { "Content-Type": "multipart/form-data" } });

export const loginMember = (data) => api.post("/members/login", data);

export const getAllMembers = () => api.get("/members");

export const getMemberById = (id) => api.get(`/members/${id}`);

export const updateMember = (id, data) => api.put(`/members/${id}`, data);

export const deleteMember = (id) => api.delete(`/members/${id}`);

export const memberForgotPassword = (email) =>
  api.post(`/members/forgot-password?email=${email}`);

export const memberVerifyOtp = (email, otp) =>
  api.post(`/members/verify-otp?email=${email}&otp=${otp}`);

export const memberResetPassword = (data) => api.post("/members/reset-password", data);

// ===== TRAINER AUTH =====
export const registerTrainer = (formData) =>
  api.post("/trainers/register", formData, { headers: { "Content-Type": "multipart/form-data" } });

export const loginTrainer = (data) => api.post("/trainers/login", data);

export const getAllTrainers = () => api.get("/trainers");

export const getTrainerById = (id) => api.get(`/trainers/${id}`);

export const updateTrainer = (id, data) => api.put(`/trainers/${id}`, data);

export const deleteTrainer = (id) => api.delete(`/trainers/${id}`);

export const trainerForgotPassword = (email) =>
  api.post(`/trainers/forgot-password?email=${email}`);

export const trainerVerifyOtp = (email, otp) =>
  api.post(`/trainers/verify-otp?email=${email}&otp=${otp}`);

export const trainerResetPassword = (data) => api.post("/trainers/reset-password", data);

// ===== ADMIN AUTH =====
export const registerAdmin = (formData) =>
  api.post("/admin/register", formData, { headers: { "Content-Type": "multipart/form-data" } });

export const loginAdmin = (data) => api.post("/admin/login", data);

export const getAdminById = (id) => api.get(`/admin/${id}`);

export const adminForgotPassword = (email) =>
  api.post(`/admin/forgot-password?email=${email}`);

export const adminVerifyOtp = (email, otp) =>
  api.post(`/admin/verify-otp?email=${email}&otp=${otp}`);

export const adminResetPassword = (data) => api.post("/admin/reset-password", data);

export const updateAdmin = (id, data) => api.put(`/admin/${id}`, data);

// ===== MEMBERSHIP PLANS =====
export const getAllActivePlans = () => api.get("/membership-plans");

export const getAllPlans = () => api.get("/membership-plans/all");

export const createMembershipPlan = (data) => api.post("/membership-plans", data);

export const updateMembershipPlan = (id, data) => api.put(`/membership-plans/${id}`, data);

export const deactivateMembershipPlan = (id) =>
  api.put(`/membership-plans/${id}/deactivate`);

// ===== MEMBERSHIPS =====
export const subscribeToPlan = (memberId, planId) =>
  api.post(`/memberships/subscribe?memberId=${memberId}&planId=${planId}`);

export const getMemberMemberships = (memberId) =>
  api.get(`/memberships/member/${memberId}`);

export const getActiveMembership = (memberId) =>
  api.get(`/memberships/active/${memberId}`);

export const cancelMembership = (id) => api.put(`/memberships/${id}/cancel`);

// ===== FITNESS CLASSES =====
export const getAllFitnessClasses = (type = null) =>
  api.get("/fitness-classes" + (type ? `?type=${type}` : ""));

export const getFitnessClassById = (id) => api.get(`/fitness-classes/${id}`);

export const createFitnessClass = (formData) =>
  api.post("/fitness-classes", formData, { headers: { "Content-Type": "multipart/form-data" } });

export const updateFitnessClass = (id, data, trainerId = null) =>
  api.put(`/fitness-classes/${id}${trainerId ? `?trainerId=${trainerId}` : ""}`, data);

export const getTrainerClasses = (trainerId) =>
  api.get(`/fitness-classes/trainer/${trainerId}`);

// ===== CLASS BOOKINGS =====
export const bookClass = (memberId, classId) =>
  api.post(`/bookings?memberId=${memberId}&classId=${classId}`);

export const getMemberBookings = (memberId) =>
  api.get(`/bookings/member/${memberId}`);

export const getClassBookings = (classId, date = null) =>
  api.get(`/bookings/class/${classId}${date ? `?date=${date}` : ""}`);

export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);

export const markBookingNoShow = (id) => api.put(`/bookings/${id}/no-show`);

export const markBookingAttended = (id) => api.put(`/bookings/${id}/attend`);

// ===== BMI =====
export const recordBMI = (memberId, heightCm, weightKg, notes = "") =>
  api.post(`/bmi?memberId=${memberId}&heightCm=${heightCm}&weightKg=${weightKg}&notes=${notes}`);

export const getMemberBMIHistory = (memberId) =>
  api.get(`/bmi/member/${memberId}`);

export const getRecentBMIHistory = (memberId) =>
  api.get(`/bmi/member/${memberId}/recent`);

// ===== WORKOUT HISTORY =====
export const logWorkout = (memberId, params) => {
  const qs = new URLSearchParams({ memberId, ...params }).toString();
  return api.post(`/workout-history?${qs}`);
};

export const getMemberWorkouts = (memberId) =>
  api.get(`/workout-history/member/${memberId}`);

export const getRecentWorkouts = (memberId) =>
  api.get(`/workout-history/member/${memberId}/recent`);

export const deleteWorkout = (id) => api.delete(`/workout-history/${id}`);

// ===== DIET PLANS =====
export const createDietPlan = (memberId, trainerId, data) => {
  const qs = `memberId=${memberId}${trainerId ? `&trainerId=${trainerId}` : ""}`;
  return api.post(`/diet-plans?${qs}`, data);
};

export const getMemberDietPlans = (memberId) =>
  api.get(`/diet-plans/member/${memberId}`);

export const getLatestDietPlan = (memberId) =>
  api.get(`/diet-plans/member/${memberId}/latest`);

export const updateDietPlan = (id, data) => api.put(`/diet-plans/${id}`, data);

export const deleteDietPlan = (id) => api.delete(`/diet-plans/${id}`);

// ===== TRANSACTIONS =====
export const recordTransaction = (memberId, params) => {
  const qs = new URLSearchParams({ memberId, ...params }).toString();
  return api.post(`/transactions?${qs}`);
};

export const getMemberTransactions = (memberId) =>
  api.get(`/transactions/member/${memberId}`);

export const getAllTransactions = () => api.get("/transactions");

export const updateTransactionStatus = (id, status) =>
  api.put(`/transactions/${id}/status?status=${status}`);

export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);

export const getTrainerTransactions = (trainerId) =>
  api.get(`/transactions/trainer/${trainerId}`);

// ===== NOTIFICATIONS =====
export const createNotification = (data) => api.post("/notifications", data);

export const getNotifications = (role = null) =>
  api.get("/notifications" + (role ? `?role=${role}` : ""));

export const markNotificationRead = (id) => api.put(`/notifications/${id}/read`);

export const deleteNotification = (id) => api.delete(`/notifications/${id}`);
