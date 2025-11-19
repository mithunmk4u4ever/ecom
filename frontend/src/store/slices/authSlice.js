import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/api';

export const login = createAsyncThunk('auth/login', async (credentials) => {
  const res = await API.post('/login', credentials);
  return res.data;
});

export const register = createAsyncThunk('auth/register', async (data) => {
  const res = await API.post('/register', data);
  return res.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: JSON.parse(localStorage.getItem('user')) || null, token: localStorage.getItem('token') || null, status: 'idle' },
  reducers: {
    logout: (state) => { state.user = null; state.token = null; localStorage.removeItem('token'); localStorage.removeItem('user'); }
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
