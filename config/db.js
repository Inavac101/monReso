const mongoose = require('mongoose');

mongoose
    .set('strictQuery', false)
    .connect( `mongodb+srv://${process.env.DB_USER_PASS}@cluster0.2t1yzwx.mongodb.net/monreso`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
           
            
        }
    )
    
    .then(() => console.log(`Connected to MongoDB`))
    .catch((err) => console.log(`Failed to connect to MongoDB`, err));