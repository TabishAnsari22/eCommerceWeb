import React from "react";
import { useContext } from "react";
import { GlobalContext } from "./Context";

const AddToCart = () => {
  let { state, dispatch } = useContext(GlobalContext);
  console.log(state.addCarts);

  const addCardDelete = (item) => {
    let Data = state.addCarts.filter(items=>  items._id != item._id)
    console.log("item",item);
    console.log(Data, "delete data");
    dispatch({
        type:"ADD_CARTS",
        payload: Data
      });
      localStorage.setItem("cartItem",JSON.stringify(Data))

  };

  return (
    <div className="cardContainer">
      {state?.addCarts?.map((items) => {
        return (
          <>
            <div className="addCardMain">
              <div>
                <img src={items.productPicture} alt="" />
              </div>
              <div className="productsDetails">
                <div><h3>{items.title}</h3></div>
                <div><p className="green"><b>{items.condition}</b></p></div>
                <div><h3 className="red">Rs =/ {items.price}</h3></div>
                <div><p className="dec">hvi uhihv gicig iwnignw    ig ntc ihc ihih c hm ovh iu9 v3 4uht h4th 9{items.description}</p></div>
                <div className="btnAddCart">
                <button
                  className="productDeletes"
                  onClick={()=>addCardDelete(items)}
                >
                  Delete
                </button>
                </div>
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
};

export default AddToCart;
