module.exports = {
    init(app){
      const staticRoutes = require("../routes/static");
      const userRoutes = require("../routes/users");
      const wikisRoutes = require("../routes/wikis");

      app.use(staticRoutes);
      app.use(userRoutes);
      app.use(wikisRoutes);
    }
  }