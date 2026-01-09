import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    onBoardingStatus: false,
    jnlBoardingStatus: false,

};
const onboardingSlice = createSlice({
    name: 'onboarding',
    initialState,
    reducers: {
        setOnboarding: (state, action) => {
            state.onBoardingStatus = true;
        },
        setOnboardingFalse: (state, action) => {
            state.onBoardingStatus = false;
        },
        setJnlOnboard: (state, action) => {
            state.jnlBoardingStatus = true;
        },
        setJnlOnboardFalse: (state, action) => {
            state.jnlBoardingStatus = false;
        },

    },
});

export const { setOnboarding, setOnboardingFalse,setJnlOnboard,setJnlOnboardFalse } = onboardingSlice.actions;
export default onboardingSlice.reducer;
