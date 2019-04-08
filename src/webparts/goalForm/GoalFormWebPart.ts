import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'GoalFormWebPartStrings';
import GoalForm from './components/GoalForm';
import { IGoalFormProps } from './components/IGoalFormProps';

export interface IGoalFormWebPartProps {
  description: string;
}

export default class GoalFormWebPart extends BaseClientSideWebPart<IGoalFormWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IGoalFormProps > = React.createElement(
      GoalForm,
      
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
