import React from 'react';
import { Container, Grid, Typography, Card, CardContent, CardActionArea, Button } from '@mui/material'; // Material UI components
import { useNavigate } from 'react-router-dom'; // React Router for navigation
import ViewInArIcon from '@mui/icons-material/ViewInAr'; // Icon for product management
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; // Icon for forward navigation
import PeopleIcon from '@mui/icons-material/People'; // Icon for pricing optimization
import LoginIcon from '@mui/icons-material/Login'; // Icon for login
import AppRegistrationIcon from '@mui/icons-material/AppRegistration'; // Icon for registration

/*
 Dashboard component that displays a landing page or main dashboard depending on the 'page' prop.
*/
const Dashboard = ({ page }) => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <Container className='App-header'>
      {/* Main Title */}
      <Typography variant="h4" gutterBottom style={{ marginTop: '20px' }}>
        Price Optimization Tool
      </Typography>

      {/* Render different UI based on the 'page' prop */}
      {page === "landing" ? (
        <>
          {/* Login Button */}
          <Button
            color="inherit"
            onClick={() => navigate("/login")}
            variant='outlined'
            style={{ marginBottom: '15px' }}
          >
            <LoginIcon fontSize="small" marginRight='5px' />
            Login
          </Button>

          {/* Register Button */}
          <Button
            color="inherit"
            variant='outlined'
            onClick={() => navigate("/register")}
          >
            <AppRegistrationIcon fontSize="small" marginRight='5px' />
            Register
          </Button>
        </>
      ) : (
        <>
          {/* Subtitle for dashboard modules */}
          <Typography variant="subtitle1" gutterBottom>
            Use the following modules to manage products, optimize pricing, and forecast demand.
          </Typography>

          {/* Grid layout for dashboard cards */}
          <Grid container spacing={3} style={{ marginTop: '30px', justifyContent: 'center' }}>
            {/* Product Management Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardActionArea onClick={() => navigate('/products')}>
                  <CardContent>
                    <ViewInArIcon fontSize='large' />
                    <Typography variant="h5" margin='20px 0'>
                      Create and Manage Products
                    </Typography>
                    <Typography variant="body2">
                      Add, update, and manage product information including stock and pricing details.
                    </Typography>
                    <br />
                    <ArrowForwardIcon fontSize='large' />
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>

            {/* Pricing Optimization Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardActionArea onClick={() => navigate('/pricing')}>
                  <CardContent>
                    <PeopleIcon fontSize='large' />
                    <Typography variant="h5" margin='20px 0'>
                      Pricing Optimization
                    </Typography>
                    <Typography variant="body2">
                      Optimize pricing strategies based on demand forecasts and market conditions.
                    </Typography>
                    <br />
                    <ArrowForwardIcon fontSize='large' />
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default Dashboard;
