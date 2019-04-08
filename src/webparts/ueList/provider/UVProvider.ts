import { Web, Item } from '@pnp/sp';
import IUVData from '../models/UV';
import UVPropertiesConst from '../const/UVProperties';
import { IBaseDataProvider } from './BaseDataProvider';

export interface IUVDataProvider extends IBaseDataProvider {

    getUVById(id: number) : Promise<IUVData>;
    getAllUV(): Promise<IUVData[]>;
    addUV(entity: IUVData) : Promise<void>;
    updateUV(entity: IUVData) : Promise<void>;
}

export default class UVDataProvider implements IUVDataProvider {
    public Web: Web;
    public TitleList: string;

    constructor(siteUrl: string)
    {
        this.Web = new Web(siteUrl); 
        this.TitleList = "UV";
    }
    
    public getUVById(id: number): Promise<IUVData> {
        throw new Error("Method not implemented.");
    }
    public getAllUV(): Promise<IUVData[]> {
        return this.Web.lists.getByTitle(this.TitleList).items
            .select(UVPropertiesConst.ID, UVPropertiesConst.Title,UVPropertiesConst.Description).get().then((items: Item[]) => {
            let ues: IUVData[] = items.map((item: Item) => <IUVData> {
                ID: item[UVPropertiesConst.ID],
                Title: item[UVPropertiesConst.Title],
                Name : item[UVPropertiesConst.Name],
                Description : item[UVPropertiesConst.Description],
            });

            return Promise.resolve(ues);
        },(error) => {
            return Promise.reject(error);
        });
    }
    public addUV(entity: IUVData): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public updateUV(entity: IUVData): Promise<void> {
        throw new Error("Method not implemented.");
    }
}