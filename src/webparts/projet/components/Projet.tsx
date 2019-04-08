import * as React from 'react';
import styles from './Projet.module.scss';
import { IProjetProps } from './IProjetProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IProjetStates } from './IProjetStates';
import IProjectData from '../models/project';
import { Spinner, SpinnerSize, DefaultButton, PrimaryButton, autobind, TextField, Dropdown, MessageBar, MessageBarType, Label, IDropdownOption, MaskedTextField, DialogContent, nullRender, DatePicker } from 'office-ui-fabric-react';
import NumberFormat from 'react-number-format';
import  ProjectDataProvider, { IProjectDataProvider } from '../provider/ProjectDataProvider';
import GoalPropertiesConst from '../const/ProjectProperties';
import { List } from '@pnp/sp';
import ProjectPropertiesConst from '../const/ProjectProperties';

export default class Projet extends React.Component<IProjetProps, IProjetStates> {
  private _projectDataProvider:IProjectDataProvider;

  constructor(props: IProjetProps) {
    super(props);
    this.state = {
      Isloading: true,
      IsError: false,
      IsSaved: false,
      Error: null,
      selectedProject: new IProjectData({ ID: 0, Title: '', DateDebut: null, DateSoutenance: null, }),
      ProjectList:[],
      selectedId:null};
      this._projectDataProvider = new ProjectDataProvider("https://groupesbtest.sharepoint.com/sites/DiiageDEV2020TeamFour");
      
      this.LoadProjectList();
      
    }
    private LoadProjectList() {
      this.setState({Isloading: true});
      this._projectDataProvider.getAllProject().then((data) => {
        this.setState({
            ProjectList: data.map((item: IProjectData) => {
              return {
              'key' : item[ProjectPropertiesConst.ID],
              'text':  item[ProjectPropertiesConst.Title]
              };
          }),
            Isloading: false
          });
      },(error) => {
        this.setState({IsError: true,Error : error.message});
      }).catch((error) => {
        this.setState({IsError: true, Error: error.message});
      });
    }
    private LoadSelectedProject(selected:number) {
      this.setState({Isloading: true});
      if(selected) {
        this._projectDataProvider.getProjectById(selected).then((data) => {
          this.setState((prevState,props) => ({
            selectedProject: data,
            selectedId:selected,
            Isloading: false
          }));
        },(error) => {
          this.setState({IsError: true, Error: error.message});
        }).catch((error) => {
          this.setState({IsError: true, Error: error.message});
        }
        );
      }
    }
  public render(): React.ReactElement<IProjetProps> {
    return (
      <div className={ styles.projet }>
        <div className={ styles.container }>
        {(this.state.IsError) ? this.renderErrors() : ""}
        {(this.state.IsSaved) ? this.renderInformations(): ""}
        {(this.state.Isloading)
        ? (<Spinner size={ SpinnerSize.large } label="loading" />) :
          (<div className={ styles.row }>
            <div className={ styles.column }>
            <span className={ styles.title }>Créer ou modifier un Projet</span><br/>
            <label>Projets :</label>          
            <Dropdown options={this.state.ProjectList} onChanged={ this.valueSelectedProjectChanged } />
              
             <div className={styles.formButtonsContainer}>
              <div className='ard-formFieldsContainer'>
                            <Label>Titre :</Label>
                            <TextField className='ard-TextFormField' required={true}
                              name="Title" value={this.state.selectedProject ? this.state.selectedProject.Title: ''} onChanged={(item) => this.valueTitleChanged(item)} placeholder="titre" />
                            <label>Date de début de projet :</label>
                            <DatePicker  value={this.state.selectedProject && this.state.selectedProject.DateDebut!=null ? new Date(this.state.selectedProject.DateDebut.toString()) : null} onSelectDate={(item) => this.valueDateDebutChanged(item)} />
                              <label>Date de soutenance :</label>
                              <DatePicker  value={this.state.selectedProject && this.state.selectedProject.DateSoutenance!=null ? 
                               new Date(this.state.selectedProject.DateSoutenance.toString()) : null} onSelectDate={(item) => this.valueDateSoutenanceChanged(item)}  />
                            
                            
                                                
                </div>
             </div>
              <div className={styles.formButtonsContainer}>
                      <PrimaryButton
                        disabled={ false }
                        text={this.state.selectedId ? "Modifier" : "Créer"}
                        onClick={ () => this.saveItem(this.state.selectedId ? false : true ) }/>
                      <DefaultButton
                          disabled={ false }
                          text="annuler" onClick={()=>this.cancel()}/>
                  </div>
            </div>
          </div>)}
        </div>
      </div>
    );
  }

  private cancel(){
    this.setState({Isloading: true});
    this.setState((prevState,props) => ({selectedProject:null , selectedId:null, Isloading:false}));
  }
  private renderErrors(): React.ReactNode {
    return  <div>
     {
           <MessageBar
           messageBarType={ MessageBarType.error }
           isMultiline={ true }>{this.state.Error}</MessageBar>
     };
   </div>;
 }

 private renderInformations(): React.ReactNode {
   return <div>
     {
       <MessageBar messageBarType={MessageBarType.success}
        isMultiline={true} onDismiss={() => {this.setState({IsSaved: false});}}>Sauvegarde</MessageBar>
     }
   </div>;
 }
 private saveItem(creation: boolean): void {
  this.setState({Isloading: true});
  switch (creation) {
    case true:
    this._projectDataProvider.addProject(this.state.selectedProject).then(() => {
      this.setState({Isloading: false, IsSaved: true});
    },(error) => {
      this.setState({Isloading: false, IsError: true, Error: error});
    });
      break;
  
      case false:
      this._projectDataProvider.updateProject(this.state.selectedProject).then(() => {
        this.setState({Isloading: false, IsSaved: true});
      },(error) => {
        this.setState({Isloading: false, IsError: true, Error: error.message});
      });
      break;

    default:
      break;
  }
}

private valueDateSoutenanceChanged(newValue: Date) {
  this.setState(prevState => ({
    selectedProject: {
      ...prevState.selectedProject,
      DateSoutenance: newValue
    }
  }));
}

private valueTitleChanged(newValue: any) {
  this.setState(prevState => ({
    selectedProject: {
        ...prevState.selectedProject,
        Title: newValue
    }
  }));
}

private valueDateDebutChanged(newValue: Date) {
  this.setState(prevState => ({
    selectedProject: {
        ...prevState.selectedProject,
        DateDebut: newValue
    }
  }));
}
@autobind
private valueSelectedProjectChanged(option :IDropdownOption){
  var goal = Number(option.key);
  this.LoadSelectedProject(goal);
}

}
