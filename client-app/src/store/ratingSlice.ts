import { createSlice } from "@reduxjs/toolkit";
import { Rating } from "../models/Review";

interface RatingState {
  rating: Rating | null
}

const initialState: RatingState = {
  rating: null
}

export const ratingSlice = createSlice({
  name: "rating",
  initialState,
  reducers: {
    setProductRating:(state, action) => {
      state.rating = action.payload;
    }
  }
})

export const {setProductRating} = ratingSlice.actions;