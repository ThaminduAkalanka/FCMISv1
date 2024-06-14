import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import cron from 'node-cron';
import QRCode from 'qrcode';

const router = express.Router();

// Cron job to check for expired memberships and update their status
cron.schedule('0 * * * *', () => {  // Runs every day at midnight
  const checkSql = `UPDATE membership SET status = "expired" WHERE endDate < NOW() AND status = "active"`;
  con.query(checkSql, (err, result) => {
      if (err) {
          console.error('Error updating membership status:', err);
          return;
      }
      console.log('Membership statuses updated.');
  });
});


//login with token
router.post("/adminlogin", (req, res) => {
  const sql = "SELECT * FROM admin WHERE username = ?";
  con.query(sql, [req.body.username], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const admin = result[0];
      const isPasswordValid = bcrypt.compareSync(req.body.password, admin.password);
      if (isPasswordValid) {
        const token = jwt.sign({ adminID: admin.adminID }, 'your_jwt_secret', { expiresIn: '1d' });
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
router.get("/adminprofile", authenticateToken, (req, res) => {
  const sql = "SELECT * FROM admin WHERE adminID = ?";
  con.query(sql, [req.user.adminID], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query error" });
    if (result.length > 0) {
      return res.json({ Status: true, admin: result[0] });
    }
    return res.json({ Status: false, Error: "Admin not found" });
  });
});

// Change Password
router.post("/changepassword", authenticateToken, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const sql = "SELECT * FROM admin WHERE adminID = ?";
  
  con.query(sql, [req.user.adminID], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query error" });
    if (result.length > 0) {
      const admin = result[0];
      const isPasswordValid = bcrypt.compareSync(currentPassword, admin.password);
      if (isPasswordValid) {
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        const updateSql = "UPDATE admin SET password = ? WHERE adminID = ?";
        con.query(updateSql, [hashedPassword, req.user.adminID], (err, result) => {
          if (err) return res.json({ Status: false, Error: "Query error" });
          return res.json({ Status: true });
        });
      } else {
        return res.json({ Status: false, Error: "Incorrect current password" });
      }
    } else {
      return res.json({ Status: false, Error: "Admin not found" });
    }
  });
});

// Register New Admin
router.post("/registeradmin", authenticateToken, (req, res) => {
  const { name, username, password, email, contact } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const sql = "INSERT INTO admin (name, username, password, email, contact) VALUES (?, ?, ?, ?, ?)";
  
  con.query(sql, [name, username, hashedPassword, email, contact], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query error" });
    return res.json({ Status: true });
  });
});

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

router.get('/package/:packageID', (req,res) => {
  const packageID = req.params.packageID;
  const sql = `SELECT * FROM package WHERE packageID = ?`;
  con.query(sql, [packageID], (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
    return res.json({Status: true, Result: result})
  })
})

router.put('/edit_package/:packageID', (req,res) => {
  const packageID = req.params.packageID;
  const sql = `UPDATE package SET packageName = ?, Rate = ?  WHERE packageID = ?`;
  const values=[
    req.body.packageName, 
    req.body.Rate, 
  ]
  con.query(sql, [...values, packageID], (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error"+err })
    return res.json({Status: true, Result: result})
  })
})


router.delete('/delete_package/:packageID', (req,res) => {
  const packageID = req.params.packageID;
  const sql = `DELETE FROM package WHERE packageID = ?`;
  con.query(sql, [packageID], (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
    return res.json({Status: true, Result: result})
  })
})

//member
// Check Username Availability API
router.post('/check_username', async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.json({ available: false, message: "Username is required" });
  }

  const sql = "SELECT COUNT(*) as count FROM member WHERE username = ?";
  con.query(sql, [username], (err, result) => {
    if (err) {
      return res.json({ available: false, message: "Query error" });
    }
    const count = result[0].count;
    res.json({ available: count === 0 });
  });
});

