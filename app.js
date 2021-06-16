let express = require("express");
let app = express();
const mongoose = require('mongoose');
let article = require("./article"); 
let slugigy = require("slugify"); 
const e = require("express"); 
let user = require("./user"); 
let bcrypt = require ("bcryptjs"); 
let jwt = require ("jsonwebtoken"); 
let authSecret = "m120892mgc"; 
let auth = require ("./auth");
let cors = require ("cors");  


mongoose.connect('mongodb://localhost:27017/news', {useNewUrlParser: true, useUnifiedTopology: true});


app.use(cors()); 

app.use(express.json()); 

app.get("/", (req, res) => {
    article.find().then(articles => {
        res.json(articles); 

    }).catch(err => {
        res.statusCode = 500; 
        res.json({err: err}); 

    }); 
   
})

app.post("/article", auth, (req, res) => {

    var title = req.body.title;
    var content = req.body.content;
    var author = req.body.author;
    var category = req.body.category;
    var slug = slugify(title);

    res.json({title,content,author,category,slug}); 

    if(title == undefined || title == "" || title == " "){
        res.statusCode = 
        res.json({err: "O título não pode ser vazio"}); 
        return; 

    }
    const article = new article({
        title,
        content,
        author,
        category,
        slug, 
        publishDate: Date.now()
    }) 
    article.save().then(() => {
        res.statusCode = 200; 
        res.json({msg:  "Artigo salvo com sucesso"})
    
    }).catch(err => {
        res.statusCode = 500; 
    res.json({err: err}); 
    }); 


}); 

app.delete("/article/:id",(req, res) => {

    let id = req.params.id; 

    article.deleteOne({"_id": id }).then(d => {

        res.statusCode = 200; 
        res.send("Deletado com sucesso"); 

    }).catch(err => {
        if(err){
            res.statusCode = 500; 
            res.json({err: err})
        }
    })
})

app.get("/article/:slug", (req, res) => {
    let slug = req.params.slug; 
    article.findOne({slug: slug}).then(article => {
        if(article != undefined){
            res.json(article); 

        }else{
            res.json(undefined); 

        }

    }).catch(err =>{
        if(err){
            res.statusCode = 500; 
            res.json({err: err})

        }
    })
})

app.patch("/article/:id",(req, res) => {
   
    let id = req.params.id;

    article.findOneAndUpdate({_id: id},req.body).then(a => {

        res.json("OK"); 

    }).catch(err => {
        if(err){
            res.statusCode = 500; 
            res.json({err: err})
            
        }
    })

})

app.post("/user", (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    user.findOne({"email": email}).then(user => {

        if(user == undefined){ 

            let salt = bcrypt.genSaltSync(10); 
            var hash = bcrypt.hashSync(password, salt);

            let user = new user ({
                name,
                email,
                password: hash
            })
            
            user.save().then(u => {

                res.send("OK!)"); 

            }).catch(err => {
                if(err){
                    res.statusCode = 500; 
                    res.json({err: err})
                    
                }
                
            })

        }else{
            res.statusCode = 403;
            res.json({err: "Este email já está cadastrado"}); 

        }
    }).catch(err => {
        if(err){
            res.statusCode = 500; 
            res.json({err: err})
            
        }
    })
})

app.post("/login", (req, res) => {

let email = req.body.email; 
let password = req.body.password;
user.findOne({"email": email}).then(user => {

    if(user != undefined){

    var correctPassword =  bcrypt.compareSync(password,user.password); 

    if(correctPassword){

       let token =  jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: {email: email}
          }, authSecret);

        res.json({msg: "Você está logado!", token: token})


    }else{
        res.statusCode = 403; 
        res.json({err: "Senha incorreta"}); 

    }

    }else{
        res.statusCode = 403; 
        res.json({err: err}); 
    }

}).catch(err => {
    res.statusCode = 501; 
    res.json({err: err}); 
})

    
}); 

app.listen(3030,() => {
console.log("Servidor ok"); 
}); 