import IGoalData from './Goal'
export interface ISkillData {
    ID:number;
    Title: string;
    Goals:IGoalData[];
  }
  export default class SkillData implements ISkillData
{
    public ID: number;
    public Title: string;
    public Goals:IGoalData[];

    constructor(entity: ISkillData)
    {
        this.ID = entity.ID;
        this.Title = entity.Title;
        this.Goals = entity.Goals;
    }
}