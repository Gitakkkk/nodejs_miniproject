const express = require('express');
const User = require('../schemas/user');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authMiddlleware = require('../middlewares/auth-middleware');

const postUsersSchemas = Joi.object({
  nickname: Joi.string()
    .required()
    .pattern(new RegExp('^[a-zA-Z0-9가-힣]{3,30}$')),
  password: Joi.string().required().min(4),
  confirmPassword: Joi.string().required().min(4),
});

// 회원가입구현
router.post('/signup', async (req, res) => {
  try {
    const { nickname, password, confirmPassword } =
      await postUsersSchemas.validateAsync(req.body);
    if (password !== confirmPassword) {
      res.status(400).send({
        errorMessage: '비밀번호를 확인해주세요.',
      });
      return;
    }
    if (nickname === password) {
      res.status(400).send({
        errorMessage: '닉네임과 비밀번호가 같습니다.',
      });
      return;
    }

    const existUsers = await User.find({ nickname });
    if (existUsers.length) {
      res.status(400).send({
        errorMessage: '이미 가입된 닉네임이 있습니다.',
      });
      return;
    }
    const user = new User({ nickname, password });
    await user.save();

    res.status(201).send({});
  } catch (err) {
    res.status(400).send({
      errorMessage: '요청한 형식이 올바르지 않습니다.',
    });
  }
});

const postAuthSchemas = Joi.object({
  nickname: Joi.string()
    .required()
    .pattern(new RegExp('^[a-zA-Z0-9가-힣]{3,30}$')),
  password: Joi.string().required().pattern(new RegExp('^{4,30}$')),
});

// 로그인 구현
router.post('/login', async (req, res) => {
  try {
    const { nickname, password } = await postAuthSchemas.validateAsync(
      req.body
    );

    const user = await User.findOne({ nickname }).exec();

    if (!user) {
      res.status(400).send({
        errorMessage: '닉네임 또는 패스워드가 잘못됐습니다.',
      });
      return;
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.status(400).send({
          errorMessage: '닉네임 또는 패스워드가 잘못됐습니다.',
        });
      }
    });

    if (nickname === password) {
      res.status(400).send({
        errorMessage: '닉네임과 비밀번호가 같습니다.',
      });
      return;
    }

    const token = jwt.sign(
      { nickname: user.nickname },
      `${process.env.SECRET_KEY}`
    );
    res.send({
      token,
    });
  } catch (error) {
    res.status(400).send({
      errorMessage: '요청한 형식이 올바르지 않습니다.',
    });
  }
});

// 사용자인증 미들웨어
router.get('/auth', authMiddlleware, async (req, res) => {
  const { user } = res.locals;
  res.send({
    user: {
      nickname: user.nickname,
    },
  });
});

module.exports = router;
