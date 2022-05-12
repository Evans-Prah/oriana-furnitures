import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { accountSlice } from "./accountSlice";
import { basketSlice } from "./basketSlice";
import { catalogSlice, productSlice } from "./catalogSlice";
import { ratingSlice } from "./ratingSlice";
import { reviewSlice } from "./reviewsSlice";

export const store = configureStore({
  reducer: {
    catalog: catalogSlice.reducer,  
    product: productSlice.reducer,
    basket: basketSlice.reducer,
    account: accountSlice.reducer,
    productReviews: reviewSlice.reducer,
    rating: ratingSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;