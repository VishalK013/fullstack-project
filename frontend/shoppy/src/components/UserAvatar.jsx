import React from "react";
import { Avatar, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useSelector } from "react-redux";

const BASE_URL = "http://192.168.1.1:5000";

const UserAvatar = ({ size = 30, onClick = null, showIconButton = false, src = null }) => {
  const user = useSelector((state) => state.user.user);
  const imageSrc = src || (user?.image ? `${BASE_URL}${user.image}` : null);

  const avatar = imageSrc ? (
    <Avatar
      src={imageSrc}
      alt="profile"
      sx={{ width: size, height: size, cursor: onClick ? "pointer" : "default" }}
      onClick={onClick}
    />
  ) : (
    <AccountCircleIcon
      sx={{ width: size, height: size, cursor: onClick ? "pointer" : "default" }}
      onClick={onClick}
    />
  );

  return showIconButton ? (
    <IconButton onClick={onClick} sx={{ p: 0 }}>
      {avatar}
    </IconButton>
  ) : (
    avatar
  );
};

export default UserAvatar;
