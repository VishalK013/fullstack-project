import React from "react";
import { topSellings } from "../features/product/ProductSlice";
import ProductList from "./ProductList";

const selectTopSelling = (state) => ({
  products: state.product.topSelling,
  error: state.product.error,
  status: state.product.status,
});

function TopSellings() {
  return (
    <ProductList
      fetchAction={topSellings}
      productsSelector={selectTopSelling}
      title="Top Sellings"
      loadingText="Loading top sellings..."
      errorText="Failed to load top sellings"
    />
  );
}

export default TopSellings;
