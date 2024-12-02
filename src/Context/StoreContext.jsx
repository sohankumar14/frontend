import { createContext, useEffect, useState, useCallback, useMemo } from "react";
import { food_list, menu_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [ordersData, setOrdersData] = useState([]);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    // Add item to cart
    const addToCart = useCallback((itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1,
        }));
    }, []);

    // Remove item from cart
    const removeFromCart = useCallback((itemId) => {
        setCartItems((prev) => {
            if (prev[itemId] <= 1) {
                const updatedCart = { ...prev };
                delete updatedCart[itemId];
                return updatedCart;
            }
            return { ...prev, [itemId]: prev[itemId] - 1 };
        });
    }, []);

    // Get total cart amount
    const getTotalCartAmount = useCallback(() => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = food_list.find((product) => product.food_id === Number(item));
                if (itemInfo) {
                    totalAmount += itemInfo.food_price * cartItems[item];
                }
            }
        }
        return totalAmount;
    }, [cartItems]);

    // Place order
    const placeOrder = useCallback(async (deliveryData) => {
        if (Object.keys(cartItems).length === 0) {
            console.error("Cart is empty. Cannot place order.");
            return;
        }

        // Validate delivery data
        if (!deliveryData || !deliveryData.street || !deliveryData.phone) {
            console.error("Invalid delivery data.");
            return;
        }

        const orderData = {
            deliveryDetails: deliveryData,
            cartItems: { ...cartItems },
            totalAmount: getTotalCartAmount(),
            orderDate: new Date().toISOString(),
        };

        setIsPlacingOrder(true);
        try {
            const response = await fetch("http://localhost:3001/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                const savedOrder = await response.json();
                setOrdersData((prev) => [...prev, savedOrder]); // Save order locally
                setCartItems({}); // Clear cart
                console.log("Order placed successfully:", savedOrder);
            } else {
                console.error("Failed to place order:", response.statusText);
            }
        } catch (error) {
            console.error("Error placing order:", error);
        } finally {
            setIsPlacingOrder(false);
        }
    }, [cartItems, getTotalCartAmount]);

    const contextValue = useMemo(() => ({
        food_list,
        menu_list,
        cartItems,
        ordersData,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        placeOrder,
        isPlacingOrder,
    }), [cartItems, ordersData, addToCart, removeFromCart, getTotalCartAmount, placeOrder, isPlacingOrder]);

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
