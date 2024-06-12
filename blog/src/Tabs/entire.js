import React from 'react';
import { Grid, Container } from '@mui/material';
import SliderContainer from "../layouts/SliderContainer";
import RecentArt from "../components/RecentArt";
import PopularArt from "../components/PopularArt";
import RecommanQuiz from "../components/remmandQuiz"
import test1 from "../components/onlytest";

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
          <PopularArt />
      </Container>
    </Grid>
    <Grid item xs={12}>
      <Container style={{ maxWidth: '80%' }}>
          <test1 />
      </Container>
    </Grid>
  </Grid>
);

export default EnterPage;