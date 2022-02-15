const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const authmiddlewares = require('../middlewares/auth-middleware');
const UserController = require('../controllers/userController');
const posting = require('../schemas/postSchema');
const upload = require('../modules/multer');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// 이미지 파일 AWS S3 저장

router.post('/imgs', upload.single('image'), UserController.uploadImage);

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
  res.json({});
});

// 게시글 삭제

router.delete('/items/delete/:itemId', authmiddlewares, async (req, res) => {
  await posting.deleteOne({ _id: req.params.itemId });
  res.json({ message: '삭제가 완료됐습니다.' });
});

// 게시글 수정

router.put('/items/modify/:itemId', authmiddlewares, async (req, res) => {
  const { item_url, title, price, description, date } = req.body;
  await posting
    .findByIdAndUpdate(req.params.itemId, {
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

// 전체 게시글 조회 //

router.get('/items', async (req, res) => {
  const postings = await posting.find();
  res.json({ list: postings });
});

// detail 화면에 보일 게시글 조회

router.get('/detail/:itemId', async (req, res) => {
  const itemId = req.params;
  const postings = await posting.findById(itemId);
  const comment = await comments.find({ itemId });

  res.json({ list: postings, comment });
});

// 수정 페이지 접속

router.get('/items/:itemId', authmiddlewares, async (req, res) => {
  const postings = await posting.findById(req.params.itemId);
  res.json({ list: postings });
});

module.exports = router;
