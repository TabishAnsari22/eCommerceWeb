import React, { useState, useEffect, useMemo } from "react";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import axios from "axios";
import { useContext } from "react";
import { GlobalContext } from "./Context";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const Payment = ({ cartItems }) => {
  let { state, dispatch } = useContext(GlobalContext);
   const useOptions = () => {
    const fontSize = useResponsiveFontSize();
    const options = useMemo(
      () => ({
        style: {
          base: {
            fontSize,
            color: "#424770",
            letterSpacing: "0.025em",
            fontFamily: "Source Code Pro, monospace",
            "::placeholder": {
              color: "#aab7c4",
            },
          },
          invalid: {
            color: "#9e2146",
          },
        },
      }),
      [fontSize]
    );

    return options;
  };
  const stripe = useStripe();
  const elements = useElements();
  const options = useOptions();

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }
    // console.log(cartItems,'cartItems');
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    if (!error) {
      const { id } = paymentMethod;
      const createdBy = state.user._id;
      console.log(id ,'id=');

      try {
        const data = await axios.post(
          `${state.baseUrl}/create-checkout-session`,
          {
            createdBy,
            id,
            amount: state.addCarts.reduce((acc, obj) => {
              let count = obj.price * obj.count;
              return acc + count;
            }, 0),
            cartItems: state.addCarts,
            // description: item.description
          },

          {
            withCredentials: true,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          }
        );
        console.log(data);
      } catch (e) {
        console.log(e);
      }
    }
  };
  function useResponsiveFontSize() {
    const getFontSize = () => (window.innerWidth < 450 ? "16px" : "18px");
    const [fontSize, setFontSize] = useState(getFontSize);

    useEffect(() => {
      const onResize = () => {
        setFontSize(getFontSize());
      };

      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
      };
    });

    return fontSize;
  }


  return (

    <div className="payment-containor">
      <div>
        <div className="payment-child">
          <div>
            <CreditCardIcon className="payment-icon" />
          </div>
          <h4 className="credit">Enter credit or debit card</h4>
        </div>
        <hr />

        <div className="payment-child-pay">
          <h5>Lioneus Pay</h5>
        </div>

        <div>
          <form onSubmit={handleCheckout}>
            <br />
            <CardElement
              options={options}
              onReady={() => {
                console.log("CardElement [ready]");
              }}
              onChange={(event) => {
                console.log("CardElement [change]", event);
              }}
              // onBlur={() => {
              //   console.log("CardElement [blur]");
              // }}
              // onFocus={() => {
              //   console.log("CardElement [focus]");
              // }}
            />

            {/* <button type="submit" disabled={!stripe}>
        Pay
      </button> */}
            <div className="purchese-containor">
              <button
                type="submit"
                disabled={!stripe}
                className="purchese-btn"
                onClick={handleCheckout}
              >
                Purchase
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default Payment;
