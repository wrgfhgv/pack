import React from 'react';

export function ExpandInfoArrow({ className = '', style = {} }) {
  return (
    <svg
      className={className}
      style={style}
      width="20"
      height="9"
      viewBox="0 0 20 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 9L7.17157 1.82843C8.73367 0.266333 11.2663 0.26633 12.8284 1.82843L20 9H0Z"
        fill="#F2F5F7"
      />
    </svg>
  );
}
