#!/bin/bash

# d0s.dev Site Setup Script
# This script helps you set up and deploy the d0s.dev website

set -e

echo "🚀 d0s.dev Site Setup"
echo "===================="
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20.x or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi
echo ""

# Build the site
echo "🔨 Building the site..."
npm run build
echo "✅ Site built successfully"
echo ""

# Ask about deployment
echo "Would you like to:"
echo "1) Preview the site locally"
echo "2) Deploy to GitHub Pages"
echo "3) Exit"
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🌐 Starting preview server..."
        echo "   Open http://localhost:4173 in your browser"
        npm run preview
        ;;
    2)
        echo ""
        echo "📤 Deploying to GitHub Pages..."
        
        # Check if gh-pages is installed
        if ! npm list gh-pages &> /dev/null; then
            echo "Installing gh-pages..."
            npm install --save-dev gh-pages
        fi
        
        npm run deploy
        echo "✅ Deployed to GitHub Pages!"
        echo "   Your site will be available at https://d0s.dev"
        ;;
    3)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac
