import React from "react";
import { Modal, Box, Typography, IconButton } from "@mui/material"; // Material-UI components
import CloseIcon from "@mui/icons-material/Close"; // Close icon for modal
import DemandForecastChart from "./DemandForecastChart"; // Chart component for demand forecast visualization

/*
 Modal component to display the demand forecast chart for selected products.
*/
const DemandForecastModal = ({ open, handleClose, selectedProducts }) => {
  console.log("selectedProducts",selectedProducts)
  return (
    <Modal open={open} onClose={handleClose}>
      {/* Modal container styling */}
      <Box
        sx={{
          width: "80%",
          margin: "50px auto",
          backgroundColor: "#1e1e2f", // Dark background for the modal
          color: "#fff", // White text for contrast
          padding: "20px",
          borderRadius: "10px",
          height: "80%", // Full-screen height for better visualization
        }}
      >
        {/* Header with title and close button */}
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ height: "20px" }}>
          <Typography variant="body1">Demand Forecast</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon sx={{ color: "#fff" }} /> {/* Close icon */}
          </IconButton>
        </Box>
        {/* Chart component to visualize demand forecast */}
        <DemandForecastChart selectedProducts={selectedProducts} />
      </Box>
    </Modal>
  );
};

export default DemandForecastModal;
