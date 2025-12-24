# FlowStep - AI-Assisted Code-to-Support-Flow Visualizer
**Your Code** ⟶ *local/cloud AI builds a ReactFlow JSON* ⟶ Import to FlowStep ⟶ **finish and export a single, read-only HTML file with a built-in execution sequence view**  
*The sequence view automatically highlights the execution order step by step, making it easy to follow what happens next without reading the code.*

FlowStep is a tool designed to convert complex code logic into clean, easy to understand, interactive process diagrams. It’s the perfect bridge between Development and Support.  
The purpose of this tool is **not** to provide support staff with a testing checklist or to visualise the **complexity of your code**, but by concentrating on the raw process flow of your code, **we enable** colleagues to trace the code execution logic and identify the root cause of module failures.

If you try FlowStep with my prompt and you wonder that your diagram looks very simple - well that was the goal 😉.

**Note:** While manual creation is possible, FlowStep is built for AI speed. If you are not allowed to use AI or prefer building everything from scratch, ReactFlow’s [showcase](https://reactflow.dev/showcase) might offer more traditional and better alternatives.

**Note2:** This app is already fully functional, but still just the "base" of this idea. Do whatever you want and need to do **(add/remove/adapt)** to make it work even better for you and your team.

![FlowStep Sequence](./Sequence.gif)

# Prerequisites

Before you start, you need to have **Node.js** installed on your computer.
*If you don't usually work with React or Frontend: Node.js is the runtime environment that powers this tool in the background.*

1. Download Node.js (LTS Version) here: [nodejs.org](https://nodejs.org/)
2. Install it using the default settings.

# Quick Start (Local Execution)

Once you have unpacked the folder, open your terminal (Command Prompt or PowerShell) inside that folder and enter the following commands:

1. **Install dependencies:**

```bash
npm install
```

(This will download all necessary libraries like React and Tailwind. A folder named node_modules will be created—you can simply ignore it.)

# How to start, the workflow and important information:
🛫 Start the App  

```bash
npm run dev
```
```bash
open: click on the link provided to you in the terminal.
e.g: ➜ Local:   http://localhost:3000/
```
💡The Workflow (80/20 Principle)  
80% is already done / 20% - the finish - comes from you  
Logic Extraction: Have the **(Prompt_english.txt)** prompt ready, insert the copy of your code **at the bottom** and let an AI (local or cloud) (e.g., Gemini (best results while testing)) generate the logic data in ReactFlow JSON format.  
Prompt build: What to do -> ReactFlow example (dont delete this - or you get output which does not exist in my ReactFlow scheme) -> Your Code (this is the place for your code).

1. Import: **Completely replace** the content of **constants.tsx** with the code provided by the AI. If changes aren't visible immediately, click "Restore Defaults" on the right.

2. Fine-tuning: Briefly adjust the positions of the boxes (nodes) and add additional connections manually. Check the "Sequence" view to ensure the flow is correct.

3. Export: Click on "Save" first and then "Export Portable HTML." You will receive a single, lightweight and read-only .html file.

📦 Delivery & Support  
The exported HTML file is completely independent. You can send it to support, embed it in your wiki, or simply open it in a browser. It requires no Node.js and no server to run.

Happy Visualizing!

```text
⚠️ Save/Copy/Restore Defaults and Export Portable HTML buttons - what to know so you dont think 
"meh, doesnt work" ⚠️

"Browser Save"
Save Button: This button saves your current progress to your browser's LocalStorage. 
If you refresh the page, your work will still be there. 
Note: This does not write changes back to your actual constants.tsx file 
on your hard drive, use "Copy" for that.

"Hard Save"
Copy: This button copies the entire code for your constants.tsx to your clipboard. 
To "hard-save" your work permanently, replace the **complete** content of your local 
constants.tsx file with this copied code.

Restore Defauls: This button resets the editor to the state currently defined in your 
constants.tsx file. 
Use this if you see an outdated flow from your LocalStorage or want to start over 
from the file's original state.

Export portable HTML: This function uses the data from your LocalStorage to generate 
the HTML file. Crucial: Always click **"Save"** before exporting to ensure the HTML 
>includes your latest changes.
```
```text
Tips & Tricks

➡️ ⬇️ Straight Arrow connections:
When it seems not possible to connect a straight arrow from one node to the other. 
It may come from the AI import. Try to snap all nodes to the grid and then reconnect them.
This will most likely occur after the first import when you moved one node but not the other. 
The node you moved is snaped to the grid the other is not.
Move all the nodes one time and then use the "Align Y" or "Align X" buttons.
```

📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details."