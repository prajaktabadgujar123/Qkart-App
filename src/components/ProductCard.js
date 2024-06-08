import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  const { name, category, cost, rating, image, _id } = product;
  
  
  return (
    <Card className="card">
      <CardMedia
        component="img"
        height="194"
        image={image}
        alt={name}
      />
       <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="h5" color="text.secondary">
          ${cost}
        </Typography>
        <Rating name="read-only" value={rating} readOnly />
      </CardContent>
      <CardActions>
        <Button variant="contained" fullWidth startIcon={<AddShoppingCartOutlined />} onClick={ handleAddToCart }>
         ADD TO CART</Button>
      </CardActions>
      
    </Card>
  );
};

export default ProductCard;
