const express = require('express');
const Posts = require('./postDb');

const router = express.Router();

router.get('/', (req, res) => {
  console.log("headers", req.headers);

  Posts.get(req.query)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the Posts",
      });
    });
});

router.get('/:id', validatePostId, (req, res) => {
  Posts.getById(req.params.id)
  .then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "post not found" });
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      message: "Error retrieving the post",
    });
  });
});

router.delete('/:id', (req, res) => {
  Posts.remove(req.params.id)
  .then(count => {
    if (count > 0) {
      res.status(200).json({ message: "The post has been nuked" });
    } else {
      res.status(404).json({ message: "The post could not be found" });
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      message: "Error removing the post",
    });
  });
});

router.put('/:id', (req, res) => {
  Posts.update(req.params.id, req.body)
  .then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "The post could not be found" });
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      message: "Error updating the post",
    });
  });
});

// custom middleware

function validatePostId(req, res, next) {
  Posts.getById(req.params.id)
  .then(post => {
    if(post) {
      req.post = post;
      next();
    } else {
      res.status(400).json({ message: "Invalid post id" })
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      message: "Error retreiving the user",
    });
  });
}

module.exports = router;
