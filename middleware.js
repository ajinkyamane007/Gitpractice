// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const oidc = new ExpressOIDC({
  issuer: "{yourOktaOrgUrl}/oauth2/default",
  client_id: "yourOktaClientId}",
  client_secret: "{yourOktaClientSecret}",
  redirect_uri: "http://localhost:3000/users/callback",
  scope: "openid profile",
  routes: {
    login: {
      path: "/users/login"
    },
    callback: {
      path: "/users/callback",
      defaultRedirect: "/dashboard"
    }
  }
});

app.use(session({
  secret: "{aLongRandomString}",
  resave: true,
  saveUninitialized: false
}));

app.use(oidc.router);

app.use((req, res, next) => {
  if (!req.userinfo) {
    return next();
  }

  client.getUser(req.userinfo.sub)
    .then(user => {
      req.user = user;
      res.locals.user = user;

      next();
    });
});
