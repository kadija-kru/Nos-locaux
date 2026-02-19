import * as React from 'react';
import styles from '../NosLocauxWebPart.module.scss';
import { ILocation } from './LocationCard';

// Props du formulaire d'ajout/modification de localisation
export interface ILocationFormProps {
  location?: ILocation;           // Si défini, on est en mode édition
  onSave: (location: ILocation) => void;
  onCancel: () => void;
}

// État interne du formulaire
interface IFormState {
  name: string;
  address: string;
  city: string;
  iconColor: 'blue' | 'pink';
  errors: {
    name?: string;
    address?: string;
    city?: string;
  };
}

/**
 * Formulaire d'ajout et de modification d'une localisation de bureau
 */
const LocationForm: React.FC<ILocationFormProps> = ({ location, onSave, onCancel }) => {
  const isEditing = !!location;

  const [formState, setFormState] = React.useState<IFormState>({
    name: location ? location.name : '',
    address: location ? location.address : '',
    city: location ? location.city : '',
    iconColor: location ? location.iconColor : 'blue',
    errors: {}
  });

  /**
   * Valide les champs du formulaire
   */
  const validate = (): boolean => {
    const errors: IFormState['errors'] = {};

    if (!formState.name.trim()) {
      errors.name = 'Le nom du bureau est requis';
    }
    if (!formState.address.trim()) {
      errors.address = "L'adresse est requise";
    }
    if (!formState.city.trim()) {
      errors.city = 'La ville est requise';
    }

    setFormState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  /**
   * Gère la soumission du formulaire
   */
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const savedLocation: ILocation = {
      id: location ? location.id : (typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2) + Date.now().toString(36)),
      name: formState.name.trim(),
      address: formState.address.trim(),
      city: formState.city.trim(),
      iconColor: formState.iconColor
    };

    onSave(savedLocation);
  };

  /**
   * Met à jour un champ du formulaire
   */
  const handleChange = (field: keyof IFormState, value: string): void => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
      errors: { ...prev.errors, [field]: undefined }
    }));
  };

  return (
    <div className={styles.formContainer} role="dialog" aria-labelledby="form-title">
      <h3 id="form-title" className={styles.formTitle}>
        {isEditing ? 'Modifier le bureau' : 'Ajouter un bureau'}
      </h3>

      <form onSubmit={handleSubmit} noValidate>
        {/* Champ Nom */}
        <div className={styles.formField}>
          <label htmlFor="location-name">Nom du bureau *</label>
          <input
            id="location-name"
            type="text"
            value={formState.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Ex: Bureau Paris"
            aria-required="true"
            aria-describedby={formState.errors.name ? 'name-error' : undefined}
          />
          {formState.errors.name && (
            <span id="name-error" className={styles.errorText} role="alert">
              {formState.errors.name}
            </span>
          )}
        </div>

        {/* Champ Adresse */}
        <div className={styles.formField}>
          <label htmlFor="location-address">Adresse *</label>
          <input
            id="location-address"
            type="text"
            value={formState.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Ex: 10 Rue de Rivoli"
            aria-required="true"
            aria-describedby={formState.errors.address ? 'address-error' : undefined}
          />
          {formState.errors.address && (
            <span id="address-error" className={styles.errorText} role="alert">
              {formState.errors.address}
            </span>
          )}
        </div>

        {/* Champ Ville */}
        <div className={styles.formField}>
          <label htmlFor="location-city">Ville *</label>
          <input
            id="location-city"
            type="text"
            value={formState.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="Ex: Paris, 75001"
            aria-required="true"
            aria-describedby={formState.errors.city ? 'city-error' : undefined}
          />
          {formState.errors.city && (
            <span id="city-error" className={styles.errorText} role="alert">
              {formState.errors.city}
            </span>
          )}
        </div>

        {/* Champ Couleur */}
        <div className={styles.formField}>
          <label htmlFor="location-color">Couleur</label>
          <select
            id="location-color"
            value={formState.iconColor}
            onChange={(e) => handleChange('iconColor', e.target.value as 'blue' | 'pink')}
          >
            <option value="blue">Bleu</option>
            <option value="pink">Rose</option>
          </select>
        </div>

        {/* Actions du formulaire */}
        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
            aria-label="Annuler"
          >
            Annuler
          </button>
          <button
            type="submit"
            className={styles.saveButton}
            aria-label={isEditing ? 'Enregistrer les modifications' : 'Ajouter le bureau'}
          >
            {isEditing ? 'Enregistrer' : 'Ajouter'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LocationForm;
