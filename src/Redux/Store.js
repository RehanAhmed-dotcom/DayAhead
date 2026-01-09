import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import storage from '@react-native-async-storage/async-storage';
import UserSlice from '../Redux/Auth';

import { persistReducer } from 'redux-persist';
import onboardingSlice from '../Redux/OnboardingSlice';

let persistConfig = {
    key: 'root',
    storage,
    whitelist: ['onboarding', 'user'],
};
let rootReducer = combineReducers({

    user: UserSlice,
    onboarding: onboardingSlice,

});
let persistedReducer = persistReducer(persistConfig, rootReducer);
const Store = configureStore({ reducer: persistedReducer });

export default Store;
