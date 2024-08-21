import React from 'react';

const ExampleCarouselImage = ({ imageUrl, text }) => {
  return (
    <img
      className="d-block w-100"
      src={imageUrl}
      alt={text}
    />
  );
};

export default ExampleCarouselImage;
