import React, { useState } from "react"; // Import React and useState hook for managing state
import { Button, TextField, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material"; // Import Material UI components

// ProductDialog component accepts props for product data, onClose and onSave handlers, and view mode
const ProductDialog = ({ product, onClose, onSave, view }) => {
    // Initialize form state. If a product is provided, use its values, otherwise initialize with empty strings
    const [form, setForm] = useState(
        product || {
            name: "",
            category: "",
            cost_price: "",
            selling_price: "",
            description: "",
            stock_available: "",
            units_sold: "",
            customer_rating: "",
            optimized_price: "",
            demand_forecast: ""
        }
    );

    // Handle input field changes and update the form state with new values
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <>
            {/* Dialog Title: Dynamic title based on whether a product is being edited or a new product is being added */}
            <DialogTitle>
                {product ? "Edit Product" : "Add New Product"}
            </DialogTitle>

            {/* Dialog Content: Contains the form for entering or editing product details */}
            <DialogContent>
                <form id="product-form">
                    <Grid container spacing={2}> {/* Grid container for form fields */}
                        {/* Product Name field */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Product Name"
                                name="name"
                                defaultValue={form.name || ""} // Default value set from form state
                                onChange={handleChange} // Update form state on change
                                required
                                disabled={view} // Disable the input if in view mode
                            />
                        </Grid>

                        {/* Category field */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Category"
                                name="category"
                                defaultValue={form?.category || ""} // Default value from form state
                                onChange={handleChange}
                                required
                                disabled={view} // Disable the input if in view mode
                            />
                        </Grid>

                        {/* Cost Price field */}
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="number" // Input type for numbers
                                label="Cost Price"
                                name="cost_price"
                                defaultValue={form?.cost_price || ""} // Default value from form state
                                onChange={handleChange}
                                required
                                disabled={view}
                            />
                        </Grid>

                        {/* Selling Price field */}
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="number" // Input type for numbers
                                label="Selling Price"
                                name="selling_price"
                                defaultValue={form?.selling_price || ""} // Default value from form state
                                onChange={handleChange}
                                required
                                disabled={view}
                            />
                        </Grid>

                        {/* Description field */}
                        <Grid item xs={12}>
                            <TextField
                                rows={2} // Multi-line text field
                                label="Description"
                                name="description"
                                value={form.description} // Set the value from form state
                                onChange={handleChange}
                                fullWidth
                                disabled={view}
                                required
                            />
                        </Grid>

                        {/* Stock Available field */}
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="number" // Input type for numbers
                                label="Stock Available"
                                name="stock_available"
                                onChange={handleChange}
                                defaultValue={form?.stock_available || ""} // Default value from form state
                                required
                                disabled={view}
                            />
                        </Grid>

                        {/* Units Sold field */}
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="number" // Input type for numbers
                                label="Units Sold"
                                name="units_sold"
                                onChange={handleChange}
                                defaultValue={form?.units_sold || ""} // Default value from form state
                                required
                                disabled={view}
                            />
                        </Grid>

                        {/* Customer Rating field */}
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="number" // Input type for numbers
                                label="Customer Rating"
                                name="customer_rating"
                                onChange={handleChange}
                                defaultValue={form?.customer_rating || ""} // Default value from form state
                                InputProps={{
                                    inputProps: {
                                        min: 0.1, // Minimum value for customer rating
                                        max: 5,   // Maximum value for customer rating
                                    },
                                }}
                                required
                                disabled={view}
                            />
                        </Grid>

                        {/* Optimized Price field */}
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="number" // Input type for numbers
                                label="Optimized Price"
                                name="optimized_price"
                                onChange={handleChange}
                                defaultValue={form?.optimized_price || ""} // Default value from form state
                                required
                                disabled={view}
                            />
                        </Grid>

                        {/* Demand Forecast field */}
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="number" // Input type for numbers
                                label="Demand Forecast"
                                name="demand_forecast"
                                onChange={handleChange}
                                defaultValue={form?.demand_forecast || ""} // Default value from form state
                                required
                                disabled={view}
                            />
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>

            {/* Dialog Actions: Cancel and Save buttons */}
            <DialogActions>
                {/* Cancel button triggers the onClose function passed as a prop */}
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                {/* Save button triggers the onSave function and is disabled if in view mode */}
                {!view &&
                    <Button
                        onClick={() => onSave(form)} // Save form data to parent component
                        style={{ backgroundColor: "#007bff", color: "#fff" }} // Button style
                    >
                        Save
                    </Button>}
            </DialogActions>
        </>
    );
};

// Export the ProductDialog component as default
export default ProductDialog;
