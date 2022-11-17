import React from "react";
import { useContext, useState } from "react";
import CheckOutCarts from "./CheckOutCarts";
import { GlobalContext } from "./Context";
import Payment from "./Payment";

const CheckOut = () => {
  let { state, dispatch } = useContext(GlobalContext);

  const count = state.addCarts;
  var add = state.addCarts.reduce((acc, obj) => {
    let count = obj.price * obj.count;
    return acc + count;
  }, 0);

  const [trueValue,setTrueValue]=useState(false)

  return (
    <div className="containerOne">
      {
        (trueValue=== true)?<Payment cartItems ={state.addCarts}/>:<CheckOutCarts />
        
      }

      <div className="secDiv">
        <div className="inerDiv">
          <div className="sideCard">
            <h3>SubTotal</h3>
            <h3>Rs.{add}</h3>
          </div>
          <div className="line">
            <hr />
          </div>
          <div className="sideCard">
            <h3>Total</h3>
            <h3>Rs.{add}</h3>
          </div>
          <div className="sideCard">
            <p>
              Tax for the full value and fees will be calculated at checkout ❤️.
            </p>
          </div>
          <div className="summryBtn">
           
            <button onClick={()=>{setTrueValue(true)}} className="next">Next</button>
            <button onClick={()=>{setTrueValue(false)}} className="next">Back</button>
          
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
