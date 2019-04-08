import { Web, Item, ItemUpdateResult, ItemAddResult, UserProfileQuery } from '@pnp/sp';
import Project from '../models/project';
import ProjectPropertiesConst from '../const/ProjectProperties';
import { IBaseDataProvider } from './BaseDataProvider';



export interface IProjectDataProvider extends IBaseDataProvider {
    getProjectById(id: number) : Promise<Project>;
    getAllProject(): Promise<Project[]>;
    addProject(entity: Project) : Promise<void>;
    updateProject(entity: Project) : Promise<void>;
}
export default class ProjectDataProvider implements IProjectDataProvider {
    public Web: Web;
    public TitleList: string;

    constructor(siteUrl: string) {
        this.Web = new Web(siteUrl);
        this.TitleList = "Projects";
    }

    public getProjectById(id: number): Promise<Project> {
        return this.Web.lists.getByTitle(this.TitleList).items.getById(id).select(
            ProjectPropertiesConst.ID,ProjectPropertiesConst.DateSoutenance,ProjectPropertiesConst.Title,ProjectPropertiesConst.DateDebut,
        ).get().then((item:Item)=>{
            let project : Project = {
                ID : item[ProjectPropertiesConst.ID],
                Title : item[ProjectPropertiesConst.Title],
                DateDebut : item[ProjectPropertiesConst.DateDebut],
                DateSoutenance: item[ProjectPropertiesConst.DateSoutenance],
                
              };

              return Promise.resolve(project);
          },(error) => {
              return Promise.reject(error);
          });
        
    }
    public getAllProject(): Promise<Project[]> {
        return this.Web.lists.getByTitle(this.TitleList).items.get().then((items:Item[])=>{
            let ues: Project[] = items.map((item: Item) => <Project> {
                ID: item[ProjectPropertiesConst.ID],
                Title: item[ProjectPropertiesConst.Title],
                DateDebut : item[ProjectPropertiesConst.DateDebut],
                DateSoutenance: item[ProjectPropertiesConst.DateSoutenance],
                
            });
            return Promise.resolve(ues);
        },(error) => {
            return Promise.reject(error);
        });
    }
    public addProject(entity: Project): Promise<void> {
        return this.Web.lists.getByTitle(this.TitleList).items.add({
            'Title': entity.Title,
            'DateDebutProjet': entity.DateDebut,
            'DateSoutenance': entity.DateSoutenance,
        }).then((result: ItemAddResult) => {
            console.log(result);
            Promise.resolve();
        },(error) => {
            Promise.reject(error);
        });
    }
    public updateProject(entity: Project): Promise<void> {
       return this.Web.lists.getByTitle(this.TitleList).items.getById(entity.ID).update({
        'Title': entity.Title,
        'DateDebutProjet': entity.DateDebut,
         'DateSoutenance': entity.DateSoutenance,
       }).then((result: ItemUpdateResult) => {
        console.log(result);
        return Promise.resolve();
   },(error) => {
       return Promise.reject(error);
   });
    }
    
}