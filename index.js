// const express = require('express');
// const mysql = require('mysql');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const app = express();
// const port = 80;

// app.use(bodyParser.json());
// app.use(cors()); // CORS 미들웨어 설정

// // 모든 요청을 로깅하는 미들웨어 추가
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   next();
// });

// // MySQL 연결 설정
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'wjddlsgh9890',
//   database: 'madcamp_week2_db'
// });

// db.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log('MySQL Connected...');
// });

// // 라우트 설정
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// // 사용자 추가 라우트
// app.post('/user', (req, res) => {
//   let user = { name: req.body.name, email: req.body.email };
//   let sql = 'INSERT INTO users SET ?';
//   db.query(sql, user, (err, result) => {
//     if (err) throw err;
//     res.send('User added...');
//   });
// });

// // MUSIC 테이블 조회 라우트
// app.get('/music', (req, res) => {
//   console.log('Received request for /music');
//   let sql = 'SELECT * FROM MUSIC';
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching music:', err);
//       res.status(500).send('Error fetching music');
//       return;
//     }
//     console.log('Fetched music:', results);
//     res.json(results);
//   });
// });

// // 서버 시작
// app.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });



// py 연동

// const express = require('express');
// const bodyParser = require('body-parser');
// const { spawn } = require('child_process'); // child_process 모듈을 불러옴
// const cors = require('cors');

// const app = express();
// const port = 80;

// app.use(bodyParser.json());
// app.use(cors());

// music = 30
// user = 3

// function getRandomInt(min, max) {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// // 예제 행렬 생성
// const matrix = Array.from({ length: user }, () => Array.from({ length: music }, () => getRandomInt(1, 5)));

// Python 스크립트 실행 라우트
// app.get('/run-python', (req, res) => {
//   const matrixJson = JSON.stringify(matrix);

//   const python = spawn('python3', ['recommend.py', matrixJson]); // Python 스크립트에 JSON 문자열 전달

//   python.stdout.on('data', (data) => {
//     console.log(`stdout: ${data}`);
//     const result = JSON.parse(data);
//     res.json(result);
//   });

//   python.stderr.on('data', (data) => {
//     console.error(`stderr: ${data}`);
//     res.status(500).send(`Error: ${data}`);
//   });

//   python.on('close', (code) => {
//     console.log(`child process exited with code ${code}`);
//   });
// });

// // 서버 시작
// app.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });

const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const app = express();
const port = 80;

// Python 스크립트를 실행하여 결과를 반환하는 함수
function getRecommend(user) {
  return new Promise((resolve, reject) => {
    const python = spawn('python3', ['python/recommend.py', user]);
    
    let data = '';
    
    python.stdout.on('data', (chunk) => {
      data += chunk;
    });

    python.stderr.on('data', (error) => {
      reject(error.toString());
    });

    python.on('close', (code) => {
      if (code !== 0) {
        reject(`Python script exited with code ${code}`);
      } else {
        resolve(data.trim()); // 결과 문자열 반환
      }
    });
  });
}

// Python 스크립트를 실행하여 결과를 반환하는 함수
function adduser(user) {
  return new Promise((resolve, reject) => {
    const python = spawn('python3', ['python/newuser.py', user]);
    
    let data = '';
    
    python.stdout.on('data', (chunk) => {
      data += chunk;
    });

    python.stderr.on('data', (error) => {
      reject(error.toString());
    });

    python.on('close', (code) => {
      if (code !== 0) {
        reject(`Python script exited with code ${code}`);
      } else {
        resolve(data.trim()); // 결과 문자열 반환
      }
    });
  });
}


app.get('/music', async (req, res) => {
  console.log("Received request for music");
  user = 1;
  try {
    const Filename = await getRecommend(user);
    console.log(`${Filename}`);
    const filePath = path.join(__dirname, 'music', `${Filename}.mp3`);

    res.set('Content-Type', 'audio/mpeg'); // 적절한 Content-Type 설정

    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        if (err.code === 'ENOENT') {
          // 파일이 존재하지 않는 경우 404 반환
          res.status(404).send('File not found');
        } else if (!res.headersSent) {
          res.status(500).send('Error sending file');
        }
      }
    }
  );
  } catch (error) {
    console.error('Error executing Python script:', error);
    res.status(500).send('Error executing Python script');
  }
});

app.get('/music_image', async (req, res) => {
  console.log("Received request for music image");
  
  try {
    const Filename = await getRandomNumberFromPython(1);
    console.log(`${Filename}`);
    const filePath = path.join(__dirname, 'image', `${Filename}.jpg`);

    res.set('Content-Type', 'image/jpeg'); // 적절한 Content-Type 설정

    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        if (err.code === 'ENOENT') {
          // 파일이 존재하지 않는 경우 404 반환
          res.status(404).send('File not found');
        } else if (!res.headersSent) {
          res.status(500).send('Error sending file');
        }
      }
    }
  );
  } catch (error) {
    console.error('Error executing Python script:', error);
    res.status(500).send('Error executing Python script');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
