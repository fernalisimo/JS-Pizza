/**
 * Created by chaika on 25.01.16.
 */

$(function(){
    //This code will execute when the page is ready
    var Pizza_List = require('./Pizza_List');

    Pizza_List.getPizzaFromServer(function(){

        var PizzaMenu = require('./pizza/PizzaMenu');
        var PizzaCart = require('./pizza/PizzaCart');

        PizzaCart.initialiseCart();
        PizzaMenu.initialiseMenu();

        if(PizzaCart.isOrderPage) {
            var PizzaOrder = require("./pizza/PizzaOrder");
            PizzaOrder.initialize();
        }

    });


});