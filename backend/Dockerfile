FROM python:3.12

WORKDIR /app

COPY Pipfile .
RUN pip install --no-cache-dir pipenv
RUN pipenv install --skip-lock

COPY . .

CMD ["pipenv", "run", "uvicorn", "uptimemon.main:app", "--host", "0.0.0.0", "--port", "8000"]
