import React, { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
    Legend,
    Title,
} from "chart.js";
import { Line } from "react-chartjs-2"; // Line chart component from react-chartjs-2
import axios from "axios"; // HTTP client for API requests
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material"; // Material-UI components for the table
import notification from "../store/NotificationStore"; // MobX store for managing notifications

// Register required Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
    Legend,
    Title
);

const DemandForecastChart = ({ selectedProducts }) => {
    const [data, setData] = useState([]); // State to store API data
    console.log("Selected Products",selectedProducts)
    // Table headers
    const headers = [
        "Product Name",
        "Category",
        "Cost Price",
        "Selling Price",
        "Available Stock",
        "Units Sold",
        "Calculated Demand Forecast",
    ];

    // Fetch demand forecast data on component mount
    useEffect(() => {
        
        console.log("In First Component Mount Useeffect")
        console.log(DemandForecastChart)
        axios
            .post("/pricing/demand-forecast/", { ids: selectedProducts })
            .then((res) => {
                setData(res.data); // Update state with API response
            })
            .catch((err) => {
                notification.addNotification({
                    open: true,
                    message: "Unable to fetch Demand Forecast View!",
                });
            })
    }, []);

    // Extract unique years and product names from the data
    const years = [...new Set(data.map((item) => item.product_added_year))].sort(
        (a, b) => b - a
    );
    const productNames = [...new Set(data.map((item) => item.product_name))];

    // Prepare chart datasets for demand forecast and selling price
    
    const demandForecastData = productNames.map((productName) => {
        const item = data.find((d) => d.product_name === productName);
        return item ? item.demand_forecast : 0;
    });


    const sellingPriceData = productNames.map((productName) => {
        const item = data.find((d) => d.product_name === productName);
        return item ? item.product_selling_price : 0;
    });

    // Chart configuration
    const chartData = {
        labels: productNames, // Product names as x-axis labels
        datasets: [
            {
                label: "Demand Forecast",
                data: demandForecastData,
                borderColor: "purple",
                backgroundColor: "rgba(128, 0, 128, 0.5)",
                fill: false,
                tension: 0.4,
                yAxisID: "y-axis-demand", // Maps to a specific y-axis
            },
            {
                label: "Selling Price",
                data: sellingPriceData,
                borderColor: "green",
                backgroundColor: "rgba(0, 255, 0, 0.5)",
                fill: false,
                tension: 0.4,
                yAxisID: "y-axis-selling", // Maps to a specific y-axis
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top", // Position of the legend
            },
            title: {
                display: true,
                text: "Demand Forecast vs Selling Price by Product and Year",
            },
        },
        layout: {
            padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Products",
                },
            },
            y: {
                type: "category", // Year-based categories
                labels: years.map((year) => year.toString()), // Use years as labels
                position: "left",
                title: {
                    display: true,
                    text: "Years",
                },
                reverse: true, // Reverse order for years
            },
            "y-axis-right": {
                type: "linear",
                position: "right",
                title: {
                    display: true,
                    text: "Demand Forecast & Selling Price Scale",
                },
                ticks: {
                    display: false,
                },
                grid: {
                    drawOnChartArea: false, // Avoid overlapping grids
                },
            },
        },
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "95%",
                padding: "10px",
                overflowY: "auto",
            }}
        >
            {/* Chart Section */}
            <div
                style={{
                    flex: 3,
                    minHeight: "150px",
                    maxHeight: "45vh",
                    width: "100%",
                    maxWidth: "100%",
                    margin: "0 auto",
                }}
            >
                <Line data={chartData} options={options} /> {/* Render line chart */}
            </div>

            {/* Table Section */}
            <div
                style={{
                    flex: 2,
                    maxHeight: "30vh",
                }}
            >
                <TableContainer component={Paper} style={{ maxHeight: "30vh", overflowY: "auto" }}>
                    <Table stickyHeader style={{ tableLayout: "auto", width: "100%" }}>
                        <TableHead>
                            <TableRow>
                                {headers.map((header, index) => (
                                    <TableCell
                                        key={index}
                                        align="center"
                                        style={{ fontWeight: "bold", fontSize: "10px" }}
                                    >
                                        {header.toUpperCase()} {/* Display headers in uppercase */}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {Object.keys(data[0]).map((key, colIndex) => (
                                        key !== "product_added_year" && (
                                            <TableCell
                                                key={colIndex}
                                                align="center"
                                                style={{ fontSize: "10px" }}
                                            >
                                                {row[key]} {/* Render row data */}
                                            </TableCell>
                                        )
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
};

export default DemandForecastChart; // Export the component
