import React from "react";

const Loader = ({text="Loading"}) => {
  return (
    <p className="loadingText">{text}</p>
  );
};

export default Loader;
