const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// the old way 
mongoose
  .connect(DB, {
    // .connect(proccess.env.DATABASE_LOCAL, {  TO connect local database
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  }).then(console.log('DB connection successful!'));


/* // instead 
mongoose.connect(DB)
  .then(() => console.log('DB connection successful!'))
  .catch(err => console.error('DB connection failed:', err));

*/

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  }
})

const Tour = mongoose.model('Tour', tourSchema);

const tourTest = new Tour({
  name: 'The Park Camper',
  price: 497
});


tourTest
  .save()
  .then(doc => {
    console.log(doc);

  })
  .catch(err => {
    console.log('ERROR : ', err);
  })

const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});