// Add Member API
router.post('/add_member', upload.single('image'), async (req, res) => {
  const { name, username, password, email, contact, medical, dob, gender, packageID, categoryID } = req.body;
  const registerDate = new Date();

  // Server-side validation
  if (!name || !username || !password || !email || !contact || !gender || !packageID || !categoryID) {
    return res.json({ Status: false, Error: "All required fields must be filled" });
  }

  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailRegex.test(email)) {
    return res.json({ Status: false, Error: "Invalid email format" });
  }

  if (contact.length !== 10) {
    return res.json({ Status: false, Error: "Contact must be 10 digits" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const values = [
      name, username, hash, email, contact, req.file ? req.file.filename : '', medical, dob, gender, registerDate, packageID, categoryID
    ];

    const sql = "INSERT INTO `member` (`name`, `username`, `password`, `email`, `contact`, `image`, `medical`, `dob`, `gender`, `registerDate`, `packageID`, `categoryID`) VALUES (?)";
    
    con.query(sql, [values], async (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query error" });

      const memberId = result.insertId;
      const membershipSql = `INSERT INTO membership (memberID, packageID, status, startDate) VALUES (?, ?, 'pending', NOW())`;

      con.query(membershipSql, [memberId, packageID], async (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query error" });

        // Generate QR code
        const qrCodeUrl = await QRCode.toDataURL(memberId.toString());

        // Save QR code URL to the database if needed
        const updateMemberSql = `UPDATE member SET qrCode = ? WHERE memberID = ?`;
        con.query(updateMemberSql, [qrCodeUrl, memberId], (err, updateResult) => {
          if (err) return res.json({ Status: false, Error: "Query error" });

          // Assign schedule
          const scheduleSql = `INSERT INTO assignschedule (memberID) VALUES (?)`;
          con.query(scheduleSql, [memberId], async (err, result) => {
            if (err) return res.json({ Status: false, Error: "Query error" });

            return res.json({ Status: true, Result: updateResult });
          });
        });
      });
    });
  } catch (error) {
    console.error('Error:', error);
    return res.json({ Status: false, Error: "Server error" });
  }
});



// Mark Attendance API
router.post('/mark_attendance', async (req, res) => {
  const { memberID } = req.body;
  console.log('Received memberID:', memberID); // Log received memberID

  try {
    // Check membership status and expiration date
    const checkMembershipSql = `SELECT status, endDate FROM membership WHERE memberID = ?`;
    con.query(checkMembershipSql, [memberID], (err, membershipResult) => {
      if (err) {
        console.error('Error querying membership:', err);
        return res.json({ Status: false, Error: "Query error" });
      }

      if (membershipResult.length === 0) {
        return res.json({ Status: false, message: "No membership found for this member." });
      }

      const membershipStatus = membershipResult[0].status;
      const endDate = new Date(membershipResult[0].endDate);
      const currentDate = new Date();
      const oneWeekAfterEndDate = new Date(endDate);
      oneWeekAfterEndDate.setDate(endDate.getDate() + 7);

      if (membershipStatus !== 'active' && currentDate > oneWeekAfterEndDate) {
        return res.json({ Status: false, message: "Membership expired. Please renew to access." });
      }

      if (membershipStatus !== 'active' && currentDate <= oneWeekAfterEndDate) {
        // Allow attendance marking but show a warning message
        const checkAttendanceSql = `SELECT * FROM attendance WHERE memberID = ? AND checkoutTime IS NULL`;
        con.query(checkAttendanceSql, [memberID], (err, result) => {
          if (err) {
            console.error('Error querying attendance:', err);
            return res.json({ Status: false, Error: "Query error" });
          }

          if (result.length > 0) {
            // Check-out process
            const updateAttendanceSql = `UPDATE attendance SET checkoutTime = NOW() WHERE memberID = ? AND checkoutTime IS NULL`;
            con.query(updateAttendanceSql, [memberID], (err, result) => {
              if (err) {
                console.error('Error updating attendance:', err);
                return res.json({ Status: false, Error: "Query error" });
              }

              return res.json({ Status: true, message: "Checkout successful. Note: Your membership has expired. Please renew within this week to continue accessing the gym.", Result: result });
            });
          } else {
            // Check-in process
            const insertAttendanceSql = `INSERT INTO attendance (memberID, checkinTime) VALUES (?, NOW())`;
            con.query(insertAttendanceSql, [memberID], (err, result) => {
              if (err) {
                console.error('Error inserting attendance:', err);
                return res.json({ Status: false, Error: "Query error" });
              }

              return res.json({ Status: true, message: "Check-in successful. Note: Your membership has expired. Please renew within this week to continue accessing the gym.", Result: result });
            });
          }
        });
      } else {
        // If membership is active, proceed with attendance marking
        const checkAttendanceSql = `SELECT * FROM attendance WHERE memberID = ? AND checkoutTime IS NULL`;
        con.query(checkAttendanceSql, [memberID], (err, result) => {
          if (err) {
            console.error('Error querying attendance:', err);
            return res.json({ Status: false, Error: "Query error" });
          }

          if (result.length > 0) {
            // Check-out process
            const updateAttendanceSql = `UPDATE attendance SET checkoutTime = NOW() WHERE memberID = ? AND checkoutTime IS NULL`;
            con.query(updateAttendanceSql, [memberID], (err, result) => {
              if (err) {
                console.error('Error updating attendance:', err);
                return res.json({ Status: false, Error: "Query error" });
              }

              return res.json({ Status: true, message: "Checkout successful", Result: result });
            });
          } else {
            // Check-in process
            const insertAttendanceSql = `INSERT INTO attendance (memberID, checkinTime) VALUES (?, NOW())`;
            con.query(insertAttendanceSql, [memberID], (err, result) => {
              if (err) {
                console.error('Error inserting attendance:', err);
                return res.json({ Status: false, Error: "Query error" });
              }

              return res.json({ Status: true, message: "Check-in successful.", Result: result });
            });
          }
        });
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return res.json({ Status: false, Error: "Query error" });
  }
});




//members
router.get('/member',(req, res)=>{
  const sql = "SELECT * FROM member";
  con.query(sql, (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
    return res.json({Status: true, Result: result})
  })
})

router.get('/activemember',(req, res)=>{
  const sql = "SELECT * FROM membership WHERE status='active' ";
  con.query(sql, (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
    return res.json({Status: true, Result: result})
  })
})


// Get members with their membership status
router.get('/member1', (req, res) => {
  const sql = `
    SELECT m.*, mem.status
    FROM member m
    LEFT JOIN membership mem ON m.memberID = mem.memberID
  `;
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query error" });
    return res.json({ Status: true, Result: result });
  });
});


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

// Search member by name or memberID
router.get('/search_member', (req, res) => {
  const { query } = req.query;
  const sql = `SELECT m.*, mem.status FROM member m
  LEFT JOIN membership mem ON m.memberID = mem.memberID
  WHERE m.name LIKE ? OR m.memberID LIKE ?`;
  const searchQuery = `%${query}%`;
  con.query(sql, [searchQuery, searchQuery], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query error" });
    return res.json({ Status: true, Result: result });
  });
});



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

router.get('/trainer/:trainerID', (req,res) => {
  const trainerID = req.params.trainerID;
  const sql = `SELECT * FROM trainer WHERE trainerID = ?`;
  con.query(sql, [trainerID], (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
    return res.json({Status: true, Result: result})
  })
})

router.put('/edit_trainer/:trainerID', (req,res) => {
  const trainerID = req.params.trainerID;
  const sql = `UPDATE trainer SET name = ?, contact = ?  WHERE trainerID = ?`;
  const values=[
    req.body.name, 
    req.body.contact, 
  ]
  con.query(sql, [...values, trainerID], (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error"+err })
    return res.json({Status: true, Result: result})
  })
})

router.delete('/delete_trainer/:trainerID', (req,res) => {
  const trainerID = req.params.trainerID;
  const sql = `DELETE FROM trainer WHERE trainerID = ?`;
  con.query(sql, [trainerID], (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
    return res.json({Status: true, Result: result})
  })
})

//equipment
router.post('/add_equipment', (req, res) =>{
  const sql = " INSERT INTO equipment (`equipmentName`, `quantity`) VALUES (?,?)";
  con.query(sql, [req.body.equipmentName, req.body.quantity], (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
    return res.json({Status: true})
  })
})

router.get('/equipment',(req, res)=>{
  const sql = "SELECT * FROM equipment";
  con.query(sql, (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
    return res.json({Status: true, Result: result})
  })
})

router.get('/equipment/:equipmentID', (req,res) => {
  const equipmentID = req.params.equipmentID;
  const sql = `SELECT * FROM equipment WHERE equipmentID = ?`;
  con.query(sql, [equipmentID], (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
    return res.json({Status: true, Result: result})
  })
})

router.put('/edit_equipment/:equipmentID', (req,res) => {
  const equipmentID = req.params.equipmentID;
  const sql = `UPDATE equipment SET equipmentName = ?, quantity = ?  WHERE equipmentID = ?`;
  const values=[
    req.body.equipmentName, 
    req.body.quantity, 
  ]
  con.query(sql, [...values, equipmentID], (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error"+err })
    return res.json({Status: true, Result: result})
  })
})

router.delete('/delete_equipment/:equipmentID', (req,res) => {
  const equipmentID = req.params.equipmentID;
  const sql = `DELETE FROM equipment WHERE equipmentID = ?`;
  con.query(sql, [equipmentID], (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
    return res.json({Status: true, Result: result})
  })
})
 



// Record a payment, update membership status and update packageID
router.post('/payment', (req, res) => {
  const { memberID, packageID, amount, startDate, endDate } = req.body;

  // Server-side validation
  if (!memberID || !packageID || !amount || !startDate || !endDate) {
    return res.json({ Status: false, Error: "All fields are required" });
  }

  if (isNaN(amount) || amount <= 0) {
    return res.json({ Status: false, Error: "Amount must be a positive number" });
  }

  if (new Date(startDate) >= new Date(endDate)) {
    return res.json({ Status: false, Error: "End date must be after start date" });
  }

  const paymentSql = `INSERT INTO payment (memberID, packageID, amount, paymentDate) VALUES (?, ?, ?, NOW())`;
  con.query(paymentSql, [memberID, packageID, amount], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ Status: false, Error: "Query error" });
    }

    const membershipUpdateSql = `UPDATE membership SET packageID = ?, status = 'active', startDate = ?, endDate = ? WHERE memberID = ?`;
    con.query(membershipUpdateSql, [packageID, startDate, endDate, memberID], (err, result) => {
      if (err) {
        console.error(err);
        return res.json({ Status: false, Error: "Query error" });
      }

      const updateMemberSql = `UPDATE member SET packageID = ? WHERE memberID = ?`;
      con.query(updateMemberSql, [packageID, memberID], (err, result) => {
        if (err) {
          console.error(err);
          return res.json({ Status: false, Error: "Query error" });
        }

        // Delete notifications after payment
        const deleteNotificationsSql = `DELETE FROM notifications WHERE memberID = ?`;
        con.query(deleteNotificationsSql, [memberID], (err, result) => {
          if (err) {
            console.error(err);
            return res.json({ Status: false, Error: "Query error" });
          }

          return res.json({ Status: true, Result: result });
        });
      });
    });
  });
});


