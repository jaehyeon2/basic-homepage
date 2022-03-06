const express=require('express');
const Sequelize=require('sequelize');
const fs=require('fs');
const multer=require('multer');
const path=require('path');

const {Board, Page, Post, User}=require('../models');
const {isLoggedIn, isNotLoggedIn, isAdmin}=require('./middlewares');
const { findAll } = require('../models/user');

const router=express.Router();

router.use((req, res, next)=>{
	res.locals.user=req.user;
	next();
});

router.get('/', isLoggedIn, isAdmin, async(req, res, next)=>{
	res.render('adminpage/main', {title:`- admin`});
	//res.render('adminpage/main', {title:`${page.title} - admin`});
});

router.get('/main', isLoggedIn, isAdmin, async(req, res, next)=>{
	res.render('adminpage/sitemanage', {title:`메인 화면 관리`});
});

router.get('/board', isLoggedIn, isAdmin, async(req, res, next)=>{
	try{
		let boards;
		const type=req.query.type;
		if (type==="normal"){
			boards=await Board.findAll({where:{type:"normal"}});
			console.log('boards', boards);
			res.render('adminpage/boardlist', {title:`일반 게시판 목록`, boards, type});
		}
		else{
			boards=await Board.findAll({where:{type:"photo"}});
			res.render('adminpage/boardlist', {title:`포토 게시판 목록`, boards, type});
		}	
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.get('/boardcreate', isLoggedIn, isAdmin, async(req, res, next)=>{
	const type=req.query.type;
	res.render('adminpage/boardcreate', {title:`${type} 게시판 생성`, type});
});

router.post('/boardcreate', isLoggedIn, isAdmin, async(req, res, next)=>{
	try{
		const board_temp=await Board.findOne({where:{title:req.body.title, type:req.body.type}});
		if (board_temp){
			res.redirect('/admin?boardError=이미 존재하는 게시판입니다.');
		}else{
			console.log('title', req.body.title);
			console.log('type', req.body.type);
			board=await Board.create({
				title:req.body.title,
				type:req.body.type,
			});
			res.redirect('/admin');
		}
		
	}catch(error){
		console.error(error);
		next(error);
	}
})

router.get('/postmanage/:id', isLoggedIn, isAdmin, async(req, res, next)=>{
	try{
		console.log('id', req.params.id);
		const posts=await Post.findAll({where:{boardid:req.params.id}});
		const board=await Board.findOne({where:{id:req.params.id}});
		res.render('adminpage/boardmanage', {title:`게시판 관리`, posts, board});
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.get('/deleteboard/:id', isLoggedIn, isAdmin, async(req, res, next)=>{
    try{
		const posts=await Post.destroy({
			where:{boardid:req.params.id},
		});
		console.log('posts', posts);
		console.log('all post delete!');
        await Board.destroy({
            where:{id:req.params.id},
        });
        console.log('board delete!');
        res.redirect('/admin');
    }catch(error){
        console.error(error);
        next(error);
    }
});

router.get('/deletepost/:id', isLoggedIn, isAdmin, async(req, res, next)=>{
    try{
		const posts=await Post.destroy({
			where:{id:req.params.id},
		});
        console.log('post delete!');
        res.redirect('/admin');
    }catch(error){
        console.error(error);
        next(error);
    }
});

try{
    fs.readdirSync('uploads');
} catch(error){
    console.error('uploads folder is no exist. create upload folder');
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

router.post('/image', isLoggedIn, isAdmin, upload.single('image'), async(req, res, next)=>{
	try{
		console.log('img', req.file.filename);
		const temp=await Page.findOne({where:{id:1}});
		//console.log('temp', temp.id);
		if (!temp){
			console.log('null');
			const page=await Page.create({
				title:req.body.title,
				mainimage:req.file.filename,
			});
		}else{
			console.log('not null');
			const page=await Page.update({
				title:req.body.title,
				mainimage:req.file.filename,
			},{
				where:{id:temp.id}
			});
		}
        
        res.redirect('/');
    }catch(error){
        console.error(error);
        next(error);
    }
});

module.exports=router;