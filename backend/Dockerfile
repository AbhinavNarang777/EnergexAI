FROM python:3.11-slim


RUN apt update
# RUN  apt-get install --no-install-recommends libreoffice-writer libreoffice-impress -y
# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app
RUN pip3 install --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 8000
# Run app.py when the container launches
CMD ["uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000", "--workers", "25"]
