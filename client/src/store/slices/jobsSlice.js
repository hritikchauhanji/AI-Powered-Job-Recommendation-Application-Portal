import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/axios";

// Fetch all jobs with filters
export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (
    {
      page = 1,
      limit = 10,
      search = "",
      location = "",
      jobType = "",
      skills = "",
    },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (search) params.append("search", search);
      if (location) params.append("location", location);
      if (jobType) params.append("jobType", jobType);
      if (skills) params.append("skills", skills);

      const { data } = await apiClient.get(`/jobs?${params}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch jobs"
      );
    }
  }
);

// Fetch single job by ID
export const fetchJobById = createAsyncThunk(
  "jobs/fetchJobById",
  async (jobId, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/jobs/${jobId}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch job"
      );
    }
  }
);

// Create new job (Recruiter)
export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (jobData, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/jobs", jobData);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create job"
      );
    }
  }
);

// Update job
export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async ({ jobId, jobData }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.put(`/jobs/${jobId}`, jobData);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update job"
      );
    }
  }
);

// Delete job
export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (jobId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/jobs/${jobId}`);
      return jobId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete job"
      );
    }
  }
);

// Fetch recruiter's jobs
export const fetchRecruiterJobs = createAsyncThunk(
  "jobs/fetchRecruiterJobs",
  async ({ page = 1, limit = 10, status = "" }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (status) params.append("status", status);

      const { data } = await apiClient.get(`/jobs/recruiter/my-jobs?${params}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch recruiter jobs"
      );
    }
  }
);

const jobsSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    currentJob: null,
    recruiterJobs: [],
    pagination: { page: 1, limit: 10, totalJobs: 0, totalPages: 1 },
    loading: false,
    error: "",
  },
  reducers: {
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    clearError: (state) => {
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch job by ID
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create job
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.recruiterJobs.unshift(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete job
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.recruiterJobs = state.recruiterJobs.filter(
          (job) => job._id !== action.payload
        );
      })
      // Fetch recruiter jobs
      .addCase(fetchRecruiterJobs.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchRecruiterJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.recruiterJobs = action.payload.jobs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchRecruiterJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentJob, clearError } = jobsSlice.actions;
export default jobsSlice.reducer;
