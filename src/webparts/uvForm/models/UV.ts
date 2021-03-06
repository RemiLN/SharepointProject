export default interface IUVData {
    ID: number;
    Title: string;
    Name:string;
    Description: string;
}

export default class UV implements IUVData
{
    public ID: number;
    public Title: string;
    public Name:string;
    public Description: string;

    constructor(entity: IUVData)
    {
        this.ID = entity.ID;
        this.Title = entity.Title;
        this.Name =entity.Name;
        this.Description = entity.Description;
    }
}