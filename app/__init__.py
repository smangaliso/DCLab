from flask import Flask
import os


def create_app(test_config=None):
    app = Flask(__name__, template_folder='views/templates', static_folder='views/static',
                instance_relative_config=True)
    app.secret_key = 'dljsaklqk24e21cjn!Ew@@dsa5'
    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)

    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass


    from app.controllers import routes
    from app.controllers.routes import DClab
    from app.controllers.routes import shpb
    app.register_blueprint(DClab.bp)
    app.add_url_rule('/', endpoint='index')

    app.register_blueprint(shpb.bp)


    return app
