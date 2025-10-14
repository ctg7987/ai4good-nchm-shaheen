FROM mcr.microsoft.com/devcontainers/base:ubuntu-22.04

# Install additional packages
RUN apt-get update && apt-get install -y \
    curl \
    git \
    vim \
    && rm -rf /var/lib/apt/lists/*

# Set up workspace
WORKDIR /workspace

# Copy package files for better caching
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY apps/api/pyproject.toml ./apps/api/
COPY packages/shared/package*.json ./packages/shared/

# Install Node.js dependencies
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install Python dependencies
RUN apt-get update && apt-get install -y \
    python3.11 \
    python3.11-pip \
    python3.11-venv \
    && rm -rf /var/lib/apt/lists/*

# Create virtual environment
RUN python3.11 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python packages
RUN pip install --upgrade pip setuptools wheel

# Set default shell
SHELL ["/bin/bash", "-c"]

