import { Web, Item, ItemUpdateResult, ItemAddResult, UserProfileQuery } from '@pnp/sp';
import Goal from '../models/Goal';
import UEPropertiesConst from '../const/GoalProperties';
import { IBaseDataProvider } from './BaseDataProvider';
import GoalPropertiesConst from '../const/GoalProperties';


export interface IGoalDataProvider extends IBaseDataProvider {
    getGoalById(id: number) : Promise<Goal>;
    getAllGoal(): Promise<Goal[]>;
    addGoal(entity: Goal) : Promise<void>;
    updateGoal(entity: Goal) : Promise<void>;
}
export default class GoalDataProvider implements IGoalDataProvider {
    public Web: Web;
    public TitleList: string;

    constructor(siteUrl: string) {
        this.Web = new Web(siteUrl);
        this.TitleList = "Goals";
    }

    public getGoalById(id: number): Promise<Goal> {
        return this.Web.lists.getByTitle(this.TitleList).items.getById(id).select(
            GoalPropertiesConst.ID,GoalPropertiesConst.Points,GoalPropertiesConst.Title,GoalPropertiesConst.Details,
        ).get().then((item:Item)=>{
            let goal : Goal = {
                ID : item[UEPropertiesConst.ID],
                Title : item[UEPropertiesConst.Title],
                Details : item[UEPropertiesConst.Details],
                Points: item[UEPropertiesConst.Points],
                
              };

              return Promise.resolve(goal);
          },(error) => {
              return Promise.reject(error);
          });
        
    }
    public getAllGoal(): Promise<Goal[]> {
        return this.Web.lists.getByTitle(this.TitleList).items.get().then((items:Item[])=>{
            let ues: Goal[] = items.map((item: Item) => <Goal> {
                ID: item[UEPropertiesConst.ID],
                Title: item[UEPropertiesConst.Title],
                Details : item[UEPropertiesConst.Details],
                Points: item[UEPropertiesConst.Points],
            });
            return Promise.resolve(ues);
        },(error) => {
            return Promise.reject(error);
        });
    }
    public addGoal(entity: Goal): Promise<void> {
        return this.Web.lists.getByTitle(this.TitleList).items.add({
            'Title': entity.Title,
            'Details': entity.Details,
            'Points': entity.Points,
            
        }).then((result: ItemAddResult) => {
            console.log(result);
            Promise.resolve();
        },(error) => {
            Promise.reject(error);
        });
    }
    public updateGoal(entity: Goal): Promise<void> {
       return this.Web.lists.getByTitle(this.TitleList).items.getById(entity.ID).update({
        'Title': entity.Title,
        'Details': entity.Details,
        'Points': entity.Points,
        
       }).then((result: ItemUpdateResult) => {
        console.log(result);
        return Promise.resolve();
   },(error) => {
       return Promise.reject(error);
   });
    }
    
}