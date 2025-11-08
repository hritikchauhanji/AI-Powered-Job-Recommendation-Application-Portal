import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/axios";

// Get dashboard overview
export const fetchDashboardOverview = createAsyncThunk(
  "admin/fetchOverview",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/admin/overview");
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch overview"
      );
    }
  }
);

// Get all users
export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async ({ page = 1, limit = 10, role = "" }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (role) params.append("role", role);

      const { data } = await apiClient.get(`/admin/users?${params}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin/users/${userId}`);
      return userId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

// Change user role
export const changeUserRole = createAsyncThunk(
  "admin/changeUserRole",
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.put(`/admin/users/${userId}/role`, {
        role,
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to change user role"
      );
    }
  }
);

// Get pending jobs
export const fetchPendingJobs = createAsyncThunk(
  "admin/fetchPendingJobs",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const { data } = await apiClient.get(`/admin/pending-jobs?${params}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch pending jobs"
      );
    }
  }
);

// Approve job
export const approveJob = createAsyncThunk(
  "admin/approveJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.put(`/admin/jobs/${jobId}/approve`);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to approve job"
      );
    }
  }
);

// Reject job
export const rejectJob = createAsyncThunk(
  "admin/rejectJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.put(`/admin/jobs/${jobId}/reject`);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to reject job"
      );
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    overview: null,
    users: [],
    pendingJobs: [],
    pagination: { page: 1, limit: 10, total: 0, pages: 1 },
    loading: false,
    error: "",
  },
  reducers: {
    clearError: (state) => {
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch overview
      .addCase(fetchDashboardOverview.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchDashboardOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(fetchDashboardOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      // Fetch pending jobs
      .addCase(fetchPendingJobs.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchPendingJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingJobs = action.payload.jobs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPendingJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Approve/Reject job
      .addCase(approveJob.fulfilled, (state, action) => {
        state.pendingJobs = state.pendingJobs.filter(
          (job) => job._id !== action.payload._id
        );
      })
      .addCase(rejectJob.fulfilled, (state, action) => {
        state.pendingJobs = state.pendingJobs.filter(
          (job) => job._id !== action.payload._id
        );
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
