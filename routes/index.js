const express=require('express');
const Sequelize=require('sequelize');
const fs=require('fs');
const multer=require('multer');
const path=require('path');

const {Board, Page, Post, User}=require('../models');
const {isLoggedIn, isNotLoggedIn}=require('./middlewares');
const { render } = require('nunjucks');

const router=express.Router();

router.use((req, res, next)=>{
	res.locals.user=req.user;
	next();
});

router.get('/', async(req, res, next)=>{
	try{
		const page=await Page.findOne({where:{id:1}});
		console.log('page', page);
		res.cookie('paget', page.title);
		res.cookie('pagei', page.mainimage);
        const normalboards=await Board.findAll({where:{type:"normal"}});
        const photoboards=await Board.findAll({where:{type:"photo"}});
		res.render('main', {title:`${page.title}`, page, normalboards, photoboards});
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.get('/join', isNotLoggedIn, async (req, res, next)=>{
	res.render('join', {title:'join'});
});

router.get('/normalboard/:id', async(req, res, next)=>{
	try{
		const boardinfo=await Board.findOne({where:{id:req.params.id}});
		const posts=await Post.findAll({where:{type:"normal", boardid:req.params.id}});
		res.render('board-post/normalboard', {title:`일반 게시판 - ${boardinfo.title}`, boardinfo, posts});
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.get('/photoboard/:id', async(req, res, next)=>{
	try{
		const boardinfo=await Board.findOne({where:{id:req.params.id}});
		const posts=await Post.findAll({where:{type:"photo", boardid:req.params.id}});
		res.render('board-post/photoboard', {title:`포토 게시판 - ${boardinfo.title}`, boardinfo, posts});
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.get('/post-write', isLoggedIn, async(req, res, next)=>{
	try{
		const board=await Board.findOne({where:{id:req.query.board}});
		res.render('board-post/post-write', {title:`게시물 작성`, board});
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.get('/post/:id', async(req, res, next)=>{
	try{
		const post_tmp=await Post.findOne({
			where:{id:req.params.id},
		});
		await Post.update({
			views:post_tmp.views+1,
		},{
			where:{id:req.params.id},
		});

		const post=await Post.findOne({where:{id:req.params.id}});
		const board=await Board.findOne({where:{id:post.boardid}});
		res.render('board-post/post', {title:`${post.title}`, post, board});
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.get('/deletepost/:id', isLoggedIn, async(req, res, next)=>{
    try{
		const temp=await Post.findOne({where:{id:req.params.id}});
		if (req.user.nick===temp.writer){
			const posts=await Post.destroy({
				where:{id:req.params.id},
			});
			console.log('post delete!');
			res.redirect('/');
		}
		else{
			res.redirect('/?authError=권한이 없습니다!')
		}
    }catch(error){
        console.error(error);
        next(error);
    }
});

try{
	fs.readdirSync('uploads');
}catch(error){
	console.error('uploads 폴더가 존재하지 않습니다. 폴더를 새로 생성합니다.');
	fs.mkdirSync('uploads');
}

const upload=multer({
	storage:multer.diskStorage({
		destination(req, file, cb){
			cb(null, 'uploads/');
		},
		filename(req, file, cb){
			const ext=path.extname(file.originalname);
			cb(null, path.basename(file.originalname, ext)+new Date().valueOf()+ext);
		},
	}),
	limits:{fileSize:500*1024*1024},
});

router.post('/post-write-n', isLoggedIn, async(req, res, next)=>{
	try{
		const today = new Date();   
	    const time=today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate()+' '+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
		const post=await Post.create({
			title:req.body.title,
			content:req.body.content,
			writer:req.user.nick,
			type:req.body.type,
			boardid:req.body.boardid,
			date:time,
		});
		res.redirect(`/normalboard/${req.body.boardid}`);
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.post('/post-write-p', isLoggedIn, upload.single('image'), async(req, res, next)=>{
	try{
		const today = new Date(); 
	    const time=today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate()+' '+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
		const post=await Post.create({
			title:req.body.title,
			image:req.file.filename,
			content:req.body.content,
			writer:req.user.nick,
			type:req.body.type,
			boardid:req.body.boardid,
			date:time,
		});
		res.redirect(`/photoboard/${req.body.boardid}`);
	}catch(error){
		console.error(error);
		next(error);
	}
});

module.exports=router;