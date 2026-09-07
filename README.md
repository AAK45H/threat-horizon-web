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


-----------------------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------------

### To Host on EC2
# 1. Update system
```bash
sudo yum update -y
```
# 2. Install Node.js
```bash
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
```
# 3. Install PM2 and Nginx
```bash
sudo npm install -g pm2
sudo dnf install nginx -y      # AL2023
```

# 4. Start Nginx
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```
# 5. Clone repo
```bash
cd ~
git clone https://github.com/AAK45H/threat-horizon-web.git
cd threat-horizon-web
```

# 6. Install deps and build
```bash
npm install
npm run build
```

# 7. Copy dist to web root
```bash
sudo mkdir -p /var/www/myapp
sudo cp -r dist/* /var/www/myapp/
```

# 8. Start backend with PM2
```bash
pm2 start server.js --name "backend"
pm2 startup
pm2 save
```

# 9. Create Nginx config
```bash
sudo nano /etc/nginx/conf.d/myapp.conf
```
paste this:
server {
    listen 80;
    server_name YOUR_EC2_PUBLIC_IP;

    root /var/www/myapp;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 10. Apply Nginx config
```bash
sudo nginx -t
sudo systemctl restart nginx
```

## Technologies Used
- React
- Vite
- React Flow (@xyflow/react)
- Express
- Node.js
