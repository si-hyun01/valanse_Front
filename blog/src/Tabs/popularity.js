import React, { useState } from "react";

const Popularity = () => {
    // 정적 데이터
    const allData = [
        { id: 1, imageUrl: "https://via.placeholder.com/150", title: "첫 번째 사진 제목", likes: 10000, dislikes: 200 },
        { id: 2, imageUrl: "https://via.placeholder.com/150", title: "두 번째 사진 제목", likes: 8000, dislikes: 500 },
        { id: 3, imageUrl: "https://via.placeholder.com/150", title: "세 번째 사진 제목", likes: 6700, dislikes: 300 },
        { id: 4, imageUrl: "https://via.placeholder.com/150", title: "네 번째 사진 제목", likes: 5000, dislikes: 100 },
        { id: 5, imageUrl: "https://via.placeholder.com/150", title: "다섯 번째 사진 제목", likes: 3000, dislikes: 600 },
        { id: 6, imageUrl: "https://via.placeholder.com/150", title: "여섯 번째 사진 제목", likes: 2000, dislikes: 300 },
        { id: 7, imageUrl: "https://via.placeholder.com/150", title: "일곱 번째 사진 제목", likes: 1500, dislikes: 200 },
        { id: 8, imageUrl: "https://via.placeholder.com/150", title: "여덟 번째 사진 제목", likes: 1200, dislikes: 100 },
        { id: 9, imageUrl: "https://via.placeholder.com/150", title: "아홉 번째 사진 제목", likes: 800, dislikes: 50 },
        { id: 10, imageUrl: "https://via.placeholder.com/150", title: "열 번째 사진 제목", likes: 500, dislikes: 30 }
    ];

    // 페이지와 페이지 크기 상태
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5; // 페이지당 항목 수

    // 현재 페이지에 해당하는 데이터 슬라이싱
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const data = allData.slice(startIndex, endIndex);

    // 페이지 변경 핸들러: 다음 페이지로 이동
    const handleNextPage = () => {
        if (endIndex < allData.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    // 페이지 변경 핸들러: 이전 페이지로 이동
    const handlePreviousPage = () => {
        if (startIndex > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                    {/* 정적 데이터를 기반으로 각 행을 정적으로 생성 */}
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td style={{ width: '50px', verticalAlign: 'middle', textAlign: 'center', border: '1px solid #dee2e6' }}>{item.id}</td>
                            <td style={{ width: '400px', border: '1px solid #dee2e6', borderRight: 'none' }}>
                                {/* 사진과 제목을 함께 표시하는 컴포넌트 */}
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <img src={item.imageUrl} alt={item.title} style={{ marginRight: '10px', width: '150px', height: 'auto' }} />
                                    <div>
                                        <h5>{item.title}</h5>
                                    </div>
                                </div>
                            </td>
                            <td style={{ width: '200px', verticalAlign: 'bottom', textAlign: 'right', border: '1px solid #dee2e6', borderLeft: 'none', paddingTop: '20px' }}>
                                {/* 좋아요와 싫어요 표시 */}
                                <div style={{ minWidth: '100px' }}>
                                    <div style={{ fontSize: '12px', marginRight: '10px' }}>좋아요: {item.likes} 싫어요: {item.dislikes}</div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* 페이지네이션 UI */}
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <button onClick={handlePreviousPage} disabled={startIndex === 0}>이전 페이지</button>
                <button onClick={handleNextPage} disabled={endIndex >= allData.length}>다음 페이지</button>
            </div>
        </div>
    );
}

export default Popularity;
