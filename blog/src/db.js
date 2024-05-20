const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'valanse-db.cngiwkyu8qm3.ap-northeast-2.rds.amazonaws.com',
  user: 'root',
  password: 'valanserootdb',
  database: 'valanse',
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as id ' + connection.threadId);

  // Query to get data from the quiz table
  connection.query('SELECT * FROM quiz', (error, results) => {
    if (error) throw error;
    console.log('Data from quiz table: ', results);

    // Close the connection after the query
    connection.end((err) => {
      if (err) {
        console.error('Error ending the connection:', err.stack);
      }
      console.log('Connection ended');
    });
  });
});
