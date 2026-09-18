import { createSlice } from '@reduxjs/toolkit';

// Helper function untuk decode JWT tanpa library eksternal
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const getInitialUser = () => {
  const token = localStorage.getItem('token');
  if (token) {
    const decoded = decodeToken(token);
    if (decoded) {
      return {
        username: decoded.sub,
        position: decoded.position,
        privilage: decoded.privilege || decoded.privilage,
        privilege: decoded.privilege || decoded.privilage,
        nik: decoded.nik,
        fullName: decoded.fullName,
        division: decoded.division,
        leader: decoded.leader
      };
    }
  }
  return null;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getInitialUser(),
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
  },
  reducers: {
    login: (state, action) => {
      const { token } = action.payload;
      const decoded = decodeToken(token);
      
      if (decoded) {
        state.user = {
          username: decoded.sub,
          position: decoded.position,
          privilage: decoded.privilege || decoded.privilage,
        privilege: decoded.privilege || decoded.privilage,
          nik: decoded.nik,
          fullName: decoded.fullName,
          division: decoded.division,
          leader: decoded.leader
        };
        state.token = token;
        state.isAuthenticated = true;
        localStorage.setItem('token', token);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user'); // Cleanup old keys
      localStorage.removeItem('username');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
