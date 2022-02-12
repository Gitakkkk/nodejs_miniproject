const jwt = require('jsonwebtoken');
const User = require('../schemas/user')

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    const [tokenTpye, tokenValue] = authorization.split(' ');

    if (tokenTpye !== 'Bearer') {
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요'
        });
        return;
    }

    try {
        const { nickname } = jwt.verify(tokenValue, "veiw-scret-key");

        const user = User.find({ nickname }).exec().then((user) => {
            res.locals.user = user;
            next();
        });

    } catch (error) {
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요'
        });
        return;
    }
};