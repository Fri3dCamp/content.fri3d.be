from flask import render_template

from fri3d import app

@app.route("/cfp")
def render_form():
  return render_template("cfp.html")
