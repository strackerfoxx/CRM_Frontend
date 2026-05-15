const fs = require('fs');
let file = fs.readFileSync('src/components/ClientComponent.jsx', 'utf8');
file = file.replace('import { useBusiness } from "@/hooks/useBusiness"', 'import { useBusiness } from "@/hooks/useBusiness"\nimport OverviewHeader from "@/components/OverviewHeader"');
fs.writeFileSync('src/components/ClientComponent.jsx', file);
