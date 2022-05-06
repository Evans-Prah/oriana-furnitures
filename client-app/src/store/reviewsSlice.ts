import { createSlice } from "@reduxjs/toolkit";
import { Review } from "../models/Review";

interface ReviewsState {
  productReviews: Review[] | [];
}

const initialState: ReviewsState = {
  productReviews: [],
};

export const reviewSlice = createSlice({
  name: 'productReviews',
  initialState,
  reducers: {
    setProductReviews: (state, action) => {
      state.productReviews = action.payload;
    }
  }
})

export const { setProductReviews } = reviewSlice.actions;