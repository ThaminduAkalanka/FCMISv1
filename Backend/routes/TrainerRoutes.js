import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import cron from 'node-cron';
import QRCode from 'qrcode';

const router = express.Router();

//login with token
router.post("/trainerlogin", (req, res) => {
    const sql = "SELECT * FROM trainer WHERE username = ?";
    con.query(sql, [req.body.username], (err, result) => {
      if (err) return res.json({ loginStatus: false, Error: "Query error" });
      if (result.length > 0) {
        const trainer = result[0];
        const isPasswordValid = bcrypt.compareSync(req.body.password, trainer.password);
        if (isPasswordValid) {
          const token = jwt.sign({ trainerID: trainer.trainerID }, 'your_jwt_secret', { expiresIn: '1d' });
          return res.json({ loginStatus: true, token });
        }
      }
      return res.json({ loginStatus: false, Error: "Incorrect username or password" });
    });
  });
   
  router.get('/logout', (req, res)=>{
    res.clearCookie('token')
    return res.json({Status: true})
  })
  

//middelware to verify token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token after "Bearer "
  
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, 'your_jwt_secret', (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };
  
  
  //profile page
  
  //fetch admin details
  router.get("/trainerprofile", authenticateToken, (req, res) => {
    const sql = "SELECT * FROM trainer WHERE trainerID = ?";
    con.query(sql, [req.user.trainerID], (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query error" });
      if (result.length > 0) {
        return res.json({ Status: true, trainer: result[0] });
      }
      return res.json({ Status: false, Error: "Member not found" });
    });
  });

  // Change Password
  router.post("/changepassword", authenticateToken, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const sql = "SELECT * FROM member WHERE memberID = ?";
    
    con.query(sql, [req.user.trainerID], (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query error" });
      if (result.length > 0) {
        const trainer = result[0];
        const isPasswordValid = bcrypt.compareSync(currentPassword, trainer.password);
        if (isPasswordValid) {
          const hashedPassword = bcrypt.hashSync(newPassword, 10);
          const updateSql = "UPDATE trainer SET password = ? WHERE trainerID = ?";
          con.query(updateSql, [hashedPassword, req.user.trainerID], (err, result) => {
            if (err) return res.json({ Status: false, Error: "Query error" });
            return res.json({ Status: true });
          });
        } else {
          return res.json({ Status: false, Error: "Incorrect current password" });
        }
      } else {
        return res.json({ Status: false, Error: "trainer not found" });
      }
    });
  });



//schedule
router.post('/assignschedule', (req, res) => {
  const { memberID, trainerID, scheduleID, startDate, endDate } = req.body;
      const membershipUpdateSql = `UPDATE assignschedule SET trainerID= ?, scheduleID= ?, scheduleStatus = 'in progress', startDate = ?, endDate = ? WHERE memberID = ?`;
      con.query(membershipUpdateSql, [trainerID, scheduleID, startDate, endDate, memberID], (err, result) => {
              if (err) return res.json({ Status: false, Error: "Query error" })
                return res.json({Status: true, Result: result})
      });
  });



router.get('/memberschedule', (req, res) => {
  const sql = `
    SELECT m.*, a.*
    FROM member m
    LEFT JOIN assignschedule a ON m.memberID = a.memberID
  `;
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query error" });
    return res.json({ Status: true, Result: result });
  });
});

//manage schedule
router.post('/add_schedule', (req, res) =>{
  const sql = " INSERT INTO schedule (`categoryID`, `name`, `level`, `scheduleDetail`) VALUES (?, ?, ?, ?)";
  con.query(sql, [req.body.categoryID, req.body.name, req.body.level, req.body.scheduleDetail], (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error", err })
    return res.json({Status: true})
  })
}) 

router.get('/manageschedule',(req, res)=>{
  const sql = `SELECT * FROM schedule`;
  con.query(sql, (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
    return res.json({Status: true, Result: result})
  })
})

router.get('/schedule/:scheduleID', (req,res) => {
  const scheduleID = req.params.scheduleID;
  const sql = `SELECT * FROM schedule WHERE scheduleID = ?`;
  con.query(sql, [scheduleID], (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
    return res.json({Status: true, Result: result})
  })
})

router.put('/edit_schedule/:scheduleID', (req,res) => {
  const scheduleID = req.params.scheduleID;
  const sql = `UPDATE schedule SET categoryID = ?, name = ?, level = ?, scheduleDetails = ?  WHERE scheduleID = ?`;
  const values=[
    req.body.categoryID, 
    req.body.name,
    req.body.level, 
    req.body.scheduleDetail, 
  ]
  con.query(sql, [...values, scheduleID], (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error"+err })
    return res.json({Status: true, Result: result})
  })
})


router.delete('/delete_schedule/:scheduleID', (req,res) => {
  const scheduleID = req.params.scheduleID;
  const sql = `DELETE FROM schedule WHERE scheduleID = ?`;
  con.query(sql, [scheduleID], (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
    return res.json({Status: true, Result: result})
  })
})


//category
router.get('/category',(req, res)=>{
  const sql = "SELECT * FROM workoutcategory";
  con.query(sql, (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
    return res.json({Status: true, Result: result})
  })
})

//progress
// Endpoint to fetch progress report
router.post('/progressReport', authenticateToken, (req, res) => {
  const { memberID, exerciseID, startDate, endDate, period } = req.body;

  if (!memberID) {
    return res.status(400).json({ Error: "MemberID is required" });
  }

  // Determine date range based on the selected period
  let start = startDate;
  let end = endDate;

  if (period === 'week') {
    start = new Date();
    start.setDate(start.getDate() - 7);
    start = start.toISOString().slice(0, 10);
    end = new Date().toISOString().slice(0, 10);
  } else if (period === 'month') {
    start = new Date();
    start.setMonth(start.getMonth() - 1);
    start = start.toISOString().slice(0, 10);
    end = new Date().toISOString().slice(0, 10);
  } else if (period === 'year') {
    start = new Date();
    start.setFullYear(start.getFullYear() - 1);
    start = start.toISOString().slice(0, 10);
    end = new Date().toISOString().slice(0, 10);
  }

  // Query to fetch progress data
  const sql = "SELECT * FROM progress WHERE memberID = ? AND exerciseID = ? AND entryDate BETWEEN ? AND ?";
  con.query(sql, [memberID, exerciseID, start, end], (err, result) => {
    if (err) return res.status(500).json({ Error: "Database error" });
    return res.json({ Status: "Success", Result: result });
  });
});



  export { router as TrainerRouter }