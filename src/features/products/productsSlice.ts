import {createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Product} from "../../app/api";
import {RootState} from "../../app/store";

export interface ProductsState {
    products: { [id: string]: Product }
}

const initialState: ProductsState = {
    products: {}
}


const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        receivedProducts(state, action: PayloadAction<Product[]>) {
            const products = action.payload;
            products.forEach(product => {
                state.products[product.id] = product;
            })

        }
    }
});


export const {receivedProducts} = productsSlice.actions;
export default productsSlice.reducer;

export function getNumItems(state: RootState) {
    let numItems = 0;
    for (let id in state.cart.items) {
        numItems += state.cart.items[id];
    }
    return numItems;
}


export const getMemorizedNumItems = createSelector(
    (state: RootState) => state.cart.items,
    (items) => {
        let numItems = 0;
        console.log("getMemorizedNumItems")
        for (let id in items) {
            numItems += items[id];
        }
        return numItems;
    }
)
