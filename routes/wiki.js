const express = require('express');
const router = express.Router();

const { Page, User } = require('../models');
const { addPage, wikiPage, main } = require('../views');

router.get('/', async (req, res, next) => {
  const pages = await Page.findAll();
  res.send(main(pages));
});

router.post('/', async (req, res, next) => {
  const page = new Page({
    title: req.body.title,
    content: req.body.content,
  });

  const [user, wasCreated] = await User.findOrCreate({
    where: {
      name: req.body.name,
      email: req.body.email,
    },
  });
  //console.log('new page in wiki router ', page);
  try {
    const createdPage = await page.save();
    createdPage.setAuthor(user);
    //console.log('new page ', page);
    res.redirect(`/wiki/${createdPage.slug}`);
  } catch (error) {
    next(error);
  }
});

router.get('/add', (req, res, next) => {
  res.send(addPage());
});

router.get('/:slug', async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: {
        slug: req.params.slug,
      },
    });
    const author = await page.getAuthor();
    //console.log('page ', page);
    res.send(wikiPage(page, author));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
