//Handle catch async error

const handleCatchError = (func) => {
  return (req, res, next) => {
    const asynFunc = new Promise((resolve, reject) => {
      resolve(func(req, res, next));
    });

    asynFunc.catch((error) => {
      let statusCode = 500;
      let message = 'Something went wromt';
      //Define error
      //Handle castError
      const nameError = error.name;
      console.log(nameError);
      if (nameError === 'CastError') {
        console.log('sdfds');
        message = `Resource not found.`;
        statusCode = 400;
      }

      //Handling Mongoose validation Error
      if (nameError === 'ValidationError') {
        const message = Object.values(err.errors).map((value) => value.message)[0];
        message = message;
        statusCode = 400;
      }

      //Hand Mongoose duplicate key errors
      if (error.code === 11000) {
        const messageError = `Duplicate ${Object.keys(error.keyValue)} entered`;
        statusCode = 400;
        message = messageError;
      }

      //Handling wrong JWT error
      if (nameError === 'JsonWebTokenError') {
        const message = `JSON Web Token is invalid. Try Again!!!`;
        statusCode = 400;
        message = message;
      }

      //Handling Expored JWT error
      if (nameError === 'TokenExpiredError') {
        const message = `JSON Web Token is invalid. Try Again!!!`;
        statusCode = 400;
        message = message;
      }

      //Res error
      res.status(statusCode).json({
        msg: message,
        statusCode,
      });
    });
  };
};

module.exports = handleCatchError;