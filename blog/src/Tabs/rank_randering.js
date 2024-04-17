import React, { useState } from "react";
import "./mainpage.css"

const Popularity = () => {
    // 정적 데이터
    const allData = [
        { id: 1, imageUrl: "https://via.placeholder.com/150", title: "누구 고를 건데?", likes: 10000, dislikes: 200 },
        { id: 2, imageUrl: "https://via.placeholder.com/150", title: "롤하다가 지면 누구 탓 할거냐?", likes: 8000, dislikes: 500 },
        { id: 3, imageUrl: "https://via.placeholder.com/150", title: "제목 미정", likes: 6700, dislikes: 300 },
        { id: 4, imageUrl: "https://via.placeholder.com/150", title: "제목 미정", likes: 5000, dislikes: 100 },
        { id: 5, imageUrl: "https://via.placeholder.com/150", title: "제목 미정", likes: 3000, dislikes: 600 },
        { id: 6, imageUrl: "https://via.placeholder.com/150", title: "일단 정적 데이터 처리로 이렇게 나타냄", likes: 2000, dislikes: 300 },
        { id: 7, imageUrl: "https://via.placeholder.com/150", title: "제목 미정", likes: 1500, dislikes: 200 },
        { id: 8, imageUrl: "https://via.placeholder.com/150", title: "제목 미정", likes: 1200, dislikes: 100 },
        { id: 9, imageUrl: "https://via.placeholder.com/150", title: "제목 미정", likes: 800, dislikes: 50 },
        { id: 10, imageUrl: "https://via.placeholder.com/150", title: "제목 미정", likes: 500, dislikes: 30 }
    ];

    // 정렬된 데이터 가져오기
    const sortedData = allData.slice().sort((a, b) => b.likes - a.likes); // 좋아요 수로 내림차순 정렬

    // 상위 6개의 데이터 추출
    const topSixData = sortedData.slice(0, 6);

    return (
        <div>
            <h2 className="rank_title">현재 인기 랭킹</h2>
            <ul>
                {topSixData.map((item) => (
                    <li key={item.id} className="rank_title_under_text">{item.title}</li>
                ))}
            </ul>
        </div>
    );
}

export default Popularity;
