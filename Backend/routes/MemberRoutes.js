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
router.post("/memberlogin", (req, res) => {
    const sql = "SELECT * FROM member WHERE username = ?";
    con.query(sql, [req.body.username], (err, result) => {
      if (err) return res.json({ loginStatus: false, Error: "Query error" });
      if (result.length > 0) {
        const member = result[0];
        const isPasswordValid = bcrypt.compareSync(req.body.password, member.password);
        if (isPasswordValid) {
          const token = jwt.sign({ memberID: member.memberID }, 'your_jwt_secret', { expiresIn: '1d' });
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
  router.get("/memberprofile", authenticateToken, (req, res) => {
    const sql = "SELECT * FROM member WHERE memberID = ?";
    con.query(sql, [req.user.memberID], (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query error" });
      if (result.length > 0) {
        return res.json({ Status: true, member: result[0] });
      }
      return res.json({ Status: false, Error: "Member not found" });
    });
  });

  // Change Password
  router.post("/changepassword", authenticateToken, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const sql = "SELECT * FROM member WHERE memberID = ?";
    
    con.query(sql, [req.user.memberID], (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query error" });
      if (result.length > 0) {
        const member = result[0];
        const isPasswordValid = bcrypt.compareSync(currentPassword, member.password);
        if (isPasswordValid) {
          const hashedPassword = bcrypt.hashSync(newPassword, 10);
          const updateSql = "UPDATE member SET password = ? WHERE memberID = ?";
          con.query(updateSql, [hashedPassword, req.user.memberID], (err, result) => {
            if (err) return res.json({ Status: false, Error: "Query error" });
            return res.json({ Status: true });
          });
        } else {
          return res.json({ Status: false, Error: "Incorrect current password" });
        }
      } else {
        return res.json({ Status: false, Error: "member not found" });
      }
    });
  });


    //fetch package details
    router.get("/memberpackage", authenticateToken, (req, res) => {
        const sql =  `
        SELECT * FROM membership WHERE memberID= ?
      `;
        con.query(sql, [req.user.memberID], (err, result) => {
          if (err) return res.json({ Status: false, Error: "Query error" });
          if (result.length > 0) {
            return res.json({ Status: true, member: result[0] });
          }
          return res.json({ Status: false, Error: "Member not found" });
        });
      });

//fetch schedule
      router.get("/memberschedule", authenticateToken, (req, res) => {
        const sql = "SELECT * FROM assignschedule WHERE memberID = ?";
        con.query(sql, [req.user.memberID], (err, result) => {
          if (err) return res.json({ Status: false, Error: "Query error" });
          if (result.length > 0) {
            return res.json({ Status: true, member: result[0] });
          }
          return res.json({ Status: false, Error: "schedule not found" });
        });
      });


      router.put('/updateschedule', authenticateToken, (req, res) => {
        const sql = "UPDATE assignschedule SET scheduleStatus = ? WHERE memberID = ?";
        con.query(sql, [req.body.scheduleStatus, req.body.memberID], (err, result) => {
          if (err) return res.json({ Status: false, Error: "Query error" });
          return res.json({ Status: true });
        });
      });

   //announcements
   // Endpoint to fetch announcements
      router.get("/announcements", (req, res) => {
        const sql = "SELECT * FROM announcement ORDER BY AnnounceDate DESC";
        con.query(sql, (err, results) => {
          if (err) return res.json({ status: false, error: "Query error" });
          return res.json({ status: true, announcements: results });
        });
      });
   
//attendance
     // Endpoint to fetch attendance for a specific member with pagination and date filtering
router.get("/attendance", authenticateToken, (req, res) => {
  const memberID = req.user.memberID;
  const { page = 1, limit = 10, date } = req.query;
  const offset = (page - 1) * limit;

  let sql = `
    SELECT id, memberID, checkinTime, checkoutTime 
    FROM attendance 
    WHERE memberID = ?
  `;
  let countSql = `
    SELECT COUNT(*) as count
    FROM attendance 
    WHERE memberID = ?
  `;
  let monthlyCountSql = `
    SELECT COUNT(*) as count
    FROM attendance 
    WHERE memberID = ? 
    AND MONTH(checkinTime) = MONTH(CURRENT_DATE)
    AND YEAR(checkinTime) = YEAR(CURRENT_DATE)
  `;

  const params = [memberID];

  if (date) {
    sql += " AND DATE(checkinTime) = ?";
    countSql += " AND DATE(checkinTime) = ?";
    params.push(date);
  }

  sql += " ORDER BY checkinTime DESC LIMIT ? OFFSET ?";
  params.push(parseInt(limit), parseInt(offset));

  con.query(sql, params, (err, results) => {
    if (err) return res.json({ status: false, error: "Query error" });

    con.query(countSql, [memberID, ...(date ? [date] : [])], (countErr, countResults) => {
      if (countErr) return res.json({ status: false, error: "Count query error" });

      con.query(monthlyCountSql, [memberID], (monthlyCountErr, monthlyCountResults) => {
        if (monthlyCountErr) return res.json({ status: false, error: "Monthly count query error" });

        const total = countResults[0].count;
        const pages = Math.ceil(total / limit);
        const monthlyCount = monthlyCountResults[0].count;

        return res.json({
          status: true,
          attendances: results,
          total,
          pages,
          currentPage: parseInt(page),
          monthlyCount,
        });
      });
    });
  });
});

  export { router as MemberRouter }