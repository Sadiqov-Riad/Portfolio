const fs = require('fs');
const file = 'c:/Users/sadiq/OneDrive - ITM STEP MMC/Desktop/step/portfolio/components/RetroWindows.tsx';
let data = fs.readFileSync(file, 'utf8');

const startMarker = '{openWindows.includes("3D_Portfolio") && (';
const endMarker = '{openWindows.includes("Contact") && (';
const startIndex = data.indexOf(startMarker);
const endIndex = data.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `
        {openWindows.includes("HabitForge") && (
          <div
            className={\`win95-window \${activeWindow === "HabitForge" ? "active" : ""}\`}
            onMouseDown={() => setActiveWindow("HabitForge")}
            style={{ top: positions["HabitForge"].y, left: positions["HabitForge"].x, width: "380px", height: "290px" }}
          >
            <div className="win95-titlebar" onMouseDown={(e) => startDrag(e, "HabitForge")}>
              <span className="win95-title">
                <Code size={14} className="inline mr-1 text-blue-200" /> HabitForge
              </span>
              <button className="win95-close-btn" onClick={() => closeWindow("HabitForge")}>
                <X size={12} strokeWidth={3} />
              </button>
            </div>
            <div className="win95-window-content bg-white text-black p-4 text-sm overflow-y-auto">
              <img src="/assets/icon_explorer.png" width={32} height={32} className="float-right ml-4 mb-4" />
              <h2 className="text-xl font-bold mb-2">HabitForge</h2>
              <p className="mb-3">A full-stack habit tracking application designed to help users build and maintain positive routines.</p>
              <h3 className="font-bold mt-2">TECH STACK:</h3>
              <ul className="list-disc pl-5 mb-4">
                <li><strong>Frontend:</strong> React</li>
                <li><strong>Backend:</strong> ASP.NET Core</li>
                <li><strong>Database:</strong> SQL Server</li>
              </ul>
              <a href="https://github.com/riadsadiqov/HabitForge" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline flex items-center gap-1 mt-4 hover:text-blue-800">
                <Github size={16} /> View on GitHub
              </a>
            </div>
          </div>
        )}

        {openWindows.includes("CoffeeShop") && (
          <div
            className={\`win95-window \${activeWindow === "CoffeeShop" ? "active" : ""}\`}
            onMouseDown={() => setActiveWindow("CoffeeShop")}
            style={{ top: positions["CoffeeShop"].y, left: positions["CoffeeShop"].x, width: "360px", height: "290px" }}
          >
            <div className="win95-titlebar" onMouseDown={(e) => startDrag(e, "CoffeeShop")}>
              <span className="win95-title">
                <Map size={14} className="inline mr-1 text-green-200" /> CoffeeShop
              </span>
              <button className="win95-close-btn" onClick={() => closeWindow("CoffeeShop")}>
                <X size={12} strokeWidth={3} />
              </button>
            </div>
            <div className="win95-window-content bg-white text-black p-4 text-sm overflow-y-auto">
              <img src="/assets/icon_notepad.png" width={32} height={32} className="float-right ml-4 mb-4" />
              <h2 className="text-xl font-bold mb-2">CoffeeShop App</h2>
              <p className="mb-3">A cross-platform mobile application for browsing coffee menus, placing orders, and managing loyalty rewards.</p>
              <h3 className="font-bold mt-2">TECH STACK:</h3>
              <ul className="list-disc pl-5 mb-4">
                <li><strong>Framework:</strong> React Native</li>
                <li><strong>Features:</strong> Animations, Cart state, UI/UX</li>
                <li><strong>Platforms:</strong> iOS & Android</li>
              </ul>
              <a href="https://github.com/riadsadiqov/CoffeeShop" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline flex items-center gap-1 mt-4 hover:text-blue-800">
                <Github size={16} /> View on GitHub
              </a>
            </div>
          </div>
        )}

        {openWindows.includes("E_Wallet") && (
          <div
            className={\`win95-window \${activeWindow === "E_Wallet" ? "active" : ""}\`}
            onMouseDown={() => setActiveWindow("E_Wallet")}
            style={{ top: positions["E_Wallet"].y, left: positions["E_Wallet"].x, width: "360px", height: "300px" }}
          >
            <div className="win95-titlebar" onMouseDown={(e) => startDrag(e, "E_Wallet")}>
              <span className="win95-title">
                <TerminalSquare size={14} className="inline mr-1 text-gray-200" /> E-wallet
              </span>
              <button className="win95-close-btn" onClick={() => closeWindow("E_Wallet")}>
                <X size={12} strokeWidth={3} />
              </button>
            </div>
            <div className="win95-window-content bg-black text-green-500 p-4 font-mono text-sm overflow-y-auto h-full">
              <p>C:\\Projects\\E-Wallet> run-android</p>
              <br/>
              <p className="font-bold text-white mb-2">=== E-Wallet React Native App ===</p>
              <h3 className="text-white mt-2">TECH STACK:</h3>
              <p className="text-gray-300">React Native</p>
              <br/>
              <p>Features loaded:</p>
              <ul className="list-disc pl-5 mt-1">
                <li>Secure Authentication</li>
                <li>Balance Tracking</li>
                <li>Transaction History</li>
                <li>QR Code Scanning</li>
              </ul>
              <a href="https://github.com/riadsadiqov/E-Wallet" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline flex items-center gap-1 mt-4 pt-2 border-t border-gray-600 hover:text-blue-300">
                <Github size={16} /> View on GitHub
              </a>
              <p className="animate-pulse mt-2">_</p>
            </div>
          </div>
        )}

        `;
        
  data = data.substring(0, startIndex) + replacement + data.substring(endIndex);
}

data = data.replaceAll("<span>HabitForge.exe</span>", "<span>HabitForge</span>");
data = data.replaceAll("<span>CoffeeShop.apk</span>", "<span>CoffeeShop</span>");
data = data.replaceAll("<span>E-wallet.apk</span>", "<span>E-wallet</span>");

if (data.includes('activeWindow === "Projects"')) {
   const projectStartIdx = data.indexOf('{openWindows.includes("Projects") && (');
   const projectEndIdx = data.indexOf('<div className="win95-window-content', projectStartIdx);
   if (projectStartIdx !== -1 && projectEndIdx !== -1) {
       let projectStr = data.substring(projectStartIdx, projectEndIdx);
       projectStr = projectStr.replace(/<div className="win95-menubar">.*?<\/div>\s*/s, "");
       data = data.substring(0, projectStartIdx) + projectStr + data.substring(projectEndIdx);
   }
}

fs.writeFileSync(file, data, 'utf8');
console.log('Done replacement');
