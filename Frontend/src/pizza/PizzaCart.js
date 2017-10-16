/**
 * Created by chaika on 02.02.16.
 */

var Templates = require('../Templates');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//The whole HTML cart element
var shoppingCart = $(".shopping-cart");

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");

//Localstorage
var Storage = require("../storage/localstorage");

//Check if orger page
var isOrderPage = $(".btn-block").hasClass("edit-button");

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок

    //Якщо продукт вже є у кошику, то збільшити його кількість на 1
    for(var i = 0; i < Cart.length; i++){
        if(Cart[i].pizza.id === pizza.id && Cart[i].size === size){
            Cart[i].quantity += 1;
            updateCart();
            return;
        }
    }

    //Приклад реалізації, можна робити будь-яким іншим способом
    Cart.push({
        pizza: pizza,
        size: size,
        quantity: 1
    });

    //Оновити вміст кошика на сторінці
    updateCart();
}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    //TODO: треба зробити
    for(var i = 0; i < Cart.length; i++){
        if(Cart[i].pizza.id === cart_item.pizza.id && Cart[i].size === cart_item.size){
            Cart.splice(i, 1);
        }
    }

    //Після видалення оновити відображення
    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    $(shoppingCart).on("click", ".clear", function () {
        Cart = [];
        updateCart();
    });

    //Localstorage
    //Cart = JSON.parse(localStorage.getItem("savedData"));   //another variant of localstorage
    //if (Cart === null) Cart = [];
    var saved_orders = Storage.get("cart");
    if(saved_orders){
        Cart = saved_orders;
    }
    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function getPizzaSize(pizza, size) {
    //returns json of small or big sized pizza
    if(size === "small_size") {
        return pizza.small_size;
    } else{
        return pizza.big_size;
    }
}

function getOverallPrice() {
    //returns the sum of the prices from the cart
    var overallPrice = 0;
    for(var i = 0; i < Cart.length; i++){
        overallPrice += getPizzaSize(Cart[i].pizza, Cart[i].size).price * Cart[i].quantity;
    }
    var res = overallPrice + " грн";
    return res;
}

function getOverallCount() {
    //returns the sum of the prices from the cart
    var overallCount = 0;
    for(var i = 0; i < Cart.length; i++){
        overallCount += Cart[i].quantity;
    }
    return overallCount;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage
    //localStorage.setItem("savedData", JSON.stringify(Cart));    //another variant of localstorage
    Storage.set("cart", Cart);

    //Очищаємо старі піци в кошику
    $cart.html("");

    //Update overall price and pizza quantity
    shoppingCart.find(".overall").html(getOverallPrice());
    shoppingCart.find(".orders-count").html(getOverallCount());

    if(Cart.length === 0){
        $cart.append('<div class="empty-cart-text"><br>Замовте піцу!</div>');
    }

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        if(isOrderPage){
            $node.find(".order-details").addClass("non-editable");
            $node.find(".order-pizza-count").text(cart_item.quantity + " шт.");
        }

        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;

            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".minus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity -= 1;

            if(cart_item.quantity === 0){
                removeFromCart(cart_item);
            }

            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".count-clear").click(function(){
            //Видадяємо піцу
            removeFromCart(cart_item);
        });

        $cart.append($node);
    }

    if(Cart.length === 0){
        $(".order-button").attr('disabled', true);
        $(".order-button").addClass("disabled-button");
    } else {
        $(".order-button").attr('disabled', false);
        $(".order-button").removeClass("disabled-button");
    }

    Cart.forEach(showOnePizzaInCart);

}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;
exports.isOrderPage = isOrderPage;