# Wep Applikation of Hyfive

## Credits

>Created between 2022 and 2023 as part of the Hyfive project.\
>Web application for the visualisation of data sets within an influx database.\
>Problems and contact:

>https://github.com/TreeM4n/HyFiVe/issues 

>or

>baum.tree.tm@gmail.com

## New Installation 

### (Optional) For updating older Installations

>Linux: 
```
sudo rm -r /var/www/html
```

>Yes, this is just removes the entire folder.

### Via Quick Setup Script
```
wget -O quick-setup.sh "https://raw.githubusercontent.com/TreeM4n/HyFiVe/main/quick-setup.sh" && chmod +x quick-setup.sh && bash quick-setup.sh \
 ```
>Thats it.

### Via SSH and Local Machine in some directionary
#### 1. Download and extract Archive

>URl:    https://github.com/TreeM4n/HyFiVe/archive/master.zip

>Linux: 
``` 
wget "https://github.com/TreeM4n/HyFiVe/archive/master.zip"
```

#### 2. Extract (after or before transfering to remote machine)

>Locally or \
>Linux: 
```
sudo apt-get install unzip
```
```
unzip HyFiVe-main.zip 
```

#### 3. Run Shell File

>Linux:  
```
chmod +x setup.sh 
```
```
./setup.sh
```

#### 4. (optional) Check in var/www/html 



