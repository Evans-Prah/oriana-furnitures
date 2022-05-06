import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { Product } from "../models/Product";

interface CatalogState {
  catalog: Product[]  | undefined;
  status: string;
  product: Product | undefined;
}

interface ProductState {
  status: string;
  product: Product | undefined;
}

const initialState: CatalogState = {
  catalog: [],
  product: undefined,
  status: "idle",
};

const productInitialState: ProductState = {
  product: undefined,
  status: "idle",
};

export const fetchProductsAsync = createAsyncThunk<Product[] | undefined>(
  "catalog/fetchProductsAsync",
  async () => {
    try {
      return await agent.Catalog.getProducts();
    } catch (error) {
      toast.error("An error occurred while fetching products");
    }
  }
);

export const fetchProductAsync = createAsyncThunk<Product | undefined, string>(
  "catalog/fetchProductAsync",
  async (productUuid, thunkAPI) => {
    try {
      return await agent.Catalog.getProduct(productUuid);
    } catch (error:any) {
      console.log(error);
      toast.error("An error occurred while fetching products");
      return thunkAPI.rejectWithValue("error")
    }
  }
);

export const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProductsAsync.pending, (state) => {
      state.status = "pendingFetchProducts";
    });
    builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
      state.catalog = action.payload;
      state.status = "idle";
    });
    builder.addCase(fetchProductsAsync.rejected, (state) => {
      state.status = "idle";
    });

  },
});

export const productSlice = createSlice({
  name: "product",
  initialState: productInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProductAsync.pending, (state) => {
      state.status = "pendingFetchProduct";
    });
    builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
      state.product = action.payload;
      state.status = "idle";
    });
    builder.addCase(fetchProductAsync.rejected, (state, action) => {
      console.log('action-->', action)
      state.status = "idle";
    });
  },
});
