import md5 from "../../node_modules/crypto-js/md5.js";
import hmacSHA512 from "../../node_modules/crypto-js/sha512.js";
import Base64 from "../../node_modules/crypto-js/enc-base64.js";
import dotenv from "dotenv";
dotenv.config();

function encryptPassword(password) {
  const privateKey = process.env.PRIVATE_KEY;

  const encryptPassword = Base64.stringify(
    hmacSHA512(md5(password), privateKey)
  );

  return encryptPassword;
}

export default encryptPassword;
