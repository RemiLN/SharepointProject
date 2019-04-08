import { Web, Item, ItemUpdateResult, ItemAddResult, UserProfileQuery } from '@pnp/sp';
import IUEData from '../models/UE';
import UEPropertiesConst from '../const/UEProperties';
import { IBaseDataProvider } from './BaseDataProvider';

export interface IUEDataProvider extends IBaseDataProvider {
    getUEById(id: number) : Promise<IUEData>;
    getAllUe(): Promise<IUEData[]>;
    addUE(entity: IUEData) : Promise<void>;
    updateUE(entity: IUEData) : Promise<void>;
}

export default class UEDataProvider implements IUEDataProvider {
    public Web: Web;
    public TitleList: string; 

    constructor(siteUrl: string) {
        this.Web = new Web(siteUrl);
        this.TitleList = "UE";
    }
    public getUEById(id: number): Promise<IUEData> {
         return this.Web.lists.getByTitle(this.TitleList).items.getById(id)
            .select(UEPropertiesConst.ID, UEPropertiesConst.Title, UEPropertiesConst.Description, 
                UEPropertiesConst.Name, UEPropertiesConst.UVId,UEPropertiesConst.UVTitle,
                   )
            .expand(UEPropertiesConst.UV).get().then((item: Item) => {
              let ue : IUEData = {
                ID : item[UEPropertiesConst.ID],
                Title : item[UEPropertiesConst.Title],
                Description : item[UEPropertiesConst.Description],
                Name: item[UEPropertiesConst.Name],
                UV : item[UEPropertiesConst.UV], 
              };

              return Promise.resolve(ue);
          },(error) => {
              return Promise.reject(error);
          });
    }
    public getAllUe(): Promise<IUEData[]> {
        return this.Web.lists.getByTitle(this.TitleList).items.get().then((items: Item[]) => {
            let ues: IUEData[] = items.map((item: Item) => <IUEData> {
                ID: item[UEPropertiesConst.ID],
                Title: item[UEPropertiesConst.Title],
                Description : item[UEPropertiesConst.Description],
                Name: item[UEPropertiesConst.Name],
                UV : item[UEPropertiesConst.UV],
                
            });

            return Promise.resolve(ues);
        },(error) => {
            return Promise.reject(error);
        });
    }
    public addUE(entity: IUEData): Promise<void> {
        return this.Web.lists.getByTitle(this.TitleList).items.add({
            'Title': entity.Title,
            'Description': entity.Description,
            'Name': entity.Name,
            'UVId': entity.UV.ID,
        }).then((result: ItemAddResult) => {
            console.log(result);
            Promise.resolve();
        },(error) => {
            Promise.reject(error);
        });
    }
    public updateUE(entity: IUEData): Promise<void> {
       return this.Web.lists.getByTitle(this.TitleList).items.getById(entity.ID).update({
           'Title': entity.Title,
           'Description': entity.Description,
           'Name': entity.Name,
           'UVId': entity.UV.ID
       }).then((result: ItemUpdateResult) => {
            console.log(result);
            return Promise.resolve();
       },(error) => {
           return Promise.reject(error);
       });
    }
}