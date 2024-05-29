import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import cron from 'node-cron';

const router = express.Router();

// Cron job to check for expired memberships and update their status
cron.schedule('0 0 * * *', () => {  // Runs every day at midnight
  const checkSql = `UPDATE membership SET status = "expired" WHERE endDate < NOW() AND status = "active"`;
  con.query(checkSql, (err, result) => {
      if (err) {
          console.error('Error updating membership status:', err);
          return;
      }
      console.log('Membership statuses updated.');
  });
});



router.post("/adminlogin", (req, res) => {
  const sql = "SELECT * FROM admin WHERE username = ? and password = ?";
  con.query(sql, [req.body.username, req.body.password], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const username = result[0].username;
      const token = jwt.sign(
        { role: "admin", username: username },
        "jwt_secret_key",
        { expiresIn: "1d" }//secret key must be very secure one
      ); 
      res.cookie('token', token)
      return res.json({ loginStatus: true });
    }else{
        return res.json({ loginStatus: false, Error: "Incorrect username or password" });
    }
  });
});

router.get('/logout', (req, res)=>{
  res.clearCookie('token')
  return res.json({Status: true})
})


//image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname) )
  }
})
const upload = multer ({
  storage: storage
})

//end image upload

router.post('/add_package', (req, res) =>{
  const sql = " INSERT INTO package (`packageName`, `rate`) VALUES (?,?)";
  con.query(sql, [req.body.packageName, req.body.rate], (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
    return res.json({Status: true})
  })
})

router.get('/package',(req, res)=>{
  const sql = "SELECT * FROM package";
  con.query(sql, (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
    return res.json({Status: true, Result: result})
  })
})



router.post('/add_member', upload.single('image'), (req, res) =>{
  const registerDate = new Date();
  const sql = "INSERT INTO `member` (`name`, `username`, `password`, `email`, `contact`, `image`, `medical`, `dob`, `gender`, `personal`, `registerDate`, `packageID`) VALUES (?)";
  bcrypt.hash(req.body.password, 10, (err, hash)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
      const values =[
        req.body.name,
        req.body.username,
        hash,
        req.body.email,
        req.body.contact, 
        req.file.filename,
        req.body.medical,
        req.body.dob,
        req.body.gender,
        req.body.personal,
        registerDate,
        req.body.packageID 
      ]

      con.query(sql, [values], (err, result)=>{
        if (err) return res.json({ Status: false, Error: "Query error" })
        return res.json({Status: true})
      })

  })
})

router.get('/member',(req, res)=>{
  const sql = "SELECT * FROM member";
  con.query(sql, (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
    return res.json({Status: true, Result: result})
  })
})

router.post('/add_trainer', upload.single('image'), (req, res) =>{
  const registerDate = new Date();
  const sql = "INSERT INTO `trainer` (`name`, `username`, `password`, `contact`, `registerDate`, `image`) VALUES (?)";
  bcrypt.hash(req.body.password, 10, (err, hash)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
      const values =[
        req.body.name,
        req.body.username,
        hash,
        req.body.contact,
        registerDate, 
        req.file.filename
      ]

      con.query(sql, [values], (err, result)=>{
        if (err) return res.json({ Status: false, Error: "Query error" })
        return res.json({Status: true})
      })

  })
})

router.get('/trainer',(req, res)=>{
  const sql = "SELECT * FROM trainer";
  con.query(sql, (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
    return res.json({Status: true, Result: result})
  })
})


router.get('/member/:memberID', (req,res) => {
  const memberID = req.params.memberID;
  const sql = `SELECT * FROM member WHERE memberID = ?`;
  con.query(sql, [memberID], (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
    return res.json({Status: true, Result: result})
  })
})

router.put('/edit_member/:memberID', (req,res) => {
  const memberID = req.params.memberID;
  const sql = `UPDATE member SET name = ?, email = ?, contact = ?, medical = ?, packageID= ?, personal = ? WHERE memberID = ?`;
  const values=[
    req.body.name, 
    req.body.email, 
    req.body.contact, 
    req.body.medical, 
    req.body.packageID, 
    req.body.personal
  ]
  con.query(sql, [...values, memberID], (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error"+err })
    return res.json({Status: true, Result: result})
  })
})

router.delete('/delete_member/:memberID', (req,res) => {
  const memberID = req.params.memberID;
  const sql = `DELETE FROM member WHERE memberID = ?`;
  con.query(sql, [memberID], (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
    return res.json({Status: true, Result: result})
  })
})

// Record a payment and update membership status
router.post('/payment', (req, res) => {
  const { memberID, packageID, amount, date } = req.body;
  const paymentSql = `INSERT INTO payment (memberID, packageID, amount, paymentDate) VALUES (?, ?, ?, NOW())`;
  con.query(paymentSql, [memberID, packageID, amount], (err, result) => {
      if (err) throw err;
      const membershipSql = `INSERT INTO membership (memberID, packageID, status, startDate, endDate) VALUES (?, ?, 'active', NOW(), ?) ON DUPLICATE KEY UPDATE status = 'active', startDate = NOW(), endDate = ?`;
      con.query(membershipSql, [memberID, packageID, date, date], (err, result) => {
          if (err) throw err;
          res.send('Payment recorded and membership activated.');
      });
  });
});





export { router as adminRouter };
