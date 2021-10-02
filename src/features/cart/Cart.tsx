import React from "react";
import styles from "./Cart.module.css";
import classNames from "classnames";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {checkoutCart, getTotalPrice, removeFromCart, updateQuantity} from "./cartSlice"

export function Cart() {
    const dispatch = useAppDispatch();
    const products = useAppSelector((state) => state.products.products);
    const items = useAppSelector((state) => state.cart.items);
    const totalPrice = useAppSelector(getTotalPrice);
    const checkoutState = useAppSelector((state) => state.cart.checkoutState);
    const errorMessage = useAppSelector((state) => state.cart.errorMessage);


    const onQuantityChanged = (
        event: React.ChangeEvent<HTMLInputElement>,
        id: string
    ) => {
        const quantity = Number(event.target.value) || 0;
        dispatch(updateQuantity({id, quantity}));
    }
    const onCheckout = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(checkoutCart(items))
    }

    const tableClasses = classNames({
        [styles.table]: true,
        [styles.checkoutError]: checkoutState == "ERROR",
        [styles.checkoutLoading]: checkoutState == "LOADING",
    })


    return (
        <main className="page">
            <h1>Shopping Cart</h1>
            <table className={tableClasses}>
                <thead>
                <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Remove</th>
                </tr>
                </thead>
                <tbody>
                {
                    Object.entries(items).map(([id, quantity]) => (
                        <tr key={id}>
                            <td>{products[id].name}</td>
                            <td>
                                <input type="text" className={styles.input} defaultValue={quantity}
                                       onChange={(event) => onQuantityChanged(event, id)}/>
                            </td>
                            <td>{(products[id].price * quantity).toFixed(2)}</td>
                            <td>
                                <button onClick={() => {
                                    dispatch(removeFromCart(id))
                                }} aria-label={`Remove ${products[id].name} from Shopping Cart`}>
                                    X
                                </button>
                            </td>
                        </tr>
                    ))
                }

                </tbody>
                <tfoot>
                <tr>
                    <td>Total</td>
                    <td></td>
                    <td className={styles.total}>${totalPrice}</td>
                    <td></td>
                </tr>
                </tfoot>
            </table>
            <form onSubmit={onCheckout}>
                {checkoutState === "ERROR" && errorMessage ? (
                    <p className={styles.errorBox}>{errorMessage}</p>
                ) : null}
                <button className={styles.button} type="submit">
                    Checkout
                </button>
            </form>
        </main>
    );
}
