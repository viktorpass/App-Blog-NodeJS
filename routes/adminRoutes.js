const { application } = require('express');
const express = require('express');
const router = express.Router();
const mongo = require('mongoose');
const app = express();
require('../models/Category');
const Category = mongo.model('categories');
require('../models/Posts');
const Posts = mongo.model('posts');
const {isAdmin} = require('../helpers/isAdmin');


router.get('/',isAdmin,(req,res)=>{
    res.render("admin/index");
})


router.get('/categories',isAdmin,(req,res)=>{
    Category.find().then((categories)=>{
        
        res.render("admin/categories", {categories: categories.map(categories=> categories.toJSON())})
    }).catch(()=>{
        req.flash("error_msg","An error occurrred")
        res.redirect("/admin")
    })
    
})

router.get('/categories/add',isAdmin,(req,res)=>{
    res.render('admin/addcategories');
})

router.post('/categories/new',isAdmin,(req,res)=>{

    let errors = [];

    if(!req.body.name || typeof req.body.name === undefined  || req.body.name === null ){
        errors.push({text:"invalid name!"});
    }
    
    if(req.body.name.length < 2 ){
        errors.push({text:"category name is so small"});
    }
    if(errors.length > 0){
        res.render("admin/addcategories", {errors:errors})
    }else{
        const newCategory = {
            name:req.body.name,
            slug:req.body.slug
            
        }
        new Category(newCategory).save().then(()=>{
            req.flash('success_msg','New category has created');
            res.redirect("/admin/categories")
        }).catch(() => {
            req.flash('error_msg','An error occurred, try again');
        })
    }

    

})
router.get('/categories/edit/:id',isAdmin,(req,res)=>{
    Category.findOne({_id:req.params.id}).then((categories)=>{
        res.render('admin/editcategories',{categories: categories});
    }).catch((err)=>{
        req.flash('error_msg',"An error ocurred");
        res.redirect('/admin/categories');
    })
    
})


router.post('/categories/edit',isAdmin,(req,res)=>{

    Category.findOne({_id:req.body.id}).then((categories)=>{

        categories.name = req.body.name,
        categories.slug = req.body.slug
        

        categories.save().then(()=>{
            console.log("Save successfully");
            req.flash('success_msg','category edited successfully');
            res.redirect("/admin/categories")
        }).catch((err)=>{
            req.flash('error_msg','An error ocurred');
            
            res.redirect('/admin/categories')
        })
    }).catch((err)=>{
        console.log("ERROR" + err)
        req.flash('error_msg','An error ocurred editing category');
        res.redirect('/admin/categories');

    })
})

router.post('/categories/delete',isAdmin,(req,res)=>{
    Category.deleteOne({_id:req.body.id}).then(()=>{
        req.flash('success_msg','category deleted');
        res.redirect('/admin/categories');
    }).catch((err)=>{
        req.flash('error_msg','An error ocurred deleting the category');
        res.redirect('/admin/categories');
    })
})

router.get('/posts',isAdmin,(req,res)=>{
    Posts.find().populate('category').sort({date:"desc"}).then((post)=>{
        res.render('admin/posts',{post : post});
        
    }).catch((error)=>{
        req.flash('error_msg','An error ocurred in show the posts')
        res.redirect('/admin');
        console.log(error)
    })
    
});

router.get('/posts/add',isAdmin,(req,res)=>{
    Category.find().then((categories)=>{
        res.render('admin/addpost',{categories:categories});
    }).catch((err)=>{
        req.flash('error_msg','An error ocurred');
        res.redirect('/admin/posts');
    })
    
})

router.post('/posts/new',isAdmin,(req,res)=>{
    let errors = [];

    if(req.body.category == 0){
        errors.push({text:"Invalid category,register one!"})
    }
    if(errors.length > 0){
        res.redirect('/admin/posts')
    }else{
        let newPosts = {
            title:req.body.title,
            slug:req.body.slug,
            description:req.body.description,
            content:req.body.content,
            category:req.body.category
            
        }
        new Posts(newPosts).save().then(()=>{
            req.flash('success_msg','Post created succesfully');
            res.redirect('/admin/posts')
        }).catch((err)=>{
            req.flash('error_msg','An error ocurred saving the new post');
            res.redirect('/admin/posts');
            console.log(err);
        })
    }
})

router.get('/posts/edit/:id',isAdmin,(req,res)=>{
    Posts.findOne({_id:req.params.id}).then((post)=>{
        Category.find().then((categories)=>{
            res.render("admin/editPosts",{categories:categories, post:post});
            
        }).catch((err)=>{
            req.flash('error_msg','An error ocurred finding data');
            res.redirect('/admin/posts');
        })

        
    }).catch((error)=>{
        req.flash('error_msg','An error ocurred in loading form');
    })
    
})

router.post('/posts/edit',isAdmin,(req,res)=>{
    Posts.findOne({_id:req.body.id}).then((post)=>{

        post.title = req.body.title,
        post.slug = req.body.slug,
        post.description = req.body.description,
        post.content = req.body.content,
        post.category = req.body.category

        console.log(post)

        post.save().then(()=>{
            req.flash('success_msg','Edit successfully');
            res.redirect('/admin/posts');
        }).catch((error)=>{
            console.log(error)
            req.flash('error_msg','Error in save post');
            res.redirect('/admin/posts');
        })


    }).catch((error)=>{
        req.flash('error_msg','An error ocurred' + error)
        res.redirect('/admin/posts')
    })

})

router.post('/posts/delete',isAdmin,(req,res)=>{
    Posts.deleteOne({_id:req.body.id}).then(()=>{
        req.flash('success_msg','Post deleted');
        res.redirect('/admin/posts')
    }).catch(()=>{
        req.flash('error_msg')
    })
})




module.exports = router;