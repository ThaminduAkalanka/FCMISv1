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
          const token = jwt.sign({ memberID: member.memberID }, 'your_jwt_secret', { expiresIn: '1h' });
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
  

  export { router as MemberRouter }