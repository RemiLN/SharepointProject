import * as React from 'react';
import styles from './SkillForm.module.scss';
import { ISkillFormProps } from './ISkillFormProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ISkillFormStates } from './ISkillFormStates';
import IGoal from '../models/Goal';
import GoalDataProvider, { IGoalDataProvider } from '../provider/GoalDataProvider';
import ISkill from '../models/Skill';
import { Spinner, SpinnerSize, DefaultButton, PrimaryButton, autobind, TextField, Dropdown, MessageBar, MessageBarType, Label, IDropdownOption, MaskedTextField, DialogContent, DatePicker } from 'office-ui-fabric-react';
import SkillPropertiesConst from '../const/SkillProperties';
import GoalPropertiesConst from '../const/GoalProperties';
import SkillDataProvider, { ISkillDataProvider } from '../provider/SkillDataProvider';
export default class SkillForm extends React.Component<ISkillFormProps, ISkillFormStates> {

  private _skillDataProvider: ISkillDataProvider;
  private _goalDataProvider:IGoalDataProvider;
  constructor(props: ISkillFormProps) {
    super(props);
    this.state = {
      Isloading: true,
      IsError: false,
      IsSaved: false,
      Error: null,
      selectedSkill: new ISkill({ ID: 0, Title: '', Goals:[]}),
      goalList: [] ,
      skillList:[],
      curentgoalsId:[],
      selectedId:null};
      this._goalDataProvider = new GoalDataProvider("https://groupesbtest.sharepoint.com/sites/DiiageDEV2020TeamFour");
      this._skillDataProvider = new SkillDataProvider("https://groupesbtest.sharepoint.com/sites/DiiageDEV2020TeamFour");
      this.LoadGoalList();
      this.LoadSkillList();
    }
    private LoadCurrentGoalsId(SkillId:number){
      this._skillDataProvider.getSkillById(SkillId).then((data)=>{var num:number[];
      data.Goals.forEach((item)=>{num.push(item.ID)});
      this.setState({curentgoalsId:num});
      });
    }
    private LoadGoalsListWithoutCurrentPoints()
    {

    }
    private LoadSkillList() {
      this.setState({Isloading: true});
      this._skillDataProvider.getAllSkill().then((data) => {
        this.setState({
            skillList: data.map((item: ISkill) => {
              return {
              'key' : item[SkillPropertiesConst.ID],
              'text':  item[SkillPropertiesConst.Title]
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

    private LoadGoalList() {
      this.setState({Isloading: true});
      this._goalDataProvider.getAllGoal().then((data) => {
        this.setState({
            goalList: data.map((item: IGoal) => {
              return {
              'key' : item[GoalPropertiesConst.ID],
              'text':  item[GoalPropertiesConst.Title]
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
    private LoadSelectedSkill(selected:number) {
      this.setState({Isloading: true});
      if(selected) {
        this._skillDataProvider.getSkillById(selected).then((data) => {
          this.setState((prevState,props) => ({
            selectedSkill: data,
            selectedId:selected,
            Isloading: false
          }));
          this.LoadCurrentGoalsId(selected);
        },(error) => {
          this.setState({IsError: true, Error: error.message});
        }).catch((error) => {
          this.setState({IsError: true, Error: error.message});
        }
        );
      }
    }
  public render(): React.ReactElement<ISkillFormProps> {
    return (
      <div className={ styles.goalForm }>
      <div className={ styles.container }>
      {(this.state.IsError) ? this.renderErrors() : ""}
      {(this.state.IsSaved) ? this.renderInformations(): ""}
      {(this.state.Isloading)
      ? (<Spinner size={ SpinnerSize.large } label="loading" />) :
        (<div className={ styles.row }>
          <div className={ styles.column }>
          <span className={ styles.title }>Créer ou modifier un Objectif</span><br/>
          <label>Objectifs :</label>          
          <Dropdown options={this.state.skillList} onChanged={ this.valueselectedSkillChanged } />
            
           <div className={styles.formButtonsContainer}>
            <div className='ard-formFieldsContainer'>
                          <Label>Titre :</Label>
                          <TextField className='ard-TextFormField' 
                            name="Title" value={this.state.selectedSkill ? this.state.selectedSkill.Title: ''} onChanged={(item) => this.valueTitleChanged(`${item}`)} placeholder="titre" />
                             <label>Goals :</label>
                          <Dropdown options={this.state.skillList} multiSelect selectedKeys={
                            this.state.curentgoalsId!=[] ?  this.state.curentgoalsId
                              : null} onChanged={ this.valueSelectedGoalsChanged } />
                                              
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
    this.setState((prevState,props) => ({selectedSkill:null , selectedId:null, Isloading:false}));
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
    this._skillDataProvider.addSkill(this.state.selectedSkill).then(() => {
      this.setState({Isloading: false, IsSaved: true});
    },(error) => {
      this.setState({Isloading: false, IsError: true, Error: error});
    });
      break;
  
      case false:
      this._skillDataProvider.updateSkill(this.state.selectedSkill).then(() => {
        this.setState({Isloading: false, IsSaved: true});
      },(error) => {
        this.setState({Isloading: false, IsError: true, Error: error.message});
      });
      break;

    default:
      break;
  }
}



private valueTitleChanged(newValue: any) {
  this.setState(prevState => ({
    selectedSkill: {
        ...prevState.selectedSkill,
        Title: newValue
    }
  }));
}


@autobind
private valueselectedSkillChanged(option :IDropdownOption){
  var skill = Number(option.key);
  this.LoadSelectedSkill(skill);
}
@autobind
private valueSelectedGoalsChanged(event: React.FormEvent<HTMLDivElement>, option: IDropdownOption) {
  const newSelectedItems = [...this.state.curentgoalsId];
    if (option.selected) {
      var newGoal = this._goalDataProvider.getGoalById(Number(option.key));
      var point : number;
      newGoal.then(item=>{point=item.Points} )
      this.state.curentgoalsId.forEach(element => {
        if(element==point)
        {
          this.setState({Isloading: false, IsError: true, Error: "poid de skill impossible"});
        }
        else
        {
          newSelectedItems.push(Number(option.key));
        }
      });
      // add the option if it's checked
     

    } else {
      // remove the option if it's unchecked
      const currIndex = newSelectedItems.indexOf(Number(option.key));
      if (currIndex > -1) {
        newSelectedItems.splice(currIndex, 1);
      }
    }
    this.setState({
      curentgoalsId: newSelectedItems
    });
  };
}

