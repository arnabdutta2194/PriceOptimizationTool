import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid"; // Data grid for displaying tabular data
import { Box } from "@mui/material"; // Material-UI Box for layout
import { observer } from "mobx-react-lite"; // MobX observer for reactive updates
import { productStore } from "../store/ProductStore"; // MobX store for product data
import Navbar from "../components/ProductNavBar"; // Navigation bar component
import Footer from "../components/Footer"; // Footer component
import { toJS } from "mobx"; // Converts MobX observable objects to plain JS

const PricingOptimization = observer(() => {
  // State variables
  const [category, setCategory] = useState(""); // Selected category for filtering
  const [searchText, setSearchText] = useState(""); // Search text for filtering
  const [products, setProducts] = useState(productStore.pricingOptimizeProducts); // Displayed product list

  // Fetch price optimization records when the component mounts
  useEffect(() => {
    productStore.fetchPriceOptimizationRecords();
  }, []);

  // Update `products` whenever `pricingOptimizeProducts` in the store changes
  useEffect(() => {
    setProducts(toJS(productStore.pricingOptimizeProducts));
  }, [productStore.pricingOptimizeProducts]);

  // Filter products based on search text or selected category
  useEffect(() => {
    setProducts(productStore.filteredProducts(searchText, category, "price"));
  }, [category, searchText]);

  // Columns for the data grid
  const columns = [
    { field: "name", headerName: "Product Name", flex: 1 },
    { field: "category", headerName: "Product Category", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    { field: "cost_price", headerName: "Cost Price", flex: 1 },
    { field: "selling_price", headerName: "Selling Price", flex: 1 },
    { field: "optimized_price", headerName: "Optimized Price", flex: 2 },
  ];

  return (
    <Box>
      {/* Navbar with filtering controls */}
      <Navbar 
        page="priceOptimize" 
        searchText={searchText} 
        setSearchText={setSearchText} 
        category={category} 
        setCategory={setCategory} 
        categoryList={toJS(productStore.categoryList)} 
      />
      {/* Data grid displaying products */}
      <Box sx={{ padding: 2, margin: "80px 0 40px 0", height: "calc(100vh - 128px)" }}>
        <DataGrid
          rows={products} // Products to display
          columns={columns} // Column configuration
          autoHeight // Adjust height automatically
          disableSelectionOnClick // Disable row selection on click
          disableColumnSelector // Hide column selector
          keepNonExistentRowsSelected // Preserve row selection
          slots={{
            toolbar: GridToolbar, // Show toolbar with built-in options
          }}
          disableColumnMenu={true} // Disable column menu options
        />
      </Box>
      <Footer /> {/* Footer component */}
    </Box>
  );
});

export default PricingOptimization; // Export the component
