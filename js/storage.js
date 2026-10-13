/**
 * RentEquip - Campus LocalStorage Persistence & Demo Seed Engine
 * Manages college equipment inventory (50+ items), student bookings,
 * club hosts, return inspections, and academic notifications.
 */

(function (window) {
  'use strict';

  const STORAGE_KEYS = {
    USERS: 'rentequip_campus_users_v3',
    CURRENT_USER: 'rentequip_campus_current_user_v3',
    EQUIPMENT: 'rentequip_campus_equipment_v3',
    BOOKINGS: 'rentequip_campus_bookings_v3',
    REVIEWS: 'rentequip_campus_reviews_v3',
    NOTIFICATIONS: 'rentequip_campus_notifications_v3',
    INIT_FLAG: 'rentequip_campus_seeded_v3'
  };

  const SEED_USERS = [
    {
      id: 'usr_aarav',
      name: 'Aarav Sharma',
      email: 'aarav.cs24@campus.edu',
      role: 'customer',
      avatar: 'AS',
      company: '2nd Year B.Tech CSE • Room 314, Kaveri Hostel',
      phone: '+91 98765 43210',
      joinedDate: '2025-08-01',
      rating: 4.95
    },
    {
      id: 'usr_priya',
      name: 'Priya Patel',
      email: 'priya.mech23@campus.edu',
      role: 'owner',
      avatar: 'PP',
      company: 'Final Year Mech • Robotics Club Lead • Saraswati Hostel',
      phone: '+91 98123 45678',
      joinedDate: '2024-07-15',
      rating: 4.92
    },
    {
      id: 'usr_council',
      name: 'Student Affairs Council & Lab Desk',
      email: 'sac.equipment@campus.edu',
      role: 'admin',
      avatar: 'SAC',
      company: 'Central Equipment Library & Student Council',
      phone: '+91 44 2257 8000',
      joinedDate: '2024-01-01',
      rating: 5.0
    }
  ];

  function getInitialCampusEquipment() {
    return [
      // 1. STATIONERY
      {
        id: 'eq_01',
        title: 'Pilot V7 Hi-Tecpoint Gel Pen (Pack of 2)',
        category: 'Stationery',
        dailyRate: 2,
        weeklyRate: 10,
        securityDeposit: 15,
        location: 'Central Library - Helpdesk',
        condition: 'Pristine / Like New',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.9,
        reviewCount: 32,
        status: 'available',
        image: 'assets/images/stationery.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'Smooth precision 0.7mm pure liquid ink pens. Perfect for written exam answer sheets, lab records, and neat assignment submissions. Blue and Black included.',
        specs: [
          { label: 'Tip Size', value: '0.7mm Fine Point' },
          { label: 'Ink Colors', value: '1x Blue, 1x Black' },
          { label: 'Ink Type', value: 'Pure Liquid Ink with Regulator' },
          { label: 'Ideal For', value: 'Semester Exams & Lab Records' }
        ],
        features: ['Smudge-Free Flow', 'Refillable Cartridge System', 'Campus Exam Approved']
      },
      {
        id: 'eq_02',
        title: 'Complete Mathematical Geometry Box Set',
        category: 'Stationery',
        dailyRate: 10,
        weeklyRate: 40,
        securityDeposit: 50,
        location: 'Kaveri Boys Hostel - Common Room',
        condition: 'Pristine / Like New',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.85,
        reviewCount: 19,
        status: 'available',
        image: 'assets/images/geometry-box.svg',
        featured: true,
        requiresOperatorLicense: false,
        description: 'Tin geometry set containing steel compass, divider, 180° protractor, 45° and 60° set squares, 15cm ruler, eraser, and mini lead pencil. Pre-sharpened and ready for tests.',
        specs: [
          { label: 'Brand', value: 'Camlin Exam Series' },
          { label: 'Case Material', value: 'Durable Metal Tin Case' },
          { label: 'Instruments', value: 'Compass, Divider, Protractor, Set Squares, Scale' },
          { label: 'Accuracy', value: 'High Precision mm Graded' }
        ],
        features: ['Self-Centering Compass', 'Transparent Acrylic Protractor', 'Exam Ready Kit']
      },
      {
        id: 'eq_03',
        title: 'Big Heavy-Duty Engineering Drawing Compass',
        category: 'Stationery',
        dailyRate: 15,
        weeklyRate: 60,
        securityDeposit: 80,
        location: 'Mechanical Engineering Workshop (Block B)',
        condition: 'Pristine / Like New',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.92,
        reviewCount: 22,
        status: 'available',
        image: 'assets/images/geometry-box.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'Large brass/chrome drawing compass with extension beam for drawing large circles up to 400mm diameter on A1/A2 engineering graphics sheets.',
        specs: [
          { label: 'Max Radius', value: '200 mm (400 mm Diameter)' },
          { label: 'Extension Arm', value: 'Telescopic Beam Included' },
          { label: 'Pencil Adapter', value: 'Universal 0.5mm Clutch Holder' }
        ],
        features: ['Zero Wobble Locking Nut', 'Fine Adjustment Wheel', 'Hardened Needle Point']
      },
      {
        id: 'eq_04',
        title: 'Staedtler Mars Drafting Scale (30cm Tri-Scale)',
        category: 'Stationery',
        dailyRate: 8,
        weeklyRate: 30,
        securityDeposit: 60,
        location: 'Fine Arts & Architecture Studio (Block E)',
        condition: 'Gently Used',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.88,
        reviewCount: 14,
        status: 'available',
        image: 'assets/images/stationery.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'Architectural and engineering triangular reduction scale with 6 metric ratios (1:100, 1:200, 1:250, 1:300, 1:400, 1:500). Clean laser-etched markings.',
        specs: [
          { label: 'Length', value: '30 cm' },
          { label: 'Shape', value: 'Triangular 6-Ratio Rule' },
          { label: 'Material', value: 'Matte White Anodized Plastic' }
        ],
        features: ['Color-Coded Grooves', 'Shatter-Resistant Body', 'Laser-Etched Scales']
      },
      {
        id: 'eq_05',
        title: 'Chisel-Tip Whiteboard Markers (Set of 4 Colors)',
        category: 'Stationery',
        dailyRate: 10,
        weeklyRate: 35,
        securityDeposit: 40,
        location: 'Student Activity Center (SAC) - Room 102',
        condition: 'Pristine / Like New',
        ownerId: 'usr_council',
        ownerName: 'SAC Equipment Desk',
        ownerRating: 5.0,
        rating: 4.75,
        reviewCount: 11,
        status: 'available',
        image: 'assets/images/stationery.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'Low-odor dry erase markers in Black, Blue, Red, and Green. Includes magnetic eraser. Perfect for group study sessions in hostel common rooms or seminar presentations.',
        specs: [
          { label: 'Colors', value: 'Black, Blue, Red, Green' },
          { label: 'Tip', value: 'Versatile Chisel Tip (1mm - 5mm)' },
          { label: 'Erasability', value: 'Residue-Free Dry Wipe' }
        ],
        features: ['Non-Toxic Low Odor', 'Magnetic Foam Duster Included', 'Cap-Off Tech 24hr']
      },

      // 2. ENGINEERING DRAWING
      {
        id: 'eq_06',
        title: 'Imperial Pine-Wood Engineering Drawing Board (D1)',
        category: 'Engineering Drawing',
        dailyRate: 30,
        weeklyRate: 120,
        securityDeposit: 200,
        location: 'SAC Equipment Desk',
        condition: 'Good Working Condition',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.91,
        reviewCount: 45,
        status: 'available',
        image: 'assets/images/drawing-board.svg',
        featured: true,
        requiresOperatorLicense: false,
        description: 'Standard 650mm x 500mm seasoned pine wood drawing board with hard ebony edge for T-square guidance. Includes 4 stainless steel sheet clips and carrying handle.',
        specs: [
          { label: 'Board Dimensions', value: '650 x 500 x 18 mm (D1 Size)' },
          { label: 'Wood Type', value: 'Kiln-Seasoned Pine with Batten Support' },
          { label: 'Edge Guide', value: 'Ebony Straight Edge Strips' },
          { label: 'Included Accessories', value: '4x Steel Clips + Board Cover' }
        ],
        features: ['Warp-Resistant Battens', 'Smooth Sanded Drawing Surface', 'Lightweight for Transit']
      },
      {
        id: 'eq_07',
        title: 'Omega Engineering Mini-Drafter with Cover Bag',
        category: 'Engineering Drawing',
        dailyRate: 25,
        weeklyRate: 100,
        securityDeposit: 150,
        location: 'Tech Hub & Makerspace',
        condition: 'Pristine / Like New',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.94,
        reviewCount: 38,
        status: 'available',
        image: 'assets/images/drafter.svg',
        featured: true,
        requiresOperatorLicense: false,
        description: 'Essential apparatus for first-year engineering graphics and machine drawing. Features 360° protractor head with angle clamp lock and unbreakable transparent metric scale arms.',
        specs: [
          { label: 'Scale Lengths', value: '150mm Horizontal & Vertical' },
          { label: 'Protractor Rotation', value: 'Full 360° with Locking Knob' },
          { label: 'Clamp', value: 'Heavy Die-Cast Clamp for 25mm Board' },
          { label: 'Arms', value: 'Twin Parallel Chromium-Plated Linkages' }
        ],
        features: ['Zero Backlash Linkage', 'Canvas Shoulder Strap Bag', 'Crystal Clear Beveled Scales']
      },
      {
        id: 'eq_08',
        title: 'Professional French Curves Set (Pack of 3)',
        category: 'Engineering Drawing',
        dailyRate: 8,
        weeklyRate: 30,
        securityDeposit: 40,
        location: 'Mechanical Engineering Workshop (Block B)',
        condition: 'Pristine / Like New',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.82,
        reviewCount: 16,
        status: 'available',
        image: 'assets/images/drafter.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'Smoke-tinted acrylic French curve templates for drawing smooth non-circular contours, ellipses, and parabolic curves on engineering and design sheets.',
        specs: [
          { label: 'Quantity', value: '3 Differently Contoured Templates' },
          { label: 'Material', value: 'Transparent 2.5mm Scratch-Resistant Acrylic' },
          { label: 'Edge', value: 'Double Inking Edges to Prevent Blotting' }
        ],
        features: ['Smooth Burr-Free Edges', 'Inking Rims', 'Clear Optical Transparency']
      },
      {
        id: 'eq_09',
        title: 'Rotring Isograph Technical Pen 0.2mm & 0.5mm',
        category: 'Engineering Drawing',
        dailyRate: 20,
        weeklyRate: 75,
        securityDeposit: 150,
        location: 'Fine Arts & Architecture Studio (Block E)',
        condition: 'Pristine / Like New',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.89,
        reviewCount: 12,
        status: 'available',
        image: 'assets/images/stationery.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'High-precision refillable technical drawing pens for tracing sheets and architectural drafting. Pre-filled with waterproof black drawing ink.',
        specs: [
          { label: 'Nibs Included', value: '0.20 mm & 0.50 mm Chrome Plated Tips' },
          { label: 'Ink Type', value: 'High Density Carbon Black Indian Ink' },
          { label: 'Barrel', value: 'Color-Coded ISO Standard' }
        ],
        features: ['Push-On Sleeve for Easy Cleaning', 'Constant Flow Regulator', 'Architect Grade']
      },

      // 3. LAB ESSENTIALS
      {
        id: 'eq_10',
        title: 'Pure Cotton Student Lab Coat (Full Sleeve, Size M/L)',
        category: 'Lab Essentials',
        dailyRate: 20,
        weeklyRate: 80,
        securityDeposit: 100,
        location: 'Science Labs Corridor (Block C)',
        condition: 'Pristine / Like New',
        ownerId: 'usr_council',
        ownerName: 'SAC Equipment Desk',
        ownerRating: 5.0,
        rating: 4.96,
        reviewCount: 64,
        status: 'available',
        image: 'assets/images/lab-coat.svg',
        featured: true,
        requiresOperatorLicense: false,
        description: 'Freshly laundered 100% white cotton lab coat with 3 front pockets, back slit, and press stud buttons. Mandatory for chemistry, biotech, and physics laboratories.',
        specs: [
          { label: 'Material', value: '100% Preshrunk Thick Cotton' },
          { label: 'Available Sizes', value: 'M (38-40) & L (42-44)' },
          { label: 'Pockets', value: '1 Chest Pocket + 2 Lower Deep Pockets' },
          { label: 'Compliance', value: 'Standard University Lab Norms' }
        ],
        features: ['Fire-Safe Pure Cotton', 'Side Slits for Trouser Pocket Access', 'Stain-Resistant Wash']
      },
      {
        id: 'eq_11',
        title: 'Anti-Fog Clear Chemical Splash Safety Goggles',
        category: 'Lab Essentials',
        dailyRate: 5,
        weeklyRate: 20,
        securityDeposit: 30,
        location: 'Science Labs Corridor (Block C)',
        condition: 'Pristine / Like New',
        ownerId: 'usr_council',
        ownerName: 'SAC Equipment Desk',
        ownerRating: 5.0,
        rating: 4.9,
        reviewCount: 51,
        status: 'available',
        image: 'assets/images/lab-coat.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'Wide-vision laboratory safety goggles with indirect ventilation vents to prevent chemical vapor and splash hazards while eliminating lens fogging.',
        specs: [
          { label: 'Lens Material', value: 'Polycarbonate Optical Grade Lens' },
          { label: 'Coating', value: 'Anti-Fog & Scratch Resistant' },
          { label: 'Strap', value: 'Adjustable Chemical Resistant Elastic' }
        ],
        features: ['Fits Comfortably Over Eyeglasses', 'UV 400 Protection', 'Soft PVC Face Seal']
      },
      {
        id: 'eq_12',
        title: 'Mastech Auto-Ranging Digital Multimeter (DMM)',
        category: 'Lab Essentials',
        dailyRate: 25,
        weeklyRate: 100,
        securityDeposit: 150,
        location: 'Electronics & VLSI Lab (Block C)',
        condition: 'Good Working Condition',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.88,
        reviewCount: 33,
        status: 'rented', // bk_106 overdue scenario
        image: 'assets/images/multimeter.svg',
        featured: true,
        requiresOperatorLicense: false,
        description: 'True-RMS 6000-count digital multimeter for measuring AC/DC voltage, current, resistance, capacitance, diode check, and audio continuity buzzer.',
        specs: [
          { label: 'Display', value: 'Backlit LCD with Bar Graph' },
          { label: 'Voltage Range', value: 'Up to 600V AC/DC' },
          { label: 'Features', value: 'Continuity Buzzer, Diode Test, Data Hold' },
          { label: 'Protection', value: 'Rubber Shock Holster with Fold-out Kickstand' }
        ],
        features: ['Gold-Plated Shrouded Needle Probes', 'Auto Power Off Battery Saver', 'CAT III 600V Rated']
      },
      {
        id: 'eq_13',
        title: 'Arduino Uno R3 Starter Prototyping Kit',
        category: 'Lab Essentials',
        dailyRate: 40,
        weeklyRate: 160,
        securityDeposit: 250,
        location: 'Tech Hub & Makerspace',
        condition: 'Pristine / Like New',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.95,
        reviewCount: 41,
        status: 'available',
        image: 'assets/images/arduino.svg',
        featured: true,
        requiresOperatorLicense: false,
        description: 'Complete kit with genuine Arduino Uno board, blue USB cable, 830-point solderless breadboard, 65 jumper wires, assortment of LEDs, resistors, ultrasonic sensor, and servo motor.',
        specs: [
          { label: 'Microcontroller', value: 'ATmega328P @ 16 MHz' },
          { label: 'Operating Voltage', value: '5V (USB or DC Jack)' },
          { label: 'I/O Pins', value: '14 Digital I/O (6 PWM) + 6 Analog' },
          { label: 'Included Components', value: 'Breadboard, Wires, HC-SR04, SG90 Servo, LEDs' }
        ],
        features: ['Plug-and-Play USB Cable', 'Beginner Friendly Pinout Cheat Sheet', 'Component Storage Box']
      },
      {
        id: 'eq_14',
        title: 'ESP32 Wi-Fi & Bluetooth Dual-Core Dev Board',
        category: 'Lab Essentials',
        dailyRate: 30,
        weeklyRate: 120,
        securityDeposit: 180,
        location: 'Electronics & VLSI Lab (Block C)',
        condition: 'Pristine / Like New',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.92,
        reviewCount: 29,
        status: 'available',
        image: 'assets/images/arduino.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: '38-pin ESP-WROOM-32 development board with built-in 2.4 GHz Wi-Fi and Bluetooth BLE. Ideal for IoT college semester mini-projects and home automation setups.',
        specs: [
          { label: 'Processor', value: 'Dual-Core Xtensa 32-bit LX6 @ 240 MHz' },
          { label: 'Wireless', value: '802.11 b/g/n Wi-Fi + BLE 4.2' },
          { label: 'Memory', value: '520 KB SRAM + 4 MB Flash' },
          { label: 'Connector', value: 'Micro-USB with CP2102 Driver' }
        ],
        features: ['Pre-flashed Blink Firmware', 'Breadboard-Friendly Spacing', 'Ultra Low Power Sleep Mode']
      },
      {
        id: 'eq_15',
        title: 'Soldering Iron Kit (60W Temp-Controlled + Stand)',
        category: 'Lab Essentials',
        dailyRate: 25,
        weeklyRate: 90,
        securityDeposit: 120,
        location: 'Tech Hub & Makerspace',
        condition: 'Pristine / Like New',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.87,
        reviewCount: 26,
        status: 'available',
        image: 'assets/images/soldering-kit.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'Adjustable temperature 200°C–450°C soldering iron. Includes heavy spring stand with sponge, tube of lead-free rosin core solder, desoldering wick, and tweezers.',
        specs: [
          { label: 'Power', value: '60W Ceramic Heating Element' },
          { label: 'Temperature Range', value: '200°C to 450°C Dial Control' },
          { label: 'Included Extras', value: 'Stand, Sponge, 60/40 Solder, Desolder Pump' }
        ],
        features: ['Rapid 15-Second Heat-up', 'Heat-Resistant Silicone Grip', 'Extra Replacement Chisel Tips']
      },

      // 4. ACADEMIC RESOURCES
      {
        id: 'eq_16',
        title: 'Casio fx-991EX ClassWiz Scientific Calculator',
        category: 'Academic Resources',
        dailyRate: 20,
        weeklyRate: 80,
        securityDeposit: 250,
        location: 'Central Library - Helpdesk',
        condition: 'Pristine / Like New',
        ownerId: 'usr_council',
        ownerName: 'SAC Equipment Desk',
        ownerRating: 5.0,
        rating: 4.98,
        reviewCount: 88,
        status: 'rented', // bk_101 active scenario
        image: 'assets/images/calculator.svg',
        featured: true,
        requiresOperatorLicense: false,
        description: 'The standard calculator for engineering examinations. Features 552 functions, natural textbook high-resolution LCD display, matrix/vector math, equation solvers, and numerical integration.',
        specs: [
          { label: 'Display', value: 'High-Resolution 192x63 Dot Matrix' },
          { label: 'Functions', value: '552 Functions (Matrices, Vectors, Integrals, Solver)' },
          { label: 'Power', value: 'Dual Power (Solar Cell + Backup Battery)' },
          { label: 'Approved For', value: 'GATE, College Mid-Terms & Finals' }
        ],
        features: ['Natural Display Fractions & Radicals', 'QR Code Graph Viewer', 'Slide-on Hard Protective Cover']
      },
      {
        id: 'eq_17',
        title: 'Texas Instruments TI-84 Plus Graphing Calculator',
        category: 'Academic Resources',
        dailyRate: 45,
        weeklyRate: 180,
        securityDeposit: 600,
        location: 'Central Library - Helpdesk',
        condition: 'Gently Used',
        ownerId: 'usr_council',
        ownerName: 'SAC Equipment Desk',
        ownerRating: 5.0,
        rating: 4.93,
        reviewCount: 20,
        status: 'available',
        image: 'assets/images/calculator.svg',
        featured: true,
        requiresOperatorLicense: false,
        description: 'Graphic plotting calculator with USB connectivity. Preloaded with interactive graphing, statistics regression modeling, and financial calculations.',
        specs: [
          { label: 'Display', value: '8-Line x 16-Character High Contrast LCD' },
          { label: 'Memory', value: '480 KB Flash ROM + 24 KB RAM' },
          { label: 'Connectivity', value: 'Mini-USB Port with Computer Link Cable' }
        ],
        features: ['Plot up to 10 Functions Simultaneously', 'Split Screen Table & Graph', 'Preloaded Engineering Apps']
      },
      {
        id: 'eq_18',
        title: 'Higher Engineering Mathematics — B.S. Grewal (44th Ed)',
        category: 'Academic Resources',
        dailyRate: 10,
        weeklyRate: 40,
        securityDeposit: 150,
        location: 'Kaveri Boys Hostel - Common Room',
        condition: 'Good Working Condition',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.88,
        reviewCount: 52,
        status: 'available',
        image: 'assets/images/textbook.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'The standard reference textbook covering differential calculus, linear algebra, Laplace transforms, Fourier series, numerical methods, and partial differential equations with solved examples.',
        specs: [
          { label: 'Author', value: 'Dr. B.S. Grewal' },
          { label: 'Edition', value: '44th Revised & Enlarged Edition' },
          { label: 'Pages', value: '1,350 Pages Hardbound' }
        ],
        features: ['Highlighted Key Formulas', 'Unmarked Clean Practice Exercises', 'Includes GATE Formula Summary']
      },
      {
        id: 'eq_19',
        title: 'Introduction to Algorithms (CLRS 3rd Edition)',
        category: 'Academic Resources',
        dailyRate: 15,
        weeklyRate: 50,
        securityDeposit: 200,
        location: 'Central Library - Helpdesk',
        condition: 'Pristine / Like New',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.95,
        reviewCount: 34,
        status: 'available',
        image: 'assets/images/textbook.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'Comprehensive algorithmic bible covering asymptotic notation, dynamic programming, greedy algorithms, graph theory, B-trees, and NP-completeness. Essential for coding rounds.',
        specs: [
          { label: 'Authors', value: 'Cormen, Leiserson, Rivest, Stein' },
          { label: 'Subject', value: 'Data Structures & Algorithm Design' },
          { label: 'Publisher', value: 'MIT Press / PHI' }
        ],
        features: ['Hardcover Edition', 'Clean Pseudocode Explanations', 'Ideal for FAANG Placement Prep']
      },
      {
        id: 'eq_20',
        title: 'GATE 2026 CSE Chapterwise Solved Papers (Made Easy)',
        category: 'Academic Resources',
        dailyRate: 12,
        weeklyRate: 45,
        securityDeposit: 150,
        location: 'Saraswati Girls Hostel - Wing A',
        condition: 'Gently Used',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.9,
        reviewCount: 28,
        status: 'available',
        image: 'assets/images/textbook.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'Past 32 years authentic GATE Computer Science question papers with complete step-by-step explanatory solutions and shortcut techniques.',
        specs: [
          { label: 'Publisher', value: 'Made Easy Publications' },
          { label: 'Coverage', value: '1992 - 2025 Solved Papers' },
          { label: 'Features', value: 'Topic-wise Marks Weightage Analysis' }
        ],
        features: ['Detailed Step-by-Step Derivations', 'Error-Free Solutions', 'Compact Revision Tables']
      },

      // 5. ELECTRONICS & COMPUTING
      {
        id: 'eq_21',
        title: 'Dell Latitude Student Laptop (i5, 16GB RAM, 512GB SSD)',
        category: 'Electronics & Computing',
        dailyRate: 250,
        weeklyRate: 1100,
        securityDeposit: 1500,
        location: 'Computer Center - Ground Floor',
        condition: 'Pristine / Like New',
        ownerId: 'usr_council',
        ownerName: 'SAC Equipment Desk',
        ownerRating: 5.0,
        rating: 4.96,
        reviewCount: 37,
        status: 'available',
        image: 'assets/images/laptop.svg',
        featured: true,
        requiresOperatorLicense: false,
        description: 'Reliable high-speed student laptop pre-installed with Ubuntu Linux and Windows dual-boot, VS Code, Python 3, Node.js, MATLAB, and Docker. Perfect when your own system crashes before project deadlines.',
        specs: [
          { label: 'Processor', value: 'Intel Core i5 11th Gen (4 Cores, 4.2 GHz)' },
          { label: 'Memory', value: '16 GB DDR4 Dual-Channel' },
          { label: 'Storage', value: '512 GB NVMe M.2 Fast SSD' },
          { label: 'Display & Battery', value: '14" FHD IPS Matte, 6-Hour Battery Life' }
        ],
        features: ['Original 65W Fast Charger', 'Pre-configured Programming Environments', 'HDMI & USB-C Ports']
      },
      {
        id: 'eq_22',
        title: 'Logitech C920 Pro Full HD 1080p Webcam',
        category: 'Electronics & Computing',
        dailyRate: 35,
        weeklyRate: 140,
        securityDeposit: 250,
        location: 'Computer Center - Ground Floor',
        condition: 'Pristine / Like New',
        ownerId: 'usr_council',
        ownerName: 'SAC Equipment Desk',
        ownerRating: 5.0,
        rating: 4.92,
        reviewCount: 27,
        status: 'available',
        image: 'assets/images/webcam.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'Crisp 1080p 30fps webcam with stereo dual microphones and automatic light correction. Ideal for proctored online examinations, internship interviews, and hackathons.',
        specs: [
          { label: 'Resolution', value: 'Full HD 1080p / 30 fps' },
          { label: 'Focus & Lens', value: 'Auto-Focus Glass Lens (78° Field of View)' },
          { label: 'Audio', value: 'Dual Stereo Microphones with Noise Filter' }
        ],
        features: ['Universal Tripod-Ready Monitor Clip', 'Privacy Shutter Lens Cap', 'Plug and Play USB-A']
      },
      {
        id: 'eq_23',
        title: 'USB-C 7-in-1 Multi-Port Hub (HDMI 4K, SD, 100W PD)',
        category: 'Electronics & Computing',
        dailyRate: 15,
        weeklyRate: 50,
        securityDeposit: 100,
        location: 'Tech Hub & Makerspace',
        condition: 'Pristine / Like New',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.88,
        reviewCount: 23,
        status: 'available',
        image: 'assets/images/laptop.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'Aluminum USB-C dongle adapter. Expands MacBook or Windows laptop with 4K HDMI, 3x USB 3.0 ports, SD/TF card slots, and 100W Power Delivery pass-through charging.',
        specs: [
          { label: 'Ports', value: 'HDMI 4K@30Hz, 3x USB 3.0, SD, MicroSD, 100W PD' },
          { label: 'Transfer Speed', value: 'Up to 5 Gbps Data Speed' },
          { label: 'Body', value: 'Heat-Dissipating Space Grey Aluminum' }
        ],
        features: ['Pocket-Sized Form Factor', 'Plug & Play (No Drivers Required)', 'Braided Connector Cable']
      },
      {
        id: 'eq_24',
        title: 'Seagate 1TB Portable External Hard Drive (USB 3.0)',
        category: 'Electronics & Computing',
        dailyRate: 20,
        weeklyRate: 70,
        securityDeposit: 200,
        location: 'Computer Center - Ground Floor',
        condition: 'Pristine / Like New',
        ownerId: 'usr_council',
        ownerName: 'SAC Equipment Desk',
        ownerRating: 5.0,
        rating: 4.89,
        reviewCount: 18,
        status: 'available',
        image: 'assets/images/laptop.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'High-speed 1TB backup drive formatted for both Windows and Mac. Perfect for transferring large machine learning datasets, CAD project files, and video renders.',
        specs: [
          { label: 'Capacity', value: '1 TB (1000 GB)' },
          { label: 'Interface', value: 'SuperSpeed USB 3.0 (Backward USB 2.0)' },
          { label: 'Transfer Rate', value: 'Up to 120 MB/s' }
        ],
        features: ['Protective Padded Storage Case', 'USB 3.0 Cable Included', 'Password Encryption Ready']
      },
      {
        id: 'eq_25',
        title: 'Redragon Mechanical Gaming/Typing Keyboard',
        category: 'Electronics & Computing',
        dailyRate: 30,
        weeklyRate: 110,
        securityDeposit: 200,
        location: 'Kaveri Boys Hostel - Common Room',
        condition: 'Gently Used',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.83,
        reviewCount: 15,
        status: 'available',
        image: 'assets/images/laptop.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'Tenkeyless compact mechanical keyboard with tactile blue switches, double-shot keycaps, and RGB backlighting. Great for coding marathons in hostel rooms.',
        specs: [
          { label: 'Switches', value: 'Outemu Dustproof Blue (Clicky & Tactile)' },
          { label: 'Layout', value: '87-Key Compact Tenkeyless (TKL)' },
          { label: 'Keycaps', value: 'Double-Shot Injection Molded' }
        ],
        features: ['Detachable Braided USB Cable', 'Anti-Ghosting All 87 Keys', 'Customizable RGB Presets']
      },

      // 6. ART & DESIGN
      {
        id: 'eq_26',
        title: 'Complete Fine Arts Painting Kit & Tabletop Easel',
        category: 'Art & Design',
        dailyRate: 35,
        weeklyRate: 130,
        securityDeposit: 200,
        location: 'Fine Arts & Architecture Studio (Block E)',
        condition: 'Pristine / Like New',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.96,
        reviewCount: 30,
        status: 'available',
        image: 'assets/images/art-kit.svg',
        featured: true,
        requiresOperatorLicense: false,
        description: 'Wooden Beechwood folding desk easel with 12x 22ml rich acrylic paint tubes, wooden mixing palette, 6 artist brushes (flat, round, fan), and brush cleaning cup.',
        specs: [
          { label: 'Easel Material', value: 'Beechwood Folding Box Easel' },
          { label: 'Colors', value: '12x High Pigment Acrylic Colors' },
          { label: 'Brushes', value: 'Set of 6 Professional Synthetic Filberts & Rounds' }
        ],
        features: ['Integrated Storage Drawer', 'Adjustable Incline Angles', 'Non-Toxic Artist Grade Pigments']
      },
      {
        id: 'eq_27',
        title: 'A3 Spiral-Bound Heavyweight Drawing Sketchbook (160 GSM)',
        category: 'Art & Design',
        dailyRate: 15,
        weeklyRate: 50,
        securityDeposit: 80,
        location: 'Fine Arts & Architecture Studio (Block E)',
        condition: 'Pristine / Like New',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.88,
        reviewCount: 17,
        status: 'available',
        image: 'assets/images/sketchbook.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'Acid-free 160 GSM cartridge paper sketchbook with sturdy hardboard backing. Ideal for graphite shading, charcoal sketching, architectural ideation, and pastels.',
        specs: [
          { label: 'Page Size', value: 'A3 (297 x 420 mm)' },
          { label: 'Paper Weight', value: '160 GSM Heavyweight Cartridge' },
          { label: 'Binding', value: 'Twin-Wire Top Spiral Loop' }
        ],
        features: ['Micro-Perforated Sheets', 'Eraser-Friendly Texture', 'Rigid Board Backing']
      },
      {
        id: 'eq_28',
        title: 'Self-Healing Craft Cutting Mat (A2 Size) + Precision Knife',
        category: 'Art & Design',
        dailyRate: 15,
        weeklyRate: 60,
        securityDeposit: 90,
        location: 'Fine Arts & Architecture Studio (Block E)',
        condition: 'Good Working Condition',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.86,
        reviewCount: 22,
        status: 'available',
        image: 'assets/images/sketchbook.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'Green 5-ply self-healing cutting board with printed metric grid lines, angles, and circles. Includes precision hobby craft scalpel knife with 5 spare blades.',
        specs: [
          { label: 'Dimensions', value: 'A2 (600 x 450 x 3 mm)' },
          { label: 'Layers', value: '5-Ply PVC Self-Sealing Compound' },
          { label: 'Markings', value: '1cm Grid, Isometric & Angle Lines' }
        ],
        features: ['Protects Hostel Desks', 'Non-Slip Reversible Surface', 'Safety Blade Cap Included']
      },
      {
        id: 'eq_29',
        title: 'TouchFive Dual-Tip Alcohol Sketch Markers (48 Colors)',
        category: 'Art & Design',
        dailyRate: 30,
        weeklyRate: 110,
        securityDeposit: 180,
        location: 'Saraswati Girls Hostel - Wing A',
        condition: 'Pristine / Like New',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.94,
        reviewCount: 25,
        status: 'available',
        image: 'assets/images/sketchbook.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'Alcohol-based art markers with broad chisel tip on one side and fine bullet point on the other. Ideal for product design rendering, fashion sketches, and poster design.',
        specs: [
          { label: 'Count', value: '48 Vibrant Color Shades' },
          { label: 'Tips', value: 'Dual: 6mm Broad Chisel + 1mm Fine Point' },
          { label: 'Ink', value: 'Fast-Drying Alcohol Blendable' }
        ],
        features: ['Zippered Fabric Carry Case', 'Color-Coded Caps', 'Seamless Gradient Blending']
      },

      // 7. PROJECTS & PRESENTATIONS
      {
        id: 'eq_30',
        title: 'BenQ Full HD 1080p Portable Classroom Projector',
        category: 'Projects & Presentations',
        dailyRate: 150,
        weeklyRate: 650,
        securityDeposit: 1200,
        location: 'Student Activity Center (SAC) - Room 102',
        condition: 'Pristine / Like New',
        ownerId: 'usr_council',
        ownerName: 'SAC Equipment Desk',
        ownerRating: 5.0,
        rating: 4.97,
        reviewCount: 46,
        status: 'available',
        image: 'assets/images/projector.svg',
        featured: true,
        requiresOperatorLicense: false,
        description: '3,800 Lumens bright DLP projector capable of projecting crystal clear slides in daylight rooms. Includes 5m HDMI cable, power cord, remote, and padded carry bag.',
        specs: [
          { label: 'Native Resolution', value: 'Full HD 1080p (1920 x 1080)' },
          { label: 'Brightness', value: '3,800 ANSI Lumens High Brightness' },
          { label: 'Connectivity', value: 'Dual HDMI, VGA, Audio In/Out, USB' },
          { label: 'Projection Size', value: '60" to 150" Diagonal' }
        ],
        features: ['Vertical Keystone Auto-Correction', 'Built-in 10W Speaker', 'Instant Plug-and-Play']
      },
      {
        id: 'eq_31',
        title: 'Wireless Presentation Clicker with Red Laser Pointer',
        category: 'Projects & Presentations',
        dailyRate: 15,
        weeklyRate: 50,
        securityDeposit: 100,
        location: 'Student Activity Center (SAC) - Room 102',
        condition: 'Pristine / Like New',
        ownerId: 'usr_council',
        ownerName: 'SAC Equipment Desk',
        ownerRating: 5.0,
        rating: 4.9,
        reviewCount: 39,
        status: 'available',
        image: 'assets/images/projector.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'Ergonomic 2.4 GHz RF wireless PowerPoint remote. Controls slide forward/back, full screen, blank screen, with bright laser pointer up to 100 feet range.',
        specs: [
          { label: 'Wireless Range', value: 'Up to 30 Meters (100 ft)' },
          { label: 'Receiver', value: 'Magnetic Stored USB Nano Receiver' },
          { label: 'Compatibility', value: 'PowerPoint, Google Slides, Keynote, PDF' }
        ],
        features: ['Tactile Intuitive Slide Buttons', 'No Software Setup Needed', 'Battery Included']
      },
      {
        id: 'eq_32',
        title: 'Digitek 65-inch Heavy Duty Camera / Phone Tripod',
        category: 'Projects & Presentations',
        dailyRate: 25,
        weeklyRate: 90,
        securityDeposit: 150,
        location: 'Student Activity Center (SAC) - Room 102',
        condition: 'Pristine / Like New',
        ownerId: 'usr_council',
        ownerName: 'SAC Equipment Desk',
        ownerRating: 5.0,
        rating: 4.88,
        reviewCount: 24,
        status: 'available',
        image: 'assets/images/projector.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'Aluminum telescopic tripod with 3-way fluid pan head, quick-release plate, bubble level, and universal smartphone clamp. Holds DSLRs and smartphones steadily.',
        specs: [
          { label: 'Max Height', value: '165 cm (65 inches) Extended' },
          { label: 'Folded Length', value: '55 cm Compact' },
          { label: 'Load Capacity', value: 'Up to 3.5 kg' }
        ],
        features: ['360° Panoramic Pan Head', 'Weighted Center Column Hook', 'Nylon Carrying Pouch']
      },
      {
        id: 'eq_33',
        title: 'Heavy Duty 5-Meter Spike Guard Extension Board (4 Sockets)',
        category: 'Projects & Presentations',
        dailyRate: 15,
        weeklyRate: 50,
        securityDeposit: 80,
        location: 'Kaveri Boys Hostel - Common Room',
        condition: 'Pristine / Like New',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.91,
        reviewCount: 42,
        status: 'available',
        image: 'assets/images/extension-cord.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: '4 universal sockets with individual switches and safety shutters, 5-meter heavy copper cord, and built-in surge protection circuit. Indispensable for hackathon tables.',
        specs: [
          { label: 'Cable Length', value: '5 Meters Heavy Gauge Wire' },
          { label: 'Sockets', value: '4x Universal 3-Pin with LED Indicators' },
          { label: 'Rating', value: '6A, 240V AC Surge Protected' }
        ],
        features: ['Thermal Overload Reset Breaker', 'Fire-Retardant ABS Enclosure', 'Child Safety Shutters']
      },

      // 8. SPORTS & RECREATION
      {
        id: 'eq_34',
        title: 'Yonex Muscle Power Badminton Rackets (Pair + 3 Shuttles)',
        category: 'Sports & Recreation',
        dailyRate: 20,
        weeklyRate: 80,
        securityDeposit: 150,
        location: 'Student Activity Center (SAC) - Room 102',
        condition: 'Good Working Condition',
        ownerId: 'usr_council',
        ownerName: 'SAC Equipment Desk',
        ownerRating: 5.0,
        rating: 4.93,
        reviewCount: 71,
        status: 'available',
        image: 'assets/images/badminton.svg',
        featured: true,
        requiresOperatorLicense: false,
        description: 'Two genuine Yonex isometric aluminum-carbon rackets with fresh polyurethane grip tape, pre-strung at 22 lbs tension. Includes nylon shuttlecocks and full zip cover.',
        specs: [
          { label: 'Set Contents', value: '2 Rackets + 3 Feather/Nylon Shuttles + Full Cover' },
          { label: 'Frame', value: 'Isometric Aluminum with Carbon Shaft' },
          { label: 'Grip Size', value: 'G4 Standard Cushion Grip' }
        ],
        features: ['Even Balance Versatile Play', 'Durable High Tension Strings', 'Zippered Shoulder Cover']
      },
      {
        id: 'eq_35',
        title: 'Nivia Storm Match Football (Size 5) with Hand Pump',
        category: 'Sports & Recreation',
        dailyRate: 15,
        weeklyRate: 60,
        securityDeposit: 100,
        location: 'Student Activity Center (SAC) - Room 102',
        condition: 'Pristine / Like New',
        ownerId: 'usr_council',
        ownerName: 'SAC Equipment Desk',
        ownerRating: 5.0,
        rating: 4.86,
        reviewCount: 35,
        status: 'available',
        image: 'assets/images/football.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'Standard 32-panel rubberized molded match football for all-weather campus ground play. Comes with needle and portable dual-action air pump.',
        specs: [
          { label: 'Size', value: 'Official Size 5 Football' },
          { label: 'Construction', value: 'Rubberized Molded 32-Panel' },
          { label: 'Bladder', value: 'High Air-Retention Butyl Bladder' }
        ],
        features: ['High Scuff Resistance for Hard Grounds', 'Hand Pump & Pin Included', 'Water Resistant']
      },
      {
        id: 'eq_36',
        title: 'Complete Cricket Kit (SG Kashmir Willow Bat + Leather Ball)',
        category: 'Sports & Recreation',
        dailyRate: 40,
        weeklyRate: 160,
        securityDeposit: 300,
        location: 'Kaveri Boys Hostel - Common Room',
        condition: 'Good Working Condition',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.89,
        reviewCount: 40,
        status: 'available',
        image: 'assets/images/cricket-kit.svg',
        featured: true,
        requiresOperatorLicense: false,
        description: 'Short-handle full-size Kashmir willow cricket bat with thick edges, 2 four-piece leather match balls, wooden stumps, and bails in a canvas kit bag.',
        specs: [
          { label: 'Bat Grade', value: 'Full Size Men Short Handle Kashmir Willow' },
          { label: 'Weight', value: '1180 - 1220 grams Balanced Pickup' },
          { label: 'Set Contents', value: 'Bat, 2x Match Balls, 3 Wooden Stumps, 2 Bails' }
        ],
        features: ['Knocked-in Bat Face with Scuff Sheet', 'Chevron Grip Handle', 'Canvas Gear Bag']
      },
      {
        id: 'eq_37',
        title: 'Tournament Wooden Chess Board & Weighted Staunton Pieces',
        category: 'Sports & Recreation',
        dailyRate: 10,
        weeklyRate: 35,
        securityDeposit: 75,
        location: 'Central Library - Helpdesk',
        condition: 'Pristine / Like New',
        ownerId: 'usr_council',
        ownerName: 'SAC Equipment Desk',
        ownerRating: 5.0,
        rating: 4.97,
        reviewCount: 29,
        status: 'available',
        image: 'assets/images/chess.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: '16-inch folding Sheesham wood chess board with carved weighted Staunton pieces, green felt bases, and internal velvet foam organizers. Great for hostel matches.',
        specs: [
          { label: 'Board Size', value: '16 x 16 Inch Inlaid Wood Board' },
          { label: 'King Height', value: '3.0 Inches Weighted' },
          { label: 'Base', value: 'Anti-Scratch Green Felt Underside' }
        ],
        features: ['Brass Latch Closure', 'Individual Foam Compartments for All 32 Pieces', 'FIDE Standard Sizing']
      },

      // 9. CAMPUS EVENTS
      {
        id: 'eq_38',
        title: 'JBL PartyBox 100W Portable Bluetooth Event Speaker',
        category: 'Campus Events',
        dailyRate: 120,
        weeklyRate: 500,
        securityDeposit: 1000,
        location: 'Student Activity Center (SAC) - Room 102',
        condition: 'Pristine / Like New',
        ownerId: 'usr_council',
        ownerName: 'SAC Equipment Desk',
        ownerRating: 5.0,
        rating: 4.98,
        reviewCount: 38,
        status: 'available',
        image: 'assets/images/speaker.svg',
        featured: true,
        requiresOperatorLicense: false,
        description: '100W punchy bass portable outdoor speaker with dynamic RGB light show, built-in rechargeable battery (up to 12 hrs), mic/guitar inputs, and Bluetooth connectivity.',
        specs: [
          { label: 'Power Output', value: '100W RMS JBL Signature Sound' },
          { label: 'Battery Life', value: 'Up to 12 Hours Continuous Playback' },
          { label: 'Inputs', value: 'Bluetooth 5.1, USB, 3.5mm Aux, Mic/Guitar In' }
        ],
        features: ['Dynamic Syncing Beat Lights', 'Splashproof IPX4 Rating', 'Telescopic Trolley Handle']
      },
      {
        id: 'eq_39',
        title: 'Ahuja Dual UHF Wireless Microphone System (Handheld + Collar)',
        category: 'Campus Events',
        dailyRate: 50,
        weeklyRate: 200,
        securityDeposit: 350,
        location: 'Student Activity Center (SAC) - Room 102',
        condition: 'Pristine / Like New',
        ownerId: 'usr_council',
        ownerName: 'SAC Equipment Desk',
        ownerRating: 5.0,
        rating: 4.9,
        reviewCount: 22,
        status: 'available',
        image: 'assets/images/speaker.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'UHF dual-channel wireless microphone system with one handheld mic and one lapel collar mic with bodypack transmitter. Interference-free range up to 50 meters.',
        specs: [
          { label: 'Operating Range', value: 'Up to 50 Meters Clear Line-of-Sight' },
          { label: 'Frequency', value: 'UHF Multi-Channel Quartz Crystal Locked' },
          { label: 'Receiver Output', value: 'Mixed 6.3mm Jack & Balanced XLR Out' }
        ],
        features: ['Anti-Feedback Cardioid Capsules', 'LED Display Battery Gauges', 'Carrying Flight Case']
      },
      {
        id: 'eq_40',
        title: 'RGB LED Stage Focus Par Cans (Pair with Controller)',
        category: 'Campus Events',
        dailyRate: 60,
        weeklyRate: 240,
        securityDeposit: 400,
        location: 'Student Activity Center (SAC) - Room 102',
        condition: 'Pristine / Like New',
        ownerId: 'usr_council',
        ownerName: 'SAC Equipment Desk',
        ownerRating: 5.0,
        rating: 4.88,
        reviewCount: 16,
        status: 'available',
        image: 'assets/images/speaker.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'Two 36x1W RGB LED stage lights with sound-active color changes, DMX input, dual bracket mounts, and remote control. Creates instant festive lighting for club stages.',
        specs: [
          { label: 'LED Count', value: '36x 1W LEDs (12 Red, 12 Green, 12 Blue)' },
          { label: 'Modes', value: 'Sound-Activated, Auto Cycle, DMX512, Strobe' },
          { label: 'Mounting', value: 'Dual Adjustable Floor/Truss Brackets' }
        ],
        features: ['Remote Controller Included', 'Cooling Fan System', 'High Brightness Stage Wash']
      },

      // 10. EVERYDAY STUDENT ESSENTIALS
      {
        id: 'eq_41',
        title: 'Heavy-Duty Windproof Campus Umbrella (Auto-Open)',
        category: 'Everyday Essentials',
        dailyRate: 10,
        weeklyRate: 35,
        securityDeposit: 60,
        location: 'Campus Canteen / Student Mart',
        condition: 'Pristine / Like New',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.93,
        reviewCount: 57,
        status: 'available',
        image: 'assets/images/umbrella.svg',
        featured: true,
        requiresOperatorLicense: false,
        description: 'Large 48-inch canopy storm umbrella with fiberglass wind-resistant ribs, automatic one-touch open button, water-repellent pongee fabric, and wooden J-handle.',
        specs: [
          { label: 'Canopy Arc', value: '48 Inches (Fits Two Students Comfortably)' },
          { label: 'Frame', value: '8 Reinforced Fiberglass Windproof Ribs' },
          { label: 'Operation', value: 'Auto-Open Push Button with Safety Lock' }
        ],
        features: ['UV-Coated Sun & Rain Protection', 'Quick Dry Hydrophobic Fabric', 'Ergonomic Curved Handle']
      },
      {
        id: 'eq_42',
        title: 'Mi 20,000mAh 22.5W Fast Charging Power Bank + Multi-Cable',
        category: 'Everyday Essentials',
        dailyRate: 25,
        weeklyRate: 90,
        securityDeposit: 200,
        location: 'Central Library - Helpdesk',
        condition: 'Pristine / Like New',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.97,
        reviewCount: 74,
        status: 'available',
        image: 'assets/images/power-bank.svg',
        featured: true,
        requiresOperatorLicense: false,
        description: 'Triple port fast charging power bank. Charges smartphones 4 to 5 times. Features two-way Type-C fast charging. Includes 3-in-1 nylon braided cable (Lightning, Type-C, Micro-USB).',
        specs: [
          { label: 'Capacity', value: '20,000 mAh (74 Wh Lithium Polymer)' },
          { label: 'Fast Charge', value: '22.5W Power Delivery & Quick Charge 3.0' },
          { label: 'Ports', value: '1x Type-C (In/Out) + 2x USB-A Out' }
        ],
        features: ['Multi-Device Simultaneous Charging', 'Smart LED Charge Indicators', 'Overheat & Short-Circuit Protection']
      },
      {
        id: 'eq_43',
        title: 'Hardened Steel Bicycle Combination U-Lock with Cable',
        category: 'Everyday Essentials',
        dailyRate: 10,
        weeklyRate: 35,
        securityDeposit: 80,
        location: 'Kaveri Boys Hostel - Common Room',
        condition: 'Pristine / Like New',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.9,
        reviewCount: 33,
        status: 'available',
        image: 'assets/images/cycle-lock.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: '16mm heavy cut-resistant alloy steel bicycle U-shackle with a 4-digit resettable combination mechanism and 1.2-meter steel security cable for campus bike racks.',
        specs: [
          { label: 'Shackle Thickness', value: '16 mm Hardened Zinc-Alloy Steel' },
          { label: 'Lock Type', value: '4-Digit Resettable Combination (No Keys to Lose)' },
          { label: 'Flex Cable', value: '1.2m Vinyl Coated Braided Steel' }
        ],
        features: ['Weatherproof Dust Cover', 'Scratch-Proof Silicone Shackle Coating', 'Fits All Hostel Bike Stands']
      },
      {
        id: 'eq_44',
        title: 'Waterproof Dual-Compartment Raincoat & Rain Pants',
        category: 'Everyday Essentials',
        dailyRate: 15,
        weeklyRate: 50,
        securityDeposit: 80,
        location: 'Campus Canteen / Student Mart',
        condition: 'Pristine / Like New',
        ownerId: 'usr_council',
        ownerName: 'SAC Equipment Desk',
        ownerRating: 5.0,
        rating: 4.88,
        reviewCount: 28,
        status: 'available',
        image: 'assets/images/umbrella.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'Two-piece durable PVC waterproof rain jacket with hood and matching rain trousers. Essential for cycling to classes during heavy campus monsoon downpours.',
        specs: [
          { label: 'Material', value: 'Heavy Duty 0.30mm Waterproof PVC/Polyester' },
          { label: 'Design', value: 'Zip-Front Jacket with Hood + Elastic Waist Pants' },
          { label: 'Size', value: 'Free Size Universal Adult Fit' }
        ],
        features: ['Reflective Night Safety Stripes', 'Sealed Waterproof Taped Seams', 'Compact Storage Pouch']
      },
      {
        id: 'eq_45',
        title: 'Heavy Duty Backpack with Padded Laptop Compartment',
        category: 'Everyday Essentials',
        dailyRate: 15,
        weeklyRate: 55,
        securityDeposit: 100,
        location: 'Kaveri Boys Hostel - Common Room',
        condition: 'Good Working Condition',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.85,
        reviewCount: 19,
        status: 'available',
        image: 'assets/images/power-bank.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: '30-liter water-resistant student daypack with padded sleeve for 15.6" laptop, side bottle holders, and anti-theft back pocket for campus day trips and hackathons.',
        specs: [
          { label: 'Capacity', value: '30 Liters Volume' },
          { label: 'Laptop Sleeve', value: 'Padded Shock-Absorbing Fits up to 15.6"' },
          { label: 'Material', value: '900D Tear-Resistant Ballistic Nylon' }
        ],
        features: ['Ergonomic Breathable Mesh Back', 'Built-in External USB Charging Pass-through', 'Rain Flap Zippers']
      },

      // Additional realistic items to exceed 50+ listings
      {
        id: 'eq_46',
        title: 'Faber-Castell Triangular Clutch Pencils (0.5mm + Leads)',
        category: 'Stationery',
        dailyRate: 5,
        weeklyRate: 18,
        securityDeposit: 25,
        location: 'Central Library - Helpdesk',
        condition: 'Pristine / Like New',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.92,
        reviewCount: 22,
        status: 'available',
        image: 'assets/images/stationery.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'Ergonomic triangular mechanical pencil pair (0.5mm and 0.7mm) with cushioned grip, twist-out eraser, and two full tubes of 2B polymer leads.',
        specs: [
          { label: 'Lead Sizes', value: '0.5mm & 0.7mm' },
          { label: 'Grip', value: 'Rubberized Non-Slip Triangular' },
          { label: 'Lead Type', value: 'Super-Polymer 2B Dark Leads' }
        ],
        features: ['Retractable Brass Sleeve', 'Long Twist Eraser', 'Exam Grade Precision']
      },
      {
        id: 'eq_47',
        title: 'T-Square Ruler (80cm Acrylic Wooden Head)',
        category: 'Engineering Drawing',
        dailyRate: 15,
        weeklyRate: 50,
        securityDeposit: 75,
        location: 'Mechanical Engineering Workshop (Block B)',
        condition: 'Good Working Condition',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.87,
        reviewCount: 14,
        status: 'available',
        image: 'assets/images/drafter.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: '80cm clear acrylic blade T-square with polished hardwood fixed head for horizontal parallel line drafting on Imperial drawing boards.',
        specs: [
          { label: 'Blade Length', value: '80 cm Acrylic Blade' },
          { label: 'Head Material', value: 'Polished Seasoned Hardwood' },
          { label: 'Bevel', value: 'Inking Edge on Both Margins' }
        ],
        features: ['Screwed Brass Reinforcement', 'Precise 90 Degree True Alignment', 'Non-Warping Blade']
      },
      {
        id: 'eq_48',
        title: 'Breadboard Jumper Wires Assortment (120 Pieces Male-Female-Male)',
        category: 'Lab Essentials',
        dailyRate: 10,
        weeklyRate: 35,
        securityDeposit: 50,
        location: 'Electronics & VLSI Lab (Block C)',
        condition: 'Pristine / Like New',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.94,
        reviewCount: 31,
        status: 'available',
        image: 'assets/images/arduino.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'Ribbon jumper wire pack with 40x Male-to-Male, 40x Male-to-Female, and 40x Female-to-Female flexible 20cm multi-colored breadboard wires.',
        specs: [
          { label: 'Wire Count', value: '120 Wires in 3 Ribbons' },
          { label: 'Length', value: '20 cm Standard Pitch 2.54mm' },
          { label: 'Core', value: 'High Conductivity Tinned Copper' }
        ],
        features: ['Snug Pin Grip on Header Pins', 'Color-Coded for Easy Tracing', 'Peelable Ribbon Form']
      },
      {
        id: 'eq_49',
        title: 'Electric Soldering Desoldering Suction Vacuum Pump',
        category: 'Lab Essentials',
        dailyRate: 10,
        weeklyRate: 35,
        securityDeposit: 50,
        location: 'Tech Hub & Makerspace',
        condition: 'Good Working Condition',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.83,
        reviewCount: 13,
        status: 'available',
        image: 'assets/images/soldering-kit.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'High vacuum spring-loaded desoldering pump (solder sucker) for cleanly removing molten solder from PCB components and IC pins during circuit rework.',
        specs: [
          { label: 'Body', value: 'Aluminum Metal Cylinder with Anti-Static Nozzle' },
          { label: 'Suction', value: 'Double Oil-Seal High Vacuum Plunger' },
          { label: 'Length', value: '19 cm Ergonomic Single-Hand Operation' }
        ],
        features: ['Heat-Resistant Teflon Tip', 'One-Touch Quick Release', 'Easy De-clog Cleaning']
      },
      {
        id: 'eq_50',
        title: 'Raspberry Pi 4 Model B (4GB RAM) with Case & Power Supply',
        category: 'Electronics & Computing',
        dailyRate: 60,
        weeklyRate: 250,
        securityDeposit: 400,
        location: 'Tech Hub & Makerspace',
        condition: 'Pristine / Like New',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.98,
        reviewCount: 27,
        status: 'available',
        image: 'assets/images/arduino.svg',
        featured: true,
        requiresOperatorLicense: false,
        description: 'Single board computer with quad-core 1.5 GHz CPU, dual micro-HDMI 4K video outputs, Gigabit Ethernet, and 32GB Class 10 MicroSD card pre-loaded with Raspberry Pi OS.',
        specs: [
          { label: 'SoC', value: 'Broadcom BCM2711 Quad-Core Cortex-A72 @ 1.5 GHz' },
          { label: 'RAM', value: '4 GB LPDDR4' },
          { label: 'Ports', value: '2x USB 3.0, 2x USB 2.0, Dual Micro-HDMI 4K, Type-C Power' }
        ],
        features: ['Aluminum Cooling Fan Case', 'Official 15W Type-C Adapter Included', 'Micro-HDMI to HDMI Cable']
      },
      {
        id: 'eq_51',
        title: 'A3 Pre-Stretched Cotton Canvas Board Pack (3 Boards)',
        category: 'Art & Design',
        dailyRate: 20,
        weeklyRate: 70,
        securityDeposit: 80,
        location: 'Fine Arts & Architecture Studio (Block E)',
        condition: 'Pristine / Like New',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.91,
        reviewCount: 14,
        status: 'available',
        image: 'assets/images/art-kit.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'Triple gesso primed 100% cotton canvas boards mounted on high-density MDF boards. Acid-free and ready for oil, acrylic, or mixed media art submissions.',
        specs: [
          { label: 'Size', value: 'A3 (30 x 42 cm)' },
          { label: 'Canvas', value: '100% Medium Grain Cotton (380 GSM)' },
          { label: 'Priming', value: 'Triple Acrylic Titanium Gesso Primed' }
        ],
        features: ['Non-Warping Heavy Board', 'Individually Shrink-Wrapped', 'Acid-Free Archival Quality']
      },
      {
        id: 'eq_52',
        title: 'Settlers of Catan Board Game (Complete 3-4 Player Edition)',
        category: 'Sports & Recreation',
        dailyRate: 25,
        weeklyRate: 90,
        securityDeposit: 150,
        location: 'Kaveri Boys Hostel - Common Room',
        condition: 'Pristine / Like New',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        ownerRating: 4.9,
        rating: 4.99,
        reviewCount: 36,
        status: 'available',
        image: 'assets/images/chess.svg',
        featured: true,
        requiresOperatorLicense: false,
        description: 'The classic strategy game of resource trading and settlement building. All hexagonal terrain tiles, wooden roads, settlements, and resource cards in pristine organized condition.',
        specs: [
          { label: 'Players', value: '3 to 4 Players (Ages 10+)' },
          { label: 'Game Time', value: '60 - 90 Minutes' },
          { label: 'Components', value: '19 Hex Terrain Tiles, 95 Resource Cards, Wooden Pieces' }
        ],
        features: ['Card Sleeved for Protection', 'Rulebook & Almanac Included', 'Hostel Game Night Favorite']
      }
    ];
  }

  function getInitialCampusBookings() {
    const today = window.RentEquip.Calc.getTodayISO();
    const addDays = (d, n) => window.RentEquip.Calc.addDays(d, n);

    return [
      {
        id: 'bk_101',
        equipmentId: 'eq_16',
        equipmentTitle: 'Casio fx-991EX ClassWiz Scientific Calculator',
        equipmentImage: 'assets/images/calculator.svg',
        category: 'Academic Resources',
        customerId: 'usr_aarav',
        customerName: 'Aarav Sharma',
        customerEmail: 'aarav.cs24@campus.edu',
        customerCompany: '2nd Year B.Tech CSE • Room 314, Kaveri Hostel',
        ownerId: 'usr_council',
        ownerName: 'Student Affairs Council & Lab Desk',
        startDate: addDays(today, -1),
        endDate: addDays(today, 1),
        rentalDays: 2,
        dailyRate: 20,
        rentalFee: 40,
        serviceFee: 2,
        securityDeposit: 250,
        totalUpfrontPaid: 292,
        status: 'active', // Active ongoing exam rental
        createdAt: addDays(today, -2) + 'T14:30:00Z',
        approvedAt: addDays(today, -1) + 'T16:00:00Z',
        pickedUpAt: addDays(today, -1) + 'T17:15:00Z',
        actualReturnDate: null,
        rejectionReason: null,
        inspection: null,
        payment: {
          transactionId: 'CAMPUS-UPI-98214',
          rentalPaymentStatus: 'paid',
          depositStatus: 'held',
          method: 'Simulated UPI • aarav@okhdfc',
          timestamp: addDays(today, -2) + 'T14:30:00Z'
        },
        reviewed: false
      },
      {
        id: 'bk_102',
        equipmentId: 'eq_13',
        equipmentTitle: 'Arduino Uno R3 Starter Prototyping Kit',
        equipmentImage: 'assets/images/arduino.svg',
        category: 'Lab Essentials',
        customerId: 'usr_aarav',
        customerName: 'Aarav Sharma',
        customerEmail: 'aarav.cs24@campus.edu',
        customerCompany: '2nd Year B.Tech CSE • Room 314, Kaveri Hostel',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        startDate: addDays(today, 2),
        endDate: addDays(today, 5),
        rentalDays: 3,
        dailyRate: 40,
        rentalFee: 120,
        serviceFee: 6,
        securityDeposit: 250,
        totalUpfrontPaid: 376,
        status: 'pending', // Pending Priya's approval
        createdAt: addDays(today, -1) + 'T19:20:00Z',
        approvedAt: null,
        pickedUpAt: null,
        actualReturnDate: null,
        rejectionReason: null,
        inspection: null,
        payment: {
          transactionId: 'CAMPUS-UPI-67124',
          rentalPaymentStatus: 'paid',
          depositStatus: 'held',
          method: 'Simulated GPay • 9876543210@upi',
          timestamp: addDays(today, -1) + 'T19:20:00Z'
        },
        reviewed: false
      },
      {
        id: 'bk_103',
        equipmentId: 'eq_07',
        equipmentTitle: 'Omega Engineering Mini-Drafter with Cover Bag',
        equipmentImage: 'assets/images/drafter.svg',
        category: 'Engineering Drawing',
        customerId: 'usr_aarav',
        customerName: 'Aarav Sharma',
        customerEmail: 'aarav.cs24@campus.edu',
        customerCompany: '2nd Year B.Tech CSE • Room 314, Kaveri Hostel',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        startDate: addDays(today, 1),
        endDate: addDays(today, 3),
        rentalDays: 2,
        dailyRate: 25,
        rentalFee: 50,
        serviceFee: 2.5,
        securityDeposit: 150,
        totalUpfrontPaid: 202.5,
        status: 'approved', // Approved, ready for Aarav to pick up at Tech Hub
        createdAt: addDays(today, -2) + 'T11:15:00Z',
        approvedAt: addDays(today, -1) + 'T18:00:00Z',
        pickedUpAt: null,
        actualReturnDate: null,
        rejectionReason: null,
        inspection: null,
        payment: {
          transactionId: 'CAMPUS-PAYTM-44129',
          rentalPaymentStatus: 'paid',
          depositStatus: 'held',
          method: 'Simulated Paytm Wallet',
          timestamp: addDays(today, -2) + 'T11:15:00Z'
        },
        reviewed: false
      },
      {
        id: 'bk_104',
        equipmentId: 'eq_06',
        equipmentTitle: 'Imperial Pine-Wood Engineering Drawing Board (D1)',
        equipmentImage: 'assets/images/drawing-board.svg',
        category: 'Engineering Drawing',
        customerId: 'usr_aarav',
        customerName: 'Aarav Sharma',
        customerEmail: 'aarav.cs24@campus.edu',
        customerCompany: '2nd Year B.Tech CSE • Room 314, Kaveri Hostel',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        startDate: addDays(today, -4),
        endDate: addDays(today, -1),
        rentalDays: 3,
        dailyRate: 30,
        rentalFee: 90,
        serviceFee: 4.5,
        securityDeposit: 200,
        totalUpfrontPaid: 294.5,
        status: 'returned', // Aarav returned it yesterday, awaiting Priya's inspection & refund
        createdAt: addDays(today, -5) + 'T09:00:00Z',
        approvedAt: addDays(today, -4) + 'T12:00:00Z',
        pickedUpAt: addDays(today, -4) + 'T14:00:00Z',
        returnedAt: addDays(today, -1) + 'T18:30:00Z',
        actualReturnDate: addDays(today, -1),
        rejectionReason: null,
        inspection: null,
        payment: {
          transactionId: 'CAMPUS-UPI-88192',
          rentalPaymentStatus: 'paid',
          depositStatus: 'held',
          method: 'Simulated UPI • aarav@okhdfc',
          timestamp: addDays(today, -5) + 'T09:00:00Z'
        },
        reviewed: false
      },
      {
        id: 'bk_105',
        equipmentId: 'eq_10',
        equipmentTitle: 'Pure Cotton Student Lab Coat (Full Sleeve)',
        equipmentImage: 'assets/images/lab-coat.svg',
        category: 'Lab Essentials',
        customerId: 'usr_aarav',
        customerName: 'Aarav Sharma',
        customerEmail: 'aarav.cs24@campus.edu',
        customerCompany: '2nd Year B.Tech CSE • Room 314, Kaveri Hostel',
        ownerId: 'usr_council',
        ownerName: 'SAC Equipment Desk',
        startDate: addDays(today, -8),
        endDate: addDays(today, -6),
        rentalDays: 2,
        dailyRate: 20,
        rentalFee: 40,
        serviceFee: 2,
        securityDeposit: 100,
        totalUpfrontPaid: 142,
        status: 'completed', // Completed & deposit fully refunded! Review ready
        createdAt: addDays(today, -9) + 'T10:00:00Z',
        approvedAt: addDays(today, -8) + 'T13:00:00Z',
        pickedUpAt: addDays(today, -8) + 'T14:30:00Z',
        returnedAt: addDays(today, -6) + 'T17:00:00Z',
        actualReturnDate: addDays(today, -6),
        rejectionReason: null,
        inspection: {
          condition: 'pristine',
          damageFee: 0,
          damageNotes: 'Returned freshly laundered, spotless white cotton, zero tears or chemicals.',
          lateDays: 0,
          latePenaltyFee: 0,
          depositRefunded: 100,
          inspectedBy: 'SAC Equipment Desk',
          inspectedAt: addDays(today, -5) + 'T10:00:00Z'
        },
        payment: {
          transactionId: 'CAMPUS-UPI-11029',
          rentalPaymentStatus: 'paid',
          depositStatus: 'fully_refunded',
          method: 'Simulated UPI • aarav@okhdfc',
          timestamp: addDays(today, -9) + 'T10:00:00Z'
        },
        reviewed: false // Can be reviewed on customer page
      },
      {
        id: 'bk_106',
        equipmentId: 'eq_12',
        equipmentTitle: 'Mastech Auto-Ranging Digital Multimeter (DMM)',
        equipmentImage: 'assets/images/multimeter.svg',
        category: 'Lab Essentials',
        customerId: 'usr_aarav',
        customerName: 'Aarav Sharma',
        customerEmail: 'aarav.cs24@campus.edu',
        customerCompany: '2nd Year B.Tech CSE • Room 314, Kaveri Hostel',
        ownerId: 'usr_priya',
        ownerName: 'Priya Patel',
        startDate: addDays(today, -4),
        endDate: addDays(today, -1), // Scheduled end was yesterday -> OVERDUE!
        rentalDays: 3,
        dailyRate: 25,
        rentalFee: 75,
        serviceFee: 3.75,
        securityDeposit: 150,
        totalUpfrontPaid: 228.75,
        status: 'active', // Active but past due date -> triggers overdue alert & penalty!
        createdAt: addDays(today, -5) + 'T16:00:00Z',
        approvedAt: addDays(today, -4) + 'T18:00:00Z',
        pickedUpAt: addDays(today, -4) + 'T19:00:00Z',
        actualReturnDate: null,
        rejectionReason: null,
        inspection: null,
        payment: {
          transactionId: 'CAMPUS-UPI-77401',
          rentalPaymentStatus: 'paid',
          depositStatus: 'held',
          method: 'Simulated UPI • aarav@okhdfc',
          timestamp: addDays(today, -5) + 'T16:00:00Z'
        },
        reviewed: false
      }
    ];
  }

  function getInitialCampusReviews() {
    return [
      {
        id: 'rev_01',
        equipmentId: 'eq_16',
        customerId: 'usr_aarav',
        customerName: 'Aarav Sharma',
        rating: 5,
        comment: 'Lifesaver for the Mathematics-II semester exam! Matrix and numerical integration worked seamlessly. Calculator was in mint condition with battery fully charged.',
        date: '2026-09-15',
        verifiedRental: true
      },
      {
        id: 'rev_02',
        equipmentId: 'eq_07',
        customerId: 'usr_aarav',
        customerName: 'Aarav Sharma',
        rating: 5,
        comment: 'Priya’s mini-drafter was perfectly calibrated with zero wobble. All orthographic projections on my sheet were approved by the lab instructor.',
        date: '2026-09-02',
        verifiedRental: true
      },
      {
        id: 'rev_03',
        equipmentId: 'eq_10',
        customerId: 'usr_aarav',
        customerName: 'Aarav Sharma',
        rating: 5,
        comment: 'Forgot my lab coat in the hostel and picked this up from SAC in 5 minutes. Clean, pressed, and compliant with chemistry lab guidelines.',
        date: '2026-08-20',
        verifiedRental: true
      }
    ];
  }

  function getInitialCampusNotifications() {
    const today = window.RentEquip.Calc.getTodayISO();
    return [
      {
        id: 'notif_01',
        userId: 'usr_aarav',
        title: 'Mini-Drafter Ready for Pickup',
        message: 'Your rental request for Omega Mini-Drafter was approved by Priya. Collect it at Tech Hub & Makerspace.',
        type: 'booking_approved',
        link: 'customer.html',
        bookingId: 'bk_103',
        read: false,
        createdAt: today + 'T18:01:00Z'
      },
      {
        id: 'notif_02',
        userId: 'usr_priya',
        title: 'New Arduino Kit Request',
        message: 'Aarav Sharma requested your Arduino Uno Starter Kit for 3 days. Action required.',
        type: 'booking_request',
        link: 'owner.html',
        bookingId: 'bk_102',
        read: false,
        createdAt: today + 'T19:21:00Z'
      },
      {
        id: 'notif_03',
        userId: 'usr_priya',
        title: 'Drawing Board Returned — Needs Inspection',
        message: 'Imperial Drawing Board was returned at SAC desk by Aarav. Complete condition check to release deposit refund.',
        type: 'return_submitted',
        link: 'owner.html',
        bookingId: 'bk_104',
        read: false,
        createdAt: today + 'T18:35:00Z'
      },
      {
        id: 'notif_04',
        userId: 'usr_aarav',
        title: 'Overdue Item Reminder: Multimeter',
        message: 'Notice: Mastech Digital Multimeter was scheduled for return yesterday. Return today to avoid extra late fees.',
        type: 'overdue_alert',
        link: 'customer.html',
        bookingId: 'bk_106',
        read: false,
        createdAt: today + 'T08:00:00Z'
      },
      {
        id: 'notif_05',
        userId: 'usr_priya',
        title: 'Overdue Notice: Multimeter Out',
        message: 'Your Digital Multimeter (#bk_106) is past scheduled return date. Late penalty accumulation active.',
        type: 'overdue_alert',
        link: 'owner.html',
        bookingId: 'bk_106',
        read: false,
        createdAt: today + 'T08:05:00Z'
      }
    ];
  }

  const Storage = {
    init() {
      if (!localStorage.getItem(STORAGE_KEYS.INIT_FLAG)) {
        this.resetToDefaults();
      }
      this.ensureCurrentUser();
    },

    resetToDefaults() {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(SEED_USERS[0])); // Aarav Sharma default
      localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(getInitialCampusEquipment()));
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(getInitialCampusBookings()));
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(getInitialCampusReviews()));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(getInitialCampusNotifications()));
      localStorage.setItem(STORAGE_KEYS.INIT_FLAG, 'true');
      this.notifyChange('reset');
    },

    ensureCurrentUser() {
      const cur = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (!cur) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(SEED_USERS[0]));
      }
    },

    // USER METHODS
    getUsers() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || SEED_USERS;
      } catch (e) {
        return SEED_USERS;
      }
    },

    getUserById(id) {
      return this.getUsers().find(u => u.id === id) || null;
    },

    getCurrentUser() {
      try {
        const u = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
        return u || SEED_USERS[0];
      } catch (e) {
        return SEED_USERS[0];
      }
    },

    setCurrentUser(id) {
      const user = this.getUserById(id);
      if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        this.notifyChange('user_change', user);
      }
      return user;
    },

    // EQUIPMENT METHODS
    getEquipment() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.EQUIPMENT)) || [];
      } catch (e) {
        return [];
      }
    },

    getEquipmentById(id) {
      return this.getEquipment().find(e => e.id === id) || null;
    },

    saveEquipment(item) {
      const list = this.getEquipment();
      if (!item.id) {
        item.id = 'eq_' + Date.now().toString(36);
        item.rating = 5.0;
        item.reviewCount = 0;
        item.status = item.status || 'available';
        list.push(item);
      } else {
        const idx = list.findIndex(e => e.id === item.id);
        if (idx >= 0) {
          list[idx] = { ...list[idx], ...item };
        } else {
          list.push(item);
        }
      }
      localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(list));
      this.notifyChange('equipment_change', item);
      return item;
    },

    deleteEquipment(id) {
      let list = this.getEquipment();
      list = list.filter(e => e.id !== id);
      localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(list));
      this.notifyChange('equipment_change', { id, deleted: true });
    },

    // BOOKING CONFLICT & DATE AVAILABILITY
    isEquipmentAvailable(equipmentId, startDate, endDate, excludeBookingId = null) {
      if (!equipmentId || !startDate || !endDate) return false;
      const bookings = this.getBookings();

      const blockingBookings = bookings.filter(b => {
        if (b.equipmentId !== equipmentId) return false;
        if (excludeBookingId && b.id === excludeBookingId) return false;
        return ['approved', 'active'].includes(b.status);
      });

      for (const b of blockingBookings) {
        if (window.RentEquip.Calc.areDatesOverlapping(startDate, endDate, b.startDate, b.endDate)) {
          return {
            available: false,
            conflictingBooking: b,
            reason: `Item already booked (${window.RentEquip.Calc.formatDate(b.startDate)} to ${window.RentEquip.Calc.formatDate(b.endDate)})`
          };
        }
      }

      return { available: true };
    },

    getBookedRanges(equipmentId) {
      return this.getBookings()
        .filter(b => b.equipmentId === equipmentId && ['approved', 'active'].includes(b.status))
        .map(b => ({
          bookingId: b.id,
          status: b.status,
          startDate: b.startDate,
          endDate: b.endDate
        }));
    },

    // BOOKING CRUD & LIFECYCLE
    getBookings() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS)) || [];
      } catch (e) {
        return [];
      }
    },

    getBookingById(id) {
      return this.getBookings().find(b => b.id === id) || null;
    },

    createBooking(bookingData) {
      const bookings = this.getBookings();
      const newBooking = {
        id: 'bk_' + Date.now().toString(36),
        createdAt: new Date().toISOString(),
        status: 'pending',
        reviewed: false,
        payment: {
          transactionId: 'CAMPUS-UPI-' + Math.floor(10000 + Math.random() * 90000),
          rentalPaymentStatus: 'paid',
          depositStatus: 'held',
          method: bookingData.paymentMethod || 'Simulated Campus UPI',
          timestamp: new Date().toISOString()
        },
        ...bookingData
      };

      bookings.unshift(newBooking);
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

      // Notify owner
      this.addNotification({
        userId: newBooking.ownerId,
        title: 'New Campus Borrow Request',
        message: `${newBooking.customerName} requested ${newBooking.equipmentTitle} for ${newBooking.rentalDays} days.`,
        type: 'booking_request',
        link: 'owner.html',
        bookingId: newBooking.id
      });

      this.notifyChange('booking_change', newBooking);
      return newBooking;
    },

    updateBooking(booking) {
      const bookings = this.getBookings();
      const idx = bookings.findIndex(b => b.id === booking.id);
      if (idx >= 0) {
        bookings[idx] = { ...bookings[idx], ...booking };
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
        this.notifyChange('booking_change', bookings[idx]);
        return bookings[idx];
      }
      return null;
    },

    transitionBookingStatus(bookingId, newStatus, payload = {}) {
      const booking = this.getBookingById(bookingId);
      if (!booking) return { success: false, error: 'Booking not found' };

      const nowISO = new Date().toISOString();
      const todayISO = window.RentEquip.Calc.getTodayISO();

      booking.status = newStatus;

      if (newStatus === 'approved') {
        booking.approvedAt = nowISO;
        this.addNotification({
          userId: booking.customerId,
          title: 'Borrow Request Approved!',
          message: `Your request for ${booking.equipmentTitle} was approved by ${booking.ownerName}. Ready for pickup.`,
          type: 'booking_approved',
          link: 'customer.html',
          bookingId: booking.id
        });
      } else if (newStatus === 'rejected') {
        booking.rejectionReason = payload.reason || 'Lender unavailable or item in personal use';
        booking.rejectedAt = nowISO;
        booking.payment.rentalPaymentStatus = 'refunded';
        booking.payment.depositStatus = 'fully_refunded';
        this.addNotification({
          userId: booking.customerId,
          title: 'Request Declined',
          message: `Request for ${booking.equipmentTitle} was declined: ${booking.rejectionReason}. Full simulated refund issued.`,
          type: 'booking_rejected',
          link: 'customer.html',
          bookingId: booking.id
        });
      } else if (newStatus === 'active') {
        booking.pickedUpAt = nowISO;
        const eq = this.getEquipmentById(booking.equipmentId);
        if (eq) {
          eq.status = 'rented';
          this.saveEquipment(eq);
        }
        this.addNotification({
          userId: booking.ownerId,
          title: 'Item Picked Up',
          message: `${booking.customerName} confirmed pickup of ${booking.equipmentTitle}. Rental is active.`,
          type: 'rental_active',
          link: 'owner.html',
          bookingId: booking.id
        });
      } else if (newStatus === 'returned') {
        booking.returnedAt = nowISO;
        booking.actualReturnDate = payload.actualReturnDate || todayISO;
        this.addNotification({
          userId: booking.ownerId,
          title: 'Item Returned — Inspection Needed',
          message: `${booking.equipmentTitle} was returned by ${booking.customerName}. Please verify condition and release deposit.`,
          type: 'return_submitted',
          link: 'owner.html',
          bookingId: booking.id
        });
      } else if (newStatus === 'completed') {
        booking.completedAt = nowISO;
        booking.inspection = {
          condition: payload.condition || 'good',
          damageFee: Number(payload.damageFee) || 0,
          damageNotes: payload.damageNotes || 'Returned in good working order',
          lateDays: Number(payload.lateDays) || 0,
          latePenaltyFee: Number(payload.latePenaltyFee) || 0,
          depositRefunded: Number(payload.depositRefunded) || 0,
          inspectedBy: payload.inspectedBy || booking.ownerName,
          inspectedAt: nowISO
        };

        if (booking.inspection.depositRefunded >= booking.securityDeposit) {
          booking.payment.depositStatus = 'fully_refunded';
        } else if (booking.inspection.depositRefunded > 0) {
          booking.payment.depositStatus = 'partially_refunded';
        } else {
          booking.payment.depositStatus = 'forfeited';
        }

        const eq = this.getEquipmentById(booking.equipmentId);
        if (eq && eq.status === 'rented') {
          eq.status = 'available';
          this.saveEquipment(eq);
        }

        this.addNotification({
          userId: booking.customerId,
          title: 'Rental Completed & Deposit Settled',
          message: `Inspection finalized for ${booking.equipmentTitle}. Deposit refunded: ${window.RentEquip.Calc.formatCurrency(booking.inspection.depositRefunded)}. You can now leave peer feedback!`,
          type: 'inspection_completed',
          link: 'customer.html',
          bookingId: booking.id
        });
      } else if (newStatus === 'cancelled') {
        booking.cancelledAt = nowISO;
        booking.payment.rentalPaymentStatus = 'refunded';
        booking.payment.depositStatus = 'fully_refunded';
        this.addNotification({
          userId: booking.ownerId,
          title: 'Borrow Request Cancelled',
          message: `${booking.customerName} cancelled their request for ${booking.equipmentTitle}.`,
          type: 'booking_rejected',
          link: 'owner.html',
          bookingId: booking.id
        });
      }

      this.updateBooking(booking);
      return { success: true, booking };
    },

    // REVIEW METHODS
    getReviews(equipmentId = null) {
      try {
        const revs = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS)) || [];
        if (equipmentId) {
          return revs.filter(r => r.equipmentId === equipmentId);
        }
        return revs;
      } catch (e) {
        return [];
      }
    },

    addReview({ equipmentId, bookingId, rating, comment }) {
      const curUser = this.getCurrentUser();
      const booking = this.getBookingById(bookingId);

      if (!booking || booking.status !== 'completed') {
        return { success: false, error: 'Peer reviews are only permitted for completed, inspected rentals.' };
      }
      if (booking.reviewed) {
        return { success: false, error: 'This rental has already been reviewed.' };
      }

      const reviews = this.getReviews();
      const newReview = {
        id: 'rev_' + Date.now().toString(36),
        equipmentId,
        bookingId,
        customerId: curUser.id,
        customerName: curUser.name,
        rating: Math.max(1, Math.min(5, Number(rating) || 5)),
        comment: comment.trim(),
        date: window.RentEquip.Calc.getTodayISO(),
        verifiedRental: true
      };

      reviews.unshift(newReview);
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));

      booking.reviewed = true;
      this.updateBooking(booking);

      const eqReviews = reviews.filter(r => r.equipmentId === equipmentId);
      const avgRating = Math.round((eqReviews.reduce((sum, r) => sum + r.rating, 0) / eqReviews.length) * 10) / 10;
      const eq = this.getEquipmentById(equipmentId);
      if (eq) {
        eq.rating = avgRating;
        eq.reviewCount = eqReviews.length;
        this.saveEquipment(eq);
      }

      this.notifyChange('review_added', newReview);
      return { success: true, review: newReview };
    },

    // NOTIFICATION METHODS
    getNotifications(userId = null) {
      try {
        const notifs = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) || [];
        if (userId) {
          return notifs.filter(n => n.userId === userId);
        }
        return notifs;
      } catch (e) {
        return [];
      }
    },

    addNotification(notif) {
      const notifs = this.getNotifications();
      const newNotif = {
        id: 'notif_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
        createdAt: new Date().toISOString(),
        read: false,
        ...notif
      };
      notifs.unshift(newNotif);
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
      this.notifyChange('notification_added', newNotif);
      return newNotif;
    },

    markNotificationRead(id) {
      const notifs = this.getNotifications();
      const item = notifs.find(n => n.id === id);
      if (item) {
        item.read = true;
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
        this.notifyChange('notification_updated', item);
      }
    },

    markAllNotificationsRead(userId) {
      const notifs = this.getNotifications();
      let changed = false;
      notifs.forEach(n => {
        if (!userId || n.userId === userId) {
          if (!n.read) {
            n.read = true;
            changed = true;
          }
        }
      });
      if (changed) {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
        this.notifyChange('notification_updated');
      }
    },

    getUnreadNotificationCount(userId) {
      return this.getNotifications(userId).filter(n => !n.read).length;
    },

    // EVENT BUS
    notifyChange(eventName, detail = {}) {
      window.dispatchEvent(new CustomEvent('rentequip:change', {
        detail: { type: eventName, ...detail }
      }));
    },

    subscribe(callback) {
      window.addEventListener('rentequip:change', callback);
    }
  };

  Storage.init();

  window.RentEquip = window.RentEquip || {};
  window.RentEquip.Storage = Storage;
})(window);
