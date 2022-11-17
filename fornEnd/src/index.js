import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import ContextProvider from "./Componenets/Context";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51LyBFNAUV1ejpZwqhhrtXk5dzAmIFiZxuW5pclJfJxLG0JD5WH8F16E6nqW08eEPUFBU7TjYmhyCVMWOzAC0je4S00ZLSWSnNe");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ContextProvider>
    <Elements stripe={stripePromise}>
   
      <App />
      </Elements>
    </ContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
