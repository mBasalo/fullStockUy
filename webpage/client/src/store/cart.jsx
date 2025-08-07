import { createContext, useContext, useEffect, useState } from "react";

const CartCtx = createContext();
export const useCart = () => useContext(CartCtx);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => localStorage.setItem("cart", JSON.stringify(items)), [items]);

  const add = (p, qty=1) => {
    setItems(prev => {
      const i = prev.find(x => x._id === p._id);
      return i
        ? prev.map(x => x._id===p._id ? {...x, qty: x.qty+qty} : x)
        : [...prev, {...p, qty}];
    });
  };
  const remove = id => setItems(prev => prev.filter(x => x._id !== id));
  const setQty = (id, qty) => setItems(prev => prev.map(x => x._id===id ? {...x, qty: Math.max(1, qty)} : x));
  const clear = () => setItems([]);
  const total = items.reduce((s,x)=> s + Number(x.priceUSD || 0) * Number(x.qty || 0), 0);

  return <CartCtx.Provider value={{ items, add, remove, setQty, clear, total }}>{children}</CartCtx.Provider>;
}
