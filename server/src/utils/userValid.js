const validSignUp = ({ name, email, role, password, cf_password }) => {
  //Check exist data
  if (!name || !email || !password) {
    return 'Please add all fields.';
  }

  if (name.length < 3) {
    //Check length of name
    return 'Name must be at least 3 characters.';
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

const validUpdate = ({ name, email, role }) => {
  if (!name || !email || !role) {
    return 'Please add all fields.';
  }

  if (name.length < 3) {
    //Check length of name
    return 'Name must be at least 3 characters.';
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
};


//Role Valid User

const validFilter = ({ role }) => {
  if (role !== 'staff' && role !== 'qa_coordinator' && role !== 'department_manager') {
    return 'Invalid role';
  }
};

//Check valid email function
function validateEmail(email) {
  const res =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return res.test(String(email).toLowerCase());
}

//Check valid password
function validatePassword(password) {
  const res = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return res.test(String(password).toLowerCase());
}

//Check valid assign one user to department
const validAssignOneUser = ({ userId, departmentId }) => {
  //Check exist data
  if (!userId || !departmentId) {
    return 'Please add all fields.';
  }
};

//Check valid assign many users to department
const validAssignManyUsers = ({ users, departmentId }) => {
  //Check exist data
  if (users.length === 0 || !departmentId) {
    return 'Please add all fields.';
  }
};

module.exports = {
  validSignUp,
  validUpdate,
  validFilter,
  validatePassword,
  validAssignOneUser,
  validAssignManyUsers
};
