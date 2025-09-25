import { configureStore } from "@reduxjs/toolkit";
import userRegistrationSlice from "./userRegistration";
import userLoginSlice from "./userData";
import hospitalSlice from "./HospitalsData";
import ambulaceData from "./AmbulanceData";
import bloodData from "./BloodData";


// export const store = configureStore({
//   reducer: {
//     userRegistration: userRegistrationSlice,
//     userLogin: userLoginSlice,
//     hospitalData: hospitalSlice,
//     ambulanceData: ambulaceData,
//   },
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;


export const store = configureStore({
  reducer: {
    userRegistration: userRegistrationSlice,
    userLogin: userLoginSlice,
    hospitalData: hospitalSlice,
    ambulanceData: ambulaceData,
    bloodData: bloodData,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // dev-only warning off
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
