import con from "./db.js";
import bcrypt from "bcrypt";

const memberID = 68;  // assuming adminID is 1 for admin1
const newPassword = '1234';  // the new password you want to set

const hash = bcrypt.hashSync(newPassword, 10);

const sql = "UPDATE member SET password = ? WHERE memberID = ?";

con.query(sql, [hash, memberID], (err, result) => {
  if (err) throw err;
  console.log("Password updated successfully");
  con.end();
});