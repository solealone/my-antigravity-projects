// Mock Database for Yez Bus Dashboard
// Centered around Holy Grace Academy, Mala, Kerala, India (~10.2291, 76.3117)

const SCHOOL_COORDS = [10.2291, 76.3117];

const MOCK_ROUTES = [
  {
    id: "R-01",
    name: "Mala-Kodungallur Express",
    busId: "KL-45-H-1024",
    driverId: "D-01",
    studentsCount: 42,
    capacity: 50,
    distance: "18.5 km",
    duration: "38 min",
    status: "Active",
    color: "#EF4444",
    stops: [
      { name: "Kodungallur Temple Junction", coords: [10.2192, 76.1973], time: "07:15 AM", studentCount: 12 },
      { name: "Pullut Bridge Stop", coords: [10.2235, 76.2201], time: "07:22 AM", studentCount: 8 },
      { name: "Vellangallur Junction", coords: [10.2312, 76.2584], time: "07:31 AM", studentCount: 10 },
      { name: "Mala KSRTC Stand Stop", coords: [10.2154, 76.2954], time: "07:44 AM", studentCount: 12 },
      { name: "Holy Grace Academy", coords: SCHOOL_COORDS, time: "07:53 AM", studentCount: 0 }
    ]
  },
  {
    id: "R-02",
    name: "Chalakudy-Mala Route",
    busId: "KL-45-H-4560",
    driverId: "D-02",
    studentsCount: 35,
    capacity: 40,
    distance: "16.2 km",
    duration: "32 min",
    status: "Active",
    color: "#3B82F6",
    stops: [
      { name: "Chalakudy Railway Station Stop", coords: [10.3061, 76.3352], time: "07:20 AM", studentCount: 8 },
      { name: "Anathadam Junction", coords: [10.2825, 76.3211], time: "07:29 AM", studentCount: 10 },
      { name: "Potta Bypass Corner", coords: [10.2711, 76.3295], time: "07:34 AM", studentCount: 7 },
      { name: "Mala Town Hall", coords: [10.2185, 76.2981], time: "07:46 AM", studentCount: 10 },
      { name: "Holy Grace Academy", coords: SCHOOL_COORDS, time: "07:52 AM", studentCount: 0 }
    ]
  },
  {
    id: "R-03",
    name: "Angamaly-Mala Corridor",
    busId: "KL-45-H-8921",
    driverId: "D-03",
    studentsCount: 48,
    capacity: 50,
    distance: "21.0 km",
    duration: "44 min",
    status: "Active",
    color: "#10B981",
    stops: [
      { name: "Angamaly KSRTC Stand", coords: [10.1983, 76.3862], time: "07:10 AM", studentCount: 15 },
      { name: "Kidangoor Junction", coords: [10.2124, 76.3681], time: "07:20 AM", studentCount: 8 },
      { name: "Adoor Stop", coords: [10.2215, 76.3492], time: "07:28 AM", studentCount: 12 },
      { name: "Kuzhur Church Junction", coords: [10.2102, 76.3251], time: "07:39 AM", studentCount: 13 },
      { name: "Holy Grace Academy", coords: SCHOOL_COORDS, time: "07:54 AM", studentCount: 0 }
    ]
  },
  {
    id: "R-04",
    name: "Irinjalakuda-Mala Route",
    busId: "KL-45-H-3321",
    driverId: "D-04",
    studentsCount: 28,
    capacity: 35,
    distance: "15.8 km",
    duration: "30 min",
    status: "Active",
    color: "#F5A623",
    stops: [
      { name: "Irinjalakuda Koodalmanikyam Temple", coords: [10.3421, 76.2132], time: "07:25 AM", studentCount: 6 },
      { name: "Mapranam Stop", coords: [10.3214, 76.2291], time: "07:32 AM", studentCount: 7 },
      { name: "Karuvannur Bridge", coords: [10.3125, 76.2415], time: "07:37 AM", studentCount: 5 },
      { name: "Aloor Junction Stop", coords: [10.2685, 76.2891], time: "07:47 AM", studentCount: 10 },
      { name: "Holy Grace Academy", coords: SCHOOL_COORDS, time: "07:55 AM", studentCount: 0 }
    ]
  },
  {
    id: "R-05",
    name: "Mala Local Ring",
    busId: "KL-45-H-5011",
    driverId: "D-05",
    studentsCount: 39,
    capacity: 45,
    distance: "9.5 km",
    duration: "22 min",
    status: "Active",
    color: "#8B5CF6",
    stops: [
      { name: "Poyya Village Office", coords: [10.1852, 76.3021], time: "07:30 AM", studentCount: 12 },
      { name: "Kuruvilassery School Stop", coords: [10.2014, 76.3154], time: "07:38 AM", studentCount: 10 },
      { name: "Mala Private Bus Stand", coords: [10.2162, 76.2942], time: "07:45 AM", studentCount: 17 },
      { name: "Holy Grace Academy", coords: SCHOOL_COORDS, time: "07:52 AM", studentCount: 0 }
    ]
  }
];

