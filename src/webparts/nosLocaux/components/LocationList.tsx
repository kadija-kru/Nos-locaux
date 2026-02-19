import * as React from 'react';
import styles from '../NosLocauxWebPart.module.scss';
import LocationCard, { ILocation } from './LocationCard';
import LocationForm from './LocationForm';

// Export de l'interface ILocation pour utilisation dans le WebPart
export { ILocation };

// Props du composant LocationList
export interface ILocationListProps {
  locations: ILocation[];
  onLocationsChanged: (locations: ILocation[]) => void;
  isEditMode: boolean;
}

// État interne du composant
interface ILocationListState {
  locations: ILocation[];
  showForm: boolean;
  editingLocation: ILocation | undefined;
}

/**
 * Composant principal affichant la liste des localisations de bureaux
 * Gère les opérations CRUD et la persistance des données
 */
export default class LocationList extends React.Component<ILocationListProps, ILocationListState> {

  constructor(props: ILocationListProps) {
    super(props);

    this.state = {
      locations: props.locations,
      showForm: false,
      editingLocation: undefined
    };
  }

  public componentDidUpdate(prevProps: ILocationListProps): void {
    // Synchronise l'état local avec les nouvelles props si elles changent
    if (prevProps.locations !== this.props.locations) {
      this.setState({ locations: this.props.locations });
    }
  }

  /**
   * Ouvre le formulaire d'ajout d'une nouvelle localisation
   */
  private _handleAddClick = (): void => {
    this.setState({
      showForm: true,
      editingLocation: undefined
    });
  }

  /**
   * Ouvre le formulaire de modification d'une localisation existante
   */
  private _handleEditLocation = (location: ILocation): void => {
    this.setState({
      showForm: true,
      editingLocation: location
    });
  }

  /**
   * Supprime une localisation par son identifiant
   */
  private _handleDeleteLocation = (id: string): void => {
    const updatedLocations = this.state.locations.filter(loc => loc.id !== id);
    this.setState({ locations: updatedLocations });
    this.props.onLocationsChanged(updatedLocations);
  }

  /**
   * Enregistre une nouvelle localisation ou modifie une existante
   */
  private _handleSaveLocation = (location: ILocation): void => {
    let updatedLocations: ILocation[];

    if (this.state.editingLocation) {
      // Mode édition: remplace la localisation existante
      updatedLocations = this.state.locations.map(loc =>
        loc.id === location.id ? location : loc
      );
    } else {
      // Mode ajout: ajoute la nouvelle localisation
      updatedLocations = [...this.state.locations, location];
    }

    this.setState({
      locations: updatedLocations,
      showForm: false,
      editingLocation: undefined
    });
    this.props.onLocationsChanged(updatedLocations);
  }

  /**
   * Ferme le formulaire sans enregistrer
   */
  private _handleCancelForm = (): void => {
    this.setState({
      showForm: false,
      editingLocation: undefined
    });
  }

  public render(): React.ReactElement {
    const { isEditMode } = this.props;
    const { locations, showForm, editingLocation } = this.state;

    return (
      <div className={styles.nosLocaux}>
        {/* Titre principal */}
        <h2 className={styles.title}>Nos bureaux</h2>

        {/* Liste des cartes de localisation */}
        <div
          className={styles.locationsList}
          role="list"
          aria-label="Liste des bureaux"
        >
          {locations.length === 0 ? (
            <p>Aucune localisation disponible.{isEditMode ? ' Ajoutez un bureau ci-dessous.' : ''}</p>
          ) : (
            locations.map((location) => (
              <div key={location.id} role="listitem">
                <LocationCard
                  location={location}
                  isEditMode={isEditMode}
                  onEdit={this._handleEditLocation}
                  onDelete={this._handleDeleteLocation}
                />
              </div>
            ))
          )}
        </div>

        {/* Bouton d'ajout (visible uniquement en mode édition) */}
        {isEditMode && !showForm && (
          <button
            className={styles.addButton}
            onClick={this._handleAddClick}
            aria-label="Ajouter un bureau"
          >
            + Ajouter un bureau
          </button>
        )}

        {/* Formulaire d'ajout/modification */}
        {isEditMode && showForm && (
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
