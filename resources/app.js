import Noty from "noty";
import axios from "axios";
import { stripe } from "./js/stripe";

//user-success-msg hide
let userSuccessMsg = document.querySelector(".user-success-msg");
if (userSuccessMsg) {
  setTimeout(() => {
    userSuccessMsg.remove();
  }, 2000);
}

//    user-error-msg
let userErrorMsg = document.querySelector("#user-error-msg");
if (userErrorMsg) {
  setTimeout(() => {
    userErrorMsg.remove();
  }, 2000);
}

var addToCart = document.querySelectorAll(".add-to-cart");
addToCart.forEach(function (btn) {
  btn.addEventListener("click", function (e) {
    var product = JSON.parse(btn.dataset.product);
    updateCart(product);
  });
});

function updateCart(product) {
  // Update the count to cart session
  axios
    .post("/cart/update", product)
    .then((response) => {
      new Noty({
        type: "success",
        timeout: 2000,
        text: "Item added to cart",
        progressBar: false
      }).show();
    })
    .catch((error) => {
      new Noty({
        type: "error",
        timeout: 2000,
        text: "Error adding to cart",
        progressBar: false
      }).show();
    });
}

let cartFromDetail = document.querySelector("#product_addtocart_form");
if (cartFromDetail) {
  cartFromDetail.addEventListener("submit", (e) => {
    e.preventDefault();

    let formData = new FormData(cartFromDetail);
    let formObject = {};
    for (let [key, value] of formData.entries()) {
      formObject[key] = value;
    }

    // Update the count to cart session
    axios
      .post("/cart/update", formObject)
      .then((response) => {
        new Noty({
          type: "success",
          timeout: 2000,
          text: "Item added to cart",
          progressBar: false
        }).show();
      })
      .catch((error) => {
        new Noty({
          type: "error",
          timeout: 2000,
          text: "Error adding to cart",
          progressBar: false
        }).show();
      });
  });
}

//Remove item from cart
// let removeCartItem = document.querySelector(".remove-cart-item");
// if (removeCartItem) {
//   removeCartItem.addEventListener("click", (e) => {
//     e.preventDefault();
//     axios.post("/cart/delete", { itemId: removeCartItem.dataset.item });
//   });
// }

var removeCartItem = document.querySelectorAll(".remove-cart-item");
removeCartItem.forEach(function (btn) {
  btn.addEventListener("click", function (e) {
    axios
      .post("/cart/delete", { itemId: btn.dataset.item })
      .then((response) => {
        let cartRow = document.querySelector(`#product_${btn.dataset.item}`);
        cartRow.remove();
        if (Object.keys(response.data.data).length == 0) {
          let checkout_cart_button = document.querySelector(
            `#checkout_cart_button`
          );
          checkout_cart_button.remove();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

//Initiate stripe
stripe();
