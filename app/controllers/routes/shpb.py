from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, session
)
import json
import os.path as path
from app.models.models import (TransmissionBar, Specimen, IncidentBar, StrikerBar, to_json)
from matfile_reader import (read_mat)
import matfile_reader
from app.controllers.computations.sure_pulse import *
import matplotlib.pyplot as plt
from werkzeug.exceptions import abort

bp = Blueprint('shpb', __name__, url_prefix='/shpb')

transmission_bar = TransmissionBar()
specimen = Specimen()
incident_bar = IncidentBar()




def prepare_data_objects(form_data=None):
    """"
    """

    # Specimen
    specimen.name = form_data['specimen']
    specimen.length = form_data["specimen_length"]
    specimen.diameter = form_data['specimen_diameter']

    THIS_FOLDER = path.dirname(path.abspath(__file__)).replace("controllers\\routes", "views")
    my_file = path.join(THIS_FOLDER, 'static/js/material.json')

    with open(my_file) as json_file:
        jf = json.load(json_file)

    specimen.density = jf[specimen.name]['Density']
    specimen.elastic_modulus = jf[specimen.name]['Modulus']

    # incident and transmission bar
    incident_bar.name = form_data['material']
    incident_bar.diameter = form_data['incidentbar_diameter']
    incident_bar.length = form_data['incidentbar_Length']
    incident_bar.density = jf[incident_bar.name]['Density']
    incident_bar.elastic_modulus = jf[incident_bar.name]['Modulus']
    incident_bar.poissons_ratio = form_data['incidentbar_PR']
    transmission_bar.copy_from(incident_bar)

    pyObj = json.loads(form_data["config-data"])

    # read strain data

    filepath = r'%s' % pyObj["input_filepath"]

    output = read_mat(filepath=filepath, y_units="m$")
    N = 50
    ratio = 2 * (1 + incident_bar.poissons_ratio)
    incident_bar.strain_data = np.divide(output['A'][0].samples[0::N], ratio)
    transmission_bar.strain_data = np.divide(output['B'][0].samples[0::N], ratio)

    length = incident_bar.strain_data.size
    incident_bar.x_data = np.linspace(0, length * output['A'][0].time_step, length)
    incident_bar.step_size = output['A'][0].time_step
    transmission_bar.step_size = output['A'][0].time_step
    # Store data objects

    session["incident_bar"] = json.dumps(incident_bar.to_json())
    session['transmission_bar'] = json.dumps(transmission_bar.to_json())
    session['specimen'] = json.dumps(specimen.to_json())


@bp.route('/trim', methods=['POST', 'GET'])
def trim():
    if request.method == 'GET':
        return render_template('shpb.html')

    elif request.method == 'POST':
        prepare_data_objects(request.form)

        return render_template("trim.html", t_strain_data=transmission_bar.strain_data.tolist(),
                               i_strain_data=incident_bar.strain_data.tolist(), x_data=incident_bar.x_data.tolist())


@bp.route('/analyze', methods=['POST', 'GET'])
def analyze():
    if request.method == 'GET':
        return render_template('shpb.html')
    elif request.method == 'POST':
        incident_values = request.form['incident_values']
        incident_values = incident_values.split(',')
        incident_values = [int(i) for i in incident_values]
        inc_start = incident_values[0]
        inc_end = incident_values[1]

        incident_bar = IncidentBar()
        incident_bar.from_json(session["incident_bar"])
        I_strain_data = incident_bar.strain_data[inc_start:inc_end + 1]
        incident_bar.strain_data = I_strain_data

        for i, val in enumerate(incident_bar.strain_data):
            if val < 0:
                break
            else:
                incident_bar.strain_data = np.delete(incident_bar.strain_data,
                                                     np.where(incident_bar.strain_data == val))

        zero_crossings = np.where(np.diff(np.sign(incident_bar.strain_data)))[0][0]

        incident_bar.incident_strain, incident_bar.reflected_pulse = incident_bar.strain_data[
                                                                     :zero_crossings + 1], incident_bar.strain_data[
                                                                                           zero_crossings + 1:]

        incident_bar.reflected_pulse = np.delete(incident_bar.reflected_pulse,
                                                 np.where(np.sign(incident_bar.reflected_pulse) < 0))

        transmission_values = request.form['transmission_values']
        transmission_values = transmission_values.split(',')
        transmission_values = [int(j) for j in transmission_values]
        tran_start = transmission_values[0]
        tran_end = transmission_values[1]

        transmission_bar = TransmissionBar()
        transmission_bar.from_json(session['transmission_bar'])
        T_strain_data = transmission_bar.strain_data[tran_start:tran_end + 1]
        transmission_bar.strain_data = T_strain_data

        x_data = np.linspace(0, T_strain_data.size * transmission_bar.step_size, T_strain_data.size)

        load_specimen = json.loads(session['specimen'])
        specimen = Specimen()
        specimen.set(**load_specimen)

        # calculate stress
        stress = calculate_stress(transmission_bar, specimen)

        # calculate dynamic force

        dynamic_force = calculate_dynamic_force(transmission_bar, incident_bar)

        # calculate strain rate

        strain_rate = calculate_strain_rate(transmission_bar, incident_bar, specimen)

        return render_template("analyze.html", T_data=T_strain_data.tolist(),
                               I_data=I_strain_data.tolist(),
                               x_data=x_data.tolist(),
                               transmission_stress=stress['transmission_bar'].tolist(),
                               sample_stress=stress['specimen'].tolist(),
                               back_face_force=dynamic_force['transmission_bar'].tolist(),
                               front_face_force=dynamic_force['incident_bar'].tolist(),
                               strain_rate=strain_rate['specimen'].tolist(),

                               )


@bp.route('/shpb', methods=['POST', 'GET'])
def shpb():
    return render_template('shpb.html')
