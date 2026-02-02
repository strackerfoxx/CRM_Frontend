import { useContext } from "react";
import ClientContext from "../app/context/ClientProvider";

export function useClient() {
    return useContext(ClientContext)
}