/* eslint-disable linebreak-style */
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import AppContext from './Contexts/AppContext';

import ReviewSummary from './Reviews/summary-reviews';
// import ProductFeed from './RelatedProducts/ProductFeed';
import QA from './QA/QA';
import ProductOverview from './ProductOverview/ProductOverview';

const App = () => {
  // ------------------------------------------------------------------------------------
  // ------------------                State                 ----------------------------
  // ------------------------------------------------------------------------------------
  const [productId, setProductId] = useState('18100');
  const [productInfo, setProductInfo] = useState({
    name: '',
    slogan: '',
    description: '',
    category: '',
    features: [],
    styles: [{
      style_id: '',
      name: '',
      original_price: '',
      sale_price: '',
      'default?': false,
      photos: [{
        url: '',
        thumbnail_url: '',
      }],
      skus: [],
    }],
  });
  const [selectedStyle, setSelectedStyle] = useState({
    style_id: '',
    name: '',
    original_price: '',
    sale_price: '',
    'default?': false,
    photos: [{
      url: '',
      thumbnail_url: '',
    }],
    skus: [],
  });
  const [displayImageIndex, setDisplayImageIndex] = useState(0);
  const [QAs, setQAs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewMeta, setReviewMeta] = useState({});

  // ------------------------------------------------------------------------------------
  // ------------------            HTTP Requests             ----------------------------
  // ------------------------------------------------------------------------------------
  // ------------------                Create                ----------------------------
  const createQuestion = (e) => {
    // e.preventDefault;
  };

  const createAnswer = () => { };
  // ------------------                 Read                 ----------------------------
  const fetchProduct = (id) => (
    Promise.all([axios.get(`/api/products/${id}`), axios.get(`/api/products/${id}/styles`)])
      .then(([infoRes, styleRes]) => ([infoRes.data, styleRes.data]))
      .then(([productInfo, productStyles]) => {
        setProductInfo({ ...productInfo, styles: productStyles.results });
        setSelectedStyle(() => (
          (productStyles.results.filter((style) => (style['default?']))[0]) || (productStyles.results[0])
        ));
        setDisplayImageIndex(0);
      })
  );
  // const fetchProductInfo = (id) => axios.get(`/api/products/${id}`);
  // const fetchProductStyles = (id) => axios.get(`/api/products/${id}/styles`);
  const fetchQA = (id) => (
    axios.get(`/api/qa/questions?count=1000&product_id=${id}`)
      .then(({ data }) => setQAs(data.results))
  );

  const fetchReviews = (id, sort = 'relevant') => (
    axios.get(`/api/reviews?count=1000&product_id=${id}&sort=${sort}`)
      .then(({ data }) => setReviews(data.results))
  );

  const fetchMetaReview = (id) => (
    axios.get(`/api/reviews/meta?product_id=${id}`)
      .then(({ data }) => setReviewMeta(data))
  );
  // ------------------                Update                ----------------------------
  const updateHelpful = () => { };

  const updateReport = () => { };
  // ------------------                Delete                ----------------------------

  // ------------------------------------------------------------------------------------
  // ------------------              Initialize              ----------------------------
  // ------------------------------------------------------------------------------------
  useEffect(() => {
    fetchProduct(productId)
      .then(() => (
        Promise.all([fetchQA(productId), fetchReviews(productId), fetchMetaReview(productId)])
      ));
  }, []);
  // ------------------------------------------------------------------------------------
  // ------------------                Render                ----------------------------
  // ------------------------------------------------------------------------------------
  const contextVal = {
    setProductId,
    productInfo,
    QAs,
    fetchQA,
    reviews,
    reviewMeta,
    fetchReviews,
    updateHelpful,
    updateReport,
    selectedStyle,
    setSelectedStyle,
    displayImageIndex,
    setDisplayImageIndex,
  };

  return (
    <AppContext.Provider value={contextVal}>
      <h1>APP GOES HERE</h1>
      <ProductOverview />
      {/* <ProductFeed />
      <ProductFeed /> */}
      <QA />
      <ReviewSummary />
    </AppContext.Provider>
  );
};

export default App;
