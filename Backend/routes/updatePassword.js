import con from "../utils/db.js";
import bcrypt from "bcrypt";

const adminID = 1;  // assuming adminID is 1 for admin1
const newPassword = 'admin123';  // the new password you want to set

const hash = bcrypt.hashSync(newPassword, 10);

const sql = "UPDATE admin SET password = ? WHERE adminID = ?";
con.query(sql, [hash, adminID], (err, result) => {
  if (err) throw err;
  console.log("Password updated successfully");
  con.end();
});