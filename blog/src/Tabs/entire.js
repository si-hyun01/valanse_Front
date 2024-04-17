import React from 'react';
import { Grid } from '@mui/material'; // 또는 사용 중인 UI 라이브러리의 Grid 컴포넌트를 import

import SliderContainer from "../layouts/SliderContainer";
import ScaleImage from "../layouts/img/scale.gif";
import Popularity from "../Tabs/rank_randering";

const EnterPage = () => (
  <Grid container spacing={2} alignItems="center" style={{ marginTop: '10px' }}>
    <Grid item xs={8}>
      {/* 좌측에 SliderContainer 배치 위한 거*/}
      <SliderContainer />
    </Grid>
    <Grid item xs={4}>
      {/* 우측에 인기랭킹 배치할려고요 */}
      <div>
        <Popularity />
      </div>
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
);

export default EnterPage;
