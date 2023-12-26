import React from 'react'
import './deletemessagetemplate.scss'

const DeleteMessageTemplate = ({onclick}) => {
  return (
    <button onClick = {onclick} className="delete-btn">
      Cancel
    </button>
  );
}

export default DeleteMessageTemplate