import React, { useEffect } from "react";
import MetaData from "../components/layout/MetaData";

import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../redux/action/productAction";
import Product from "../components/product/Product";
import Loader from "../components/layout/Loader";
import { toast } from "react-toastify";

const Home = () => {
  const dispatch = useDispatch();

  // pull the products from the state
  const { products, productsCount, loading, error } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (error) {
      return toast.error(error);
    }
    dispatch(getProducts());
  }, [dispatch, error, toast]);

  return (
    <>
      <h1 id="products_heading">Latest Products</h1>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={"Buy Best Products online"} />
          <section id="products" className="container mt-5">
            <div className="row">
              {products &&
                products.map((product) => (
                  <Product product={product} key={product._id} />
                ))}
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default Home;
