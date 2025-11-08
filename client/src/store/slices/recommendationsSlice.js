import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/axios";

// Get job recommendations
export const fetchRecommendations = createAsyncThunk(
  "recommendations/fetchRecommendations",
  async (topN = 5, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/recommendations?topN=${topN}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch recommendations"
      );
    }
  }
);

const recommendationsSlice = createSlice({
  name: "recommendations",
  initialState: {
    recommendations: [],
    count: 0,
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
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload.recommendations;
        state.count = action.payload.count;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = recommendationsSlice.actions;
export default recommendationsSlice.reducer;
