import React from "react";
import Tilt from "react-parallax-tilt";
import { Link } from "react-router-dom";

const Logo = ({ root, title, pic }) => {
  return (
<<<<<<< HEAD
    <Link style={{  textDecoration: 'none', }} to={root}>
      <Tilt
        href={root}
        className="d-flex flex-column  align-items-center logo border shadow p-1 m-1 bg-white  bg-opacity-25 rounded"
        style={{ height: 175, width: 175 }}
      >
        <h5>{title}</h5>
        <br />
        <img src={pic} alt="logo" height="90" />
=======
    <Link to={root}>
      <Tilt
        className="d-flex flex-column  align-items-center logo border shadow p-1 m-1 bg-white  bg-opacity-25 rounded"
        style={{ height: 175, width: 175 }}
      >
        <h3>{title}</h3>
        <br />
        <img src={pic} alt="logo" height="100" width="100" />
>>>>>>> f9cbda4159e1e2f63160d254598efa594eabbc4a
      </Tilt>
    </Link>
  );
};

export default Logo;
