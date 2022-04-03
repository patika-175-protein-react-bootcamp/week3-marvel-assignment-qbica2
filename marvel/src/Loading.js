/* eslint-disable linebreak-style */
import React from "react";

function Loading() {
  return (
    <div className="container" >
      <div className="loader">
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
        <p>Loading...</p>
      </div>
    </div>
  );
}

export default Loading;