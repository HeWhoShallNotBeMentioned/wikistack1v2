const express = require('express');
const models = require('./models');
const volleyball = require('volleyball');
const wikiRouter = require('./routes/wiki');
const userRouter = require('./routes/user');

const app = express();
app.use(volleyball.custom({ debug: true }));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));

app.use('/wiki', wikiRouter);
app.use('/users', userRouter);

app.get('/', (req, res, next) => {
  res.redirect('/wiki');
});

models.db.authenticate().then(() => {
  console.log('connected to the database');
});

const PORT = 8080;
//sync needs to be wrapped in a function to be called to make sync happen.
const init = async () => {
  await models.db.sync({ force: false });

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
};

init();
