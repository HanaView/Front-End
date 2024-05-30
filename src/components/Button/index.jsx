import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./style.scss";

function Button({
  onClick,
  type = "button",
  disabled = false,
  className = "",
  style = {},
  color = "primary",
  size = "small",
  shape = "capsule",
  children,
  icon = undefined,
  loading = false,
  ...props
}) {
  const btnClass = classNames(
    "btn",
    {
      [`btn-${color}`]: color,
      [`btn-${size}`]: size,
      "btn-loading": loading,
      [`btn-${shape}`]: shape
    },
    className
  );

  return (
    <button
      // @ts-ignore
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={btnClass}
      style={style}
      {...props}
    >
      {loading && <span className="spinner" />}
      {icon && <span className="icon">{icon}</span>}
      {children}
    </button>
  );
}

Button.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["submit", "reset", "button"]),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  color: PropTypes.oneOf(["default", "primary", "secondary", "danger"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  shape: PropTypes.oneOf(["none", "capsule", "rect"]),
  icon: PropTypes.node, // 필수 아님
  loading: PropTypes.bool,
  children: PropTypes.node
};

export default Button;
