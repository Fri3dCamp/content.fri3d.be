from flask import render_template

from fri3d import app

@app.route("/")
def render_default():
  return render_template("default.html")
