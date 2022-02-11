const jwt = require('jsonwebtoken');

//Generate access token
const createAccessToken = async (payload) => {
  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '14m' });
  const { exp } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, { ignoreExpiration: true });
  return {
    token,
    exp,
  };
};

//Generate refresh token
const createRefreshToken = async (payload) => {
  const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  const { exp } = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, { ignoreExpiration: true });
  return {
    token,
    exp,
  };
};

module.exports = {
  createAccessToken,
  createRefreshToken,
};
