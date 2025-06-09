import React from "react";
import { fetchNewArrivals } from "../features/product/ProductSlice";
import ProductList from "./ProductList";

const selectNewArrival = (state) => ({
  products: state.product.newArrival,
  error: state.product.error,
  status: state.product.status,
});

function NewArrival() {
  return (
    <ProductList
      fetchAction={fetchNewArrivals}
      productsSelector={selectNewArrival}
      title="New Arrivals"
      loadingText="Loading new arrivals..."
      errorText="Failed to load new arrivals"
    />
  );
}

export default NewArrival;
