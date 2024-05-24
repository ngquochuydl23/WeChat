import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false,
    user: null,
    isLoading: true,
}

const slice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
        },
        setUser: (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
        },
        stopLoading: (state) => {
            state.isLoading = false;
        },
        logout: (state) => {
            state.user = null;
            localStorage.removeItem("accessToken");
        },
    }
})

export const { setUser, stopLoading, logout, setLoading } = slice.actions;
export default slice.reducer;
