import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/axios";

// Apply for job
export const applyForJob = createAsyncThunk(
  "applications/applyForJob",
  async ({ jobId, coverLetter }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/applications/apply", {
        jobId,
        coverLetter,
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to apply for job"
      );
    }
  }
);

// Get candidate's applications
export const fetchMyApplications = createAsyncThunk(
  "applications/fetchMyApplications",
  async ({ page = 1, limit = 10, status = "" }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (status) params.append("status", status);

      const { data } = await apiClient.get(
        `/applications/my-applications?${params}`
      );
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch applications"
      );
    }
  }
);

// Get job applications (Recruiter)
export const fetchJobApplications = createAsyncThunk(
  "applications/fetchJobApplications",
  async ({ jobId, page = 1, limit = 10, status = "" }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (status) params.append("status", status);

      const { data } = await apiClient.get(
        `/applications/job/${jobId}?${params}`
      );
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch job applications"
      );
    }
  }
);

// Update application status
export const updateApplicationStatus = createAsyncThunk(
  "applications/updateStatus",
  async ({ applicationId, status }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.put(
        `/applications/${applicationId}/status`,
        { status }
      );
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update application status"
      );
    }
  }
);

const applicationsSlice = createSlice({
  name: "applications",
  initialState: {
    myApplications: [],
    jobApplications: [],
    pagination: { page: 1, limit: 10, totalApplications: 0, totalPages: 1 },
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
      // Apply for job
      .addCase(applyForJob.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(applyForJob.fulfilled, (state, action) => {
        state.loading = false;
        state.myApplications.unshift(action.payload);
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch my applications
      .addCase(fetchMyApplications.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.myApplications = action.payload.applications;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch job applications
      .addCase(fetchJobApplications.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchJobApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.jobApplications = action.payload.applications;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchJobApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update application status
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const index = state.jobApplications.findIndex(
          (app) => app._id === action.payload._id
        );
        if (index !== -1) {
          state.jobApplications[index] = action.payload;
        }
      });
  },
});

export const { clearError } = applicationsSlice.actions;
export default applicationsSlice.reducer;
