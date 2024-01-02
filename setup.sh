#!/bin/bash
# Set the destination folder
destination_folder="/var/www/html"

sudo mkdir -p "$destination_folder"

# Move everything to the destination folder
sudo mv * "$destination_folder"/

# Update package list
sudo apt-get update

# Install Apache
sudo apt-get install apache2 -y

# Install PHP and its modules ... libapache2-mod-php php-mysql
sudo apt-get install php  -y

# Restart Apache to apply changes
sudo service apache2 restart

# Set permissions to 755 for settings.json file
sudo chmod 755 "$destination_folder/settings.json"

echo "Installation completed."
