import React from "react";
import "./socialmedia.scss";
import TextBox from "../TextBox/TextBox";
import { Trash } from "@phosphor-icons/react";
const SocialMedia = (props) => {
  // Receive props as an argument
  const handleDelete = () => {
    props.onDelete(props.index); // Access props directly
  };

  return (
    <div className="socialmedia">
      <TextBox text={"URL"} width={"80%"} size={"small"} />
      <Trash
        onClick={handleDelete}
        size={24}
        style={{ marginLeft: "1rem", color: "red" }}
      />
    </div>
  );
};

export default SocialMedia;