const MOCK_BUSES = [
  { id: "KL-45-H-1024", regNumber: "KL-45-H-1024", capacity: 50, gpsStatus: "Online", trackerIMEI: "358942109843211", docExpiry: "Valid", insuranceDue: "2026-11-20", fitnessDue: "2026-09-15", pucDue: "2026-08-30", serviceOdo: "42,150 km", speed: 38, lat: 10.2235, lng: 76.2201 },
  { id: "KL-45-H-4560", regNumber: "KL-45-H-4560", capacity: 40, gpsStatus: "Online", trackerIMEI: "358942109843212", docExpiry: "Valid", insuranceDue: "2026-12-05", fitnessDue: "2026-10-10", pucDue: "2026-07-25", serviceOdo: "28,400 km", speed: 45, lat: 10.2711, lng: 76.3295 },
  { id: "KL-45-H-8921", regNumber: "KL-45-H-8921", capacity: 50, gpsStatus: "Online", trackerIMEI: "358942109843213", docExpiry: "Valid", insuranceDue: "2026-08-14", fitnessDue: "2026-12-22", pucDue: "2026-07-15", serviceOdo: "15,820 km", speed: 0, lat: 10.1983, lng: 76.3862 },
  { id: "KL-45-H-3321", regNumber: "KL-45-H-3321", capacity: 35, gpsStatus: "Online", trackerIMEI: "358942109843214", docExpiry: "Expiring Soon", insuranceDue: "2026-07-12", fitnessDue: "2026-08-01", pucDue: "2026-07-02", serviceOdo: "56,900 km", speed: 28, lat: 10.3214, lng: 76.2291 },
  { id: "KL-45-H-5011", regNumber: "KL-45-H-5011", capacity: 45, gpsStatus: "Online", trackerIMEI: "358942109843215", docExpiry: "Valid", insuranceDue: "2027-02-18", fitnessDue: "2026-11-05", pucDue: "2026-09-12", serviceOdo: "34,210 km", speed: 32, lat: 10.2014, lng: 76.3154 },
  { id: "KL-45-H-6712", regNumber: "KL-45-H-6712", capacity: 50, gpsStatus: "Offline", trackerIMEI: "358942109843216", docExpiry: "Valid", insuranceDue: "2026-10-02", fitnessDue: "2027-01-20", pucDue: "2026-11-20", serviceOdo: "12,400 km", speed: 0, lat: 10.2291, lng: 76.3117 },
  { id: "KL-45-H-2390", regNumber: "KL-45-H-2390", capacity: 40, gpsStatus: "Offline", trackerIMEI: "358942109843217", docExpiry: "Expired", insuranceDue: "2026-06-15", fitnessDue: "2026-05-10", pucDue: "2026-06-20", serviceOdo: "68,120 km", speed: 0, lat: 10.2291, lng: 76.3117 },
  { id: "KL-45-H-9041", regNumber: "KL-45-H-9041", capacity: 45, gpsStatus: "Maintenance", trackerIMEI: "358942109843218", docExpiry: "Valid", insuranceDue: "2027-01-05", fitnessDue: "2026-12-01", pucDue: "2026-10-05", serviceOdo: "49,300 km", speed: 0, lat: 10.2201, lng: 76.3050 }
];

