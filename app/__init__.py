from flask import Flask

app = Flask(__name__, template_folder='views/templates', static_folder='views/static')

from app.controllers import routes
