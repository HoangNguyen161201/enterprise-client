const categoryFillIn = ({ name, description }) => {
  if (!name || !description) {
    return 'Please enter all fields!';
  }

  if (name.length < 6) {
    //Check length of name category
    return 'Name category must be at least 6 characters.';
  }

  if (description.length < 20 || description.length > 255) {
    //Check length of description category
    return 'Description category must be at least 20 and than 255 characters.';
  }
};

module.exports = {
  categoryFillIn,
};
