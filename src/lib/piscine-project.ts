// @ts-ignore
import piscineProjects from "../data/piscine-projects.json" with { type: "json" };

export function isPiscineProjects(id: number): boolean {
    for (const project of Object.entries(piscineProjects)){
        if (project[1] === id){
            return true;
        }
    }
    return false;
}