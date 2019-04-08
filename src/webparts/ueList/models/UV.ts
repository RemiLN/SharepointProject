import IUEData from './UE';
export default interface IUVData {
    ID: number;
    Title: string;
    Name:string;
    Description: string;
    ListUE:IUEData[];
}

export default class UV implements IUVData
{
    public ID: number;
    public Title: string;
    public Name:string;
    public Description: string;
    public ListUE:IUEData[];
    constructor(entity: IUVData)
    {
        this.ID = entity.ID;
        this.Title = entity.Title;
        this.Name =entity.Name;
        this.Description = entity.Description;
        this.ListUE = entity.ListUE;
    }
}