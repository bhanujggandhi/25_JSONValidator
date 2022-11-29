import React from "react";

import "./HelpItem.css";

const HelpItem = ({ number, title, subtitle }) => {
  return (
    <li className='process__item'>
      <span className='process__number'>{number}</span>
      <span className='process__title'>{title}</span>
      <span className='process__subtitle'>{subtitle}</span>
    </li>
  );
};

export default HelpItem;
