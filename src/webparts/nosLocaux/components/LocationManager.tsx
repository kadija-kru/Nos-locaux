import * as React from 'react';
import styles from '../NosLocauxWebPart.module.scss';
import { ILocation } from './LocationCard';
import LocationForm from './LocationForm';

// Props du gestionnaire de localisations (panneau de propriétés)
export interface ILocationManagerProps {
  locations: ILocation[];
  onLocationsChanged: (locations: ILocation[]) => void;
}

// État interne du gestionnaire
interface ILocationManagerState {
  locations: ILocation[];
  showForm: boolean;
  editingLocation: ILocation | undefined;
}

/**
 * Composant de gestion des localisations affiché dans le panneau de propriétés du WebPart.
 * Permet d'ajouter, modifier et supprimer des bureaux.
 */
export default class LocationManager extends React.Component<ILocationManagerProps, ILocationManagerState> {

  constructor(props: ILocationManagerProps) {
    super(props);

    this.state = {
      locations: props.locations,
      showForm: false,
      editingLocation: undefined
    };
  }

  public componentDidUpdate(prevProps: ILocationManagerProps): void {
    if (prevProps.locations !== this.props.locations) {
      this.setState({ locations: this.props.locations });
    }
  }

  private _handleAddClick = (): void => {
    this.setState({ showForm: true, editingLocation: undefined });
  }

  private _handleEditLocation = (location: ILocation): void => {
    this.setState({ showForm: true, editingLocation: location });
  }

  private _handleDeleteLocation = (id: string): void => {
    const updatedLocations = this.state.locations.filter(loc => loc.id !== id);
    this.setState({ locations: updatedLocations });
    this.props.onLocationsChanged(updatedLocations);
  }

  private _handleSaveLocation = (location: ILocation): void => {
    let updatedLocations: ILocation[];

    if (this.state.editingLocation) {
      updatedLocations = this.state.locations.map(loc =>
        loc.id === location.id ? location : loc
      );
    } else {
      updatedLocations = [...this.state.locations, location];
    }

    this.setState({ locations: updatedLocations, showForm: false, editingLocation: undefined });
    this.props.onLocationsChanged(updatedLocations);
  }

  private _handleCancelForm = (): void => {
    this.setState({ showForm: false, editingLocation: undefined });
  }

  public render(): React.ReactElement {
    const { locations, showForm, editingLocation } = this.state;

    return (
      <div>
        {/* Liste des localisations avec boutons de gestion */}
        <div>
          {locations.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#555' }}>Aucun bureau. Ajoutez-en un ci-dessous.</p>
          ) : (
            locations.map((location) => (
              <div key={location.id} className={styles.managerItem}>
                <span className={styles.managerItemName}>{location.name}</span>
                <div className={styles.editControls}>
                  <button
                    className={styles.editButton}
                    onClick={() => this._handleEditLocation(location)}
                    aria-label={`Modifier ${location.name}`}
                    title="Modifier"
                  >
                    ✏️
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => {
                      if (window.confirm(`Supprimer le bureau "${location.name}" ?`)) {
                        this._handleDeleteLocation(location.id);
                      }
                    }}
                    aria-label={`Supprimer ${location.name}`}
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bouton d'ajout */}
        {!showForm && (
          <button
            className={styles.addButton}
            onClick={this._handleAddClick}
            aria-label="Ajouter un bureau"
          >
            + Ajouter un bureau
          </button>
        )}

        {/* Formulaire d'ajout/modification */}
        {showForm && (
          <LocationForm
            location={editingLocation}
            onSave={this._handleSaveLocation}
            onCancel={this._handleCancelForm}
          />
        )}
      </div>
    );
  }
}
