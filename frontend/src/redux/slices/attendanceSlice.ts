import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// FIX: Use 'import type' to prevent circular dependency issues
import type { RootState } from '../store';

const API_URL = 'http://localhost:5000/api/attendance/';

interface AttendanceRecord {
    _id: string;
    date: string;
    checkInTime?: string;
    checkOutTime?: string;
    status: 'present' | 'absent' | 'late' | 'half-day';
    totalHours: number;
    userId?: {
        _id: string;
        name: string;
        employeeId: string;
        department: string;
    };
}

interface AttendanceSummary {
    present: number;
    absent: number;
    late: number;
    'half-day': number;
    totalHours: number;
}

interface AttendanceState {
    history: AttendanceRecord[];
    summary: AttendanceSummary;
    allRecords: AttendanceRecord[]; 
    isLoading: boolean;
    isError: boolean;
    message: string;
}

const getToken = (thunkAPI: any) => {
  const user = (thunkAPI.getState() as RootState).auth.user;
  return user ? user.token : null;
};

// --- Async Thunks ---

export const checkIn = createAsyncThunk('attendance/checkIn', async (_, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(API_URL + 'checkin', {}, config);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || 'Check-in failed');
    }
  }
);

export const checkOut = createAsyncThunk('attendance/checkOut', async (_, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(API_URL + 'checkout', {}, config);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || 'Check-out failed');
    }
  }
);

export const getMySummary = createAsyncThunk('attendance/getMySummary', async (_, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(API_URL + 'my-summary', config);
      return response.data as AttendanceSummary;
    } catch (error: any) {
      return thunkAPI.rejectWithValue('Failed to fetch summary');
    }
  }
);

export const getMyHistory = createAsyncThunk('attendance/getMyHistory', async (monthFilter: string | undefined, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const query = monthFilter ? `?month=${monthFilter}` : '';
      const response = await axios.get(API_URL + 'my-history' + query, config);
      return response.data as AttendanceRecord[];
    } catch (error: any) {
      return thunkAPI.rejectWithValue('Failed to fetch history');
    }
  }
);

// FIX: Updated to accept a filter object
export const getAllAttendance = createAsyncThunk(
  'attendance/getAllAttendance',
  async (filters: { date?: string; employeeId?: string; status?: string } | undefined, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      const config = { 
          headers: { Authorization: `Bearer ${token}` },
          params: filters // Pass the filters as query parameters
      };
      const response = await axios.get(API_URL + 'all', config);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue('Failed to fetch all attendance');
    }
  }
);

// --- State Slice ---

const initialState: AttendanceState = {
  history: [],
  summary: { present: 0, absent: 0, late: 0, 'half-day': 0, totalHours: 0 },
  allRecords: [],
  isLoading: false,
  isError: false,
  message: '',
};

export const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    resetAttendance: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkIn.fulfilled, (state, action) => { state.isLoading = false; state.message = action.payload.msg; })
      .addCase(checkOut.fulfilled, (state, action) => { state.isLoading = false; state.message = action.payload.msg; })
      .addCase(getMySummary.fulfilled, (state, action) => { state.isLoading = false; state.summary = action.payload; })
      .addCase(getMyHistory.fulfilled, (state, action) => { state.isLoading = false; state.history = action.payload; })
      .addCase(getAllAttendance.pending, (state) => { state.isLoading = true; })
      .addCase(getAllAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allRecords = action.payload;
      })
      .addCase(getAllAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { resetAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;