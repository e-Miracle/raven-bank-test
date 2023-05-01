const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const authenticaitonRoutes = require("./routes/authentication.js");
const raveRoutes = require("./routes/raven.js");
const jwt = require("jsonwebtoken");
const paymentService = require('./services/payment_history.js');
const ravenService = require('./services/raven.js');
require('dotenv').config();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use('/my', function(req, res, next){
  const token = req.headers.authorization.split(' ')[1]; 
    //Authorization: 'Bearer TOKEN'
    if(!token){
        res.status(401).send();
    }
    //Decoding the token
    try {
      const decodedToken = jwt.verify(token,process.env.APP_KEY );
      req.user = {id:decodedToken.userId, email:decodedToken.email};
      next();
    } catch (error) {
      console.log(error);
      res.status(401).send();
    }
});

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.post('/raven/webhook', async (req, res, next)=>{
  try {
      switch (req.body.type) {
          case "transfer":
              //store
              await paymentService.storeExternal(req.body);
              //change status
              await ravenService.transferWebhook(req.body);
              break;
      
          case "collection":
              //store
              await paymentService.storeExternal(req.body);
              //credit user
              await ravenService.collectionWebhook(req.body);
          break;
          default:
              break;
      }
  } catch (error) {
      
  } finally{
      res.status(200).send({});
  }
});

app.use("/auth", authenticaitonRoutes);
app.use("/my/raven", raveRoutes);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

app.listen(port, () => {
  console.log(`RavenBank App listening at http://localhost:${port}`);
});