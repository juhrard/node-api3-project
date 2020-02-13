const express = require('express');
const Users = require('./userDb');
const Posts = require('../posts/postDb')

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  Users.insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {

      console.log(error);
      res.status(500).json({
        message: "Error adding the user",
      });
    });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const newPost = { ...req.body, user_id: req.params.id };

  Posts.insert(newPost)
    .then(post => {
      res.status(210).json(post);
    })
    .catch(error => {

      console.log(error);
      res.status(500).json({
        message: "Error getting the posts for the user",
      });
    });
});

router.get('/', (req, res) => {
  console.log("headers", req.headers);

  Users.get(req.query)
    .then(Users => {
      res.status(200).json(Users);
    })
    .catch(error => {

      console.log(error);
      res.status(500).json({
        message: "Error retrieving the Users",
      });
    });
});

router.get('/:id', validateUserId, (req, res) => {
  Users.getById(req.params.id)
  .then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "user not found" });
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      message: "Error retrieving the user",
    });
  });
});

router.get('/:id/posts', validateUserId, (req, res) => {
  Users.getUserPosts(req.params.id)
  .then(posts => {
    res.status(200).json(posts);
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      message: "Error getting the posts for the user",
    });
  });
});

router.delete('/:id', validateUserId, (req, res) => {
  Users.remove(req.params.id)
  .then(count => {
    if (count > 0) {
      res.status(200).json({ message: "The user has been nuked" });
    } else {
      res.status(404).json({ message: "The user could not be found" });
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      message: "Error removing the user",
    });
  });
});

router.put('/:id', validateUserId, (req, res) => {
  Users.update(req.params.id, req.body)
  .then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "The user could not be found" });
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      message: "Error updating the user",
    });
  });
});

//custom middleware

function validateUserId(req, res, next) {
  Users.getById(req.params.id)
    .then(user => {
      if(user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({ message: "Invalid user id" })
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Error retreiving the user",
      });
    });
}

function validateUser(req, res, next) {
  if(!req.body) {
    res.status(400).json({ message: "Missing user data" });
  } else if (!req.body.name) {
    res.status(400).json({ message: "Missing required name field" });
  } else {
    next()
  }
}

function validatePost(req, res, next) {
  if(!req.body) {
    res.status(400).json({ message: "Missing user data" });
  } else if (!req.body.text) {
    res.status(400).json({ message: "Missing required text field" });
  } else {
    next()
  }
}

module.exports = router;
