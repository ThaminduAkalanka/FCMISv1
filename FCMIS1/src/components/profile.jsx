import React from "react";
import Profile from "../assets/profile.jpg";
const profile = () => {
  return (
    <div className="flex-1 justify-items-center">
      profile
      <img
        src={Profile}
        alt="profile"
        className="rounded-full h-20 w-20 flex items-center justify-center mr-3 border-2 border-blue-500"
      />
    </div>
  );
};

export default profile;