const MOCK_DRIVERS = [
  { id: "D-01", name: "Suresh Pillai", phone: "+91 98470 12345", license: "DL-45/2012/1004", rating: 4.8, status: "Active", score: 94, harshBrake: 2, speeding: 0, cornering: 1, onTimeRate: "98%", avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=60" },
  { id: "D-02", name: "Ragesh K. R.", phone: "+91 98471 23456", license: "DL-45/2015/8892", rating: 4.5, status: "Active", score: 87, harshBrake: 8, speeding: 2, cornering: 3, onTimeRate: "92%", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60" },
  { id: "D-03", name: "Vipin Das", phone: "+91 98472 34567", license: "DL-45/2009/4431", rating: 4.9, status: "Active", score: 98, harshBrake: 0, speeding: 0, cornering: 0, onTimeRate: "99%", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=60" },
  { id: "D-04", name: "Biju Thomas", phone: "+91 98473 45678", license: "DL-45/2018/3210", rating: 4.2, status: "Active", score: 79, harshBrake: 14, speeding: 5, cornering: 7, onTimeRate: "89%", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60" },
  { id: "D-05", name: "Shaji Mala", phone: "+91 98474 56789", license: "DL-45/2011/9841", rating: 4.7, status: "Active", score: 91, harshBrake: 3, speeding: 1, cornering: 2, onTimeRate: "96%", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=60" },
  { id: "D-06", name: "Antony Paul", phone: "+91 98475 67890", license: "DL-45/2014/1102", rating: 4.6, status: "Standby", score: 89, harshBrake: 4, speeding: 1, cornering: 2, onTimeRate: "95%", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=60" }
];

const MOCK_ALERTS = [
  { id: "A-01", type: "SOS", message: "SOS Alert triggered on Bus KL-45-H-1024 - Hard deceleration detected", time: "10 min ago", severity: "critical", resolved: false, bus: "KL-45-H-1024", location: [10.2235, 76.2201] },
  { id: "A-02", type: "Speeding", message: "Bus KL-45-H-4560 over-speeding (64 km/h in 40 km/h zone)", time: "25 min ago", severity: "high", resolved: false, bus: "KL-45-H-4560", location: [10.2711, 76.3295] },
  { id: "A-03", type: "Deviation", message: "Route deviation detected on Bus KL-45-H-3321", time: "42 min ago", severity: "medium", resolved: true, bus: "KL-45-H-3321", location: [10.3214, 76.2291] },
  { id: "A-04", type: "Idle", message: "Bus KL-45-H-8921 excessive idling (12 minutes, engine on)", time: "1 hour ago", severity: "low", resolved: true, bus: "KL-45-H-8921", location: [10.1983, 76.3862] },
  { id: "A-05", type: "Document", message: "PUC certificate expiring in 2 days for KL-45-H-3321", time: "2 hours ago", severity: "medium", resolved: false, bus: "KL-45-H-3321", location: null }
];

// Helper to generate list of students distributed over Thrissur district
const firstNames = ["Rahul", "Anjali", "Sreejith", "Meera", "Akhil", "Arya", "Gokul", "Devika", "Abhijith", "Sneha", "Kiran", "Sandra", "Arjun", "Malavika", "Vishnu", "Neethu", "Amal", "Athira", "Midhun", "Gouri", "Jithin", "Reshma", "Pranav", "Aparna", "Vivek", "Kavya", "Deepak", "Aiswarya", "Sachin", "Swathy"];
const lastNames = ["Nair", "Menon", "Pillai", "Kurup", "Nambiar", "Panicker", "Shenoy", "Varma", "Jose", "Thomas", "Paul", "George", "Varghese", "Kurian", "Mathew", "Antony", "Devassy", "Warrier", "Marar", "Bhattathiri", "Kartha", "Prabhu", "Naik", "Roy", "Sunny", "Peter", "Raju", "Baby", "Suresh", "Kumar"];
const classes = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
const sections = ["A", "B", "C", "D"];

function generateMockStudents() {
  const students = [];
  let studentId = 1000;
  
  // Seed local centers for students around our routes
  const centers = [
    { coords: [10.2192, 76.1973], route: "R-01", stop: "Kodungallur Temple Junction" },
    { coords: [10.2235, 76.2201], route: "R-01", stop: "Pullut Bridge Stop" },
    { coords: [10.2312, 76.2584], route: "R-01", stop: "Vellangallur Junction" },
    { coords: [10.2154, 76.2954], route: "R-01", stop: "Mala KSRTC Stand Stop" },
    
    { coords: [10.3061, 76.3352], route: "R-02", stop: "Chalakudy Railway Station Stop" },
    { coords: [10.2825, 76.3211], route: "R-02", stop: "Anathadam Junction" },
    { coords: [10.2711, 76.3295], route: "R-02", stop: "Potta Bypass Corner" },
    { coords: [10.2185, 76.2981], route: "R-02", stop: "Mala Town Hall" },
    
    { coords: [10.1983, 76.3862], route: "R-03", stop: "Angamaly KSRTC Stand" },
    { coords: [10.2124, 76.3681], route: "R-03", stop: "Kidangoor Junction" },
    { coords: [10.2215, 76.3492], route: "R-03", stop: "Adoor Stop" },
    { coords: [10.2102, 76.3251], route: "R-03", stop: "Kuzhur Church Junction" },
    
    { coords: [10.3421, 76.2132], route: "R-04", stop: "Irinjalakuda Koodalmanikyam Temple" },
    { coords: [10.3214, 76.2291], route: "R-04", stop: "Mapranam Stop" },
    { coords: [10.3125, 76.2415], route: "R-04", stop: "Karuvannur Bridge" },
    { coords: [10.2685, 76.2891], route: "R-04", stop: "Aloor Junction Stop" },
    
    { coords: [10.1852, 76.3021], route: "R-05", stop: "Poyya Village Office" },
    { coords: [10.2014, 76.3154], route: "R-05", stop: "Kuruvilassery School Stop" },
    { coords: [10.2162, 76.2942], route: "R-05", stop: "Mala Private Bus Stand" }
  ];

  // Generate 150 detailed students distributed amongst these stops
  for (let i = 0; i < 150; i++) {
    studentId++;
    const center = centers[i % centers.length];
    const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const cls = classes[Math.floor(Math.random() * classes.length)];
    const sec = sections[Math.floor(Math.random() * sections.length)];
    
    // Add small random offset to center coords for home address simulation
    const latOffset = (Math.random() - 0.5) * 0.005;
    const lngOffset = (Math.random() - 0.5) * 0.005;
    const homeCoords = [center.coords[0] + latOffset, center.coords[1] + lngOffset];

    // Compute approximate ride duration based on distance to school
    // Mala is very close to School. Kodungallur is farthest. Let's make it realistic.
    const routeObj = MOCK_ROUTES.find(r => r.id === center.route);
    let rideTimeMinutes = 10;
    if (center.route === "R-01") rideTimeMinutes = 20 + Math.floor(Math.random() * 20); // 20-40 min
    else if (center.route === "R-02") rideTimeMinutes = 15 + Math.floor(Math.random() * 15); // 15-30 min
    else if (center.route === "R-03") rideTimeMinutes = 25 + Math.floor(Math.random() * 18); // 25-43 min
    else if (center.route === "R-04") rideTimeMinutes = 15 + Math.floor(Math.random() * 14); // 15-29 min
    else rideTimeMinutes = 5 + Math.floor(Math.random() * 15); // 5-20 min

    // Pick boarding status
    const randState = Math.random();
    let status = "Not Boarded";
    let boardTime = "--";
    if (randState > 0.6) {
      status = "Boarded";
      boardTime = "07:35 AM";
    } else if (randState > 0.3) {
      status = "Reached School";
      boardTime = "07:42 AM";
    }

    students.push({
      id: `ST-${studentId}`,
      name: `${fName} ${lName}`,
      class: cls,
      section: sec,
      parentName: `${lastNames[Math.floor(Math.random() * lastNames.length)]} ${firstNames[Math.floor(Math.random() * firstNames.length)]}`,
      parentPhone: `+91 9446${Math.floor(Math.random() * 9)} ${Math.floor(10000 + Math.random() * 90000)}`,
      address: `Ward ${Math.floor(1 + Math.random() * 15)}, Near ${center.stop.split(" ")[0]}, Mala, Thrissur`,
      coords: homeCoords,
      routeId: center.route,
      stopName: center.stop,
      rideTime: `${rideTimeMinutes} mins`,
      boardingStatus: status,
      boardTime: boardTime,
      feeStatus: Math.random() > 0.15 ? "Paid" : "Overdue",
      enrolledDate: `2025-06-${String(Math.floor(1 + Math.random() * 28)).padStart(2, '0')}`
    });
  }
  
  return students;
}

const MOCK_STUDENTS = generateMockStudents();
