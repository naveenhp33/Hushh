const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const User = require('./backend/models/User');
const Referral = require('./backend/models/Referral');

const colleges = ['IIT Bombay', 'Stanford', 'MIT', 'BITS Pilani', 'IIT Delhi', 'Oxford', 'Cambridge', 'NUS Singapore', 'DU', 'JU'];
const names = ['Aarav', 'Zoe', 'Liam', 'Priya', 'Ethan', 'Ananya', 'Noah', 'Sanya', 'Oliver', 'Ishaan'];
const surnames = ['Sharma', 'Smith', 'Gupta', 'Johnson', 'Verma', 'Williams', 'Patel', 'Brown', 'Singh', 'Jones'];

const seedDummyData = async () => {
  try {
    const uri = process.env.MONGO_URI;
    console.log('Using URI (masked):', uri ? uri.replace(/:([^@]+)@/, ':****@') : 'undefined');
    console.log('Connecting to DB...');
    await mongoose.connect(uri);
    console.log('Connected!');

    // Optional: Clear existing ambassadors
    // await User.deleteMany({ role: 'ambassador' });
    // await Referral.deleteMany({});

    console.log('Generating 30 dummy ambassadors...');

    for (let i = 0; i < 30; i++) {
       const firstName = names[Math.floor(Math.random() * names.length)];
       const lastName = surnames[Math.floor(Math.random() * surnames.length)];
       const fullName = `${firstName} ${lastName}`;
       const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}@college.edu`;
       const uid = `dummy-uid-${Math.random().toString(36).substr(2, 9)}`;
       const code = `${firstName.toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

       const user = await User.create({
         firebaseUid: uid,
         email: email,
         name: fullName,
         photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${i}`,
         college: colleges[Math.floor(Math.random() * colleges.length)],
         onboardingComplete: Math.random() > 0.2,
         referralCode: code,
         role: 'ambassador',
         lastActive: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000))
       });

       await Referral.create({
         referrerUid: uid,
         referralCode: code,
         clicks: Math.floor(Math.random() * 500) + 50,
         signups: Math.floor(Math.random() * 40) + 5,
         conversions: 0
       });
    }

    console.log('✅ Done! Created 30 dummy ambassadors with stats.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  }
};

seedDummyData();
