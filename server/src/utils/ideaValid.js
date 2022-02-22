const { title } = require('process');

const ideaFillIn = ({ tilte, description, content, created_date, last_modified_date, user_id, category_id, submission_id }) => {
  //check exist data
  if (!title || !description || !content || created_date || !last_modified_date || !user_id  || !category_id || !submission_id) {
    return 'Please add all fields';
  }
};

const ideaUpdate = ({ title, description, content, created_date, last_modified_date }) => {
  //check exist data
  if (!title || !description || !content || created_date || !last_modified_date || !user_id  || !category_id || !submission_id) {
    return 'Please add all fields';
  }
};

module.exports = {
  ideaFillIn,
  ideaUpdate,
};
