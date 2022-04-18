module.exports = {
    isAdmin : (req,res,next) =>{
        if(req.isAuthenticated() && req.user.isAdmin == 1){
            return next()
        }
        req.flash('error_msg','You can`t acess the content, login first!');
        res.redirect('/')

    }
}