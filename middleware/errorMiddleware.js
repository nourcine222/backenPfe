require('dotenv').config();
const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: 'Something went wrong. Please try again later.' });
  };
  
module.exports = errorMiddleware;
  