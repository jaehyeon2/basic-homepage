const express=require('express');
const Sequelize=require('sequelize');

const {Board, Page, Post, User}=require('../models');
const {isLoggedIn, isNotLoggedIn, isAdmin}=require('./middlewares');

const router=express.Router();

router.use((req, res, next)=>{
	res.locals.user=req.user;
	next();
});

router.get('/', isAdmin, async(req, res, next)=>{
	res.render('adminpage/main', {title:`- admin`});
	//res.render('adminpage/main', {title:`${page.title} - admin`});
});

module.exports=router;