
var api = require("../API");
var PizzaCart = require("./PizzaCart");

var nameGroup = $(".name-group");
var phoneGroup = $(".phone-group");
var addressGroup = $(".address-group");

function initialize(){

    formValidationSetUp();

    $(".next-step-button").click(function () {

        //post order
        if(nameGroup.hasClass("has-success") && phoneGroup.hasClass("has-success") && addressGroup.hasClass("has-success")){
            var order_info = {
                name: $("#inputName").val(),
                phone: $("#inputPhone").val(),
                address: $("#inputAddress").val(),
                orders: PizzaCart.getPizzaInCart()
            };
            api.createOrder(order_info, function (err, orderData) {//dopisat' callback
                LiqPayCheckout.init({
                    data: orderData.data,
                    signature: orderData.signature,
                    embedTo: "#liqpay",
                    mode: "popup"// embed || popup
                }).on("liqpay.callback", function (data){
                    console.log(data.status);
                    console.log(data);
                }).on("liqpay.ready", function (data){
                    // ready
                }).on("liqpay.close", function (data){
                    // close
                });
            });
        }
        //else show where input is incorrect
        else{
            if(!nameGroup.hasClass("has-success")){
                nameGroup.addClass("has-error");
                nameGroup.find(".incorrect-name-tip").css("display", "inline");
            }
            if(!phoneGroup.hasClass("has-success")){
                phoneGroup.addClass("has-error");
                phoneGroup.find(".incorrect-phone-tip").css("display", "inline");
            }
            if(!addressGroup.hasClass("has-success")){
                addressGroup.addClass("has-error");
                addressGroup.find(".incorrect-address-tip").css("display", "inline");
            }
        }
    });

}

//on every typed letter shows whether the input is correct now
function formValidationSetUp(){

    var nameInput = nameGroup.find("#inputName");
    var nameTip = nameGroup.find(".incorrect-name-tip");

    nameInput.on("keyup", function (event) {
        var value = nameInput.val();

        if (!value) {
            nameGroup.removeClass("has-success");
            nameGroup.addClass("has-error");
            nameTip.css("display", "inline");
        } else {
            nameGroup.removeClass("has-error");
            nameGroup.addClass("has-success");
            nameTip.css("display", "none");

            for (var i = 0; i < value.length; i++) {
                if (inputCheck(nameGroup, i) === false) {
                    nameGroup.removeClass("has-success");
                    nameGroup.addClass("has-error");
                    nameTip.css("display", "inline");
                    break;
                }
            }
        }

    });

    var phoneInput = phoneGroup.find("#inputPhone");
    var phoneTip = phoneGroup.find(".incorrect-phone-tip");

    phoneInput.on("keyup", function (event) {
        var value = phoneInput.val();

        if (!value) {
            phoneGroup.removeClass("has-success");
            phoneGroup.addClass("has-error");
            phoneTip.css("display", "inline");
        } else {
            phoneGroup.removeClass("has-error");
            phoneGroup.addClass("has-success");
            phoneTip.css("display", "none");

            for (var i = 0; i < value.length; i++) {
                if (inputCheck(phoneGroup, i) === false) {
                    phoneGroup.removeClass("has-success");
                    phoneGroup.addClass("has-error");
                    phoneTip.css("display", "inline");
                    break;
                }
            }
        }

    });

    var addressInput = addressGroup.find("#inputAddress");
    var addressTip = addressGroup.find(".incorrect-address-tip");

    addressInput.on("keyup", function (event) {
        var value = addressInput.val();

        if (!value) {
            addressGroup.removeClass("has-success");
            addressGroup.addClass("has-error");
            addressTip.css("display", "inline");
        } else {
            addressGroup.removeClass("has-error");
            addressGroup.addClass("has-success");
            addressTip.css("display", "none");
        }

    });

}

function inputCheck(formGroup, i) {

    var value = formGroup.find(".form-control").val();
    var ch = value.charAt(i);

    //if it is name field, make sure its only letters
    if(formGroup.hasClass("name-group")){

        if(!ch.match(/[a-z]|[а-я]|і|ї|є| /i)){
            return false;
        } else{
            return true;
        }
    }
    //if it is phone field, check by regexp whether it is of the correct pattern
    else if(formGroup.hasClass("phone-group")){

        if(value.length === 13 && value.match(/\+380[0-9]{9}/i))
            return true;
        else if(value.length === 10 && value.match(/0[0-9]{9}/i))
            return true;
        else{
            return false;
        }
    }
}

//
var homeMarker, route, map;

function initializeMap() {

//Тут починаємо працювати з картою
    var mapProp = {
        center: new google.maps.LatLng(50.464379, 30.519131),
        zoom: 11
    };
    var html_element = document.getElementById("googleMap");
    map = new google.maps.Map(html_element, mapProp);
//Карта створена і показана

    var point = new google.maps.LatLng(50.464379, 30.519131);
    var marker = new google.maps.Marker({
                position:point,
                //map - це змінна карти створена за допомогою new google.maps.Map(...)
                map:map,
                icon:"assets/images/map-icon.png"
            });
    //Видалити маркер з карти можна за допомогою
    //marker.setMap(null);

    homeMarker = null;
    route = new google.maps.DirectionsRenderer;
    route.setOptions({suppress: true});
    route.setMap(map);

    google.maps.event.addListener(map, 'click', function (me){
        var coordinates = me.latLng;
        geocodeLatLng(coordinates, function (err, adress){
            if (!err) {
    //Дізналися адресу
                $("#inputAddress").val(adress);
                addressGroup.removeClass("has-error");
                addressGroup.addClass("has-success");
                $(".order-info-address-text").text(adress);

                calculateRoute(point, coordinates, function(err, routeDur){
                    $(".order-info-time-text").text(routeDur.duration.text);
                });

                console.log(adress);
            } else {
                console.log("Немає адреси");
            }
        })
    });
}


function geocodeLatLng(latlng, callback){
//Модуль за роботу з адресою
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location': latlng}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[1])  {
            var adress = results[1].formatted_address;
            callback(null, adress);
        } else {
            callback(new Error("Can't find adress"));
        }
    });
}

function geocodeAddress(adress, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, function (results, status) {
        if(status === google.maps.GeocoderStatus.OK && results[0]) {
            var coordinates = results[0].geometry.location;
            callback(null, coordinates);
        } else {
            callback(new Error("Can not find the adress"));
        }
    });
}

function calculateRoute(A_latlng, B_latlng,  callback) {
    var directionService = new google.maps.DirectionsService();
    directionService.route({
        origin: A_latlng,
        destination: B_latlng,
        travelMode: google.maps.TravelMode["DRIVING"]
    }, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            var leg = response.routes[0].legs[0];

            //delete previous markers if they existed
            if(homeMarker != null){
                homeMarker.setMap(null);
            }
            //add home marker
            homeMarker = new google.maps.Marker({
                position: B_latlng,
                map: map,
                icon: "assets/images/home-icon.png"
            });

            route.setDirections(response);
            callback(null, {
                duration: leg.duration
            });
        } else {
            callback(new Error("Can not find direction"));
        }
    });
}


//Коли сторінка завантажилась
google.maps.event.addDomListener(window, 'load', initializeMap);

exports.initialize = initialize;