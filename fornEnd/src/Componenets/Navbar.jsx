import { Link } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from "./Context";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import Icon from "./images/icons.png";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";

const Navbar = () => {
  let { state, dispatch } = useContext(GlobalContext);

  const logouthandler = async () => {
    try {
      let response = await axios.post(
        `${state.baseUrl}/logout`,
        {},

        {
          withCredentials: true,
        }
      );
      console.log("response", response.data);

      dispatch({ type: "USER_LOGOUT" });
    } catch (e) {
      console.log("Error in api", e);
    }
  };
  const SearchIconWrapper = styled("div")(({ theme }) => ({
    position: "absolute",
  }));

  //   console.log(state.cartItem.length);

  return (
    <>
      <nav className="nav_2">
        <div className="userName">
          {/* {state?.user?.firstName} {state?.user?.lastName} */}
          <img className="icon" src={Icon} alt="" />
        </div>

        <div className="serchDiv">
          <input
            className="serch"
            type="text"
            name="search"
            placeholder="Search..."
          ></input>
          <SearchIcon className="iconSerch" />
        </div>

        {state.isLogin === true ? (
          <div className="iconMain">
            <Link to="/AddToCart">
              <Badge badgeContent={state?.addCarts?.length} color="primary">
                <ShoppingCartIcon className="icon1" />
              </Badge>
            </Link>
            <Link to="/">
              <button className="navBtn">Home</button>
            </Link>
            <Link to="/Product">
              <button className="navBtn">Products</button>
            </Link>
            <Link to="/Profile">
              <button className="navBtn">Profile</button>
            </Link>
            <Link to="/MyOrder">
              <button className="navBtn">MyOrder</button>
            </Link>
            <Link to="/Createproducts">
              <button className="navBtn">CreateProducts</button>
            </Link>
            <Link to="/" onClick={logouthandler}>
              <button className="navBtn">Logout</button>
            </Link>
          </div>
        ) : null}

        {state.isLogin === false ? (
          <div className="iconMain">
            <Link to="/AddToCart">
              <Badge badgeContent={state?.addCarts?.length} color="primary">
                <ShoppingCartIcon className="icon1" />
              </Badge>
            </Link>
            <Link to="/">
              <button className="navBtn">Home</button>
            </Link>
            <Link to="/login">
              {" "}
              <button className="navBtn"> Login</button>
            </Link>
            <Link to="/signup">
              <button className="navBtn">Signup</button>
            </Link>
          </div>
        ) : null}
      </nav>
    </>
  );
};

export default Navbar;
