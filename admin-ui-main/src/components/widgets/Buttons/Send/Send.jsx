import React from 'react'
import './send.scss';
import { send } from '../../../../config/constants';

const SendButton = () => {
  return <button className="send-btn">{send}</button>;
}

export default SendButton