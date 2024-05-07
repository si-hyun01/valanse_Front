import React from 'react';
import { Grid, Container } from '@mui/material'; // 또는 사용 중인 UI 라이브러리의 Grid, Container 컴포넌트를 import

import SliderContainer from "../layouts/SliderContainer";
import ScaleImage from "../layouts/img/scale.gif";
import Popularity from "../Tabs/rank_randering";

const EnterPage = () => (
  <Container maxWidth="xl" style={{ marginTop: '10px' }}>
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={8}>
        {/* 좌측에 SliderContainer 배치 */}
        <SliderContainer />
      </Grid>
      <Grid item xs={4}>
        {/* 우측에 인기랭킹 배치 */}
        <Popularity />
      </Grid>
      <Grid item xs={12}>
        {/* 아래쪽에 저울 이미지 배치 */}
        <img
          src={ScaleImage}
          alt="저울 이미지"
          style={{ width: '50%', height: 'auto' }}
        />
      </Grid>
    </Grid>
  </Container>
);

export default EnterPage;
