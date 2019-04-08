
export interface IGoalData {
    ID:number;
    Title: string;
    Points: number;
    Details:string;
  }
  export default class GoalData implements IGoalData
{
    public ID: number;
    public Title: string;
    public Points: number;
    public Details:string;
    constructor(entity: IGoalData)
    {
        this.ID = entity.ID;
        this.Title = entity.Title;
        this.Points = entity.Points;
        this.Details = entity.Details;
    }
}