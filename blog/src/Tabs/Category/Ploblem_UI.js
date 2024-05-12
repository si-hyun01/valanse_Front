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
      <h1>데이터 출력</h1>
      {data ? <p>{data}</p> : <p>Loading...</p>}
    </div>
  );
}

export default App;
