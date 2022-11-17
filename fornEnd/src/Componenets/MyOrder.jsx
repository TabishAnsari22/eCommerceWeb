import React from "react";
import { useContext, useState } from "react";
import { GlobalContext } from "./Context";
import axios from "axios";
import { useEffect } from "react";

const MyOrder = () => {
  let { state, dispatch } = useContext(GlobalContext);
  let [order, setOrder] = useState([]);
  let [toggleReload, setToggleReload] = useState(false);
  ////////////////
  useEffect(() => {
    const getAllProducts = async () => {
      try {
        let response = await axios({
          url: `${state.baseUrl}/MyOrder`,
          method: "get",
          withCredentials: true,
        });
        if (response.status === 200) {
          console.log("response: ", response.data.data);

          setOrder(response.data.data);
        } else {
          console.log("error in api call");
        }
      } catch (e) {
        console.log("Error in api call: ", e.message);
      }
    };
    getAllProducts();
  }, [toggleReload]);

  ///////////
  //   return (
  // <div className="card_containers">
  //    {order?.map((eachProduct) => (
  //     return(
  //         eachProduct.cartItems.map((items)=>{
  //             return  <div className="card" key={eachProduct?._id}>
  //             <div className="card_childimg">
  //               <img
  //                 className="images"
  //                 style={{ width: "100%" }}
  //                 src={eachProduct?.productPicture}
  //                 alt=""
  //               />
  //             </div>
  //             <div className="main">
  //               <div className="card_child">
  //                 <p className="cardDivTitle">{eachProduct?.title}</p>
  //               </div>
  //               <div className="card_child">
  //                 <p className="cardDivPrice">Rs.{eachProduct?.price}</p>
  //               </div>
  //             </div>
  //             <div className="card_child">
  //               <p className="cardDivCon">{eachProduct?.condition}</p>
  //             </div>
  //             <div className="card_child">
  //               <p className="cardDivDec">{eachProduct?.description}</p>
  //             </div>
  //             <div className="main9">

  //             </div>
  //           </div>
  //         })
  //     )
  //     ))
  //     }
  // </div>
  //   )

  return (
    <div  className="card_containers">
      {order?.map((eachOrder) => {
        console.log("eachOrder", eachOrder);
        return eachOrder.cartItems.map((Items) => {
          return (
            <div className="card" key={Items?._id}>
              <div className="card_childimg">
                <img
                  className="images"
                  style={{ width: "100%" }}
                  src={Items?.productPicture}
                  alt=""
                />
              </div>
              <div className="main">
                <div className="card_child">
                  <p className="cardDivTitle">{Items?.title}</p>
                </div>
                <div className="card_child">
                  <p className="cardDivPrice">Rs.{Items?.price}</p>
                </div>
              </div>
              <div className="card_child">
                <p className="cardDivCon">{Items?.condition}</p>
              </div>
              <div className="card_child">
                <p className="cardDivCon"> Quaintity : {Items?.count}</p>
              </div>
              <div className="card_child">
                <p className="cardDivDec">{Items?.description}</p>
              </div>
              <div className="main9"></div>
            </div>
          );
        });
      })}
    </div>
  );
};

export default MyOrder;
