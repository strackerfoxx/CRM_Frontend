import { useContext } from "react";
import ServiceContext from "../app/context/ServiceProvider";

export function useService() {
    return useContext(ServiceContext)
}