import * as React from 'react'; // Importing React for component creation
import Snackbar from '@mui/material/Snackbar'; // Snackbar component from Material-UI for notifications
import { observer } from 'mobx-react-lite'; // Observer to reactively bind MobX state to React components

// CustomSnackbar: Displays a notification using Material-UI's Snackbar
const CustomSnackbar = observer(({ message }) => {
  const closeMessage = () => message.closeNotification(); // Function to close the notification

  return (
    message.notification.open && ( // Render Snackbar only when a notification is open
      <div>
        <Snackbar
          open={true} // Snackbar is always open when rendered
          autoHideDuration={5000} // Automatically hides after 5 seconds
          message={message.message} 
          anchorOrigin={{
            vertical: 'bottom', 
            horizontal: 'right' 
          }}
          onClose={closeMessage} 
        />
      </div>
    )
  );
});

export default CustomSnackbar;
