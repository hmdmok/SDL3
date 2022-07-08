import React from "react";
import Tilt from "react-parallax-tilt";
import { Link } from "react-router-dom";

const Logo = ({ root, title, pic }) => {
  return (
    <Link to={root}>
      <Tilt
        className="d-flex flex-column  align-items-center logo border shadow p-1 m-1 bg-white  bg-opacity-25 rounded"
        style={{ height: 175, width: 175 }}
      >
        <h3>{title}</h3>
        <br />
        <img src={pic} alt="logo" height="100" width="100" />
      </Tilt>
    </Link>
  );
};

export default Logo;
