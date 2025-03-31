import React from "react"; // Importing React for creating components
import { Navigate } from 'react-router-dom'; // Navigate component for redirecting users
import sessionStore from "./store/SessionStore"; // Importing session store to manage user login state

// PrivateRoute: A component to protect routes and restrict access to authenticated users
const PrivateRoute = ({ element: Component, ...rest }) => {
    if (sessionStore.isLoggedIn) {
        // If the user is logged in, render the requested component
        return <Component {...rest} />;
    } else {
        // If the user is not logged in, redirect to the home page
        return <Navigate to="/" />;
    }
};

export default PrivateRoute; // Exporting the PrivateRoute component
