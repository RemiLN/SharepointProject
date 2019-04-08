import IUVData from "./UV";
export interface IUEData {
    ID:number;
    Title: string;
    Name: string;
    Description:string;
    UV:IUVData;
  }
  export default class UE implements IUEData
{
    public ID: number;
    public Title: string;
    public Name: string;
    public Description:string;
    public UV: IUVData;
    constructor(entity: IUEData)
    {
        this.ID = entity.ID;
        this.Title = entity.Title;
        this.Name = entity.Name;
        this.Description = entity.Description;
        this.UV = entity.UV;
    }
}