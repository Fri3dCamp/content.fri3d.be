from flask import Flask

app = Flask(__name__, template_folder="./content")

import fri3d.default
import fri3d.cfp
