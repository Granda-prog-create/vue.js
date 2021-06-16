let jwt = require ("jsonwebtoken"); 
let authSecret = "m120892mgc";  

module.exports = function(req, res, next){

    let token = req.body.token;

    if(token != undefined){

        jwt.verify(token,authSecret,function(err, data){

            if(err){
                res.statusCode = 403; 
                res.json({err: "Token inválido"});
            
            }else{
                console.log(data); 
                next(); 
            }
        })

    }else{
        res.statusCode = 403; 
        res.json({err: "Token inválido"});
    }
    
}