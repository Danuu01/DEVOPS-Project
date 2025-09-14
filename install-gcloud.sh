#!/bin/bash

echo "🔧 Installing Google Cloud CLI (gcloud)"
echo "======================================="

# Check if running on Linux
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "📦 Detected Linux system"
    
    # Add the Cloud SDK distribution URI as a package source
    echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
    
    # Import the Google Cloud Platform public key
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
    
    # Update the package list and install the Cloud SDK
    sudo apt-get update && sudo apt-get install google-cloud-cli
    
    echo "✅ Google Cloud CLI installed successfully"
    echo ""
    echo "🔑 Next steps:"
    echo "1. Run: gcloud auth login"
    echo "2. Run: gcloud config set project rosy-slate-468308-r5"
    echo "3. Run: gcloud builds triggers list"
    echo "4. Run: gcloud builds triggers disable [TRIGGER_ID]"
    
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Detected macOS system"
    echo "Please install using Homebrew:"
    echo "brew install --cask google-cloud-sdk"
    
else
    echo "❌ Unsupported operating system: $OSTYPE"
    echo "Please install manually from: https://cloud.google.com/sdk/docs/install"
fi
