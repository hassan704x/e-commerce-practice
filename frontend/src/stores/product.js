import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),

  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.image || !newProduct.price) {
      return { success: false, message: "Please fill in all fields." };
    }
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (!res.ok) {
        const err = await res.json();
        return { success: false, message: err.message || "Server error" };
      }
      const data = await res.json();
      set((state) => ({ products: [...state.products, data.data] }));
      return { success: true, message: data.message || "Product created successfully" };
    } catch (error) {
      console.error("Create Product Error:", error);
      return { success: false, message: error.message || "Network error" };
    }
  },

  fetchProducts: async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    set({ products: data.data });
  },

  deleteProduct: async (pid) => {
    const res = await fetch(`/api/products/${pid}`, { method: "DELETE" });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // remove product from state instantly (no page refresh)
    set((state) => ({ products: state.products.filter((p) => p._id !== pid) }));
    return { success: true, message: data.message };
  },

  updateProduct: async (pid, updatedProduct) => {
    const res = await fetch(`/api/products/${pid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };
    set((state) => ({
      products: state.products.map((p) => (p._id === pid ? data.data : p)),
    }));
    return { success: true, message: data.message };
  },

 
  removeProductFromState: (pid) =>
    set((state) => ({
      products: state.products.filter((p) => p._id !== pid),
    })),
}));
