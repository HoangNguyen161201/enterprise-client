const createCommentValid = ({ content, user_id, idea_id }) => {
  //Check exist data
  if (!content || !user_id || !idea_id) {
    return 'Please add all fields.';
  }

  if (content.length < 1) {
    //Check length of name department
    return 'Comment must be at least 1 characters.';
  }
};

const updateCommentValid = ({ content }) => {
  //Check exist data
  if (!content) {
    return 'Please add all fields.';
  }

  if (content.length < 1) {
    //Check length of name department
    return 'Comment must be at least 1 characters.';
  }
};

module.exports = {
  createCommentValid,
  updateCommentValid,
};
