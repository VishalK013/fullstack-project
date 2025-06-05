import { AccessToken } from "./Api";

export const handleLogOut = () => {
    AccessToken.remove();
    localStorage.removeItem("user");

    window.location.href = "/login"
}