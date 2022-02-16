const submissionFillIn = ({ name, description, closure_date, final_closure_date }) => {
  //check exist data
  if (!name || !description || !closure_date || !final_closure_date) {
    return 'Please add all fields';
  }
};
const submissionUpdate = ({ name, description, closure_date, final_closure_date }) => {
  if (!name || !description || !closure_date || !final_closure_date) {
    return 'Please add all fields';
  }
};


module.exports = {
  submissionFillIn,
  submissionUpdate,
};
