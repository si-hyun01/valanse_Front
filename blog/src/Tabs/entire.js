import React from 'react';
import { Grid, Container } from '@mui/material'; // 또는 사용 중인 UI 라이브러리의 Grid, Container 컴포넌트를 import
import SliderContainer from "../layouts/SliderContainer";
import Popularity from "../Tabs/rank_randering";
import RecentArt from "../components/RecentArt";
import PopularArt from "../components/PopularArt";

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
  </Grid>
);

export default EnterPage;