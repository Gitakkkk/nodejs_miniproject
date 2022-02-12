const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const authmiddlewares = require('../middlewares/auth-middleware');

const posting = require('../schemas/postSchema');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// 게시글 작성 //

router.post('/items', authmiddlewares, async (req, res) => {
  const { item_url, title, price, description, date } = req.body;
  await posting.create({
    item_url,
    title,
    price,
    description,
    date,
  });
  res.send({});
});

// 전체 게시글 조회 //

router.get('/items', async (req, res) => {
  const postings = await posting.find();
  res.json({ list: postings });
});

// detail 화면에 보일 게시글 조회

router.get('/detail/:itemid', async (req, res) => {
  const postings = await posting.findById(req.params.itemid);

  res.json({ list: postings, comments });
});

// 수정 페이지 접속

router.get('/items/:itemid', async (req, res) => {
  const postings = await posting.findById(req.params.itemid);
  res.json({ list: postings });
});

// 수정 페이지 접속 후 삭제

router.post('/items/:itemid/delete', async (req, res) => {
  await posting.deleteOne({ _id: req.params.itemid });
  res.json({ message: '삭제가 완료됐습니다.' });
});

// 수정 페이지 접속 후 수정

router.post('/items/:itemid/modify', async (req, res) => {
  const { item_url, title, price, description, date } = req.body;
  await posting
    .findByIdAndUpdate(req.params.itemid, {
      $set: {
        item_url: item_url,
        title: title,
        price: price,
        description: description,
        date: date,
      },
    })
    .exec();
  res.json({ message: '수정이 완료됐습니다.' });
});

module.exports = router;
