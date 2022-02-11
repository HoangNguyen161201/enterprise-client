//Handle catch async error

const handleCatchError = (func) => {
  return (req, res, next) => {
    const asynFunc = new Promise((resolve, reject) => {
      resolve(func(req, res, next));
    });

    asynFunc.catch((error) => {
      console.log(error);
      return next();
    });
  };
};

module.exports = handleCatchError;
