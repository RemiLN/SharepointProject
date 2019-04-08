export interface IProjectData {
    ID:number;
    Title: string;
    DateDebut:Date;
    DateSoutenance:Date;
  }
  export default class Project implements IProjectData
{
    public ID: number;
    public Title: string;
    public DateDebut:Date;
    public DateSoutenance:Date;

    constructor(entity: IProjectData)
    {
        this.ID = entity.ID;
        this.Title = entity.Title;
        this.DateDebut =entity.DateDebut;
        this.DateSoutenance = entity.DateSoutenance;
    }
}