const express = require('express');
const handlebars = require('express-handlebars');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = process.env.port || 3000;
const host = '0.0.0.0'; 
const admin = require('./routes/adminRoutes');
const path = require('path');
const session = require("express-session");
const flash =  require("connect-flash");
const moment = require('moment');
require('./models/Posts');
const Posts = mongoose.model('posts')
require('./models/Category')
const Category = mongoose.model('categories')
const Users = require('./routes/userRoutes');
const passport = require('passport');
require('./auth/config')(passport);
const db = require('./auth/db');

//Sessão
app.use(session({
    secret:"24t2t892cb9",
    resave:true,
    saveUninitialized:true,
}));
app.use(passport.initialize());
app.use(passport.session())

app.use(flash());
//config
    // Configuração inicial do body parser
    app.use(bodyparser.urlencoded({extended:false}));
    app.use(bodyparser.json());

    // Configuração inicial do handlebars
   
    app.engine('handlebars',handlebars.engine({
        defaultLayout:'main',
        runtimeOptions:{
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        },
        helpers: {
            formatDate: (date) => {
                 return moment(date).format('DD/MM/YYYY HH:mm ');
             }
        }
    }));
    app.set('view engine', 'handlebars');

    // Retorna os arquivos estáticos da pasta public
    app.use(express.static(path.join(__dirname + 'public')));

    
    //middleware
    app.use((req,res,next)=>{ 
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        res.locals.user = req.user || null;
        next();
       });

    //mongo
    
    mongoose.connect(db.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        }).then(()=>{console.log("Mongo DB as connect")}).catch(error => console.log("A error ocurred" + error))


//Rotas
app.get('/',(req,res)=>{
    Posts.find().populate('category').sort({date:'desc'}).then((post)=>{
        res.render('index',{post:post});
    }).catch((error)=>{
        req.flash('error_msg','An error ocurred showing the posts');
        res.redirect('/404');
    
    })
    
});
//IMPLEMENTAR PARA ENCONTRAR COM O ID TAMBEM // ADICIONAR BUSCA POR CATEGORIAS
app.get('/posts/:slug',(req,res)=>{
    Posts.findOne({slug:req.params.slug}).then((post)=>{
        if(post){
            res.render('posts/index',{post:post});
        }else{
            req.flash('error_msg','Post not found');
            res.redirect('/');
        }
    }).catch((error)=>{
        console.log(error)
        req.flash('error_msg','Internal error');
        res.redirect('/');
    })
})


app.get('/404',(req,res)=>{
    res.sendStatus(404)
})

app.get('/categories',(req,res)=>{

    Posts.find().then((posts)=>{
        Category.find().then((categories)=>{
            res.render('categories/index',{categories:categories,posts:posts});
        }).catch((error)=>{
            req.flash('error_msg','An error ocurred');
            res.redirect('/')
        })
})
})

app.get('/categories/:slug',(req,res)=>{
    Category.findOne({slug:req.params.slug}).then((category)=>{

        if(category){
            Posts.find({category:category._id}).then((posts)=>{
                res.render('categories/posts',{posts:posts,category:category});
            }).catch((error)=>{
                req.flash('error_msg','An error ocurred listen the posts');
                res.redirect('/')
            })
        }else{
            req.flash('error_msg','Category doesn`t exist');
            res.redirect('/');
        }

    }).catch((error)=>{
        req.flash('error_msg','Cant find the category');
        res.redirect('/');
    })


})

app.use('/users',Users)
// Recebe o modulo e aponta para a rota /admin
app.use('/admin',admin);


app.listen(port,host,()=>{
    console.log('Server is listening at port: '+ port);
});