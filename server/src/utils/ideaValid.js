const { title } = require('process');

const ideaFillIn = ({ title, description, content, user_id, category_id, submission_id }) => {
  //check exist data
  if (!title || !description || !content || !user_id || !category_id || !submission_id) {
    return 'Please add all fields';
  }
};

const ideaUpdate = ({ title, description, content, created_date, last_modified_date }) => {
  //check exist data
  if (!title || !description || !content || !user_id || !category_id || !submission_id) {
    return 'Please add all fields';
  }
};
const getIdeabyUser = ({ user_id, submission_id }) => {
  if (!user_id || !submission_id) {
    return 'Data does not exist';
  }
};

module.exports = {
  ideaFillIn,
  ideaUpdate,
  getIdeabyUser
};
