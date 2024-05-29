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


//login
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


//package
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

//member

router.post('/add_member', upload.single('image'), (req, res) =>{
  const registerDate = new Date();
  const packageID = req.body.packageID;
  const sql = "INSERT INTO `member` (`name`, `username`, `password`, `email`, `contact`, `image`, `medical`, `dob`, `gender`, `registerDate`, `packageID`) VALUES (?)"; //peronsal ain kra methana
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
        //req.body.personal,
        registerDate,
        packageID
      ]

      con.query(sql, [values], (err, result)=>{
        if (err) return res.json({ Status: false, Error: "Query error" })
        
        const memberId = result.insertId;
        const membershipSql = `INSERT INTO membership (memberID, packageID, status, startDate) VALUES (?, ?, 'pending', NOW())`;
        con.query(membershipSql, [memberId, packageID], (err, result) => {
          if (err) return res.json({ Status: false, Error: "Query error" })
            return res.json({Status: true, Result: result})
      })
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
  const sql = `UPDATE member SET name = ?, email = ?, contact = ?, medical = ?  WHERE memberID = ?`; //packageID= ?,personal = ?
  const values=[
    req.body.name, 
    req.body.email, 
    req.body.contact, 
    req.body.medical, 
    //req.body.packageID, 
    //req.body.personal
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


//trainer
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


//payment
// Record a payment,update membership status and update packageID
router.post('/payment', (req, res) => {
  const { memberID, packageID, amount, date } = req.body;
  const paymentSql = `INSERT INTO payment (memberID, packageID, amount, paymentDate) VALUES (?, ?, ?, NOW())`;
  con.query(paymentSql, [memberID, packageID, amount], (err, result) => {
      if (err) throw err;
      const membershipUpdateSql = `UPDATE membership SET packageID = ?, status = 'active', startDate = NOW(), endDate = ? WHERE memberID = ?`;
      con.query(membershipUpdateSql, [packageID, date, memberID], (err, result) => {
          if (err) throw err;
          const updateMemberSql = `UPDATE member SET packageID = ? WHERE memberID = ?`;
            con.query(updateMemberSql, [packageID, memberID], (err, result) => {
                if (err) {
                    console.error('Error updating member package:', err);
                    res.status(500).send('Internal Server Error');
                    return;
                }
          res.send('Payment recorded and membership activated package updated.');
      });
  });
});
});

router.get('/membershipstatus',(req, res)=>{
  const sql = "SELECT * FROM membership";
  con.query(sql, (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
    return res.json({Status: true, Result: result})
  })
})





export { router as adminRouter };
