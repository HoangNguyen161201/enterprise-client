const createReactionValid = ({ user_id, idea_id, reactionType_id }) => {
    //Check exist data
    if (!user_id || !idea_id || !reactionType_id) {
      return 'The data is incomplete, please check again.';
    }
  };

  module.exports = {
    createReactionValid,
  };