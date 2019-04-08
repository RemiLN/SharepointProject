import * as React from 'react';
import styles from './UeList.module.scss';

import {
  Environment,
  EnvironmentType
} from '@microsoft/sp-core-library';
import {
  SPHttpClient,
  SPHttpClientResponse   
} from '@microsoft/sp-http';

import { sp } from "@pnp/sp";
import { escape } from '@microsoft/sp-lodash-subset';

import { IUeListProps } from './IUeListProps';
import { IUeListState } from './IUEListStates';

import UEDataProvider, { IUEDataProvider } from '../provider/UEProvider';
import UVDataProvider, { IUVDataProvider } from '../provider/UVProvider';


import { Spinner, SpinnerSize, DefaultButton, PrimaryButton, autobind, TextField, Dropdown, MessageBar, MessageBarType, Label, IDropdownOption, MaskedTextField, DialogContent } from 'office-ui-fabric-react';
//import { PeoplePicker, PrincipalType} from '@pnp/spfx-controls-react/lib/PeoplePicker';

//import * as strings from 'UeFormStrings';
import IUEData from '../models/UE';
import IUVData from '../models/UV';
import UVPropertiesConst from '../const/UVProperties';
import UEPropertiesConst from '../const/UEProperties';
// ...


export default class UeList extends React.Component<IUeListProps, IUeListState> {
  private _ueDataProvider: IUEDataProvider;
  private _uvDataProvider: IUVDataProvider;
 
