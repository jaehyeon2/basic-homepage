const express=require('express');
const Sequelize=require('sequelize');

const {Board, Page, Post, User}=require('../models');
const {isLoggedIn, isNotLoggedIn}=require('./middlewares');

const router=express.Router();

router.use((req, res, next)=>{
	res.locals.user=req.user;
	next();
});

router.get('/', async(req, res, next)=>{
	try{
		const page=await Page.findAll({});
        const normalboard=await Board.findAll({});
        const photoboard=await Board.findAll({});
		res.render('main', {title:`${page.title}`, page, normalboard, photoboard});
	}catch(error){
		console.error(error);
		next(error);
	}
});

module.exports=router;