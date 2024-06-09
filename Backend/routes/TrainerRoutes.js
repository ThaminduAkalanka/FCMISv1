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

  router.post('/assignSchedules', (req, res) => {
    const { memberID, trainerID, scheduleID, startDate, endDate } = req.body;
    const sql = "INSERT INTO AssignSchedule (memberID, trainerID, scheduleID, startDate, endDate) VALUES (?, ?, ?, ?, ?)";
    
    con.query(sql, [memberID, trainerID, scheduleID, startDate, endDate], (err, result) => {
        if (err) return res.status(500).json({ Status: false, Error: "Query error" });
        return res.json({ Status: true, assignID: result.insertId });
    });
});

  export { router as TrainerRouter }