const express = require('express');
const { layout } = require('./views/');
const models = require('./models');
const volleyball = require('volleyball');
const wikiRouter = require('./routes/wiki');
const userRouter = require('./routes/user');

const app = express();
app.use(volleyball.custom({ debug: true }));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));

app.use('/wiki', wikiRouter);
//app.use('/user', userRouter);

app.get('/', (req, res, next) => {
  res.redirect('/wiki');
});

models.db.authenticate().then(() => {
  console.log('connected to the database');
});

const PORT = 8080;

const init = async () => {
  await models.db.sync({ force: true });

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
};

init();