router.get('/paymentdisplay',(req, res)=>{
  const sql = "SELECT * FROM payment";
  con.query(sql, (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
    return res.json({Status: true, Result: result})
  })
})


router.get('/membershipstatus',(req, res)=>{
  const sql = "SELECT * FROM membership";
  con.query(sql, (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
    return res.json({Status: true, Result: result})
  })
})

router.delete('/delete_membership/:memberID', (req,res) => {
  const memberID = req.params.memberID;
  const sql = `DELETE FROM membership WHERE memberID = ?`;
  con.query(sql, [memberID], (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
      const sql = `DELETE FROM member WHERE memberID = ?`;
    con.query(sql, [memberID], (err, result)=>{
      if (err) return res.json({ Status: false, Error: "Query error" })
    return res.json({Status: true, Result: result})
  })
})
})

router.delete('/delete_payment/:paymentID', (req,res) => {
  const paymentID = req.params.paymentID;
  const sql = `DELETE FROM payment WHERE paymentID = ?`;
  con.query(sql, [paymentID], (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
    return res.json({Status: true, Result: result})
  })
})

// Get attendance with member name and pagination
router.get('/attendance', (req, res) => {
  const page = parseInt(req.query.page) || 1;  // Current page number, default is 1
  const limit = parseInt(req.query.limit) || 8;  // Number of records per page, default is 8
  const offset = (page - 1) * limit;

  const sql = `
    SELECT a.*, m.name
    FROM attendance a
    LEFT JOIN member m ON a.memberID = m.memberID
    ORDER BY a.checkinTime DESC
    LIMIT ?, ?
  `;

  con.query(sql, [offset, limit], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query error" });

    // Count total records
    const countSql = `
      SELECT COUNT(*) AS total
      FROM attendance
    `;

    con.query(countSql, (countErr, countResult) => {
      if (countErr) return res.json({ Status: false, Error: "Count query error" });

      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / limit);

      return res.json({
        Status: true,
        Result: result,
        TotalPages: totalPages,
        CurrentPage: page
      });
    });
  });
});



