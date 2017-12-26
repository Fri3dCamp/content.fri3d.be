from flask import render_template

from fri3d import app

@app.route("/cfp")
@app.route("/cfp/<uid>")
def render_form(uid=None):
  return render_template("cfp.html")
