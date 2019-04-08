import * as React from 'react';
import styles from './GoalForm.module.scss';
import { IGoalFormProps } from './IGoalFormProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IGoalFormStates } from './IGoalFormStates';
import IGoal from '../models/Goal';
import ISkill from '../models/Skill';
import { Spinner, SpinnerSize, DefaultButton, PrimaryButton, autobind, TextField, Dropdown, MessageBar, MessageBarType, Label, IDropdownOption, MaskedTextField, DialogContent, nullRender, DatePicker } from 'office-ui-fabric-react';
import NumberFormat from 'react-number-format';
import GoalDataProvider, { IGoalDataProvider } from '../provider/GoalDataProvider';
import GoalPropertiesConst from '../const/GoalProperties';
import SkillDataProvider, { ISkillDataProvider } from '../provider/SkillDataProvider';
import { List } from '@pnp/sp';

export default class GoalForm extends React.Component<IGoalFormProps, IGoalFormStates> {
  private _goalDataProvider:IGoalDataProvider;
  private _skillDataProvider: ISkillDataProvider;
  constructor(props: IGoalFormProps) {
    super(props);
    this.state = {
      Isloading: true,
      IsError: false,
      IsSaved: false,
      Error: null,
      selectedGoal: new IGoal({ ID: 0, Title: '', Details: '', Points: 0, Skill: null, }),
      goalList: [] ,
      skillList:[],
      selectedId:null};
      this._goalDataProvider = new GoalDataProvider("https://groupesbtest.sharepoint.com/sites/DiiageDEV2020TeamFour");
      this._skillDataProvider = new SkillDataProvider("https://groupesbtest.sharepoint.com/sites/DiiageDEV2020TeamFour");
      this.LoadGoalList();
      this.LoadSkillList();
    }
    private LoadSkillList() {
      this.setState({Isloading: true});
      this._skillDataProvider.getAllSkill().then((data) => {
        this.setState({
            skillList: data.map((item: ISkill) => {
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
    private LoadSelectedGoal(selected:number) {
      this.setState({Isloading: true});
      if(selected) {
        this._goalDataProvider.getGoalById(selected).then((data) => {
          this.setState((prevState,props) => ({
            selectedGoal: data,
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
  public render(): React.ReactElement<IGoalFormProps> {
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
            <Dropdown options={this.state.goalList} onChanged={ this.valueSelectedGoalChanged } />
              
             <div className={styles.formButtonsContainer}>
              <div className='ard-formFieldsContainer'>
                            <Label>Titre :</Label>
                            <TextField className='ard-TextFormField' 
                              name="Title" value={this.state.selectedGoal ? this.state.selectedGoal.Title: ''} onChanged={(item) => this.valueTitleChanged(`${item}`)} placeholder="titre" />
                            <label>Détails :</label>
                            <TextField className='ard-TextFormField' 
                              name="Description" value={this.state.selectedGoal ? this.state.selectedGoal.Details : ''} onChanged={(item) => this.valueDescriptionChanged(`${item}`)} placeholder="description"
                              multiline rows={4} />
                              <label>Points :</label>
                              <TextField  value={this.state.selectedGoal && this.state.selectedGoal.Points!=null ? this.state.selectedGoal.Points.toString() : ""} onChanged={(item) => this.valuePointChanged(`${item}`)}  />
                            <label>Skills :</label>
                            <Dropdown options={this.state.skillList} selectedKey={
                              this.state.skillList ? 
                                (this.state.selectedGoal && this.state.selectedGoal.Skill ? this.state.selectedGoal.Skill.ID : null) 
                                : null} onChanged={ this.valueSelectedSkillChanged } />
                                                
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
    this.setState((prevState,props) => ({selectedGoal:null , selectedId:null, Isloading:false}));
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
    this._goalDataProvider.addGoal(this.state.selectedGoal).then(() => {
      this.setState({Isloading: false, IsSaved: true});
    },(error) => {
      this.setState({Isloading: false, IsError: true, Error: error});
    });
      break;
  
      case false:
      this._goalDataProvider.updateGoal(this.state.selectedGoal).then(() => {
        this.setState({Isloading: false, IsSaved: true});
      },(error) => {
        this.setState({Isloading: false, IsError: true, Error: error.message});
      });
      break;

    default:
      break;
  }
}

private valuePointChanged(newValue: any) {
  this.setState(prevState => ({
    selectedGoal: {
      ...prevState.selectedGoal,
      Points: Number(newValue)
    }
  }));
}

private valueTitleChanged(newValue: any) {
  this.setState(prevState => ({
    selectedGoal: {
        ...prevState.selectedGoal,
        Title: newValue
    }
  }));
}

private valueDescriptionChanged(newValue: any) {
  this.setState(prevState => ({
    selectedGoal: {
        ...prevState.selectedGoal,
        Description: newValue
    }
  }));
}
@autobind
private valueSelectedGoalChanged(option :IDropdownOption){
  var goal = Number(option.key);
  this.LoadSelectedGoal(goal);
}
@autobind
private valueSelectedSkillChanged(option: IDropdownOption) {
  this.setState(prevState => ({
    selectedGoal: {
        ...prevState.selectedGoal,
        Skill: {
          ...prevState.selectedGoal.Skill,
          ID: Number(option.key),
          Title: option.text
        }
    }
  }));
}
}
