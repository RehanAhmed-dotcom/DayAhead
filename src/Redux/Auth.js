import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    user: null,
    email: '',
    password: '',
    rememberMe: false,
};
const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
    
        logoutUser: state => {
            state.isAuthenticated = false;
            state.user = null;
        },
        setCredentials: (state, action) => {
            const { email, password, rememberMe } = action.payload;
            state.email = email;
            state.password = password;
            state.rememberMe = rememberMe;
        },
        clearCredentials: state => {
            state.email = '';
            state.password = '';
            state.rememberMe = false;
        },

    },
});

export const { setUser,  logoutUser, setCredentials, clearCredentials } = UserSlice.actions;
export default UserSlice.reducer;
