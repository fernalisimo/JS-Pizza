
var pizzaList;

var API = require("./API");

function getPizzaFromServer(callback) {
    API.getPizzaList(function(_, data){
        pizzaList = data;
        callback();
    });
}

function getPizzaList(){
    return pizzaList;
}

exports.getPizzaList = getPizzaList;
exports.getPizzaFromServer = getPizzaFromServer;