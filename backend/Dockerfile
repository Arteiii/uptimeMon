# Use the official Python base image
FROM python:3.12

# Set the working directory inside the container
WORKDIR /app

# install pipenv
RUN pip install pipenv

# Copy the requirements file to the working directory
COPY Pipfile .

# Install the Python dependencies
RUN pipenv install

# Copy the application code to the working directory
COPY . .

# Expose the port on which the application will run
EXPOSE 8000

# Run the FastAPI application using uvicorn server
CMD ["pipenv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
