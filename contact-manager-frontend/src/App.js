import React, { useState } from 'react';
import { Container, Typography, Button } from '@mui/material';
import ContactsList from './components/ContactsList';
import AddContactDialog from './components/AddContactDialog';
import './App.css';

function App() {

  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // This can be called after a contact is added, to trigger re-fetch
  const handleContactAdded = () => {
    setRefreshFlag((prev) => !prev);
    // toggling refreshFlag will cause a useEffect re-run in <ContactsList>
    handleCloseDialog();
  };

  return (
    <div className="App">
      <header className="App-header">
        <Typography variant="h4">
          Contact Manager
        </Typography>
      </header>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Button to open the dialog */}
        <Button variant="contained" onClick={handleOpenDialog}>
          Add Contact
        </Button>

        {/* The Add Contact Dialog */}
        <AddContactDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          onContactAdded={handleContactAdded}
        />

        {/* Pass refreshFlag to re-fetch contacts when it changes */}
        <ContactsList refreshFlag={refreshFlag} />
      </Container>
    </div>
  );
}

export default App;
