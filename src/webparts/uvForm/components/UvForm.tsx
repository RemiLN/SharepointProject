import * as React from 'react';
import styles from './UvForm.module.scss';
import { IUvFormProps } from './IUvFormProps';
import { IUvFormState } from './IUvFormStates';
import { escape } from '@microsoft/sp-lodash-subset';
import UVDataProvider, { IUVDataProvider } from '../providers/UVProvider';
import IUVData from '../models/UV';
import UVPropertiesConst from '../const/UVProperties';
import { Spinner, SpinnerSize, DefaultButton, PrimaryButton, autobind, TextField, Dropdown, MessageBar, MessageBarType, Label, IDropdownOption, MaskedTextField, DialogContent } from 'office-ui-fabric-react';
export default class UvForm extends React.Component<IUvFormProps, IUvFormState> {

  private _uvDataProvider: IUVDataProvider;
  constructor(props: IUvFormProps) {
    super(props);
    this.state = {
      Isloading: true,
      IsError: false,
      IsSaved: false,
      Error: null,
      selectedId:null,
      uvList: [],
      selectedUv: new IUVData({ ID: 0, Title: '', Description: '', Name: '' })
    };
    this._uvDataProvider = new UVDataProvider("https://groupesbtest.sharepoint.com/sites/DiiageDEV2020TeamFour");
    this.LoadUVList();
  }
  private LoadUVList() {
    this.setState({Isloading: true});
    this._uvDataProvider.getAllUV().then((data) => {
      this.setState({
          uvList: data.map((item: IUVData) => {
            return {
            'key' : item[UVPropertiesConst.ID],
            'text':  item[UVPropertiesConst.Title]
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
  private LoadSelectedUV(selected:number) {
    this.setState({Isloading: true});
    if(selected) {
      this._uvDataProvider.getUVById(selected).then((data) => {
        this.setState((prevState,props) => ({
          selectedUv: data,
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
  public render(): React.ReactElement<IUvFormProps> {
    
  
    return (
      <div className={ styles.uvForm }>
        <div className={ styles.container }>
        {(this.state.IsError) ? this.renderErrors() : ""}
        {(this.state.IsSaved) ? this.renderInformations(): ""}
        {(this.state.Isloading)
        ? (<Spinner size={ SpinnerSize.large } label="loading" />) :
          (<div className={ styles.row }>
            <div className={ styles.column }>
            <span className={ styles.title }>Créer ou modifier une UV</span><br/>
            <label>UV :</label>          
            <Dropdown options={this.state.uvList} onChanged={ this.valueSelectedUVChanged } />
              
             <div className={styles.formButtonsContainer}>
              <div className='ard-formFieldsContainer'>
                            <Label>Titre :</Label>
                            <TextField className='ard-TextFormField' 
                              name="Title" value={this.state.selectedUv ? this.state.selectedUv.Title: ''} onChanged={(item) => this.valueTitleChanged(`${item}`)} placeholder="titre" />
                            <label>Description :</label>
                            <TextField className='ard-TextFormField' 
                              name="Description" value={this.state.selectedUv ? this.state.selectedUv.Description : ''} onChanged={(item) => this.valueDescriptionChanged(`${item}`)} placeholder="description"
                              multiline rows={4} />
                              <label>Name :</label>
                              <TextField name="Name"  value={this.state.selectedUv ? this.state.selectedUv.Name.toString() : ''} onChanged={(item) => this.valueNameChanged(`${item}`)} placeholder="Nom de l'UE" />
                                                   
                </div>
             </div>
              <div className={styles.formButtonsContainer}>
                      <PrimaryButton
                        disabled={ false }
                        text={this.state.selectedId ? "Modifier" : "Créer"}
                        onClick={ () => this.saveItem(this.state.selectedId ? false : true ) }/>
                      <DefaultButton
                          disabled={ false }
                          text="annuler" onClick={ () => this.cancel()} />
                  </div>
            </div>
          </div>)}
        </div>
      </div>
    );
  }
  private cancel(){
    this.setState({Isloading: true});
    this.setState({selectedUv:null , selectedId:null, Isloading:false});
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
    this._uvDataProvider.addUV(this.state.selectedUv).then(() => {
      this.setState({Isloading: false, IsSaved: true});
    },(error) => {
      this.setState({Isloading: false, IsError: true, Error: error});
    });
      break;
  
      case false:
      this._uvDataProvider.updateUV(this.state.selectedUv).then(() => {
        this.setState({Isloading: false, IsSaved: true});
      },(error) => {
        this.setState({Isloading: false, IsError: true, Error: error.message});
      });
      break;

    default:
      break;
  }
}

private valueNameChanged(newValue: any) {
  this.setState(prevState => ({
    selectedUv: {
      ...prevState.selectedUv,
      Name: newValue
    }
  }));
}

private valueTitleChanged(newValue: any) {
  this.setState(prevState => ({
    selectedUv: {
        ...prevState.selectedUv,
        Title: newValue
    }
  }));
}

private valueDescriptionChanged(newValue: any) {
  this.setState(prevState => ({
    selectedUv: {
        ...prevState.selectedUv,
        Description: newValue
    }
  }));
}
@autobind
private valueSelectedUVChanged(option: IDropdownOption) {
  this.LoadSelectedUV(Number(option.key));
}
}
