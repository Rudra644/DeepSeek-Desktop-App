
# DeepSeek Desktop Application

**DeepSeek Desktop** is a cross-platform desktop application is lightweight! It brings the power of DeepSeek's AI capabilities directly to your desktop, providing a seamless and efficient user experience.

## Why Choose DeepSeek?

DeepSeek is an open-source AI model developed to rival leading AI platforms. It offers advanced reasoning capabilities, efficient performance, and is accessible without subscription fees.

## Features

- **Native Desktop Experience**: Access DeepSeek directly from your desktop, without needing a brows
-   **Cross-Platform Compatibility:**  Available for Windows, macOS, and Linux systems.
-  **A lightweight:** It needs less than 9 MB of storage space and minimum resources.

## System Requirements

**Operating System:**

-   Windows 10 or later
-  MacOS 10.13 or later
-  Ubuntu 18.04 or later


## Prerequisites
Ensure you have [Node.js](https://nodejs.org/) and [Rust](https://www.rust-lang.org/) installed.

- ### MacOS
1. Install [Homebrew](https://brew.sh/)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
2. Install [Xcode](https://developer.apple.com/xcode/) Command Line Tools
```bash
xcode-select --install
```
- ### Ubuntu Linux
```bash
    sudo add-apt-repository universe sudo
    apt-get update
    sudo apt-get install -y libgtk-3-dev libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf
```
Once you have all required system packages, you can start the building process.
## How to Build

To build the DeepSeek Desktop Application from source, follow these steps:

1.  **Clone the Repository:**
    
```bash
git clone https://github.com/your-username/DeepSeek-Desktop-App.git
cd DeepSeek-Desktop-App
```
   2. **Install Tauri CLI & Dependencies:**
```bash
npm install --save @tauri-apps/cli
cargo install tauri-cli
npm install
```

3.  **Build the Application:**
    
   ```bash
   npm run tauri:build
   ```
   4. **Launch the Application:**

Run the executable file located in the `src-tauri/target/release/bundle` directory.

## Contributing

We welcome contributions! Please fork the repository and submit a pull request with your enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

----------

_Note: This application is a community-driven project and is not officially affiliated with the DeepSeek organization._