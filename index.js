
////////////////////////////////////////////////////

const express = require("express");
const jwt = require("jsonwebtoken");
const secret = "1234";


const app = express();
app.use(express.json());

const users = [];

app.post("/signup" , function(req,res){

    let username = req.body.username;
    let password = req.body.password;
    users.push({
        username:username,
        password: password
    })
    

    res.json({
        msg : "account create"
    })

})

app.post("/signin", function(req,res){

    let username = req.body.username;
    let password = req.body.password;
    
    let found = null;
    for(i=0;i<users.length;i++){
        if(users[i].username==username && users[i].password == password){
            found = users[i];
        }
    }
    

    if(found){
        const token = jwt.sign({username:username},secret);
        res.json({
            token: token,
            msg: "successfully logged in"
        })
    } else {
        res.status(403).send({
            msg:"incorrect credentials"
        })
    }
})


function auth(req,res,next){

const token = req.headers.token;
if(!token){
    res.status(401).json({
        msg:"no token"
    })
}

try{
const info = jwt.verify(token,secret);
if(info.username){
req.username = info.username;
next();
}else {
    res.status(401).json({
        msg:"u need to login"
    })
}
} catch(error){
    res.status(401).json({
        msg:"no valid token exist"
    })
}

}

app.get("/me",auth, function(req,res){
  
     let found = null;
    for(i=0;i<users.length;i++){
        if(users[i].username==req.username){
            found = users[i];
        }
    }

    if(found){
        res.json({
            username:found.username,
            password:found.password,
            msg:"hey there"
        })

    } else {
        res.json({
            msg :"invalid token"
        })
    }
 
    
})
app.listen(3000);