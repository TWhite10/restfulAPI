const express = require("express");
const router = express.Router();

const posts = require("../data/posts");
const error = require("../utilities/error");

router
  .route("/")
  .get((req, res) => {
    const links = [
      {
        href: "posts/:id",
        rel: ":id",
        type: "GET",
      },
    ];

    res.json({ posts, links });
  })
  .post((req, res, next) => {
    if (req.body.userId && req.body.title && req.body.content) {
      const post = {
        id: posts[posts.length - 1].id + 1,
        userId: req.body.userId,
        title: req.body.title,
        content: req.body.content,
      };

      posts.push(post);
      res.json(posts[posts.length - 1]);
    } else next(error(400, "Insufficient Data"));
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const post = posts.find((p) => p.id == req.params.id);

    const links = [
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "PATCH",
      },
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "DELETE",
      },
    ];

    if (post) res.json({ post, links });
    else next();
  })
  .patch((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        for (const key in req.body) {
          posts[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  })
  .delete((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        posts.splice(i, 1);
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  });

//get /api/post?usersID=<VALUE
//Retrieves all posts by a user with the specified postId.
// Not working = http://localhost:3000/api/posts?userId=3&api-key=perscholas
//comment out the other -  .route("/") for this to work as intended
router
  .route("/")
 
  .get( (req, res, next) => {

    const userId = Number(req.query.userId);


    if (userId){
     
      const postsbyUserr = posts.filter(p => Number(p.userId) == userId);
      if (postsbyUserr.length === 0){
        next(error(404, "No Posts Found"));
        return;
    }
    
     res.json({
       posts : postsbyUserr
    });
    } else{
      res.json({
        posts : posts
     });
    };
   

   });

module.exports = router;
 