import React from "react";
import { useNavigate } from "react-router-dom";

const MainAll = () => {
    const navigate = useNavigate();

    const handleAllClick = () => {
        // 홈페이지의 메인 주소로 이동합니다.
        navigate("/");
    };

    return (
        <div>
            {/* 전체 탭을 클릭했을 때 handleAllClick 함수를 실행합니다. */}
            <button onClick={handleAllClick}>전체</button>
            {/* 다른 내용을 추가할 수 있습니다. */}
        </div>
    );
};

export default MainAll;
