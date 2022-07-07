import React from "react";
import Tilt from "react-parallax-tilt";
import { Link } from "react-router-dom";

const Logo = ({ root, title, pic }) => {
  return (
    <Link style={{  textDecoration: 'none', }} to={root}>
      <Tilt
        href={root}
        className="d-flex flex-column  align-items-center logo border shadow p-1 m-1 bg-white  bg-opacity-25 rounded"
        style={{ height: 175, width: 175 }}
      >
        <h5>{title}</h5>
        <br />
        <img src={pic} alt="logo" height="90" />
      </Tilt>
    </Link>
  );
};

export default Logo;
