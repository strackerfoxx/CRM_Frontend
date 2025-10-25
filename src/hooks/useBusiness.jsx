import { useContext } from "react";
import BusinessContext from "../app/context/BusinessProvider";

export function useBusiness() {
    return useContext(BusinessContext)
}