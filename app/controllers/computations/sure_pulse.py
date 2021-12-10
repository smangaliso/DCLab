from app.models.models import (TransmissionBar, IncidentBar, Specimen)
import numpy as np


def calculate_stress(transmission_bar:TransmissionBar = None, specimen: Specimen = None):
    """"
    Calculation of stress in Specimen by using cross-sectional area ratios between the specimen and the transmission bar
    
    :param transmission_bar
    :param specimen
    """
    
    output = {"transmission_bar": np.empty(shape=(5, 1), dtype=np.float_),
              "specimen": np.empty(shape=(5, 1), dtype=np.float_)}
    if specimen is None or transmission_bar is None:
        return output
    
    # Calculate stress in transmission bar

    stress_0 = transmission_bar.elastic_modulus * transmission_bar.strain_data
    
    # Calculate area ratios
    ratios = transmission_bar.area / specimen.area
    
    # Calculate stress in specimen
    stress_1 = ratios * stress_0
    
    # Update output dictionary
    output["transmission_bar"] = stress_0
    output["specimen"] = stress_1

    return output


def calculate_dynamic_force(transmission_bar: TransmissionBar = None, incident_bar: IncidentBar = None):
    """"
    Calculation of dynamic force exerted on both the transmission and incident bars.
    :param transmission_bar
    :param incident_bar
    """
    output = {"transmission_bar": np.empty(shape=(5, 1), dtype=np.float_),
              "incident_bar": np.empty(shape=(5, 1), dtype=np.float_)}

    if transmission_bar is None or incident_bar is None:
        return output

    # Calculate dynamic force on transmission bar
    force_0 = transmission_bar.area * transmission_bar.elastic_modulus * transmission_bar.strain_data

    # Calculate dynamic force on incident bar
    max_len = min(transmission_bar.strain_data.size, incident_bar.strain_data.size)
    d_strain = incident_bar.strain_data[0:max_len] - transmission_bar.strain_data[0:max_len]
    force_1 = incident_bar.area * incident_bar.elastic_modulus * d_strain

    # Update output dictionary
    output["transmission_bar"] = force_0
    output["incident_bar"] = force_1

    return output


def calculate_strain_rate(transmission_bar: TransmissionBar = None, incident_bar: IncidentBar = None,
                          specimen: Specimen = None):
    """"
    Calculation of sample strain rate.
    """
    output = {"specimen": np.empty(shape=(5, 1), dtype=np.float_)}
    if None in [transmission_bar, incident_bar, specimen]:
        return output

    # Calculate wave speed
    v = np.sqrt(incident_bar.elastic_modulus / incident_bar.density)

    # Calculate strain rate
    strain_rate = -2*v*transmission_bar.strain_data / specimen.length

    # Update output
    output["specimen"] = strain_rate

    return output
