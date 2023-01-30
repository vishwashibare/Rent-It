

// isauthenticated is inbuilt function checks whether u r logined or not
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.session.returnTo = req.originalUrl;
      return res.redirect("/");
    }
    next();
  };

