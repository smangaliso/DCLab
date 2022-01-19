from flask import (render_template, request, redirect, url_for, flash, session)
from werkzeug.utils import secure_filename
from app import create_app
import numpy as np

#
#
#
# @app.route('/dc', methods=['GET'])
# def dc():
#     return render_template('dynamic_calibration.html')
#
#
# @app.route('/trim_dc', methods=['POST', 'GET'])
# def trim_dc():
#     if request.method == 'GET':
#         return render_template('dc.html')
#     elif request.method == 'POST':
#
#         return "free"
