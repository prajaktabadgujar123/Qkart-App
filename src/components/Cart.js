import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";
import Checkout from "./Checkout";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 *
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productList) => {
  if (!productList) return [];

  return cartData.map(({ productId, qty }) => {
    const product = productList.find(({ _id }) => _id === productId);
    return { qty, ...product };
  });
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  return items.reduce((c, { qty, cost }) => c + qty * cost, 0);
};

/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 *
 * @param {Number} value
 *    Current quantity of product in cart
 *
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 *
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 *
 *
 */
const ItemQuantity = ({ value, handleAdd, handleDelete, isReadOnly }) => {
  if (isReadOnly)
    return (
      <Box padding="0.5rem" data-testid="item-qty">
        Qty: {value}
      </Box>
    );

  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

/**
 * Component to display the Cart view
 *
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 *
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 *
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 *
 *
 */
const Cart = ({ productList, items, handleQuantity, isReadOnly }) => {

  const history = useHistory();

  if (!isReadOnly) 
    items = generateCartItemsFrom(items, productList);

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  const total = getTotalCartValue(items);

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}

        {items.map(({ _id, qty, name, cost, image }) => (
          <Box display="flex" alignItems="flex-start" padding="1rem" key={_id}>
            <Box className="image-container">
              <img
                // Add product image
                src={ image }
                // Add product name as alt eext
                alt={name }
                width="100%"
                height="100%"
              />
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              height="6rem"
              paddingX="1rem"
            >
              <div>{name}</div>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <ItemQuantity
                  value={qty}
                  isReadOnly={isReadOnly}
                  handleAdd={() => handleQuantity(_id, qty + 1)}
                  handleDelete={ () => handleQuantity(_id, qty - 1) }
                />
                <Box padding="0.5rem" fontWeight="700">
                  ${cost}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}

        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${total}
          </Box>
        </Box>

        { !isReadOnly && (
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              onClick={() => history.push('/checkout')}
            >
              Checkout
            </Button>
          </Box>
        )}
      </Box>

      {isReadOnly && (
        <Box className='cart_details' sx={{ backgroundColor: 'white', m: 1, borderRadius: 1, p: 2 }}>
          <Typography variant="h5">Order Details</Typography>
          <p>
            <span>Products</span>
            <span>{items.reduce((c, { qty }) => qty + c, 0)}</span>
          </p>
          <p>
            <span>Subtotal</span>
            <span>${ total }</span>
          </p>
          <p>
            <span>Shipping Charges</span>
            <span>$0</span>
          </p>
          <p>
            <span>Total</span>
            <span>{ total}</span>
          </p>
        </Box>
      )}
    </>
  );
};

export default Cart;

