# 🎮 How to Start FIONA Game

## Quick Start (Easy Method)

Simply **double-click** on `START_GAME.bat` to launch the game!

The batch file will:
- ✅ Start the development server automatically
- ✅ Open your default browser to http://localhost:8080
- ✅ Display a colorful terminal window showing the server status

## To Stop the Game

**Option 1:** Close the terminal window that appeared when you started the game

**Option 2:** Double-click `STOP_GAME.bat` to cleanly stop the server

## Manual Method (For Developers)

If you prefer the traditional way:

1. Open Command Prompt or PowerShell
2. Navigate to the project folder:
   ```bash
   cd "c:\Users\ACER\Desktop\2025 Capstone Project\FIONA"
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to http://localhost:8080

## Requirements

- ✅ Node.js installed (v18 or higher recommended)
- ✅ NPM installed (comes with Node.js)
- ✅ All dependencies installed (run `npm install` first if needed)

## Troubleshooting

### Game won't start?
- Make sure Node.js is installed: Run `node --version` in Command Prompt
- Install dependencies: Run `npm install` in the project folder
- Check if port 8080 is already in use: Close any other applications using that port

### Port 8080 already in use?
- Run `STOP_GAME.bat` to stop any existing servers
- Or change the port in `package.json` (line: `"dev": "node log.js dev & next dev -p 8080"`)

## Notes

- Keep the terminal window open while playing
- Your game progress is saved automatically
- Press `Ctrl+C` in the terminal to stop the server manually

Enjoy playing FIONA! 🎓📐
