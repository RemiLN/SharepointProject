import IProjectData from "../models/project";


export interface IProjetStates {
    Isloading: boolean;
    IsError: boolean;
    IsSaved: boolean;
    Error: any;
    selectedProject: IProjectData;
    selectedId?:number;
    ProjectList: any;
}