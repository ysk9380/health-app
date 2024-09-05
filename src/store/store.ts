import { configureStore, combineReducers, Action } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import loadingReducer from "./loading-slice";
import selectedPatientReducer from "./patient-slice";

const appReducer = combineReducers({
  auth: authReducer,
  loading: loadingReducer,
  currentPatient: selectedPatientReducer,
});

export type RootState = ReturnType<typeof appReducer>;

const rootReducer = (state: RootState | undefined, action: Action) => {
  if (action.type === "LOGOUT") {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export default store;
