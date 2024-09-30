import mongoose from 'mongoose';

const DATABASE_URI = process.env.DATABASE_URI || 'mongodb+srv://cungwalucky:HER4ZoR1H9YBpZGc@cluster0.scwsfnn.mongodb.net/cms-blog?retryWrites=true&w=majority';

mongoose.connect(DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connection successful!');
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });