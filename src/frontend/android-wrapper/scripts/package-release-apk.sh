#!/bin/bash
# Package Release APK Script
# This script builds the Android wrapper release APK and exports it to a stable web-downloadable path

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Calorieshivam Android APK Packaging ===${NC}"

# Get the script directory and project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ANDROID_WRAPPER_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"
FRONTEND_DIR="$( cd "$ANDROID_WRAPPER_DIR/.." && pwd )"
PROJECT_ROOT="$( cd "$FRONTEND_DIR/.." && pwd )"

# Output paths
OUTPUT_DIR="$FRONTEND_DIR/public/downloads"
OUTPUT_APK="$OUTPUT_DIR/Calorieshivam.apk"
GITKEEP_FILE="$OUTPUT_DIR/.gitkeep"

echo "Android wrapper directory: $ANDROID_WRAPPER_DIR"
echo "Output directory: $OUTPUT_DIR"

# Check if gradle.properties exists
if [ ! -f "$ANDROID_WRAPPER_DIR/gradle.properties" ]; then
    echo -e "${RED}ERROR: gradle.properties not found${NC}"
    exit 1
fi

# Check if nutriscan.baseUrl is configured (FAIL FAST with clear error)
BASE_URL=$(grep "^nutriscan.baseUrl=" "$ANDROID_WRAPPER_DIR/gradle.properties" | cut -d'=' -f2)
if [ -z "$BASE_URL" ] || [ "$BASE_URL" = "https://YOUR_CANISTER_ID.ic0.app" ]; then
    echo ""
    echo -e "${RED}╔════════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║                           CONFIGURATION ERROR                          ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${RED}ERROR: nutriscan.baseUrl is not configured or still set to placeholder.${NC}"
    echo ""
    echo -e "${YELLOW}You must set the production canister URL before building the APK.${NC}"
    echo ""
    echo -e "${GREEN}To fix this:${NC}"
    echo -e "  1. Open: ${YELLOW}frontend/android-wrapper/gradle.properties${NC}"
    echo -e "  2. Set:  ${GREEN}nutriscan.baseUrl=https://<YOUR_CANISTER_ID>.ic0.app${NC}"
    echo -e "     Example: ${GREEN}nutriscan.baseUrl=https://abc123-xyz.ic0.app${NC}"
    echo -e "  3. Save the file"
    echo -e "  4. Re-run this packaging script"
    echo ""
    echo -e "${YELLOW}Replace <YOUR_CANISTER_ID> with your actual Internet Computer canister ID.${NC}"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓ Target URL configured: $BASE_URL${NC}"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Ensure .gitkeep exists (create if missing, preserve if present)
if [ ! -f "$GITKEEP_FILE" ]; then
    echo -e "${YELLOW}Creating .gitkeep file to preserve downloads directory in version control${NC}"
    touch "$GITKEEP_FILE"
fi

# Navigate to Android wrapper directory
cd "$ANDROID_WRAPPER_DIR"

# Clean previous builds
echo -e "${GREEN}Cleaning previous builds...${NC}"
./gradlew clean

# Build release APK
echo -e "${GREEN}Building release APK...${NC}"
./gradlew assembleRelease

# Find the generated APK
GENERATED_APK="$ANDROID_WRAPPER_DIR/app/build/outputs/apk/release/app-release.apk"

if [ ! -f "$GENERATED_APK" ]; then
    echo -e "${RED}ERROR: Release APK not found at $GENERATED_APK${NC}"
    exit 1
fi

# Copy to stable output path
echo -e "${GREEN}Copying APK to web-downloadable location...${NC}"
cp "$GENERATED_APK" "$OUTPUT_APK"

# Get APK size
APK_SIZE=$(du -h "$OUTPUT_APK" | cut -f1)

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                          BUILD SUCCESSFUL                              ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✓ APK Location: ${NC}$OUTPUT_APK"
echo -e "${GREEN}✓ APK Size:     ${NC}$APK_SIZE"
echo -e "${GREEN}✓ Target URL:   ${NC}$BASE_URL"
echo ""
echo -e "${GREEN}The APK is now available at:${NC}"
echo -e "  ${YELLOW}Local path:${NC}  frontend/public/downloads/Calorieshivam.apk"
echo -e "  ${YELLOW}Web URL:${NC}     /downloads/Calorieshivam.apk (when frontend is deployed)"
echo ""
echo -e "${YELLOW}Note: This APK is unsigned unless you configured signing credentials.${NC}"
echo -e "${YELLOW}For production distribution, configure signing in local.properties${NC}"
echo -e "${YELLOW}(see README.md for signing setup instructions)${NC}"
echo ""
echo -e "${GREEN}✓ The downloads directory and .gitkeep file are preserved for version control.${NC}"
echo ""
