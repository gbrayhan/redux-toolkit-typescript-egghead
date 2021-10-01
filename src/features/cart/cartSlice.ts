import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface CartState {
    items: { [productID: string]: number }
}

const initialState: CartState = {
    items: {}
}


const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart(state, action: PayloadAction<string>) {
            const id = action.payload;
            state.items[id] = 1;
        }
    }
});


export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer;
