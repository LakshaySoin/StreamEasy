# Use the seleniarm image that's compatible with ARM architecture
FROM seleniarm/standalone-chromium:latest

# Set the working directory in the container
WORKDIR /app

# Switch to root user to install packages
USER root

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Install Python, pip, and virtualenv
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv && \
    rm -rf /var/lib/apt/lists/*

# Create and activate a virtual environment
RUN python3 -m venv venv
ENV PATH="/app/venv/bin:$PATH"

# Copy the requirements file into the container at /app
COPY requirements.txt /app/

# Install any necessary dependencies within the virtual environment
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . /app/

# Expose the port that the Flask app runs on
EXPOSE 5050

# Define environment variable
ENV FLASK_ENV=production

# Run the application using the virtual environment's Python
CMD ["python", "spotify_playlist_converter.py"]