router.delete('/delete_attendance/:id', (req,res) => {
  const id = req.params.id;
  const sql = `DELETE FROM attendance WHERE id = ?`;
  con.query(sql, [id], (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
    return res.json({Status: true, Result: result})
  })
})
//announcement

router.get('/announcement',(req, res)=>{
  const sql = "SELECT * FROM announcement";
  con.query(sql, (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
    return res.json({Status: true, Result: result})
  })
})

router.post('/add_announcement', (req, res) =>{
  const sql = " INSERT INTO announcement (`announcement`, `AnnounceDescription`,`AnnounceDate`, `applydate`) VALUES (?,?, NOW(), ?)";
  con.query(sql, [req.body.announcement, req.body.AnnounceDescription, req.body.applydate], (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
    return res.json({Status: true})
  })
})

router.delete('/delete_announce/:AnnounceID', (req,res) => {
  const AnnounceID = req.params.AnnounceID;
  const sql = `DELETE FROM announcement WHERE AnnounceID = ?`;
  con.query(sql, [AnnounceID], (err, result)=>{
    if (err) return res.json({ Status: false, Error: "Query error" })
    return res.json({Status: true, Result: result})
  })
})
 


// Endpoint to get dashboard data
router.get('/dashboard-data', (req, res) => {
  const dashboardData = {};

  // Fetch total members
  const totalMembersQuery = 'SELECT COUNT(*) AS totalMembers FROM member';
  con.query(totalMembersQuery, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      dashboardData.totalMembers = result[0].totalMembers;

      // Fetch active members
      const activeMembersQuery = "SELECT COUNT(*) AS activeMembers FROM membership WHERE status='active'";
      con.query(activeMembersQuery, (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          dashboardData.activeMembers = result[0].activeMembers;

          // Fetch trainers
          const trainersQuery = 'SELECT COUNT(*) AS trainers FROM trainer';
          con.query(trainersQuery, (err, result) => {
              if (err) return res.status(500).json({ error: err.message });
              dashboardData.trainers = result[0].trainers;

              // Fetch equipments
              const equipmentsQuery = 'SELECT COUNT(*) AS equipments FROM equipment';
              con.query(equipmentsQuery, (err, result) => {
                  if (err) return res.status(500).json({ error: err.message });
                  dashboardData.equipments = result[0].equipments;

                  // Fetch present members (assuming you have a way to track present members)
                  const presentMembersQuery = "SELECT COUNT(*) AS presentMembers FROM attendance WHERE checkoutTime IS NULL ";
                  con.query(presentMembersQuery, (err, result) => {
                      if (err) return res.status(500).json({ error: err.message });
                      dashboardData.presentMembers = result[0].presentMembers;

                      // Fetch earnings (assuming you have a payments table)
                      const earningsQuery = 'SELECT SUM(amount) AS earnings FROM payment WHERE MONTH(paymentDate) = MONTH(CURRENT_DATE) AND YEAR(paymentDate) = YEAR(CURRENT_DATE)';
                      con.query(earningsQuery, (err, result) => {
                          if (err) return res.status(500).json({ error: err.message });
                          dashboardData.earnings = result[0].earnings;

                          res.json(dashboardData);
                      });
                  });
              });
          });
      });
  });
});


