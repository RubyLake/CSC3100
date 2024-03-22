const express = require('express');
const cors = require('cors');

const HTTP_PORT = 8000; // Create a port ; 80 is reserved for http, you cant use 80. If unsure look up a list of commonly used ports
console.log("Listening on port " + HTTP_PORT);// 
var app = express();
app.use(cors()); //cross origin resource sharing-  "look where the request is coming from"
class Fruit{
    constructor(strName, strColor){
        this.name = strName;
        this.color=strColor;

    }
}

var arrFruit = []; // array of objects 
let objBanana = new Fruit('banana', 'yellow')
let objApple = new Fruit('apple', 'red');
let objGrape = new Fruit('grape', 'purple');
arrFruit.push(objBanana);
arrFruit.push(objApple);
arrFruit.push(objGrape); // Pushed into the array of fruits "Pick it up, and push it onto the trailer"
arrFruit.push(new Fruit('kiwi', 'brown'))
app.get("/fruit"(req,res,next))=>{
    let strName=req.query.name;
    if (strName){
        arrFruit()
        if (fruit.name == strName){

        }
        res.status(200).send(arrFruit)
    }
    else{
        res.status(200).send(arrFruit)
    }

}
app.post("/fruit"(req,res,next))=>{
    res.status(200).send(arrFruit))
    let strName=req.query.name;
    let strColor=req.Fruit
    arrFruit.push(new Fruit(strName, strFruit));
    res.status(201).send(arrFruit);

}
app.get("/", (req,res,next) => { //HTTTP verb it will rspond with for restful api, / is BASE URL localhost 3000 
    let strFruit = req.query.fruit; //
    console.log("Routed to base route");
    console.log(strFruit);
    arrFruit.forEach(function(thisfruit){
        if(thisfruit.name == strFruit){
            res.status(200).send(arrFruit); //200 is okay ; ADDING A RECORD SUCCESSFULLY is 201, NOT FOUND is 404
        }
    })
    res.status(200).send('{"message":"Fruit not found"}');
})

app.get("/hello", (req,res,next) => {
    let strFruit = req.query.fruit;//?fruit=banana EXAMPLE
    console.log("Routed to hello route");
    console.log(strFruit);
   
    res.status(200).send("Hello " + strFruit);
})

app.listen(HTTP_PORT);