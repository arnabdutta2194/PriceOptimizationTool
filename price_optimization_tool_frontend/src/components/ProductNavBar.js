import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Switch,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

const Navbar = observer(
  ({
    openAdd,
    openDemandForecast,
    page,
    searchText,
    setSearchText,
    category,
    setCategory,
    categoryList,
    selectedProducts,
    demandForecastEnabled,
    toggleDemandForecast
  }) => {
    const navigate = useNavigate(); // Hook for navigating to a different route

    return (
      <AppBar
        position="fixed"
        style={{
          height: "40px", // Height of the AppBar
          marginTop: "40px", // Margin at the top of the AppBar
          justifyContent: "baseline", // Aligns content in the AppBar
          backgroundColor: "#282c34", // Dark background color
          borderTop: "1px solid black", // Border at the top of the AppBar
        }}
      >
        <Toolbar
          style={{
            minHeight: "40px", // Minimum height of the toolbar
            height: "40px", // Height of the toolbar
            padding: "0 10px", // Padding inside the toolbar
            alignItems: "center", // Align items vertically in the center
          }}
        >
          {/* IconButton to go back to the dashboard */}
          <IconButton edge="start" color="inherit" onClick={() => navigate("/dashboard")}>
            <ArrowBackIcon />
          </IconButton>

          {/* Page title that changes depending on the `page` prop */}
          <Typography
            variant="body1"
            style={{
              flexGrow: 1, // Takes the remaining space in the toolbar
              fontSize: "14px", // Font size for the title
              display: "flex",
              alignItems: "center", // Vertically centers the text
            }}
          >
            {page === "manageProduct" ? "Create and Manage Product" : "Pricing Optimization"}
          </Typography>

          {/* Display the Demand Forecast switch if the page is "manageProduct" */}
          {page === "manageProduct" &&
            <Typography
              variant="body1"
              style={{
                flexGrow: 1,
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
              }}
            >
              Demand Forecast
              {/* Switch component to toggle the demand forecast */}
              <Switch
                checked={demandForecastEnabled}
                onChange={toggleDemandForecast} // Toggles the demand forecast
                color="primary"
                aria-label="Toggle demand forecast"
              />
            </Typography>}

          {/* TextField for searching products by name */}
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search by name"
            value={searchText} // Controlled value for search text
            onChange={(e) => setSearchText(e.target.value)} // Updates search text
            style={{
              width: 200, // Width of the search field
              marginRight: "10px", // Right margin
              fontSize: "12px", // Font size inside the search field
              height: "32px", // Height of the search field
              display: "flex",
              alignItems: "center" // Align items inside the search field
            }}
            InputProps={{
              style: { height: "32px", padding: "0 8px", color: "#fff", border: '1px solid white' },
            }}
          />

          {/* Category filter label and dropdown */}
          <Typography
            variant="body1"
            style={{
              flexGrow: 1,
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
            }}
          >
            Category:
            {/* FormControl component to wrap the category dropdown */}
            <FormControl
              size="small"
              style={{
                minWidth: 120, // Minimum width of the dropdown
                marginRight: "10px", // Right margin of the dropdown
                height: "32px", // Height of the dropdown
                display: "flex",
                alignItems: "center", // Aligns the dropdown inside the toolbar
              }}
            >
              <Select
                value={category} // Controlled value for category
                onChange={(e) => setCategory(e.target.value)} // Updates the selected category
                style={{
                  height: "32px", // Height of the dropdown
                  fontSize: "12px", // Font size in the dropdown
                  padding: "0 8px", // Padding inside the dropdown
                  color: "#fff", // White text color
                  minWidth: 120, // Minimum width of the dropdown
                  border: '1px solid #fff' // Border color for the dropdown
                }}
                aria-label="Filter by category"
              >
                <MenuItem value="">All</MenuItem>
                {/* Render category options */}
                {categoryList.map((el) => {
                  return <MenuItem key={el} value={el}>{el}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Typography>

          {/* Show these buttons only on "manageProduct" page */}
          {page === "manageProduct" && (
            <>
              {/* Button to add a new product */}
              <Button
                variant="contained"
                color="info"
                style={{
                  fontSize: "12px",
                  padding: "0 8px",
                  margin: 5,
                  height: "32px",
                }}
                onClick={openAdd} // Trigger the function to add a new product
              >
                Add New Product
              </Button>

              {/* Button to open the demand forecast modal */}
              <Button
                variant="contained"
                color="info"
                style={{
                  fontSize: "12px",
                  padding: "0 8px",
                  margin: 5,
                  height: "32px",
                }}
                sx={{
                  '&.Mui-disabled': {
                    border: '1px solid #0288d1',
                    color: '#fff'
                  }
                }}
                onClick={openDemandForecast} // Trigger the function to show the demand forecast modal
                disabled={!selectedProducts.length} // Disable the button if no products are selected
              >
                Demand Forecast
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    );
  }
);

export default Navbar;
