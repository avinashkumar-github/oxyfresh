import { loadStripe } from "@stripe/stripe-js";
import Noty from "noty";
import axios from "axios";

export async function stripe() {
  //Stripe load
  const stripe = await loadStripe(
    "pk_test_51JAH5MSJQQR3TnHr96T2ZacIQwnIZqPVMbNXVIDRnhT2RUDUoz1r24MoVY18iTjqaS0acXs2MqDqXOxGetZ9x3Qg00WOqOlQlH"
  );
  let card = null;
  function mountWidget() {
    let style = {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    };

    const element = stripe.elements();

    card = element.create("card", { style, hidePostalCode: true });
    card.mount("#coupon_code");
  }

  let coupon_code = document.querySelector("#coupon_code");
  if (coupon_code) {
    mountWidget();
  }

  //Proceed for payment
  let paymentForm = document.querySelector("#payment-form");
  if (paymentForm) {
    paymentForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      let formData = new FormData(paymentForm);
      let formObject = {};
      for (let [key, value] of formData.entries()) {
        formObject[key] = value;
      }

      // Verify card
      stripe
        .createToken(card)
        .then((result) => {
          formObject.stripeToken = result.token.id;
          //Place the order
          axios
            .post("/order/add", formObject)
            .then((res) => {
              new Noty({
                type: "success",
                timeout: 2000,
                text: res.data.message,
                progressBar: false
              }).show();
              setTimeout(() => {
                window.location.href = "/user/dashboard";
              }, 2000);
            })
            .catch((err) => {
              new Noty({
                type: "success",
                timeout: 1000,
                text: err.res.data.message,
                progressBar: false
              }).show();
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
}