  constructor(props: IUeListProps) {
    super(props);
    this.state = {
      Isloading: true,
      IsError: false,
      IsSaved: false,
      Error: null,
      selectedUe: new IUEData({ ID: 0, Title: '', Description: '', Name: '', UV: null, }),
      uvList: [] ,
      ueList: [],
      selectedId:null};
      this._ueDataProvider = new UEDataProvider("https://groupesbtest.sharepoint.com/sites/DiiageDEV2020TeamFour");
      this._uvDataProvider = new UVDataProvider("https://groupesbtest.sharepoint.com/sites/DiiageDEV2020TeamFour");
      
     //chargement de la liste de UV disponible
     this.LoadUVList();
     this.LoadUEList();
}
@autobind
private valueSelectedUEChanged(option :IDropdownOption){
  var ue = Number(option.key);
  this.LoadSelectedUE(ue);
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
private LoadUEList()
{
  this.setState({Isloading:true});
  this._ueDataProvider.getAllUe().then((data)=>{
    this.setState({
      ueList : data.map((item:IUEData)=>{
        return{
          'key':item[UEPropertiesConst.ID],
          'text':item[UEPropertiesConst.Title]
        };
      })
    });
  });
}
private LoadSelectedUE(selected:number) {
  this.setState({Isloading: true});
  if(selected) {
    this._ueDataProvider.getUEById(selected).then((data) => {
      this.setState((prevState,props) => ({
        selectedUe: data,
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
  public componentDidMount():void{
  
   
  }
  
  public componentDidUpdate(prevProps, prevState) {
    console.log('Component DID UPDATE!');
 }

  
    
    
    
     
  

   // const listContainer: Element =  this.domElement.querySelector('#spListContainer');
   // listContainer.innerHTML = html;
  
 /* private _renderListAsync(): void {
    // Local environment
    if (Environment.type === EnvironmentType.Local) {
    ///  this._getMockListData().then((response) => {
    //    this._renderList(response.value,null);
     // });
    }
    else if (Environment.type == EnvironmentType.SharePoint || 
              Environment.type == EnvironmentType.ClassicSharePoint) {
      
      this._getListUE()
        .then((response) => {
          this._getListeUV().then((responseuv)=>{
            this._renderList(response.value,responseuv);
          });
          
        });
        
    }
  }
  */
  
  public render(): React.ReactElement<IUeListProps> {
    
  
    return (
      <div className={ styles.ueList }>
        <div className={ styles.container }>
        {(this.state.IsError) ? this.renderErrors() : ""}
        {(this.state.IsSaved) ? this.renderInformations(): ""}
        {(this.state.Isloading)
        ? (<Spinner size={ SpinnerSize.large } label="loading" />) :
          (<div className={ styles.row }>
            <div className={ styles.column }>
            <span className={ styles.title }>Créer ou modifier une UE</span>
            <label>UE :</label>          
            <Dropdown options={this.state.ueList} onChanged={ this.valueSelectedUEChanged } />
              
             <div className={styles.formButtonsContainer}>
              <div className='ard-formFieldsContainer'>
                            <Label>Titre :</Label>
                            <TextField className='ard-TextFormField' 
                              name="Title" value={this.state.selectedUe ? this.state.selectedUe.Title: ''} onChanged={(item) => this.valueTitleChanged(`${item}`)} placeholder="titre" />
                            <label>Description :</label>
                            <TextField className='ard-TextFormField' 
                              name="Description" value={this.state.selectedUe ? this.state.selectedUe.Description : ''} onChanged={(item) => this.valueDescriptionChanged(`${item}`)} placeholder="description"
                              multiline rows={4} />
                              <label>Name :</label>
                              <TextField name="Name"  value={this.state.selectedUe ? this.state.selectedUe.Name.toString() : ''} onChanged={(item) => this.valueNameChanged(`${item}`)} placeholder="Nom de l'UE" />
                            <label>UV :</label>
                            <Dropdown options={this.state.uvList} selectedKey={
                              this.state.uvList ? 
                                (this.state.selectedUe && this.state.selectedUe.UV ? this.state.selectedUe.UV.ID : null) 
                                : null} onChanged={ this.valueSelectedUVChanged } />
                                                      
                </div>
             </div>
              <div className={styles.formButtonsContainer}>
                      <PrimaryButton
                        disabled={ false }
                        text={this.state.selectedId ? "Modifier" : "Créer"}
                        onClick={ () => this.saveItem(this.state.selectedId ? false : true ) }/>
                      <DefaultButton
                          disabled={ false }
                          text="annuler" onClick={ () => this.cancel()}/>
                  </div>
            </div>
          </div>)}
        </div>
      </div>
    );
  }
  private cancel(){
    this.setState({Isloading: true});
    this.setState({selectedUe:null , selectedId:null, Isloading:false});
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
    this._ueDataProvider.addUE(this.state.selectedUe).then(() => {
      this.setState({Isloading: false, IsSaved: true});
    },(error) => {
      this.setState({Isloading: false, IsError: true, Error: error});
    });
      break;
  
      case false:
      this._ueDataProvider.updateUE(this.state.selectedUe).then(() => {
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
    selectedUe: {
      ...prevState.selectedUe,
      Name: newValue
    }
  }));
}

private valueTitleChanged(newValue: any) {
  this.setState(prevState => ({
    selectedUe: {
        ...prevState.selectedUe,
        Title: newValue
    }
  }));
}

private valueDescriptionChanged(newValue: any) {
  this.setState(prevState => ({
    selectedUe: {
        ...prevState.selectedUe,
        Description: newValue
    }
  }));
}
@autobind
private valueSelectedUVChanged(option: IDropdownOption) {
  this.setState(prevState => ({
    selectedUe: {
        ...prevState.selectedUe,
        UV: {
          ...prevState.selectedUe.UV,
          ID: Number(option.key),
          Title: option.text
        }
    }
  }));
}

@autobind
private getPeoplePickerItems(items: any[])
{
  if(items.length > 0)
  {
    this.setState(prevState => ({
      selectedUe: {
        ...prevState.selectedUe,
        Intervenant: {
          Id: items[0].id,
          EMail: items[0].secondaryText
        }
      }
    }));
  }
  else
  {
    this.setState(prevState => ({
      selectedUe: {
        ...prevState.selectedUe,
        Intervenant: {
          Id: '',
          Name: '',
          EMail: ''
        }
      }
    }));
  }

}
}
/*<PeoplePicker context={this.props.context}
                              showtooltip={true}
                              isRequired={true}
                              disabled={false}
                              showHiddenInUI={false}
                              principalTypes={[PrincipalType.User]}
                              defaultSelectedUsers={this.state.selectedUe && this.state.selectedUe.Intervenant ? [this.state.selectedUe.Intervenant.EMail] : []}
                              resolveDelay={1000}
                              selectedItems={this.getPeoplePickerItems}
                              ensureUser={true}></PeoplePicker>*/