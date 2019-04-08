import { Web, Item, ItemUpdateResult, ItemAddResult, UserProfileQuery } from '@pnp/sp';
import Skill from '../models/Skill';
import { IBaseDataProvider } from './BaseDataProvider';
import SkillPropertiesConst from '../const/SkillProperties';


export interface ISkillDataProvider extends IBaseDataProvider {
    getSkillById(id: number) : Promise<Skill>;
    getAllSkill(): Promise<Skill[]>;
    addSkill(entity: Skill) : Promise<void>;
    updateSkill(entity: Skill) : Promise<void>;
}
export default class SkillDataProvider implements ISkillDataProvider {
    public Web: Web;
    public TitleList: string;

    constructor(siteUrl: string) {
        this.Web = new Web(siteUrl);
        this.TitleList = "Skills";
    }

    public getSkillById(id: number): Promise<Skill> {
        return this.Web.lists.getByTitle(this.TitleList).items.getById(id).select(
            SkillPropertiesConst.ID,SkillPropertiesConst.GoalsPoints,SkillPropertiesConst.GoalsTitle, SkillPropertiesConst.GoalsId,SkillPropertiesConst.Title,
        ).expand(SkillPropertiesConst.Goals).get().then((item:Item)=>{
            let Skill : Skill = {
                ID : item[SkillPropertiesConst.ID],
                Title : item[SkillPropertiesConst.Title],
                Goals : item[SkillPropertiesConst.Goals],
              };

              return Promise.resolve(Skill);
          },(error) => {
              return Promise.reject(error);
          });
        
    }
    public getAllSkill(): Promise<Skill[]> {
        return this.Web.lists.getByTitle(this.TitleList).items.get().then((items:Item[])=>{
            let ues: Skill[] = items.map((item: Item) => <Skill> {
                ID : item[SkillPropertiesConst.ID],
                Title : item[SkillPropertiesConst.Title],
                Goals : item[SkillPropertiesConst.Goals],
            });
            return Promise.resolve(ues);
        },(error) => {
            return Promise.reject(error);
        });
    }
    public addSkill(entity: Skill): Promise<void> {
        return this.Web.lists.getByTitle(this.TitleList).items.add({
            'Title': entity.Title,
            'GoalsID': entity.Goals.forEach((item)=>{return item.ID}),
            
        }).then((result: ItemAddResult) => {
            console.log(result);
            Promise.resolve();
        },(error) => {
            Promise.reject(error);
        });
    }
    public updateSkill(entity: Skill): Promise<void> {
       return this.Web.lists.getByTitle(this.TitleList).items.getById(entity.ID).update({
        'Title': entity.Title,
            'GoalsID': entity.Goals.forEach((item)=>{return item.ID}),
        
       }).then((result: ItemUpdateResult) => {
        console.log(result);
        return Promise.resolve();
   },(error) => {
       return Promise.reject(error);
   });
    }
    
}