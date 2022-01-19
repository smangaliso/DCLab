import math

from traits.trait_numeric import (Array)
from traits.api import (HasTraits, CFloat, Unicode, observe, on_trait_change)
import numpy as np


class Entity(HasTraits):
    name: Unicode = Unicode(default_value="")
    length: CFloat = CFloat(default_value=np.nan)
    diameter: CFloat = CFloat(default_value=np.nan)
    density: CFloat = CFloat(default_value=np.nan)
    elastic_modulus: CFloat = CFloat(default_value=np.nan)

    # calculated variable
    area: CFloat = CFloat(default_value=np.nan)

    def __init__(self, *args, **kwargs):
        super(Entity).__init__(*args, **kwargs)
        self.name = self.__class__.__name__

    def _diameter_changed(self, old, new):
        self.area = math.pi * (new / 2) ** 2

    def __repr__(self):
        _names = [x for x in self.traits().keys() if not x.startswith("trait")]
        _values = [self.__getattribute__(x) for (x, _) in self.traits().items() if x in _names]
        _items = ["{} = {}".format(x, y) for (x, y) in zip(_names, _values)]

        return "{} :: ({})".format(self.__class__.__name__, ", ".join(_items))

    def to_json(self):
        """"
        """
        _names = [x for x in self.traits().keys() if not x.startswith("trait")]
        _values = [self.__getattribute__(x) for (x, _) in self.traits().items() if x in _names]
        _items = dict(zip(_names, _values))

        for key, value in _items.items():
            if isinstance(value, np.ndarray):
                _items[key] = []

                # Save numpy array to file
                # filename = self.__class__.__name__
                # print((filename, value.shape))
                if key == "strain_data":
                    np.savetxt(self.__class__.__name__, value)

        return _items

    def from_json(self, json_txt: str = None):
        """"
        """
        import json

        inc_data = json.loads(json_txt)

        try:
            inc_data["strain_data"] = np.loadtxt(self.__class__.__name__)
        except FileNotFoundError:
            pass

        self.__dict__.update(**inc_data)


class Bar(Entity):
    strain_data: Array = Array(dtype=np.float_, shape=(None))
    x_data: Array = Array(dtype=np.float_, shape=(None))
    # stress_data: Array = Array()  # np.ndarray = np.empty((5, 1), dtype=np.float_)
    bar_type: Unicode = Unicode(default_value="")
    speed_limit: CFloat = CFloat(default_value=np.nan)
    poissons_ratio: CFloat = CFloat(default_value=np.nan)
    step_size: CFloat = CFloat(default_value=np.nan)

    def copy_from(self, bar: Entity = None):
        """"
        """
        if bar is None:
            return

        self.__dict__.update(bar.__dict__)


class Specimen(Entity):
    sample_type: Unicode = Unicode(default_value="Compression")
    heat_capacity: CFloat = CFloat(default_value=0)

    # dependencies
    transmission_bar: Bar = None
    incident_bar: Bar = None


class StrikerBar(Bar):
    speed: CFloat = CFloat(default_value=np.nan)


class IncidentBar(Bar):
    """

    """
    incident_strain: Array = Array(dtype=np.float_, shape=None)
    reflected_pulse: Array = Array(dtype=np.float_, shape=None)


class TransmissionBar(Bar):
    """

    """
    specimen: Specimen = None


class InputData(HasTraits):
    specimen: Specimen = Specimen()
    striker_bar: StrikerBar = StrikerBar()
    incident_bar: IncidentBar = IncidentBar()
    transmission_bar: TransmissionBar = TransmissionBar()
    input_filepath: Unicode = Unicode(default_value="")
    output_filepath: str = Unicode(default_value="")


def to_json(obj):
    '''return a serialized version of obj
    Return something only if obj's class is in class_dict.'''
    class_dict = {Bar: "Bar",
                  Entity: "Entity",
                  IncidentBar: "IncidentBar",
                  TransmissionBar: "TransmissionBar",
                  Specimen: "Specimen"}
    if obj.__class__ in class_dict:
        traits_dict = obj.get()
        traits_dict['__class__'] = class_dict[obj.__class__]
        return traits_dict

# def from_json(json_obj):
#     '''special processes on decoded objects'''
#     if "__class__" in json_obj:
#         if json_obj["__class__"] == "Person":
#             del json_obj["__class__"]
#             person = Person()
#             person.set(**json_obj)
#             return person
#         elif json_obj["__class__"] == "Household":
#             del json_obj["__class__"]
#             return json_obj
#         return json_obj
