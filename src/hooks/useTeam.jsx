import { useContext } from "react";
import TeamContext from "../app/context/TeamProvider";

export function useTeam() {
    return useContext(TeamContext)
}