// Simple icon creation script
const fs = require('fs');
const path = require('path');

// Create a simple SVG icon
function createSVGIcon(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ec4899;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
    <path d="M${size * 0.3} ${size * 0.5} L${size * 0.45} ${size * 0.65} L${size * 0.7} ${size * 0.35}" 
          stroke="white" stroke-width="${size * 0.08}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>`;
}

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes needed
const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

// Create SVG files for each size
sizes.forEach(size => {
  const svgContent = createSVGIcon(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);
  
  fs.writeFileSync(filepath, svgContent);
  console.log(`Created ${filename}`);
});

// Create a simple HTML file to convert SVGs to PNGs
const converterHTML = `<!DOCTYPE html>
<html>
<head>
    <title>Icon Converter</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .icon { margin: 10px; display: inline-block; }
        canvas { border: 1px solid #ccc; margin: 5px; }
        .download-btn { display: block; margin-top: 5px; padding: 5px 10px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; }
    </style>
</head>
<body>
    <h1>PWA Icon Converter</h1>
    <p>Click the download buttons to save PNG versions of the icons:</p>
    <div id="icons"></div>
    
    <script>
        const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];
        const container = document.getElementById('icons');
        
        sizes.forEach(size => {
            const div = document.createElement('div');
            div.className = 'icon';
            div.innerHTML = \`
                <h3>\${size}x\${size}</h3>
                <canvas id="canvas-\${size}" width="\${size}" height="\${size}"></canvas>
                <a href="#" class="download-btn" onclick="downloadIcon(\${size})">Download PNG</a>
            \`;
            container.appendChild(div);
            
            // Draw the icon
            const canvas = document.getElementById(\`canvas-\${size}\`);
            const ctx = canvas.getContext('2d');
            
            // Create gradient
            const gradient = ctx.createLinearGradient(0, 0, size, size);
            gradient.addColorStop(0, '#ec4899');
            gradient.addColorStop(1, '#8b5cf6');
            
            // Draw background
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, size, size);
            
            // Add rounded corners
            ctx.globalCompositeOperation = 'destination-in';
            ctx.beginPath();
            ctx.roundRect(0, 0, size, size, size * 0.2);
            ctx.fill();
            ctx.globalCompositeOperation = 'source-over';
            
            // Draw checkmark
            ctx.strokeStyle = 'white';
            ctx.lineWidth = size * 0.08;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            const centerX = size / 2;
            const centerY = size / 2;
            const iconSize = size * 0.4;
            
            ctx.beginPath();
            ctx.moveTo(centerX - iconSize * 0.3, centerY);
            ctx.lineTo(centerX - iconSize * 0.1, centerY + iconSize * 0.2);
            ctx.lineTo(centerX + iconSize * 0.3, centerY - iconSize * 0.2);
            ctx.stroke();
        });
        
        function downloadIcon(size) {
            const canvas = document.getElementById(\`canvas-\${size}\`);
            const link = document.createElement('a');
            link.download = \`icon-\${size}x\${size}.png\`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    </script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'convert-icons.html'), converterHTML);
console.log('Created convert-icons.html - open this file in a browser to generate PNG icons');