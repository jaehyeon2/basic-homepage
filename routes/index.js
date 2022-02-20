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
        const normalboards=await Board.findAll({where:{type=normal}});
        const photoboards=await Board.findAll({where:{type=photo}});
		res.render('main', {title:`${page.title}`, page, normalboards, photoboards});
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.get('/normalboard/:id', async(req, res, next)=>{
	try{
		const boardinfo=await Board.findOne({where:{id=req.params.id}});
		const posts=await Post.findAll({where:{type=normal}});
		res.render('board-post/normalboard', {title:`일반 게시판 - ${boardinfo.title}`, posts});
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.get('/photoboard/:id', async(req, res, next)=>{
	try{
		const boardinfo=await Board.findOne({where:{id=req.params.id}});
		const posts=await Post.findAll({where:{type:photo}});
		res.render('board-post/photoboard', {title:`포토 게시판 - ${boardinfo.title}`, posts});
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
	limits:{fileSize:5*1024*1024},
});

// router.get('/post-write', async(req, res, next)=>{
// 	try{
// 		const board=await Board.findOne({where:{id=res.params.board}});
// 		if (board.type="normal"){
// 			res.render('post-write', {title:`${board.title} - 글쓰기`, board});
// 		}else{
// 			res.render('board-post/photopost-write', {title:`${board.title} - 글쓰기`, board});
// 		}
// 	}catch(error){
// 		console.error(error);
// 		next(error);
// 	}
// });

router.post('/post-write', upload.single('img'), async(req, res, next)=>{
	try{
		const today = new Date();   
	    const time=today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate()+' '+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
		const post=await Post.create({
			title:req.body.name,
			image:req.file.filename,
			content:req.body.content,
			writer:req.user.nick,
			type:req.body.type,
			date:time,
		});
		if (req.body.type==="normal"){
			res.redirect(`/normalboard/${boardid}`);
		}else{
			res.redirect(`/photoboard/${boardid}`);
		}
	}catch(error){
		console.error(error);
		next(error);
	}
});

module.exports=router;