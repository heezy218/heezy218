var cars=[];
var car01 = {
    name : "BMW",
    ph: "600ph",
    start : function(){
        console.log("engine is starting");
    },
    stop : function(){
        console.log("engine is stoped");
    }
}
var car02 = {
    name : "Volve",
    ph: "600ph",
    start : function(){
        console.log("engine is starting");
    },
    stop : function(){
        console.log("engine is stoped");
    }
}

cars[0]=car01;
cars[1]=car02;

console.log(car01.name);
console.log(car01.ph);