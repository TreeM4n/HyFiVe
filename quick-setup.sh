#!/bin/bash

# Download HyFiVe archive from GitHub
echo "Downloading HyFiVe archive..."
wget "https://github.com/TreeM4n/HyFiVe/archive/master.zip"

# Install unzip if not installed
echo "Installing unzip..."
sudo apt-get update
sudo apt-get install unzip -y

# Extract the downloaded archive
echo "Extracting the archive..."
unzip master.zip

# Navigate into the extracted directory
cd HyFiVe-master

# Make setup.sh executable
chmod +x setup.sh

# Run setup.sh
echo "Running setup.sh..."
./setup.sh

# Clean up - remove the downloaded archive
echo "Cleaning up..."
cd ..
rm master.zip
rm -rf HyFiVe-master

echo "Installation completed."
