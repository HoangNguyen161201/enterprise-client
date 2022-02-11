const validSignUp = ({ name, email, role, password, cf_password }) => {
  //Check exist data
  if (!name || !email || !password) {
    return 'Please add all fields.';
  }

  //Check valid email
  if (!validateEmail(email)) {
    return 'Invalid emails.';
  }

  //Check enum role
  if (
    role !== 'staff' &&
    role !== 'admin' &&
    role !== 'qa_manager' &&
    role !== 'qa_coordinator' &&
    role !== 'department_manager'
  ) {
    return 'Invalid role';
  }

  if (password.length < 6) {
    //Check length of password
    return 'Password must be at least 6 characters.';
  }

  //Check match password with cf_password
  if (password !== cf_password) {
    return 'Confirm password did not match.';
  }
};

//Check valid email functionmuy
function validateEmail(email) {
  const res =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return res.test(String(email).toLowerCase());
}

module.exports = validSignUp;
