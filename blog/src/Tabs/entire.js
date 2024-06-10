import React from 'react';
import { Grid, Container } from '@mui/material';
import SliderContainer from "../layouts/SliderContainer";
import Popularity from "../Tabs/rank_randering";
import RecentArt from "../components/RecentArt";

const EnterPage = () => (
  <Grid container spacing={1} alignItems="center">
    <Grid item xs={12}>
    <div style={{ backgroundColor: '#333333' }}>
        <SliderContainer />
      </div>
    </Grid>
    <Grid item xs={12}>
      <Container style={{ maxWidth: '80%' }}>
          <RecentArt />
      </Container>
    </Grid>
    <Grid item xs={12}>
      <Container style={{ maxWidth: '80%' }}> 
          <Popularity />
      </Container>
    </Grid>
  </Grid>
);

export default EnterPage;