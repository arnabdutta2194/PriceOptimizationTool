import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Dialog, IconButton } from "@mui/material";
import { observer } from "mobx-react-lite";
import { productStore } from "../store/ProductStore";
import ProductDialog from "../components/ProductDialog";
import Navbar from "../components/ProductNavBar";
import Footer from "../components/Footer";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from '@mui/icons-material/Visibility';
import DemandForecastModal from "./DemandForecast";
import { toJS } from "mobx";

const CreateAndManageProducts = observer(() => {
  const [isProductDialogOpen, setProductDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState(false);
  const [category, setCategory] = useState("");
  const [searchText, setSearchText] = useState("");
  const [demandForecastEnabled, setDemandForecastEnabled] = useState(false);
  const [products, setProducts] = useState(productStore.products);
  const [selectedRows, setSelectedRows] = useState([]);

  // Fetch products on mount
  useEffect(() => {
    productStore.fetchProducts();
  }, []);

  useEffect(() => {
    setProducts(toJS(productStore.products));
  }, [productStore.products]);

  // Handle product edit/view
  const handleEdit = (product, view = false) => {
    setEditProduct(product);
    setProductDialogOpen(true);
    if (view) setViewProduct(true);
  };

  const handleAdd = () => {
    setEditProduct(null);
    setProductDialogOpen(true);
  };

  const demandDialogOpen = () => {
    setDialogOpen(true);
  };

  // Filter products based on search and category
  useEffect(() => {
    setProducts(productStore.filteredProducts(searchText, category, 'products'));
  }, [category, searchText]);

  // DataGrid columns
  const columns = [
    { field: "name", headerName: "Product Name", flex: 1 },
    { field: "category", headerName: "Product Category", flex: 1 },
    { field: "cost_price", headerName: "Cost Price", flex: 1 },
    { field: "selling_price", headerName: "Selling Price", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    { field: "stock_available", headerName: "Available Units", flex: 1 },
    { field: "units_sold", headerName: "Units Sold", flex: 1 },
    { field: "demand_forecast", headerName: "Calculated Demand Forecast", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleEdit(params.row, true)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => productStore.deleteProduct(params.row.id)}>
            <DeleteIcon color="error" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Navbar
        openAdd={handleAdd}
        openDemandForecast={demandDialogOpen}
        page="manageProduct"
        searchText={searchText}
        setSearchText={setSearchText}
        category={category}
        setCategory={setCategory}
        selectedProducts={selectedRows}
        demandForecastEnabled={demandForecastEnabled}
        toggleDemandForecast={() => setDemandForecastEnabled(!demandForecastEnabled)}
        categoryList={toJS(productStore.categoryList)}
      />
      <Box sx={{ padding: 2, margin: '80px 0 40px 0', height: "calc(100vh - 128px)" }}>
        <DataGrid
          rows={products}
          columns={columns}
          checkboxSelection
          onRowSelectionModelChange={(ids) => {
            if (ids.length >= 2){
            setSelectedRows(ids);
            console.log("Selected Rows",selectedRows)
            }
          }}
          autoHeight
          disableSelectionOnClick
          disableColumnSelector
          keepNonExistentRowsSelected
          slots={{
            toolbar: GridToolbar,
          }}
          disableColumnMenu={true}
          columnVisibilityModel={{
            demand_forecast: demandForecastEnabled,
          }}
        />
      </Box>
      <Footer />
      <Dialog open={isProductDialogOpen} onClose={() => { setProductDialogOpen(false); setViewProduct(false) }}>
        <ProductDialog
          product={editProduct}
          onClose={() => { setProductDialogOpen(false); setViewProduct(false) }}
          onSave={(product) => {
            if (editProduct) {
              productStore.updateProduct(product);
            } else {
              productStore.addProduct(product);
            }
            setProductDialogOpen(false);
            setViewProduct(false);
          }}
          view={viewProduct}
        />
      </Dialog>
      <DemandForecastModal
        open={isDialogOpen}
        handleClose={() => setDialogOpen(false)}
        selectedProducts={selectedRows}
      />
    </Box>
  );
});

export default CreateAndManageProducts;
