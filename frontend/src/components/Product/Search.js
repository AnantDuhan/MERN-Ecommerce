import React, { useState, Fragment } from "react";
import MetaData from "../layout/MetaData";
import "./Search.css";
import { useNavigate } from 'react-router';

const Search = () => {
    const [product, setProduct] = useState('');

    const navigate = useNavigate();

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (product.trim()) {
            navigate(`/products/${product}`);
        } else {
            navigate('/products');
        }
  };

  return (
    <Fragment>
      <MetaData title="Search A Product -- ECOMMERCE" />
      <form className="searchBox" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Search a Product ..."
          onChange={(e) => setProduct(e.target.value)}
        />
        <input type="submit" value="Search" />
      </form>
    </Fragment>
  );
};

export default Search;
