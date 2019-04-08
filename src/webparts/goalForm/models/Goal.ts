import Skill from "./Skill";
export interface GoalData {
    ID:number;
    Title: string;
    Points: number;
    Details:string;
    Skill:Skill;
  }
  export default class Goal implements GoalData
{
    public ID: number;
    public Title: string;
    public Points: number;
    public Details:string;
    public Skill: Skill;
    constructor(entity: GoalData)
    {
        this.ID = entity.ID;
        this.Title = entity.Title;
        this.Points = entity.Points;
        this.Details = entity.Details;
        this.Skill = entity.Skill;
    }
}