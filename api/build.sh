#!/bin/bash
# Install Python 3.12 if not present
if ! command -v python3.12 &> /dev/null; then
    curl -O https://www.python.org/ftp/python/3.12.0/Python-3.12.0.tgz
    tar -xzf Python-3.12.0.tgz
    cd Python-3.12.0
    ./configure --enable-optimizations
    make altinstall
    cd ..
fi

# Use Python 3.12's pip to install requirements
python3.12 -m pip install --upgrade pip
python3.12 -m pip install -r requirements.txt
