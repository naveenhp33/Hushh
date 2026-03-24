const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
console.log('Length:', sa ? sa.length : '0');
if (sa) {
  try {
    const obj = JSON.parse(sa);
    console.log('JSON Parse: Success');
    console.log('Private Key Start:', obj.private_key.substring(0, 50));
    console.log('Private Key End:', obj.private_key.substring(obj.private_key.length - 50));
  } catch (e) {
    console.log('JSON Parse: Failed', e.message);
  }
}
