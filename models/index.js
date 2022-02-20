const Sequelize=require('sequelize');
const env=process.NODE_ENV||'development';
const config=require("../config/config")[env];

const User=require("./user");
const Page=require("./page");
const Board=require("./board");
const Post=require("./post");

const db={};
const sequelize=new Sequelize(
    config.database, config.username, config.password, config,
    );

db.sequelize=sequelize;
db.User=User;
db.Page=Page;
db.Board=Board;
db.Post=Post;

User.init(sequelize);
Page.init(sequelize);
Board.init(sequelize);
Post.init(sequelize);

// User.associate(db);
// Page.associate(db);
// Board.associate(db);
// Post.associate(db);

module.exports=db;