'use strict';

const express = require('express');
const cors=require('cors');
require('dotenv').config();
const server= express();
const PORT=process.env.PORT;
server.use(cors());
server.use(express.json());
const mongoose =require('mongoose');
const axios = require ('axios');


mongoose.connect(`${process.env.DB_LINK}` , {

    useNewUrlParser: true ,
    useUnifiedTopology:true,
})


const favorSchema = new mongoose.Schema({
email:String ,
url:String , 
title:String
})

const FavorModel=mongoose.model('favor',favorSchema );

server.get('/' , testHandler);
server.get('/favorite' , getFavorite) ; 
server.get('/getData' , getHandler) ; 
server.post('/addData' , addHandler) ;
server.delete('/deleteData/:itemId' , deleteHandler) ;
server.post('/updateData/:itemId' , updateHandler) ;



function getHandler (req,res){

let email2 = req.query.email;


FavorModel.find({email:email2} , function(error , data){
if(error){

    console.log('error in getdata',error);
    
}else{

console.log('data is ' , data);
    res.send(data);
}

})

}


function addHandler (req,res){

    let {email , url , title}= req.body ;

    FavorModel.create({email , url , title});
    getHandler(req,res);

}


async function deleteHandler(req,res){

let itemId = req.params.itemId;

FavorModel.remove({_id:itemId} , (err , data)=>{

if(err){

    console.log('error at adding data', err);
}else{
    getHandler(req,res);

}
})
}


async function updateHandler(req,res){
    let itemId = req.params.itemId;
    let {email , url , title}= req.body ;

    FavorModel.findByIdAndUpdate(itemId , {email , url , title} , (error , updatData)=>{
if(error){

    console.log('error at updating ' , error );

}else {

console.log('dataUpdated' , updatData);
FavorModel.find({email:req.body.email} , function(err , lastData){

if(err){

    console.log('err at gitting data after update' , err);

}else{
console.log('data after update' ,lastData )
    res.send(lastData);
}

})

}
    })

}


function getFavorite(req , res){

try{

let URL = 'https://ltuc-asac-api.herokuapp.com/allChocolateData';
axios.get(URL).then((itemResult)=> {


let itemArray=itemResult.data.map((element)=>{

return new itemClass(element);

})

res.send(itemArray);
})



}catch(error){


    console.log('err', error);
    res.send(error);
}

}

class itemClass{
constructor(element){
    this.title=element.title ;
    this.url=element.imageUrl;
}


}




function testHandler(req,res){

res.send('all is Good');

}
server.listen(PORT , ()=>{

console.log(`server listening on port:${PORT}`)

})
