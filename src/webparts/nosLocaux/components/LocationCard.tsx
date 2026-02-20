import * as React from 'react';
import styles from '../NosLocauxWebPart.module.scss';

// Interface représentant une localisation de bureau
export interface ILocation {
  id: string;
  name: string;
  address: string;
  city: string;
  iconColor: 'blue' | 'pink';
}

// Props du composant LocationCard
export interface ILocationCardProps {
  location: ILocation;
}

/**
 * Composant carte de localisation
 * Affiche les informations d'un bureau et permet la navigation vers Google Maps
 */
const LocationCard: React.FC<ILocationCardProps> = ({ location }) => {

  /**
   * Ouvre Google Maps dans un nouvel onglet avec l'adresse complète
   */
  const handleCardClick = (): void => {
    const fullAddress = `${location.name}, ${location.address}, ${location.city}`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const fullAddress = `${location.name}, ${location.address}, ${location.city}`;
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
      window.open(mapsUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className={`${styles.locationCard} ${styles[location.iconColor]}`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${location.name}, ${location.address}, ${location.city} - Cliquer pour voir sur Google Maps`}
    >
      {/* Icône de pin de localisation */}
      <span className={styles.locationIcon} aria-hidden="true">📍</span>

      {/* Informations de localisation */}
      <div className={styles.locationInfo}>
        <div className={styles.locationName}>{location.name}</div>
        <div className={styles.locationAddress}>{location.address}</div>
        <div className={styles.locationCity}>{location.city}</div>
      </div>
    </div>
  );
};

export default LocationCard;
