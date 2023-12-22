#!/bin/bash

# Update package list
sudo apt-get update

# Install Apache
sudo apt-get install apache2 -y

# Install PHP and its modules ... libapache2-mod-php php-mysql
sudo apt-get install php  -y

# Set the destination folder
destination_folder="/var/www/html"

# Create the destination folder if it doesn't exist
if [ ! -d "$destination_folder" ]; then
    sudo mkdir -p "$destination_folder"
fi

# Move current files to /var/www/html excluding the script itself
sudo find . -maxdepth 1 -type f -name "*.sh" -not -name "$(basename "$0")" -exec mv {} "$destination_folder" \;

# Set permissions to 755 for settings.json file
sudo chmod 755 "$destination_folder/settings.json"

# Restart Apache to apply changes
sudo service apache2 restart

echo "Installation completed."
