import IUEData from "../models/Goal";


export interface IGoalFormStates {
    Isloading: boolean;
    IsError: boolean;
    IsSaved: boolean;
    Error: any;
    selectedGoal: IUEData;
    selectedId?:number;
    goalList: any;
    skillList:any;
}