const createUpdateValid = ({ name, description }) => {
  //Check exist data
  if (!name || !description) {
    return 'Please add all fields.';
  }

  if (name.length < 6) {
    //Check length of name department
    return 'Name department must be at least 6 characters.';
  }

  if (description.length < 20 || description.length > 255) {
    //Check length of name department
    return 'Name department must be at least 20 and than 255 characters.';
  }
};

module.exports = {
  createUpdateValid,
};
