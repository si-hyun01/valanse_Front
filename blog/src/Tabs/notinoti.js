import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
} from '@mui/material';
import AnnouncementEditor from '../layouts/Layout';

function App() {
  const [announcements, setAnnouncements] = useState([]);

  const handleAnnouncementSubmit = (announcementText) => {
    setAnnouncements([...announcements, announcementText]);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            공지 관리 시스템
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box mt={4}>
          <AnnouncementEditor onAnnouncementSubmit={handleAnnouncementSubmit} />
        </Box>
        <Box mt={4}>
          <Typography variant="h4" gutterBottom>
            공지 목록
          </Typography>
          {announcements.map((announcement, index) => (
            <Typography key={index} variant="body1">
              {announcement}
            </Typography>
          ))}
        </Box>
      </Container>
    </div>
  );
}

export default App;
