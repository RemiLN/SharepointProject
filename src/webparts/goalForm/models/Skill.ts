export interface SkillData {
    ID:number;
    Title: string;
  }
  export default class Skill implements SkillData
{
    public ID: number;
    public Title: string;

    constructor(entity: SkillData)
    {
        this.ID = entity.ID;
        this.Title = entity.Title;
    }
}