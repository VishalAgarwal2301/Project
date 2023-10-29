import express from "express";
import { getData, putData } from "./database.js";
const app=express()
app.use(express.json())
app.set("view engine","ejs")
app.use(express.static("public"))
app.use(express.urlencoded({extended:true}))

app.get('/',async(req,res)=>{
    res.render("index.ejs")
})
//render
app.get('/login',async(req,res)=>{
    res.render("login.ejs")
})
app.post('/login',async(req,res)=>{
    try {
        const data=await getData()
        const {username,pass}=req.body
        data.forEach(e=>{
            console.log(e.username,e.password)
            console.log(username,pass)
        })
        res.send("<h1>Login Successful</h1>")
    } catch (error) {
        res.send("Failed")
    }    
})

app.get('/register',async(req,res)=>{
    res.render("register.ejs")
})

app.post('/register',async(req,res)=>{
    const {username,Email,pass}=req.body
    try{
        const data=await putData(username,Email,pass)
        res.send("Successful")
    }
    catch{
        res.send("failed")
    }
    // if(data){
    //     res.render("Registration Successful")
    // }
    // else{
    //     res.render("Failed")
    // }
})

app.listen(3000,()=>{
    console.log("Server started")
})