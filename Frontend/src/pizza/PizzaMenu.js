/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

    Pizza_List.getPizzaList().forEach(function(pizza){
        //Якщо піка відповідає фільтру
        if(pizza.content.hasOwnProperty(filter)) {
            pizza_shown.push(pizza);
        }
    });

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

function changeActiveFilterElement(elementId){
    var navigation = $(".pizza-nav");
    navigation.find(".active").removeClass("active");
    navigation.find(elementId).addClass("active");
}

function initialiseMenu() {
    //Показуємо усі піци
    showPizzaList(Pizza_List.getPizzaList())

    //pizza filter (супербыдлокодерство)
    $(document).on("click", "#all", function(){
        changeActiveFilterElement("#all");
        showPizzaList(Pizza_List.getPizzaList());
    });
    $(document).on("click", "#meat", function(){
        changeActiveFilterElement("#meat");
        filterPizza('meat');
    });
    $(document).on("click", "#pineapple", function(){
        changeActiveFilterElement("#pineapple");
        filterPizza('pineapple');
    });
    $(document).on("click", "#mushrooms", function(){
        changeActiveFilterElement("#mushrooms");
        filterPizza('mushroom');
    });
    $(document).on("click", "#seafood", function(){
        changeActiveFilterElement("#seafood");
        filterPizza('ocean');
    });
    $(document).on("click", "#bera", function(){
        changeActiveFilterElement("#bera");
        filterPizza('tomato');
    });
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;