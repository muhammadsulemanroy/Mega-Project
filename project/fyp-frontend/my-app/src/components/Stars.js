
import React from 'react';

const Stars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={i}>&#9733;</span>); // Unicode character for a star
  }

  if (halfStar) {
    stars.push(<span key="half">&#9733;&#189;</span>);
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(<span key={`empty-${i}`}>&#9734;</span>); // Unicode character for an empty star
  }

  return <div className="star-rating">{stars}</div>;
};

export default Stars;
