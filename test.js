const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 80;

app.use(bodyParser.json());
app.use(cors()); // CORS 미들웨어 설정

// 모든 요청을 로깅하는 미들웨어 추가
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// MySQL 연결 설정
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sallyshin0619',
  database: 'madcamp_week2_db'
});

db.connect((err) => {
  if (err) {
    console.error('MySQL 연결 오류: ', err);
    throw err;
  }
  console.log('MySQL Connected...');
});

// 사용자 회원여부 확인
app.post('/checkUser', (req, res) => {
    const {login_method, token_id} = req.body;
    console.log(`${login_method}`);
    console.log(`${token_id}`);
    if(login_method == "KAKAO"){
        const sql = 'SELECT COUNT(id) AS cnt FROM USER_INFO WHERE login_method = ? AND login_token_id = ?';
        db.query(sql, ["KAKAO", token_id], (err, results) => {
            if (err) {
              console.error('사용자 조회 오류: ', err);
              res.status(500).send('사용자 조회 오류');
              return;
            }
            console.log("kakao find...");
            console.log(`${results[0].cnt}`);
            if(results[0].cnt == 0){
                res.status(300).send('사용자 정보 없음')
            }
            else{
                res.status(200).send('사용자 정보 있음')
            }
        });
        
    }
    else if(login_method == "NAVER"){
        const sql = 'SELECT COUNT(id) AS cnt FROM USER_INFO WHERE login_method = ? AND login_token_id = ?';
        db.query(sql, ["NAVER", token_id], (err, results) => {
            if (err) {
              console.error('사용자 조회 오류: ', err);
              res.status(500).send('사용자 조회 오류');
              return;
            }
            console.log("naver find...")
            if(results[0].cnt == 0){
                res.status(300).send('사용자 정보 없음')
            }
            else{
                res.status(200).send('사용자 정보 있음')
            }
        });
        
    }
    else{
        const sql = 'SELECT COUNT(id) AS cnt FROM USER_INFO WHERE login_method = ? AND login_token_id = ?';
        console.log(`${token_id}`);
        db.query(sql, ["NONE", token_id], (err, results) => {
            if (err) {
              console.error('사용자 조회 오류: ', err);
              res.status(500).send('사용자 조회 오류');
              return;
            }
            if(results[0].cnt == 0){
                res.status(300).send('사용자 정보 없음')
            }
            else{
                console.log('hi');
                res.status(200).send('사용자 정보 있음')
            }
        });
    }
});

// 사용자 로그인
app.post('/registerUser', (req, res) => {
    const { name, id, password, preferences, token_id , token_type} = req.body;
    const preferencesArray = preferences.split('');
  
    const countSql = 'SELECT COUNT(id) AS userCount FROM USER_INFO';
    
    db.query(countSql, (err, result) => {
      if (err) {
        console.log('사용자 등록 오류:', err);
        res.status(500).send('사용자 등록 오류');
        return;
      }
  
      const userCount = result[0].userCount;
      const user_id = userCount + 1;
  
      console.log(`${name}`);
      console.log(`${id}`);
      console.log(`${password}`);
      console.log(`${preferences}`);
      console.log(`${user_id}`);
      console.log(`${token_id}`);
      console.log(`${token_type}`);
  

      const insertSql = 'INSERT INTO USER_INFO (id, user_name, following_user_id, following_user_pw, user_preferences, coin, login_method, login_token_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      db.query(insertSql, [user_id, name, id, password, JSON.stringify(preferencesArray), 100, token_type, token_id], (err, result) => {
        if (err) {
          console.log('사용자 등록 오류:', err);
          res.status(500).send('사용자 등록 오류');
          return;
        }
        res.status(200).send('사용자 취향 저장 완료');
      });
    });
  });

// 서버 시작
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});