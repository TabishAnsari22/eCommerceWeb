import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "./Context";
import axios from "axios";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

let Product = () => {
  let { state, dispatch } = useContext(GlobalContext);
  let [products, setProducts] = useState([]);
  let [toggleReload, setToggleReload] = useState(false);
  let [editProduct, setEditProduct] = useState(null);
  let [loading, setLoading] = useState(false);

  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("sm");

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        let response = await axios({
          url: `${state.baseUrl}/products`,
          method: "get",
          withCredentials: true,
        });
        if (response.status === 200) {
          console.log("response: ", response.data.data);

          setProducts(response.data.data.reverse());
        } else {
          console.log("error in api call");
        }
      } catch (e) {
        console.log("Error in api call: ", e);
      }
    };
    getAllProducts();
  }, [toggleReload]);

  let updateHandler = async (e) => {
    e.preventDefault();

    try {
      let updated = await axios.put(
        `${state.baseUrl}/product/${editProduct?._id}`,
        {
          productPicture: editProduct.productPicture,
          title: editProduct.title,
          price: editProduct.price,
          condition: editProduct.condition,
          description: editProduct.description,
        },
        {
          withCredentials: true,
        }
      );
      console.log("updated: ", updated.data);

      setToggleReload(!toggleReload);
      setEditProduct(null);
      handleClose();
    } catch (e) {
      console.log("Error in api call: ", e);
      setLoading(false);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle className="modalHeading">Update Product </DialogTitle>
        <DialogContent>
          {editProduct !== null ? (
            <div>
              <form className="modalForm" onSubmit={updateHandler}>
                <div className="modalField">
                  <p>Product Pic:</p>{" "}
                  <input
                    className="modalInput"
                    type="text"
                    onChange={(e) => {
                      setEditProduct({
                        ...editProduct,
                        productPicture: e.target.value,
                      });
                    }}
                    value={editProduct.productPicture}
                  />
                </div>
                <div className="modalField">
                  <p>Title:</p>{" "}
                  <input
                    className="modalInput"
                    type="text"
                    onChange={(e) => {
                      setEditProduct({ ...editProduct, title: e.target.value });
                    }}
                    value={editProduct.title}
                  />
                </div>
                <div className="modalField">
                  <p>Price:</p>{" "}
                  <input
                    className="modalInput"
                    type="text"
                    onChange={(e) => {
                      setEditProduct({ ...editProduct, price: e.target.value });
                    }}
                    value={editProduct.price}
                  />
                </div>
                <div className="modalField">
                  <p>Condition:</p>{" "}
                  <input
                    className="modalInput"
                    type="condition"
                    onChange={(e) => {
                      setEditProduct({
                        ...editProduct,
                        condition: e.target.value,
                      });
                    }}
                    value={editProduct.condition}
                  />
                </div>
                <div className="modalField">
                  <p>Description:</p>{" "}
                  <input
                    className="modalInput"
                    type="description"
                    onChange={(e) => {
                      setEditProduct({
                        ...editProduct,
                        description: e.target.value,
                      });
                    }}
                    value={editProduct.description}
                  />
                </div>
              </form>
            </div>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button className="modalbtn" type="submit" onClick={updateHandler}>
            {" "}
            Process Update{" "}
          </Button>
        </DialogActions>
      </Dialog>

      <h1 className="productHeading">Products Page</h1>
      <div className="card_container">
        {products?.map((eachProduct) => (
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

            <div className="btnDiv">
              <button
                className="productDelete"
                onClick={async () => {
                  try {
                    setLoading(true);

                    let deleted = await axios.delete(
                      `${state.baseUrl}/product/${eachProduct?._id}`,
                      {
                        withCredentials: true,
                      }
                    );
                    console.log("deleted: ", deleted.data);
                    setLoading(false);

                    setToggleReload(!toggleReload);
                  } catch (e) {
                    console.log("Error in api call: ", e);
                    setLoading(false);
                  }
                }}
              >
                Delete product
              </button>

              <button
                className="productEdit"
                onClick={() => {
                  setEditProduct({
                    _id: eachProduct._id,
                    productPicture: eachProduct?.productPicture,
                    title: eachProduct?.title,
                    price: eachProduct?.price,
                    condition: eachProduct?.condition,
                    description: eachProduct?.description,
                  });
                  setOpen(true);
                }}
              >
                Edit Product
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
