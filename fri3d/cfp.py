import os

from flask import render_template
from flask import request

from flask import request, abort
from flask_restful import Resource

from fri3d import app, rest, mongo

@app.route("/cfp")
def render_form():
  return render_template("cfp.html")

class Submission(Resource):
  def get(self):
    try:
      return mongo.db.submissions.find_one({"_id": request.args["id"]})
    except Exception as e:
      return False

  def post(self):
    data = request.get_json()
    try:
      id = data.pop("id")
      # update record
      result = mongo.db.button.update_one(
        { "_id"  : id   },
        { "$set" : data }
      )
      return result.upserted_id
    except KeyError:
      # create record
      result = mongo.db.button.insert_one(data)
      return result.insertedId
    except Exception as e:
      return False

rest.add_resource(Submission,
  "/cfp/submission"
)
