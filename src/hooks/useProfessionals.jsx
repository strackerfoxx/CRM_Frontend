import { useContext } from "react";
import ProfesionalContext from "../app/context/ProfesionalsProvider";

export function useProfessionals() {
    return useContext(ProfesionalContext)
}