if(process.env.NODE_ENV == 'production'){
    module.exports = {mongoURI:"mongodb+srv://viktor12:mydb1212@viktordb.njrpf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI:"mongodb://localhost/blogapp"}
}