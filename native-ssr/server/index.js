const express = require('express');
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Handle SSR
app.get('*', (req, res) => {
  // Read the HTML template
  const templatePath = path.join(__dirname, '../views/index.hbs');
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const template = handlebars.compile(templateSource);
  
  // Render the template with data
  const html = template({
    title: 'Native SSR with Handlebars',
    message: 'Hello from Server-Side Rendered App!',
    timestamp: new Date().toISOString()
  });
  
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});