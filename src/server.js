require('dotenv').config();

const app = require('./app');
const { testConnection } = require('./config/database');

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`IntelliPark API running on port ${PORT}`);
  await testConnection();
});