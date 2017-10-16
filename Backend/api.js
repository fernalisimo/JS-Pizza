/**
/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');
var Keys = require("./data/Keys");
var crypto = require('crypto');

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};

function base64(str)	 {
    return new	Buffer(str).toString('base64');
}

function sha1(string)	{
    var sha1 = crypto.createHash('sha1');
    sha1.update(string);
    return sha1.digest('base64');
}

exports.createOrder = function(req, res) {
    var order_info = req.body;

    var descrPizza = "Замовлення: ";
    var payAmount = 0;

    for(var i = 0; i < order_info.orders.length; i++){
        var pizzaItem = order_info.orders[i];
        var pizzaSize = pizzaItem.size === "small_size" ? "Мала" : "Велика";
        descrPizza += "\n- " + pizzaItem.quantity + "шт. " + "["+ pizzaSize +"] " + pizzaItem.pizza.title;
        payAmount += pizzaItem.quantity* pizzaItem.pizza[pizzaItem.size].price;
    }

    var order = {
        version: 3,
        public_key: Keys.LIQPAY_PUBLIC_KEY,
        action: "pay",
        amount: payAmount,
        currency: "UAH",
        description: "Замовлення піци: " + order_info.name + "\nАдреса доставки: " + order_info.address + "\nТелефон: " + order_info.phone + "\n" + descrPizza,
        order_id: Math.random(),
//!!!Важливощоббуло1, боінакшевізьмегроші!!!
        sandbox:1
    };

    console.log("Creating Order", order);

    var data = base64(JSON.stringify(order));
    var signature = sha1(Keys.LIQPAY_PRIVATE_KEY + data + Keys.LIQPAY_PRIVATE_KEY);

    res.send({
        success: true,
        data: data,
        signature: signature
    });
};