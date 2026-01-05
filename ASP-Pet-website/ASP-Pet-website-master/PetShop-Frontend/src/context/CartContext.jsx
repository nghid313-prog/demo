import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'petshop_cart';

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Error parsing cart from localStorage:', e);
                localStorage.removeItem(CART_STORAGE_KEY);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save cart to localStorage whenever items change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, isLoaded]);

    // Add item to cart (supports both pets and products)
    const addToCart = (item, type = 'product') => {
        setItems(prevItems => {
            const existingIndex = prevItems.findIndex(
                i => i.id === item.id && i.type === type
            );

            if (existingIndex > -1) {
                // Item exists, increase quantity (only for products)
                if (type === 'product') {
                    const updated = [...prevItems];
                    updated[existingIndex] = {
                        ...updated[existingIndex],
                        quantity: updated[existingIndex].quantity + 1
                    };
                    return updated;
                }
                // Pets are unique, don't add duplicates
                return prevItems;
            }

            // Add new item
            return [...prevItems, {
                id: type === 'product' ? item.dogProductItemId : item.dogItemId,
                name: type === 'product' ? item.itemName : item.dogName,
                price: item.price,
                image: item.images?.[0] || null,
                type: type,
                quantity: 1,
                maxQuantity: type === 'product' ? item.quantity : 1,
                category: type === 'product' ? item.category : item.dogSpeciesName,
            }];
        });
    };

    // Remove item from cart
    const removeFromCart = (id, type) => {
        setItems(prevItems => prevItems.filter(
            item => !(item.id === id && item.type === type)
        ));
    };

    // Update item quantity
    const updateQuantity = (id, type, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(id, type);
            return;
        }

        setItems(prevItems => prevItems.map(item => {
            if (item.id === id && item.type === type) {
                return {
                    ...item,
                    quantity: Math.min(newQuantity, item.maxQuantity || 999)
                };
            }
            return item;
        }));
    };

    // Clear entire cart
    const clearCart = () => {
        setItems([]);
    };

    // Get total items count
    const getItemCount = () => {
        return items.reduce((total, item) => total + item.quantity, 0);
    };

    // Get cart subtotal
    const getSubtotal = () => {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Check if item is in cart
    const isInCart = (id, type) => {
        return items.some(item => item.id === id && item.type === type);
    };

    const value = {
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemCount,
        getSubtotal,
        isInCart,
        isLoaded,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export default CartContext;
