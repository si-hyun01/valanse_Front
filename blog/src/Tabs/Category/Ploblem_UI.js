import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://54.180.170.88:8080/quiz/1')
      .then(response => response.text())
      .then(text => setData(text))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>아아아아아아...ㅋㅋ..ㅋㅋ아...로컬로 콘솔확인을 못해서 깃헙푸시하다가 디자인이 다 날라갔네..아 ㅋㅋㅋ 씨</h1>
      {data ? <p>{data}</p> : <p>Loading...</p>}
    </div>
  );
}

export default App;
