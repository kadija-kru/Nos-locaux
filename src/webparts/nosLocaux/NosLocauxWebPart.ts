import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  IPropertyPaneCustomFieldProps,
  IPropertyPaneField,
  PropertyPaneFieldType
} from '@microsoft/sp-webpart-base';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'NosLocauxWebPartStrings';
import LocationList from './components/LocationList';
import { ILocation } from './components/LocationList';
import LocationManager from './components/LocationManager';

// Interface des propriétés du WebPart
export interface INosLocauxWebPartProps {
  locations: ILocation[];
}

/**
 * WebPart principal pour afficher et gérer les localisations de bureaux
 */
export default class NosLocauxWebPart extends BaseClientSideWebPart<INosLocauxWebPartProps> {

  public render(): void {
    // Récupère les localisations depuis les propriétés ou utilise les données par défaut
    const locations: ILocation[] = this.properties.locations && this.properties.locations.length > 0
      ? this.properties.locations
      : this._getDefaultLocations();

    const element: React.ReactElement = React.createElement(
      LocationList,
      {
        locations: locations
      }
    );

    ReactDom.render(element, this.domElement);
  }

  /**
   * Retourne les localisations par défaut pour la démonstration
   */
  private _getDefaultLocations(): ILocation[] {
    return [
      {
        id: '1',
        name: 'Bureau Paris',
        address: '10 Rue de Rivoli',
        city: 'Paris, 75001',
        iconColor: 'blue'
      },
      {
        id: '2',
        name: 'Bureau Lyon',
        address: '5 Place Bellecour',
        city: 'Lyon, 69002',
        iconColor: 'pink'
      },
      {
        id: '3',
        name: 'Bureau Marseille',
        address: '20 La Canebière',
        city: 'Marseille, 13001',
        iconColor: 'blue'
      }
    ];
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
                {
                  type: PropertyPaneFieldType.Custom,
                  targetProperty: 'locations',
                  properties: {
                    key: 'locationManager',
                    onRender: (elem: HTMLElement) => {
                      const locations: ILocation[] = this.properties.locations && this.properties.locations.length > 0
                        ? this.properties.locations
                        : this._getDefaultLocations();

                      const managerElement = React.createElement(
                        LocationManager,
                        {
                          locations: locations,
                          onLocationsChanged: (updatedLocations: ILocation[]) => {
                            this.properties.locations = updatedLocations;
                            this.render();
                          }
                        }
                      );
                      ReactDom.render(managerElement, elem);
                    },
                    onDispose: (elem: HTMLElement) => {
                      ReactDom.unmountComponentAtNode(elem);
                    }
                  } as IPropertyPaneCustomFieldProps
                } as IPropertyPaneField<IPropertyPaneCustomFieldProps>
              ]
            }
          ]
        }
      ]
    };
  }
}
