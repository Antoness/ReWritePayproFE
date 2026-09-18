import { createSlice } from '@reduxjs/toolkit';

const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const getInitialPermissions = () => {
  try {
    const saved = localStorage.getItem('user_permissions');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialPerms = getInitialPermissions();

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
        leader: decoded.leader,
        companyId: decoded.companyId || 1
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
    permissions: initialPerms,
    isPermissionsLoaded: initialPerms.length > 0,
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
          leader: decoded.leader,
          companyId: decoded.companyId || 1
        };
        state.token = token;
        state.isAuthenticated = true;
        state.isPermissionsLoaded = false;
        localStorage.setItem('token', token);
      }
    },
    setPermissions: (state, action) => {
      const perms = action.payload || [];
      state.permissions = perms;
      state.isPermissionsLoaded = true;
      localStorage.setItem('user_permissions', JSON.stringify(perms));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.permissions = [];
      state.isPermissionsLoaded = false;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('username');
      localStorage.removeItem('user_permissions');
    },
  },
});

export const { login, logout, setPermissions } = authSlice.actions;
export default authSlice.reducer;