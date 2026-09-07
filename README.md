# Threat Horizon Web

Threat Horizon Web is a React-based interactive web application developed as part of a Capstone project. It provides a visual, node-based interface to map and analyze various security threats, reports, and dark web intelligence.

## Features
- **Interactive Node Map**: Built with [@xyflow/react](https://reactflow.dev/) to render a dynamic threat landscape.
- **Custom Nodes**: Includes specialized components such as `ThreatMapNode`, `ReportNode`, and `DarkWebNode` to represent different types of intelligence.
- **Vite & React**: Fast development experience powered by Vite and React 19.
- **Express Server**: Simple Node.js Express server to serve the production build.

## Prerequisites
- Node.js (v18 or higher recommended)
- npm

## Getting Started

### Install node on EC2
```bash
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
```

### Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### Development
To start the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```

### Production Build
To build the application for production:
```bash
npm run build
```

To preview the built production app locally:
```bash
npm run preview
```

### Running the Express Server
To serve the built application using the included Express server (runs on port 3000 by default):
```bash
npm start
```

## Technologies Used
- React
- Vite
- React Flow (@xyflow/react)
- Express
- Node.js
