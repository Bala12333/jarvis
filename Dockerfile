FROM python:3.11-slim-bookworm

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libpcap-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Environment variables should be provided by the deployment platform
# (e.g., Render, Railway, or LiveKit Cloud)

# Start the agent in worker mode
CMD ["python", "agent.py", "start"]
