import React from 'react';
import { Grid, Container } from '@mui/material';
import SliderContainer from "../layouts/SliderContainer";
import RecentArt from "../components/RecentArt";
import PopularArt from "../components/PopularArt";
import RecommanQuiz from "../components/remmandQuiz"
import CheckUserAnswer from "../components/onlytest";

const EnterPage = () => (
  <Grid container spacing={1} alignItems="center" style = {{ background : "black"}}>
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
  </Grid>
);

export default EnterPage;