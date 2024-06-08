import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom } from "./Cart";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState();
  const [productList, setProductlist] = useState();
  const [debounceTimeout, setDebounceTimeout] = useState();
  const isLoggedIn = localStorage.getItem("username") !== null;
  const token = localStorage.getItem("token");
  const [productsInCart, setProductsInCart] = useState([]);

  let Product = {};
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */

  const performAPICall = async () => {
    setLoading(true);
    let msg,
      variant = "success";
    let product = {};

    try {
      const response = await axios.get(`${config.endpoint}/products`);
      product = response.data;
    } catch (e) {
      msg =
        "Something went wrong. Check that the backend is running, reachable and returns valid JSON.";
      variant = "error";
      enqueueSnackbar(msg, { variant });
    }
    setLoading(false);
    setProductlist(product);
    // console.log("product",Product)
  };

  useEffect(() => {
    // code to run after render goes here
    performAPICall();
    if (isLoggedIn) {
      fetchCart();
    }
  }, []); // <-- empty array means 'run once'

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try {
      const response = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      setProductlist(response.data);
    } catch (err) {
      setProductlist(null);
      enqueueSnackbar(
        "Something went wrong. Check the backend console for more details",
        { variant: "error" }
      );
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    if (debounceTimeout !== 0) {
      clearTimeout(debounceTimeout);
    }
    // need not to be async
    const timeout = setTimeout(async () => {
      performSearch(event);
    }, 500);
    setDebounceTimeout(timeout);
  };

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async () => {
    try {
      const res = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
      setProductsInCart(res.data);
    } catch (e) {
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };

  const updateCart = async (productId, qty) => {
    try {
      const res = await axios.post(
        `${config.endpoint}/cart`,
        {
          productId,
          qty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setProductsInCart(res.data);
    } catch (e) {
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };

  function _handleAddToCart(id) {
    if (isLoggedIn) {
      if (productsInCart.findIndex(({ productId }) => productId === id) >= 0)
        enqueueSnackbar(
          "Item already in cart. Use the cart sidebar to update quantity or remove item.",
          { variant: "warning" }
        );
      else updateCart(id, 1);
    } else
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
  }

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {};

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {};

  return (
    <div>
      <Header hasHiddenAuthButtons={false}>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          size="small"
          onChange={(e) => debounceSearch(e.target.value, debounceTimeout)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        onChange={(e) => debounceSearch(e.target.value, debounceTimeout)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />
      <Grid container>
        <Grid item xs={12} md={isLoggedIn ? 8 : 12}>
          <Grid container>
            <Grid item className="product-grid">
              <Box className="hero">
                <p className="hero-heading">
                  India’s{" "}
                  <span className="hero-highlight">FASTEST DELIVERY</span> to
                  your door step
                </p>
              </Box>
            </Grid>
          </Grid>

          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <CircularProgress />
              <span>Loading Products</span>
            </div>
          ) : !productList ||
            Object.keys(productList).length === 0 ||
            productList.length === 0 ? (
            <Box spacing={2} className="loading">
              <SentimentDissatisfied />
              <p>No products found</p>
            </Box>
          ) : (
            <Grid container spacing={2} my={3}>
              {productList?.map((item) => {
                return (
                  <Grid item xs={6} md={3} key={item._id}>
                    <ProductCard
                      product={item}
                      handleAddToCart={() => _handleAddToCart(item._id)}
                    />
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Grid>

        {isLoggedIn && (
          <Grid item xs={12} md={4} sx={{ backgroundColor: "#E9F5E1" }}>
            <Cart
              productList={productList}
              items={productsInCart || []}
              handleQuantity={updateCart}
            />
          </Grid>
        )}
      </Grid>

      <Footer />
    </div>
  );
};

export default Products;
