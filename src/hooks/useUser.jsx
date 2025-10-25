import { useContext } from "react";
import UserContext from "../app/context/UserProvider";

export const useUser = () => {
    return useContext(UserContext)
}