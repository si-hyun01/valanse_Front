import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Card, CardContent, Typography } from "@mui/material"; // Card 및 관련 컴포넌트 import 추가
import Life1 from "./img/Life_Quotes1.png";
import Life2 from "./img/Life_Quotes2.png";
import Life3 from "./img/Life_Quotes3.png";
import Life4 from "./img/Life_Quotes4.png";
import Life5 from "./img/Life_Quotes5.png";
import Life6 from "./img/Life_Quotes6.png";
import Life7 from "./img/Life_Quotes7.png";

import "../Tabs/mainpage.css";

export default function SliderContainer() {
  const items = [
    { src: Life1 },
    { src: Life2 },
    { src: Life3 },
    { src: Life4 },
    { src: Life5 },
    { src: Life6 },
    { src: Life7 }
  ];

  return (
    <Card elevation={3} className="slider-card" >
      <CardContent style={{ paddingTop: '20px', paddingBottom: '5px' }}>
        <Swiper
          effect={"slide"} // slide 효과로 변경
          autoplay={{
            delay: 7000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Navigation, Pagination, Autoplay]}
          className="mySwiper"
          loop={true}
        >
          {items.map((item, idx) => (
            <SwiperSlide key={idx}>
              <img src={item.src} alt={`이미지 ${idx + 1}`} className="life_quotes" style={{ width: "100%", height: "100%" }} />
            </SwiperSlide>
          ))}
        </Swiper>
        <Typography gutterBottom variant="h5" component="div" align="center" style={{ fontWeight: 'bold', padding: '20px' }}>
          카테고리를 선택하면 게임을 시작할 수 있습니다.
        </Typography>
      </CardContent>
    </Card>
  );
}
