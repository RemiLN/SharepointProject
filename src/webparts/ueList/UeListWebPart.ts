import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';


import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { sp } from "@pnp/sp";
import * as strings from 'UeListWebPartStrings';
import UeList from './components/UeList';
import { IUeListProps } from './components/IUeListProps';


export interface IUeListWebPartProps {
  description: string;
}

export default class UeListWebPart extends BaseClientSideWebPart<IUeListProps> {
  public onInit(): Promise<void> {

    return super.onInit().then(_ => {
  
      // other init code may be present
  
      sp.setup({
        spfxContext:this.context
    });
  });
  }
  public render(): void {
    const element: React.ReactElement<IUeListProps> = React.createElement(
      UeList,
     
    );

    ReactDom.render(element, this.domElement);
  }
  
  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
