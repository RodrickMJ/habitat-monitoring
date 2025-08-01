import React from 'react';

export function ButtonI(props) {
    const {text, className = ""} = props
  return (
    <button className={`mt-8 hover:text-gray-300 text-white py-2 px-4 rounded-md ${className}`}>
      {text}
    </button>
  );
}
