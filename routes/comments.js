const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const authmiddlewares = require('../middlewares/auth-middleware');

const Comments = require('../schemas/comments');



// 댓글 작성하기
router.post("/comments",authMiddleware, async (req, res) => {
    const { comment, itemId, time } = req.body;
    const nickname = res.locals.user["nickname"];
      
    const comment1 = new Comments({comment, itemId, nickname, time});
    await comment1.save();
  
    const result = await comment1.save();
    res.status(201).send({});
  });
  

  //댓글 불러오기
  router.get("/comments/:itemId", async (req, res) => {
    const {itemId} = req.params;
    
    const comments = await Comments.find({ itemId }).exec();
    
    res.send({ comments });
    console.log('댓글 목록을 보냈습니다.')
  });
  

  //댓글 삭제하기
  router.post("/comments/del/:commentid", authMiddleware, async (req, res) => {
    const { commentid } = req.params;
    const nickname = res.locals.user["nickname"];
    
    await Comments.deleteOne({ _id:commentid , nickname}); 
    res.json({ result: "success" });
  });
  

  //댓글 수정하기
  router.put("/comments/modi/:commentid", authMiddleware, async (req, res) => {
    const { comment, time } = req.body;
    const nickname = res.locals.user["nickname"];
    const { commentid } = req.params;
  
    await Comments.updateOne({ _id:commentid, nickname }, {comment: comment, time: time});
    
    res.json({ result: "success" });
  });