var express = require('express');
var router = express.Router();
var passport = require('passport');

// To return the user data to the client
router.get("/check", (req, res) => {
  console.log("user - " + req.user);
  console.log(req.session.passport);
  if (req.user === undefined) {
    res.json({});
  } else {
    res.json({
      user: req.user
    });
  }
});

router.get("/github", passport.authenticate("github"));

router.get("/yahoo", passport.authenticate("yahoo"));

// The redirect url
router.get("/github/redirect",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    // For redirecting into the client app
    res.redirect("http://localhost:8081/");
  }
);

router.get("/yahoo/redirect",
  passport.authenticate("yahoo", { failureRedirect: "/" }),
  (req, res) => {
    // For redirecting into the client app
    res.redirect("http://localhost:8081/");
  }
);

// The API to log out, it clears req.user
router.get('/logout', function(req, res, next) {
  req.logout();
  res.json({ msg: "Logged out" });
});

module.exports = router;