const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

mongoose.connect(process.env.MONGO_URI)
  .then(() => { console.log('✅ Success!'); process.exit(0); })
  .catch(err => { console.error('❌ Fail:', err.message); process.exit(1); });
