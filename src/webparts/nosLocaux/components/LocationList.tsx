import * as React from 'react';
import styles from '../NosLocauxWebPart.module.scss';
import LocationCard, { ILocation } from './LocationCard';

// Export de l'interface ILocation pour utilisation dans le WebPart
export { ILocation };

// Props du composant LocationList
export interface ILocationListProps {
  locations: ILocation[];
}

/**
 * Composant principal affichant la liste des localisations de bureaux (lecture seule).
 * La gestion (ajout, modification, suppression) se fait dans le panneau de propriétés du WebPart.
 */
const LocationList: React.FC<ILocationListProps> = ({ locations }) => {
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
          <p>Aucune localisation disponible.</p>
        ) : (
          locations.map((location) => (
            <div key={location.id} role="listitem">
              <LocationCard location={location} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LocationList;
