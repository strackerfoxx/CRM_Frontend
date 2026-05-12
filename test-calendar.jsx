const apiData = {
  "totalAppointments": 10,
  "dailyMetrics": [
    { "date": "2026-05-06", "count": 1, "color": "blue" },
    { "date": "2026-05-09", "count": 1, "color": "blue" },
    { "date": "2026-05-15", "count": 1, "color": "blue" },
    { "date": "2026-05-13", "count": 3, "color": "blue" },
    { "date": "2026-05-16", "count": 2, "color": "blue" },
    { "date": "2026-05-14", "count": 2, "color": "blue" }
  ]
};

const dayApiData = {
  "appointments": [
    { "startTime": "09:00", "endTime": "10:05", "status": "SCHEDULED", "clientName": "Diego Castle", "employeeName": "Marcos - Manicurista" },
    { "startTime": "09:20", "endTime": "12:10", "status": "SCHEDULED", "clientName": "Alex Edu", "employeeName": "Ana" },
    { "startTime": "10:20", "endTime": "11:20", "status": "SCHEDULED", "clientName": "Sotodiego", "employeeName": "Marcos - Manicurista" }
  ],
  "revenue": 4908,
  "employeeOccupancy": { "Marcos - Manicurista": 120, "Ana": 150 },
  "deadTime": 350
};
