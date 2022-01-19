from app import create_app
import numpy as np
from app.models.models import *



def main():
    """

    :return:
    """
    app = create_app()
    app.run(debug=True)


if __name__ == '__main__':
    main()
    # strain = np.ones((1, 10))
    #
    # transmission_bar = TransmissionBar()
    # incident_bar = IncidentBar()
    # specimen = Specimen()
    #
    # # Link objects
    # specimen.transmission_bar = transmission_bar
    # specimen.incident_bar = incident_bar
    #
    # transmission_bar.specimen = specimen
    #
    # # Transmission Bar settings
    # transmission_bar.elastic_modulus = 20
    # transmission_bar.strain_data = strain
    # transmission_bar.diameter = 20
    #
    # # Incident Bar Settings
    # incident_bar.elastic_modulus = 20
    # incident_bar.density = 200
    #
    # # specimen settings
    # specimen.diameter = 5.12
    #
    #
    # # print(specimen)
    # #
    # # transmission_bar.strain_data = strain*0.1
    # #
    # # print(transmission_bar)
    # print(specimen.stress_data)


