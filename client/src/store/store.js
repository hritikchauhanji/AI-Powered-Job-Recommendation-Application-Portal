import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import jobsReducer from "./slices/jobsSlice";
import applicationsReducer from "./slices/applicationsSlice";
import adminReducer from "./slices/adminSlice";
import userReducer from "./slices/userSlice";
import recommendationsReducer from "./slices/recommendationsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    applications: applicationsReducer,
    admin: adminReducer,
    user: userReducer,
    recommendations: recommendationsReducer,
  },
});
