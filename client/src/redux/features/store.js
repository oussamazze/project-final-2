import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./authSlice";
import TourReducer from "./tourSlice";

export default configureStore({
  reducer: {
    auth: AuthReducer,
    tour: TourReducer,
  },
});