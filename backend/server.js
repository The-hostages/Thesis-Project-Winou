const app = require('./index');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port: " , "http://10.0.2.2:"+PORT);
});