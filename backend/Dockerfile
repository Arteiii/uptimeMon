FROM python:3.12

WORKDIR /app

COPY Pipfile .
RUN pip install pipenv
RUN pipenv install

COPY . .


# run the fastapi application using uvicorn server
CMD ["pipenv", "run", "uvicorn", "uptimemon.main:app", "--host", "0.0.0.0", "--port", "8000"]
