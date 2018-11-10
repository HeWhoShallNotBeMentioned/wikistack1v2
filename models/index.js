const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/wikistack', {
  logging: false,
});

const Page = db.define('pages', {
  title: { type: Sequelize.STRING, allowNull: false },
  slug: { type: Sequelize.STRING, allowNull: false },
  content: { type: Sequelize.TEXT, allowNull: false },
  status: { type: Sequelize.ENUM('open', 'closed') },
});

Page.beforeValidate(page => {
  //console.log('page ', page);
  if (!page.slug) {
    page.slug = page.title
      .replace(/\s/g, '_')
      .replace(/\W/g, '')
      .toLowerCase();
  }
});

const User = db.define('users', {
  name: { type: Sequelize.STRING, allowNull: false },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
});

module.exports = { db, Page, User };
