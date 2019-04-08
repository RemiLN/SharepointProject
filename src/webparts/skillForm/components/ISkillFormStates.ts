import ISkillData from "../models/Skill";


export interface ISkillFormStates {
    Isloading: boolean;
    IsError: boolean;
    IsSaved: boolean;
    Error: any;
    selectedSkill: ISkillData;
    selectedId?:number;
    curentgoalsId:number[];
    goalList: any;
    skillList:any;
}