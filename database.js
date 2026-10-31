require('dotenv').config();
const mongoose= require('mongoose');
 
  async function connectdb(){
try{

  await mongoose.connect(process.env.MONGO_URL);
  console.log("Database Connected");
}
catch(e){
    console.log(e);
}

  }
  
  connectdb();