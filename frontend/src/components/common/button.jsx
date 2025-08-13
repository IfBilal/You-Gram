import React from "react";

function Button(props) {
  return (
    <button
      className="bg-purple-800 text-white px-4 py-2 rounded hover:bg-purple-900 transition"
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
}

export default Button;
