import React, { useState, useEffect } from "react";
import { Card } from "@mui/material";
import Life1 from "./img/Life_Quotes1.png";
import Life2 from "./img/Life_Quotes2.png";
import Life3 from "./img/Life_Quotes3.png";
import Life4 from "./img/Life_Quotes4.png";
import Life5 from "./img/Life_Quotes5.png";
import Life6 from "./img/Life_Quotes6.png";
import Life7 from "./img/Life_Quotes7.png";

// 모든 이미지를 웹에 미리 로드. 왜나하면 사진 용량이 커서 늦게 나타남 
const preloadImages = [Life1, Life2, Life3, Life4, Life5, Life6, Life7].map(image => {
  const img = new Image();
  img.src = image;
  return img;
});

const cards = [
  { src: Life1, alt: "이미지 1" },
  { src: Life2, alt: "이미지 2" },
  { src: Life3, alt: "이미지 3" },
  { src: Life4, alt: "이미지 4" },
  { src: Life5, alt: "이미지 5" },
  { src: Life6, alt: "이미지 6" },
  { src: Life7, alt: "이미지 7" }
];

const cardWidth = 550; // 카드의 너비 조정

const SliderContainer = () => {
  const [centerIndex, setCenterIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCenterIndex(prevIndex => (prevIndex + 1) % cards.length);
    }, 5000); // 5초마다 변경
    return () => clearInterval(interval);
  }, []);

  const getCardStyle = (position) => {
    let transform, zIndex, opacity;

    switch (position) {
      case 'center':
        transform = 'translateX(0) scale(1.2)';
        zIndex = 2;
        opacity = 1;
        break;
      case 'left':
        transform = `translateX(-${cardWidth / 2}px) scale(1)`; // 카드 너비의 절반만큼 왼쪽으로 이동
        zIndex = 1;
        opacity = 0.8;
        break;
      case 'right':
        transform = `translateX(${cardWidth / 2}px) scale(1)`; // 카드 너비의 절반만큼 오른쪽으로 이동
        zIndex = 1;
        opacity = 0.8;
        break;
      default:
        transform = 'translateX(0) scale(1)';
        zIndex = 0;
        opacity = 0;
    }

    return {
      transform,
      transition: 'transform 1s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 1s',
      zIndex,
      borderRadius: '20px',
      width: `${cardWidth}px`, // 카드의 너비를 조정
      height: '400px', // Adjust the card height
      position: 'absolute',
      opacity
    };
  };

  const leftIndex = (centerIndex - 1 + cards.length) % cards.length;
  const rightIndex = (centerIndex + 1) % cards.length;

  return (
    <div style={{ position: 'relative', width: '100%', height: '700px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {cards.map((card, index) => {
        let position = '';
        if (index === centerIndex) {
          position = 'center';
        } else if (index === leftIndex) {
          position = 'left';
        } else if (index === rightIndex) {
          position = 'right';
        }

        return (
          <Card key={index} style={getCardStyle(position)}>
            <img src={card.src} alt={card.alt} style={{ width: '100%', height: '100%', borderRadius: '20px' }} />
          </Card>
        );
      })}
    </div>
  );
}

export default SliderContainer;
