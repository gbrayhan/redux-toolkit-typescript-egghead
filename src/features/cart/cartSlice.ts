import {createAsyncThunk, createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {CartItems, checkout} from "../../app/api";
import {RootState} from "../../app/store";

type CheckoutState = "LOADING" | "READY" | "ERROR";

export interface CartState {
    items: { [productID: string]: number };
    checkoutState: CheckoutState;
    errorMessage: string;
}

const initialState: CartState = {
    items: {},
    checkoutState: "READY",
    errorMessage: "",
}

export const checkoutCart = createAsyncThunk("cart/checkout", async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const items = state.cart.items;
    const response = await checkout(items);
    return response;
});

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart(state, action: PayloadAction<string>) {
            if (state.items[action.payload]) {
                state.items[action.payload]++;
            } else {
                state.items[action.payload] = 1;
            }
        },
        removeFromCart(state, action: PayloadAction<string>) {
            delete state.items[action.payload];
        },
        updateQuantity(
            state,
            action: PayloadAction<{ id: string; quantity: number }>
        ) {
            const {id, quantity} = action.payload;
            state.items[id] = quantity;
        },
    }, extraReducers: function (builder) {
        builder.addCase(checkoutCart.pending, (state, action) => {
            state.checkoutState = "LOADING";
        });
        builder.addCase(
            checkoutCart.fulfilled,
            (state, action: PayloadAction<{ success: boolean }>) => {
                const { success } = action.payload;
                if (success) {
                    state.checkoutState = "READY";
                    state.items = {};
                } else {
                    state.checkoutState = "ERROR";
                }
            }
        );
        builder.addCase(checkoutCart.rejected, (state, action) => {
            state.checkoutState = "ERROR";
            state.errorMessage = action.error.message || "";
        })
    }
});

export const getTotalPrice = createSelector(
    (state: RootState) => state.cart.items,
    (state: RootState) => state.products.products,
    (items, products) => {
        let total = 0;
        for (let id in items) {
            total += products[id].price * items[id];
        }
        return total.toFixed(2);
    }
);


export const {addToCart, removeFromCart, updateQuantity} = cartSlice.actions;

export default cartSlice.reducer;
