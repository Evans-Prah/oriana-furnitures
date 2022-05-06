import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { ApiResponse } from "../models/ApiResponse";
import { Basket } from "../models/Basket";

interface BasketState {
  basket: Basket | null;
  status: string;
}

const initialState: BasketState = {
  basket: null,
  status: "idle",
};

export const addBasketItemAsync = createAsyncThunk<
  Basket,
  { productId: number; quantity?: number }
>("basket/addBasketItemAsync", async ({ productId, quantity = 1 }, thunkAPI) => {
  try {
    return await agent.Basket.addItem(productId, quantity);
  } catch (error:any) {
    console.log(error);
    toast.error("An error occurred while adding item to basket");
    return thunkAPI.rejectWithValue({error: error?.responseMessage})
  }
});

export const removeBasketItemAsync = createAsyncThunk<
  ApiResponse,
  { productId: number; quantity: number, name?:string }
>("basket/removeBasketItemAsync", async ({ productId, quantity }) => {
  try {
    return await agent.Basket.removeItem(productId, quantity);
  } catch (error) {
    toast.error("An error occurred while removing item from basket");
  }
});

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    setBasket: (state, action) => {
      state.basket = action.payload;
    },
    removeItem: (state, action) => {
      const { productId, quantity } = action.payload;
      const itemIndex = state.basket?.data?.items.findIndex(
        (item) => item.productId === productId
      );
      if (itemIndex === -1 || itemIndex === undefined) return;
      state.basket!.data.items[itemIndex].quantity -= quantity;
      if (state.basket?.data?.items[itemIndex].quantity === 0)
        state.basket?.data?.items.splice(itemIndex, 1);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addBasketItemAsync.pending, (state, action) => {
      state.status = "pendingAddItem" + action.meta.arg.productId;
    });
    builder.addCase(addBasketItemAsync.fulfilled, (state, action) => {
      state.basket = action.payload;
      state.status = "idle";
    });
    builder.addCase(addBasketItemAsync.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(removeBasketItemAsync.pending, (state, action) => {
      state.status = "pendingRemoveItem" + action.meta.arg.productId + action.meta.arg.name;
    });
    builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
      const { productId, quantity } = action.meta.arg;
      const itemIndex = state.basket?.data?.items.findIndex(
        (item) => item.productId === productId
      );
      if (itemIndex === -1 || itemIndex === undefined) return;
      state.basket!.data.items[itemIndex].quantity -= quantity;
      if (state.basket?.data?.items[itemIndex].quantity === 0)
        state.basket?.data?.items.splice(itemIndex, 1);

      state.status = "idle";
    });
  },
});

export const { setBasket, removeItem } = basketSlice.actions;
