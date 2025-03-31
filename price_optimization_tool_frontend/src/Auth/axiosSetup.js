// Import configuration data (e.g., backend URL), axios for HTTP requests, and sessionStore for managing user session
import ConstData from '../config.json'
import axios from 'axios'
import sessionStore from '../store/SessionStore'

// Set up an interval that checks every 2 minutes if the user is logged in
// If logged in, refresh the session token to keep the user authenticated
setInterval(() => {
    if (sessionStore.isLoggedIn) {  // Check if the user is logged in
        sessionStore.refreshToken() // Refresh the session token
    }
}, 1000 * 45 * 60)  // Interval of 45 minutes (in milliseconds)

// Default export function to set up axios configurations
export default function axiosSetup() {
    // Set the base URL for all axios requests from the configuration file
    axios.defaults.baseURL = ConstData.backendUrl

    // Set up an axios request interceptor to automatically attach authorization token if available
    axios.interceptors.request.use(
        function (config) {
            // Check if the user has an access token
            if (sessionStore.user.access) {
                // If access token is present, attach it as a Bearer token in the request headers
                config.headers.Authorization = `Bearer ${sessionStore.user.access}`
            }
            return config  // Return the modified request config
        },
        function (error) {
            // If there is an error with the request, reject the promise and propagate the error
            return Promise.reject(error)
        }
    )
}
