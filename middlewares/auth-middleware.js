const jwt = require('jsonwebtoken');
const User = require('../schemas/user');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const [tokenTpye, tokenValue] = authorization.split(' ');

  if (tokenTpye !== 'Bearer') {
    res.status(401).send({
      errorMessage: '1',
    });
    return;
  }

  try {
    const { nickname } = jwt.verify(tokenValue, `${process.env.SECRET_KEY}`);

    const user = User.find({ nickname })
      .exec()
      .then((user) => {
        res.locals.user = user;
        next();
      });
  } catch (error) {
    res.status(401).send({
      errorMessage: '2',
    });
    return;
  }
};
