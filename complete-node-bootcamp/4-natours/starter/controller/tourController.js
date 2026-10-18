const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {

  try {
    console.log(req.query);

   // BUILD QUERY
   // 1A) Filtering
    const queryObj = { ...req.query };
    const exculudedFields = ['page', 'sort', 'limit', 'fields'];
    exculudedFields.forEach(el => delete queryObj[el]);

    // 1B) Advanced Filtering
   let queryStr = JSON.stringify(queryObj);
   queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
   console.log(JSON.parse(queryStr));
   

   
   
   // { difficulty: 'easy', duration : {$gte : 5} }
   // { difficulty: 'easy', duration : { gte: '5' } }
   
   
   let query = Tour.find(JSON.parse(queryStr));
   
   // EXECUTE QUERY
   // 2) Sorting
   if(req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
     query = query.sort(sortBy);
   } else {
    query = query.sort('-createdAt');
    //  query = query.sort('_id');
   }


   // 3) Field limiting
   if(req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields)
   } else {
    query = query.select('-__v');
   }


   // 4) Pagination
   const page = req.query.page * 1 || 1;
   const limit = req.query.limit * 1 || 100;
   const skip = (page - 1)* limit;
    console.log({ page, limit, skip });
   // ?page=2&imit=10 , 1-10 Page(1) , 11-20 Page(2) , 21-30 Page(3)
   query = query.skip(skip).limit(limit)

   if(req.query.page){
    const numTours = await Tour.countDocuments();
    if(skip >= numTours) throw new Error('This page does not exist')
   }

    // EXECUTE QUERY
    const tours = await query;
    console.log(tours.map(tour => tour.name));
    
    // const tours = Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');
    
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // findById is a shorthand for findOne({_id: req.params.id})
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
};

exports.createTour = async (req, res) => {

  try {

    // const newTour = new Tour({})
    // newTour.save();

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      // message: err
      message: err
    })
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      // runValidators: true
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }
};

exports.deleteTour = async (req, res) => {
  try {

    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }
};
