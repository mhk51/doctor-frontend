import React from 'react'
import './notifications.scss'
import { X } from 'react-feather'

const Notifications = () => {
  return (
    <div className="notifications">
      <div className="top">
        <h2>Notifications</h2>
        <X size={15} color="#929292" />
      </div>
      <div className="middle">
        <span>Activity</span>
        <hr />
      </div>
    </div>
  );
}

export default Notifications