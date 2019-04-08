import { Web, Item, ItemUpdateResult, ItemAddResult, UserProfileQuery } from '@pnp/sp';
import Skill from '../models/Skill';
import SkillPropertiesConst from '../const/SkillProperties';
import { IBaseDataProvider } from './BaseDataProvider';

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
        throw new Error("Method not implemented.");
    }
    public getAllSkill(): Promise<Skill[]> {
        return this.Web.lists.getByTitle(this.TitleList).items.get().then((items:Item[])=>{
            let ues: Skill[] = items.map((item: Item) => <Skill> {
                ID: item[SkillPropertiesConst.ID],
                Title: item[SkillPropertiesConst.Title]
            });
            return Promise.resolve(ues);
        },(error) => {
            return Promise.reject(error);
        });
    }
    public addSkill(entity: Skill): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public updateSkill(entity: Skill): Promise<void> {
        throw new Error("Method not implemented.");
    }
   
}