import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

// 1. Applications Slice
export const fetchApplications = createAsyncThunk(
  'applications/fetch',
  async (params, { signal }) => {
    const res = await fetch(`/api/applications?search=${params.search}`, { signal });
    return await res.json();
  }
);

export const updateLoanStatus = createAsyncThunk(
  'applications/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/applications/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Update rejected');
      return await res.json();
    } catch (err) {
      return rejectWithValue({ id, message: err.message });
    }
  }
);

// Build slices and selectors here...