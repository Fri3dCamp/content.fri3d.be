all: update run

update:
	@git pull --all

run:
	@. ./venv/bin/activate; python run.py
