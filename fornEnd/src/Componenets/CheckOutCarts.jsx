import React from 'react'
import { useContext, useState } from "react";
import { GlobalContext } from "./Context";

const CheckOutCarts = () => {
    let { state, dispatch } = useContext(GlobalContext);
    console.log(state, "state");
  
    const increment = (items) => {
      const updateValue = state.addCarts.map((obj) => {
        if (obj._id === items._id) {
          return { ...obj, count: obj.count + 1 };
        }
        return obj;
      });
      dispatch({
        type: "ADD_CARTS",
        payload: updateValue,
      });
      console.log(updateValue, "updateValue");
    };
  
    const handleDecrement = (items) => {
      console.log(items, "item");
      if (items.count === 1) {
        return;
      }
  
      const updateValues = state.addCarts.map((obj) => {
        if (obj._id === items._id) {
          return { ...obj, count: obj.count - 1 };
        }
  
        console.log(obj, "obj");
        return obj;
      });
      dispatch({
        type: "ADD_CARTS",
        payload: updateValues,
      });
      console.log(updateValues, "updateValue");
    };
  

  return (
    <>
     <div className="card_containers">
        {state?.addCarts?.map((eachProduct) => (
          <div className="card" key={eachProduct?._id}>
            <div className="card_childimg">
              <img
                className="images"
                style={{ width: "100%" }}
                src={eachProduct?.productPicture}
                alt=""
              />
            </div>
            <div className="main">
              <div className="card_child">
                <p className="cardDivTitle">{eachProduct?.title}</p>
              </div>
              <div className="card_child">
                <p className="cardDivPrice">Rs.{eachProduct?.price}</p>
              </div>
            </div>
            <div className="card_child">
              <p className="cardDivCon">{eachProduct?.condition}</p>
            </div>
            <div className="card_child">
              <p className="cardDivDec">{eachProduct?.description}</p>
            </div>
            <div className="main9">
              <button
                className="increment"
                onClick={() => increment(eachProduct)}
              >
                +
              </button>
              <div className="countDiv">
                <h1> {eachProduct.count}</h1>
              </div>
              <button
                className="decrement"
                onClick={() => handleDecrement(eachProduct)}
              >
                -
              </button>
            </div>
          </div>
        ))}
      </div>
      
    </>
  )
}

export default CheckOutCarts