// reports
router.get('/attendancereport', (req, res) => {
  const { startDate, endDate } = req.query;
  const sql = `
SELECT 
    m.memberID, 
    m.name, 
    COUNT(a.id) AS attendanceCount
FROM 
    attendance a
JOIN 
    member m ON a.memberID = m.memberID
WHERE 
    a.checkinTime BETWEEN ? AND ?
GROUP BY 
    a.memberID, m.memberID, m.name
ORDER BY 
    attendanceCount DESC;
  `;
  con.query(sql, [startDate, endDate], (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true, Result: result });
  });
});

// reports
router.get('/incomereport', (req, res) => {
  const { startDate, endDate } = req.query;
  const sql = `
SELECT 
    SUM(p.amount) AS totalIncome
FROM 
    payment p
WHERE 
    p.paymentDate BETWEEN ? AND ?;
  `;
  con.query(sql, [startDate, endDate], (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true, Result: result });
  });
});

// gender chart
router.get('/genderdistribution', (req, res) => {
  const sql = `
SELECT 
  SUM(CASE WHEN gender = 'Male' THEN 1 ELSE 0 END) AS male,
  SUM(CASE WHEN gender = 'Female' THEN 1 ELSE 0 END) AS female,
  SUM(CASE WHEN gender = 'Other' THEN 1 ELSE 0 END) AS other
FROM 
  member;
  `;
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true, Result: result[0] });
  });
});

// category chart
router.get('/categorydistribution', (req, res) => {
  const sql = `
SELECT 
  SUM(CASE WHEN categoryID = 1 THEN 1 ELSE 0 END) AS muscleBuilding,
  SUM(CASE WHEN categoryID = 2 THEN 1 ELSE 0 END) AS strength,
  SUM(CASE WHEN categoryID = 3 THEN 1 ELSE 0 END) AS cardio,
  SUM(CASE WHEN categoryID = 4 THEN 1 ELSE 0 END) AS crossfit,
  SUM(CASE WHEN categoryID = 5 THEN 1 ELSE 0 END) AS flexibility
FROM 
  member;
  `;
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true, Result: result[0] });
  });
});

//notification
router.post('/sendNotification/:memberID', (req, res) => {
  const { memberID } = req.params;
  const { message } = req.body;
  const sql = "INSERT INTO notifications (memberID, message, date) VALUES (?, ?, NOW())";
  con.query(sql, [memberID, message], (err, result) => {
    if (err) return res.status(500).json({ Error: "Database error" });

    return res.json({ Status: "Success", Message: "Notification sent" });
  });
});



export { router as adminRouter };
