import React, { useState, useEffect } from "react";
import { Card, IconButton } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Life1 from "./img/Life_Quotes1.png";
import Life2 from "./img/Life_Quotes2.png";
import Life3 from "./img/Life_Quotes3.png";
import Life4 from "./img/Life_Quotes4.png";
import Life5 from "./img/Life_Quotes5.png";
import Life6 from "./img/Life_Quotes6.png";
import Life7 from "./img/Life_Quotes7.png";

const preloadImages = [Life1, Life2, Life3, Life4, Life5, Life6, Life7].map(
  (image) => {
    const img = new Image();
    img.src = image;
    return img;
  }
);

const cards = [
  { src: Life1, alt: "이미지 1" },
  { src: Life2, alt: "이미지 2" },
  { src: Life3, alt: "이미지 3" },
  { src: Life4, alt: "이미지 4" },
  { src: Life5, alt: "이미지 5" },
  { src: Life6, alt: "이미지 6" },
  { src: Life7, alt: "이미지 7" },
];

const cardWidth = 550;

const SliderContainer = () => {
  const [centerIndex, setCenterIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCenterIndex((prevIndex) => (prevIndex + 1) % cards.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrevSlide = () => {
    setCenterIndex((prevIndex) =>
      prevIndex === 0 ? cards.length - 1 : prevIndex - 1
    );
  };

  const handleNextSlide = () => {
    setCenterIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const getCardStyle = (position) => {
    let transform, zIndex, opacity;

    switch (position) {
      case "center":
        transform = "translateX(0) scale(1.2)";
        zIndex = 2;
        opacity = 1;
        break;
      case "left":
        transform = `translateX(-${cardWidth / 2}px) scale(1)`;
        zIndex = 1;
        opacity = 0.8;
        break;
      case "right":
        transform = `translateX(${cardWidth / 2}px) scale(1)`;
        zIndex = 1;
        opacity = 0.8;
        break;
      default:
        transform = "translateX(0) scale(1)";
        zIndex = 0;
        opacity = 0;
    }

    return {
      transform,
      transition: "transform 1s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 1s",
      zIndex,
      borderRadius: "20px",
      width: `${cardWidth}px`,
      height: "400px",
      position: "absolute",
      opacity,
    };
  };

  const leftIndex = (centerIndex - 1 + cards.length) % cards.length;
  const rightIndex = (centerIndex + 1) % cards.length;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "700px",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: "20px", // 하단 여백 조절
          zIndex: 3, // 다른 요소 위에 표시되도록 설정
        }}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            style={{
              width: "20px", // 사각형 너비 조절
              height: "8px", // 사각형 높이 조절
              backgroundColor: index === centerIndex ? "blue" : "gray", // 활성화된 슬라이드는 검은색, 비활성화된 슬라이드는 회색
              borderRadius: "0px", // 사각형을 원 모양으로 만들기 위해 반지름 설정
              margin: "0 5px", // 사각형 간격 조절
              display: "inline-block", // 인라인 요소로 표시하여 수평으로 정렬
            }}
          ></div>
        ))}
      </div>
      {cards.map((card, index) => {
        let position = "";
        if (index === centerIndex) {
          position = "center";
        } else if (index === leftIndex) {
          position = "left";
        } else if (index === rightIndex) {
          position = "right";
        }

        return (
          <Card key={index} style={getCardStyle(position)}>
            <img
              src={card.src}
              alt={card.alt}
              style={{ width: "100%", height: "100%", borderRadius: "20px" }}
            />
          </Card>
        );
      })}
      <IconButton
        onClick={handlePrevSlide}
        sx={{
          position: "absolute",
          top: "50%",
          left: "20px",
          transform: "translateY(-50%)",
          zIndex: 3,
          color: "inherit",
          bgcolor: "rgba(255, 255, 255, 0.8)",
          width: "50px", // 버튼 너비 조절
          height: "50px", // 버튼 높이 조절
          p: "10px", // 내부 여백 조절
          "&:hover": {
            bgcolor: "rgba(255, 255, 255, 1)", // hover시 배경색 변경
          },
        }}
      >
        <KeyboardArrowLeftIcon fontSize="large" />
      </IconButton>
      <IconButton
        onClick={handleNextSlide}
        sx={{
          position: "absolute",
          top: "50%",
          right: "20px",
          transform: "translateY(-50%)",
          zIndex: 3,
          color: "inherit",
          bgcolor: "rgba(255, 255, 255, 0.8)",
          width: "50px", // 버튼 너비 조절
          height: "50px", // 버튼 높이 조절
          p: "10px", // 내부 여백 조절
          "&:hover": {
            bgcolor: "rgba(255, 255, 255, 1)", // hover시 배경색 변경
          },
        }}
      >
        <KeyboardArrowRightIcon fontSize="large" />
      </IconButton>
    </div>
  );
};

export default SliderContainer;