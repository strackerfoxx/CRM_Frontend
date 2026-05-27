const fs = require('fs');
const content = fs.readFileSync('src/components/modals/DeleteModal.jsx', 'utf-8');
console.log(content.includes('AlertTriangle'));
console.log(content.includes('flex flex-row gap-3 w-full'));
