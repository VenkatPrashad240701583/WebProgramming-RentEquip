/**
 * RentEquip - LocalStorage Persistence & Demo Data Engine
 * Handles user sessions, equipment inventory, booking lifecycles, reviews, and notifications.
 */

(function (window) {
  'use strict';

  const STORAGE_KEYS = {
    USERS: 'rentequip_users_v2',
    CURRENT_USER: 'rentequip_current_user_v2',
    EQUIPMENT: 'rentequip_equipment_v2',
    BOOKINGS: 'rentequip_bookings_v2',
    REVIEWS: 'rentequip_reviews_v2',
    NOTIFICATIONS: 'rentequip_notifications_v2',
    INIT_FLAG: 'rentequip_seeded_v2'
  };

  const SEED_USERS = [
    {
      id: 'usr_alex',
      name: 'Alex Rivera',
      email: 'alex.rivera@buildcraft.io',
      role: 'customer',
      avatar: 'AR',
      company: 'Rivera Renovations LLC',
      phone: '(512) 884-2190',
      joinedDate: '2025-03-14',
      rating: 4.95
    },
    {
      id: 'usr_marcus',
      name: 'Marcus Vance',
      email: 'marcus@vanceheavy.com',
      role: 'owner',
      avatar: 'MV',
      company: 'Vance Earthworks & Machinery',
      phone: '(512) 743-9821',
      joinedDate: '2024-11-02',
      rating: 4.88
    },
    {
      id: 'usr_elena',
      name: 'Elena Rostova',
      email: 'elena@rentequip.internal',
      role: 'admin',
      avatar: 'ER',
      company: 'RentEquip Trust & Operations',
      phone: '(800) 555-RENT',
      joinedDate: '2024-01-10',
      rating: 5.0
    }
  ];

  function getInitialEquipment() {
    return [
      {
        id: 'eq_01',
        title: 'CAT 308 CR Mini Hydraulic Excavator',
        category: 'Earthmoving',
        dailyRate: 285,
        weeklyRate: 1425,
        securityDeposit: 650,
        replacementValue: 72000,
        location: 'Austin North Depot, Austin TX',
        ownerId: 'usr_marcus',
        ownerName: 'Marcus Vance',
        ownerRating: 4.9,
        rating: 4.9,
        reviewCount: 18,
        status: 'rented', // currently active on bk_101
        image: 'assets/images/excavator.svg',
        featured: true,
        requiresOperatorLicense: true,
        description: 'The Cat 308 CR Mini Excavator delivers maximum power and performance in a compact size to help you work in a wide range of utility, trenching, and commercial grading applications. Equipped with high-flow auxiliary hydraulics and rubber tracks to protect paved surfaces.',
        specs: [
          { label: 'Operating Weight', value: '18,500 lbs (8.4 Metric Tons)' },
          { label: 'Max Digging Depth', value: '15.3 ft (4,670 mm)' },
          { label: 'Net Engine Power', value: '74 HP @ 2400 rpm' },
          { label: 'Tail Swing', value: 'Compact Radius' },
          { label: 'Fuel Capacity', value: '26 gal (Ultra Low Sulfur Diesel)' },
          { label: 'Bucket Capacity', value: '0.4 cu yd Heavy Duty' }
        ],
        features: [
          'Sealed & Pressurized Cab with Air Conditioning',
          'Stick Steer & Cruise Control Modes',
          'Hydraulic Quick Coupler & Thumb Clamp',
          'Overload Warning Sensor & Telematics',
          'Rubber Tracks for Asphalt Protection'
        ]
      },
      {
        id: 'eq_02',
        title: 'Genie GS-1930 Electric Scissor Lift',
        category: 'Aerial & Lifts',
        dailyRate: 115,
        weeklyRate: 550,
        securityDeposit: 300,
        replacementValue: 16500,
        location: 'Downtown Logistics Hub, Austin TX',
        ownerId: 'usr_marcus',
        ownerName: 'Marcus Vance',
        ownerRating: 4.9,
        rating: 4.85,
        reviewCount: 24,
        status: 'available',
        image: 'assets/images/scissor-lift.svg',
        featured: true,
        requiresOperatorLicense: false,
        description: 'The Genie GS-1930 slab scissor lift offers quiet electric drive operation with zero site emissions. Ideal for indoor warehouse maintenance, electrical installations, ceiling drywall, and architectural facilities. Compact width passes through standard single doorways with ease.',
        specs: [
          { label: 'Max Working Height', value: '25 ft (7.79 m)' },
          { label: 'Max Platform Height', value: '19 ft (5.79 m)' },
          { label: 'Platform Capacity', value: '500 lbs (227 kg)' },
          { label: 'Machine Width', value: '30 in (0.76 m)' },
          { label: 'Drive Speed (Stowed)', value: '2.5 mph' },
          { label: 'Power Source', value: '24V DC (4x 6V 225Ah Deep Cycle)' }
        ],
        features: [
          '3 ft (0.91 m) Slide-Out Deck Extension',
          'Non-Marking Solid Rubber Tires',
          'Proportional Lift and Drive Controls',
          'Emergency Lowering Hand Valve',
          'Dual Front-Wheel Drive & Zero Inside Turn Radius'
        ]
      },
      {
        id: 'eq_03',
        title: 'Bobcat S650 Skid Steer Loader',
        category: 'Earthmoving',
        dailyRate: 240,
        weeklyRate: 1200,
        securityDeposit: 550,
        replacementValue: 54000,
        location: 'South Congress Yard, Austin TX',
        ownerId: 'usr_marcus',
        ownerName: 'Marcus Vance',
        ownerRating: 4.9,
        rating: 4.92,
        reviewCount: 31,
        status: 'available',
        image: 'assets/images/skid-steer.svg',
        featured: true,
        requiresOperatorLicense: false,
        description: 'A heavy-duty vertical lift path loader engineered for loading high-sided trucks and commercial site preparation. Offers unmatched breakout forces, comfortable sealed cab, and hydraulic flow suited for hydraulic hammers, augers, and cold planers.',
        specs: [
          { label: 'Rated Operating Capacity', value: '2,690 lbs' },
          { label: 'Operating Weight', value: '8,061 lbs' },
          { label: 'Engine Horsepower', value: '74 HP Turbo Diesel' },
          { label: 'Height to Bucket Hinge Pin', value: '124.0 in (10.3 ft)' },
          { label: 'Auxiliary Hydraulic Flow', value: '23 gpm (Std) / 30.5 gpm (High)' }
        ],
        features: [
          'Selectable Joystick Controls (SJC)',
          'High-Flow Hydraulics Package Included',
          'Bob-Tach Universal Attachment Mounting',
          'Two-Speed Travel System (12.3 mph)',
          'Backup Camera with Color In-Cab Display'
        ]
      },
      {
        id: 'eq_04',
        title: 'Generac 70kVA Sound-Attenuated Diesel Generator',
        category: 'Power & Lighting',
        dailyRate: 180,
        weeklyRate: 900,
        securityDeposit: 400,
        replacementValue: 34000,
        location: 'Austin North Depot, Austin TX',
        ownerId: 'usr_marcus',
        ownerName: 'Marcus Vance',
        ownerRating: 4.9,
        rating: 4.78,
        reviewCount: 14,
        status: 'rented', // bk_106 overdue scenario
        image: 'assets/images/generator.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'Commercial-grade mobile prime power generator designed for high uptime at construction sites, festivals, and emergency backup installations. Features a multi-voltage selector switch and sound attenuation down to 65 dBA @ 23 ft.',
        specs: [
          { label: 'Continuous Output', value: '56 kW / 70 kVA Prime' },
          { label: 'Voltage Configuration', value: '120/208V, 277/480V 3-Ph & 120/240V 1-Ph' },
          { label: 'Engine', value: 'Isuzu 4JJ1X Tier 4 Final Turbo Diesel' },
          { label: 'Fuel Tank Capacity', value: '106 gal (30 hr runtime at 75% load)' },
          { label: 'Noise Level', value: '65 dBA @ 23 ft' }
        ],
        features: [
          'Trailer Mounted with 2-5/16" Ball Hitch',
          'Multi-Voltage Camlock Connection Panel',
          'Dual Containment Fuel Tank (110% Fluid Containment)',
          'Digital Deep Sea Controller with Auto-Start',
          'Emergency Stop External Pushbutton'
        ]
      },
      {
        id: 'eq_05',
        title: 'Multiquip 9 cu ft Concrete Mixer',
        category: 'Concrete & Masonry',
        dailyRate: 85,
        weeklyRate: 380,
        securityDeposit: 200,
        replacementValue: 6200,
        location: 'East Riverside Yard, Austin TX',
        ownerId: 'usr_marcus',
        ownerName: 'Marcus Vance',
        ownerRating: 4.9,
        rating: 4.88,
        reviewCount: 19,
        status: 'available',
        image: 'assets/images/concrete-mixer.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'Rugged portable towable mixer ideal for commercial masonry and structural foundation pours. Features heavy-duty cast iron ring gear and oversized dump wheel for effortless batches.',
        specs: [
          { label: 'Batch Capacity', value: '9 cu ft (Half Bag to 1.5 Bags)' },
          { label: 'Drum Construction', value: 'Heavy Gauge Abrasion-Resistant Steel' },
          { label: 'Engine', value: 'Honda GX240 8 HP OHV' },
          { label: 'Towing Package', value: 'Highway Tires & High-Speed Hubs' },
          { label: 'Discharge Height', value: '23 in' }
        ],
        features: [
          'Retractable Tow Tongue with Safety Chains',
          'Positive Dump Wheel Lock Mechanism',
          'Heavy Reinforced One-Piece Drum Opening',
          'Engine Shroud Venting with Easy Oil Drain'
        ]
      },
      {
        id: 'eq_06',
        title: 'Wacker Neuson Forward Plate Compactor 20"',
        category: 'Compaction & Paving',
        dailyRate: 75,
        weeklyRate: 340,
        securityDeposit: 150,
        replacementValue: 3900,
        location: 'Downtown Logistics Hub, Austin TX',
        ownerId: 'usr_marcus',
        ownerName: 'Marcus Vance',
        ownerRating: 4.9,
        rating: 4.94,
        reviewCount: 42,
        status: 'available',
        image: 'assets/images/compactor.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'High-performance soil and asphalt plate compactor delivering 4,400 lbs of centrifugal force. Includes integrated water sprinkling system for non-stick asphalt paving passes.',
        specs: [
          { label: 'Centrifugal Force', value: '4,400 lbf (19.8 kN)' },
          { label: 'Base Plate Width', value: '19.7 in (500 mm)' },
          { label: 'Max Compaction Depth', value: '12 in' },
          { label: 'Engine', value: 'Honda GX160 4.8 HP' },
          { label: 'Weight', value: '207 lbs' }
        ],
        features: [
          'Vibration-Damped Ergonomic Guide Handle',
          'Removable Asphalt Water Tank & Sprinkler Bar',
          'Heavy-Duty Ductile Iron Base Plate',
          'Central Lifting Eye for Easy Crane Handling'
        ]
      },
      {
        id: 'eq_07',
        title: 'JLG 1055 Telescopic High-Reach Forklift',
        category: 'Aerial & Lifts',
        dailyRate: 340,
        weeklyRate: 1700,
        securityDeposit: 800,
        replacementValue: 125000,
        location: 'North District Depot, Austin TX',
        ownerId: 'usr_marcus',
        ownerName: 'Marcus Vance',
        ownerRating: 4.9,
        rating: 4.96,
        reviewCount: 11,
        status: 'available',
        image: 'assets/images/telehandler.svg',
        featured: true,
        requiresOperatorLicense: true,
        description: 'Heavy rough terrain telehandler capable of hoisting 10,000 lbs up to 55 feet. Essential for multi-story framing, masonry staging, and large commercial structure erection.',
        specs: [
          { label: 'Max Lift Capacity', value: '10,000 lbs (4,536 kg)' },
          { label: 'Max Lift Height', value: '55 ft (16.76 m)' },
          { label: 'Max Forward Reach', value: '42 ft (12.8 m)' },
          { label: 'Engine', value: 'Cummins QSF3.8L 130 HP Tier 4F' },
          { label: 'Steering Modes', value: '4-Wheel Circle, Crab, 2-Wheel Front' }
        ],
        features: [
          'Hydraulic Outriggers for Maximum Capacity at Full Reach',
          'Hydrostatic 4-Speed Powershift Transmission',
          'Frame Leveling (+/- 10 Degrees)',
          '72" Pallet Forks with Side-Shifting Carriage'
        ]
      },
      {
        id: 'eq_08',
        title: 'Simpson 4400 PSI Commercial Pressure Washer',
        category: 'Cleaning & Prep',
        dailyRate: 65,
        weeklyRate: 290,
        securityDeposit: 120,
        replacementValue: 1800,
        location: 'East Riverside Yard, Austin TX',
        ownerId: 'usr_marcus',
        ownerName: 'Marcus Vance',
        ownerRating: 4.9,
        rating: 4.75,
        reviewCount: 16,
        status: 'available',
        image: 'assets/images/pressure-washer.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'Professional cold water gas pressure washer designed to remove stubborn grime, graffiti, concrete slurry, and paint prep on industrial facilities and masonry structures.',
        specs: [
          { label: 'Max Pressure', value: '4,400 PSI' },
          { label: 'Flow Rate', value: '4.0 GPM' },
          { label: 'Engine', value: 'Honda GX390 Commercial Series' },
          { label: 'Pump', value: 'AAA Industrial Triplex Plunger Pump' },
          { label: 'Hose Length', value: '50 ft Steel-Braided Monster Hose' }
        ],
        features: [
          '5 Quick-Connect Pro Nozzle Tips (0°, 15°, 25°, 40°, Soap)',
          'Welded Steel Frame with 13" Pneumatic Tires',
          'Thermal Relief Valve Pump Protection',
          'Detergent Siphon Hose Included'
        ]
      },
      {
        id: 'eq_09',
        title: 'Bosch SDS-Max Demolition Hammer 15A',
        category: 'Power Tools',
        dailyRate: 55,
        weeklyRate: 250,
        securityDeposit: 100,
        replacementValue: 1200,
        location: 'Downtown Logistics Hub, Austin TX',
        ownerId: 'usr_marcus',
        ownerName: 'Marcus Vance',
        ownerRating: 4.9,
        rating: 4.89,
        reviewCount: 27,
        status: 'available',
        image: 'assets/images/rotary-hammer.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'Delivers 19 ft-lbs of impact energy for concrete breaking, slab trenching, and asphalt chipping. Active vibration control significantly reduces operator fatigue during all-day usage.',
        specs: [
          { label: 'Impact Energy', value: '19.0 Ft-Lbs (Epta Rated)' },
          { label: 'Amperage', value: '15.0 Amps (120V AC)' },
          { label: 'Chuck Type', value: 'SDS-Max with Vario-Lock 12 Positions' },
          { label: 'Impact Rate', value: '900 - 1,890 BPM' },
          { label: 'Weight', value: '25.7 lbs' }
        ],
        features: [
          'Vibration Control in Hammer Mechanism and Handle',
          'Constant Response Circuitry Under Heavy Load',
          'Includes Flat Chisel and Bull Point SDS-Max Bits',
          'Heavy-Duty Rolling Pelican Case Included'
        ]
      },
      {
        id: 'eq_10',
        title: 'Ditch Witch C16X Walk-Behind Trencher',
        category: 'Earthmoving',
        dailyRate: 195,
        weeklyRate: 880,
        securityDeposit: 450,
        replacementValue: 21000,
        location: 'Austin North Depot, Austin TX',
        ownerId: 'usr_marcus',
        ownerName: 'Marcus Vance',
        ownerRating: 4.9,
        rating: 4.86,
        reviewCount: 15,
        status: 'available',
        image: 'assets/images/trencher.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'Compact tracked trencher that easily operates in tight suburban backyards and rough commercial lots for irrigation lines, electrical conduit, and gas installations.',
        specs: [
          { label: 'Digging Depth', value: 'Up to 36 in (915 mm)' },
          { label: 'Trench Width', value: '6 in Standard Cup Chain' },
          { label: 'Engine', value: 'Vanguard 16 HP Commercial Gas' },
          { label: 'Drive', value: 'Full Rubber Tracks with Zero Turn Radius' }
        ],
        features: [
          'Patented CX Track Design for Maximum Traction',
          'Easy-to-use Dual Lever Independent Controls',
          'Heavy-Duty Auger Disperses Soil Cleanly Aside Trench',
          'Fits Through Standard 36" Walk Gates'
        ]
      },
      {
        id: 'eq_11',
        title: 'Generac Mobile LED Towable Light Tower',
        category: 'Power & Lighting',
        dailyRate: 110,
        weeklyRate: 495,
        securityDeposit: 250,
        replacementValue: 14000,
        location: 'South Congress Yard, Austin TX',
        ownerId: 'usr_marcus',
        ownerName: 'Marcus Vance',
        ownerRating: 4.9,
        rating: 4.91,
        reviewCount: 22,
        status: 'available',
        image: 'assets/images/light-tower.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'Ultra-bright energy-efficient LED light tower providing 360-degree illumination for night highway work, construction, concrete pours, and emergency recovery sites.',
        specs: [
          { label: 'Lighting Fixtures', value: '4x 350W High-Efficiency LEDs' },
          { label: 'Mast Extended Height', value: '23 ft Vertical Telescopic' },
          { label: 'Runtime', value: '200+ Hours on Single Diesel Tank' },
          { label: 'Wind Rating', value: 'Stable in up to 65 mph gusts with outriggers' }
        ],
        features: [
          'Instant-On LED (No Metal Halide Warm-Up Time)',
          'Multi-Position Individually Aimable Fixtures',
          'Heavy-Duty Outriggers with Leveling Jacks',
          'Automated Dusk-To-Dawn Photocell Sensor'
        ]
      },
      {
        id: 'eq_12',
        title: 'Vermeer BC1000XL Towable Wood Chipper',
        category: 'Landscaping',
        dailyRate: 290,
        weeklyRate: 1350,
        securityDeposit: 600,
        replacementValue: 58000,
        location: 'North District Depot, Austin TX',
        ownerId: 'usr_marcus',
        ownerName: 'Marcus Vance',
        ownerRating: 4.9,
        rating: 4.95,
        reviewCount: 17,
        status: 'available',
        image: 'assets/images/wood-chipper.svg',
        featured: false,
        requiresOperatorLicense: false,
        description: 'A contractor-grade drum chipper capable of processing branches and heavy limbs up to 12 inches in diameter. Equipped with SmartFeed system to prevent engine stall.',
        specs: [
          { label: 'Chipping Capacity', value: '12 in Diameter Limbs' },
          { label: 'Feed Table Throat', value: '12" x 17" Large Infeed Opening' },
          { label: 'Engine', value: 'Gasoline EFI 89 HP' },
          { label: 'Drum Speed', value: '2,000 RPM Drum Cutter' }
        ],
        features: [
          'SmartFeed Automatic Reverse Feed Sensing',
          'Four-Position Upper Feed Control Bar & Bottom Stop Bar',
          '360-Degree Rotation Discharge Chute',
          'DOT Approved Towing Package with Electric Brakes'
        ]
      }
    ];
  }

  function getInitialBookings() {
    const today = window.RentEquip.Calc.getTodayISO();
    const addDays = (d, n) => window.RentEquip.Calc.addDays(d, n);

    return [
      {
        id: 'bk_101',
        equipmentId: 'eq_01',
        equipmentTitle: 'CAT 308 CR Mini Hydraulic Excavator',
        equipmentImage: 'assets/images/excavator.svg',
        category: 'Earthmoving',
        customerId: 'usr_alex',
        customerName: 'Alex Rivera',
        customerEmail: 'alex.rivera@buildcraft.io',
        customerCompany: 'Rivera Renovations LLC',
        ownerId: 'usr_marcus',
        ownerName: 'Marcus Vance',
        startDate: addDays(today, -2),
        endDate: addDays(today, 1),
        rentalDays: 3,
        dailyRate: 285,
        rentalFee: 855,
        serviceFee: 51.30,
        securityDeposit: 650,
        totalUpfrontPaid: 1556.30,
        status: 'active', // Active ongoing rental
        createdAt: addDays(today, -4) + 'T09:30:00Z',
        approvedAt: addDays(today, -3) + 'T11:00:00Z',
        pickedUpAt: addDays(today, -2) + 'T08:15:00Z',
        actualReturnDate: null,
        rejectionReason: null,
        inspection: null,
        payment: {
          transactionId: 'TX-SIM-882194',
          rentalPaymentStatus: 'paid',
          depositStatus: 'held',
          method: 'Simulated Visa •••• 4242',
          timestamp: addDays(today, -4) + 'T09:30:00Z'
        },
        reviewed: false
      },
      {
        id: 'bk_102',
        equipmentId: 'eq_03',
        equipmentTitle: 'Bobcat S650 Skid Steer Loader',
        equipmentImage: 'assets/images/skid-steer.svg',
        category: 'Earthmoving',
        customerId: 'usr_alex',
        customerName: 'Alex Rivera',
        customerEmail: 'alex.rivera@buildcraft.io',
        customerCompany: 'Rivera Renovations LLC',
        ownerId: 'usr_marcus',
        ownerName: 'Marcus Vance',
        startDate: addDays(today, 3),
        endDate: addDays(today, 6),
        rentalDays: 3,
        dailyRate: 240,
        rentalFee: 720,
        serviceFee: 43.20,
        securityDeposit: 550,
        totalUpfrontPaid: 1313.20,
        status: 'pending', // Pending owner approval
        createdAt: addDays(today, -1) + 'T14:20:00Z',
        approvedAt: null,
        pickedUpAt: null,
        actualReturnDate: null,
        rejectionReason: null,
        inspection: null,
        payment: {
          transactionId: 'TX-SIM-910442',
          rentalPaymentStatus: 'paid',
          depositStatus: 'held',
          method: 'Simulated Mastercard •••• 8812',
          timestamp: addDays(today, -1) + 'T14:20:00Z'
        },
        reviewed: false
      },
      {
        id: 'bk_103',
        equipmentId: 'eq_02',
        equipmentTitle: 'Genie GS-1930 Electric Scissor Lift',
        equipmentImage: 'assets/images/scissor-lift.svg',
        category: 'Aerial & Lifts',
        customerId: 'usr_alex',
        customerName: 'Alex Rivera',
        customerEmail: 'alex.rivera@buildcraft.io',
        customerCompany: 'Rivera Renovations LLC',
        ownerId: 'usr_marcus',
        ownerName: 'Marcus Vance',
        startDate: addDays(today, 2),
        endDate: addDays(today, 4),
        rentalDays: 2,
        dailyRate: 115,
        rentalFee: 230,
        serviceFee: 13.80,
        securityDeposit: 300,
        totalUpfrontPaid: 543.80,
        status: 'approved', // Approved, ready for pickup by customer
        createdAt: addDays(today, -2) + 'T10:15:00Z',
        approvedAt: addDays(today, -1) + 'T16:00:00Z',
        pickedUpAt: null,
        actualReturnDate: null,
        rejectionReason: null,
        inspection: null,
        payment: {
          transactionId: 'TX-SIM-671239',
          rentalPaymentStatus: 'paid',
          depositStatus: 'held',
          method: 'Simulated Amex •••• 1009',
          timestamp: addDays(today, -2) + 'T10:15:00Z'
        },
        reviewed: false
      },
      {
        id: 'bk_104',
        equipmentId: 'eq_05',
        equipmentTitle: 'Multiquip 9 cu ft Concrete Mixer',
        equipmentImage: 'assets/images/concrete-mixer.svg',
        category: 'Concrete & Masonry',
        customerId: 'usr_alex',
        customerName: 'Alex Rivera',
        customerEmail: 'alex.rivera@buildcraft.io',
        customerCompany: 'Rivera Renovations LLC',
        ownerId: 'usr_marcus',
        ownerName: 'Marcus Vance',
        startDate: addDays(today, -5),
        endDate: addDays(today, -2),
        rentalDays: 3,
        dailyRate: 85,
        rentalFee: 255,
        serviceFee: 15.30,
        securityDeposit: 200,
        totalUpfrontPaid: 470.30,
        status: 'returned', // Customer returned it, awaiting owner inspection & deposit release!
        createdAt: addDays(today, -7) + 'T08:00:00Z',
        approvedAt: addDays(today, -6) + 'T12:00:00Z',
        pickedUpAt: addDays(today, -5) + 'T09:00:00Z',
        returnedAt: addDays(today, -2) + 'T17:30:00Z',
        actualReturnDate: addDays(today, -2),
        rejectionReason: null,
        inspection: null,
        payment: {
          transactionId: 'TX-SIM-349812',
          rentalPaymentStatus: 'paid',
          depositStatus: 'held',
          method: 'Simulated Visa •••• 4242',
          timestamp: addDays(today, -7) + 'T08:00:00Z'
        },
        reviewed: false
      },
      {
        id: 'bk_105',
        equipmentId: 'eq_06',
        equipmentTitle: 'Wacker Neuson Forward Plate Compactor 20"',
        equipmentImage: 'assets/images/compactor.svg',
        category: 'Compaction & Paving',
        customerId: 'usr_alex',
        customerName: 'Alex Rivera',
        customerEmail: 'alex.rivera@buildcraft.io',
        customerCompany: 'Rivera Renovations LLC',
        ownerId: 'usr_marcus',
        ownerName: 'Marcus Vance',
        startDate: addDays(today, -10),
        endDate: addDays(today, -7),
        rentalDays: 3,
        dailyRate: 75,
        rentalFee: 225,
        serviceFee: 13.50,
        securityDeposit: 150,
        totalUpfrontPaid: 388.50,
        status: 'completed', // Inspected, deposit fully refunded, review ready
        createdAt: addDays(today, -12) + 'T11:00:00Z',
        approvedAt: addDays(today, -11) + 'T14:00:00Z',
        pickedUpAt: addDays(today, -10) + 'T08:30:00Z',
        returnedAt: addDays(today, -7) + 'T16:00:00Z',
        actualReturnDate: addDays(today, -7),
        rejectionReason: null,
        inspection: {
          condition: 'pristine',
          damageFee: 0,
          damageNotes: 'Clean return, plate and motor in excellent condition. Water tank drained.',
          lateDays: 0,
          latePenaltyFee: 0,
          depositRefunded: 150,
          inspectedBy: 'Marcus Vance',
          inspectedAt: addDays(today, -6) + 'T10:00:00Z'
        },
        payment: {
          transactionId: 'TX-SIM-110293',
          rentalPaymentStatus: 'paid',
          depositStatus: 'fully_refunded',
          method: 'Simulated Visa •••• 4242',
          timestamp: addDays(today, -12) + 'T11:00:00Z'
        },
        reviewed: false // Can be reviewed on customer page!
      },
      {
        id: 'bk_106',
        equipmentId: 'eq_04',
        equipmentTitle: 'Generac 70kVA Sound-Attenuated Diesel Generator',
        equipmentImage: 'assets/images/generator.svg',
        category: 'Power & Lighting',
        customerId: 'usr_alex',
        customerName: 'Alex Rivera',
        customerEmail: 'alex.rivera@buildcraft.io',
        customerCompany: 'Rivera Renovations LLC',
        ownerId: 'usr_marcus',
        ownerName: 'Marcus Vance',
        startDate: addDays(today, -6),
        endDate: addDays(today, -2), // Scheduled end was 2 days ago -> OVERDUE!
        rentalDays: 4,
        dailyRate: 180,
        rentalFee: 720,
        serviceFee: 43.20,
        securityDeposit: 400,
        totalUpfrontPaid: 1163.20,
        status: 'active', // Active but past due date!
        createdAt: addDays(today, -8) + 'T15:00:00Z',
        approvedAt: addDays(today, -7) + 'T18:00:00Z',
        pickedUpAt: addDays(today, -6) + 'T09:00:00Z',
        actualReturnDate: null,
        rejectionReason: null,
        inspection: null,
        payment: {
          transactionId: 'TX-SIM-784019',
          rentalPaymentStatus: 'paid',
          depositStatus: 'held',
          method: 'Simulated Visa •••• 4242',
          timestamp: addDays(today, -8) + 'T15:00:00Z'
        },
        reviewed: false
      }
    ];
  }

  function getInitialReviews() {
    return [
      {
        id: 'rev_01',
        equipmentId: 'eq_01',
        customerId: 'usr_alex',
        customerName: 'Alex Rivera',
        rating: 5,
        comment: 'Machine performed flawlessly for our foundation trenching project. Hydraulic thumb made moving broken concrete chunks a breeze. Marcus delivered it fully fueled and cleaned.',
        date: '2026-08-15',
        verifiedRental: true
      },
      {
        id: 'rev_02',
        equipmentId: 'eq_02',
        customerId: 'usr_alex',
        customerName: 'Alex Rivera',
        rating: 5,
        comment: 'The Genie GS-1930 fit straight through a standard 36-inch service entrance door without any hitch. Battery easily lasted 2 full work shifts on one overnight charge.',
        date: '2026-09-02',
        verifiedRental: true
      },
      {
        id: 'rev_03',
        equipmentId: 'eq_06',
        customerId: 'usr_alex',
        customerName: 'Alex Rivera',
        rating: 5,
        comment: 'Extremely smooth plate compactor. Minimal hand-arm vibration and the asphalt water bar prevented asphalt tack from sticking to the plate.',
        date: '2026-07-28',
        verifiedRental: true
      }
    ];
  }

  function getInitialNotifications() {
    const today = window.RentEquip.Calc.getTodayISO();
    return [
      {
        id: 'notif_01',
        userId: 'usr_alex',
        title: 'Booking Approved',
        message: 'Your rental request for Genie GS-1930 Electric Scissor Lift has been approved. You can pick up the equipment at Downtown Logistics Hub.',
        type: 'booking_approved',
        link: 'customer.html',
        bookingId: 'bk_103',
        read: false,
        createdAt: today + 'T16:01:00Z'
      },
      {
        id: 'notif_02',
        userId: 'usr_marcus',
        title: 'New Booking Request',
        message: 'Alex Rivera requested to rent Bobcat S650 Skid Steer Loader for 3 days. Action required.',
        type: 'booking_request',
        link: 'owner.html',
        bookingId: 'bk_102',
        read: false,
        createdAt: today + 'T14:21:00Z'
      },
      {
        id: 'notif_03',
        userId: 'usr_marcus',
        title: 'Equipment Returned & Awaiting Inspection',
        message: 'Multiquip 9 cu ft Concrete Mixer was returned. Perform inspection to finalize deposit refund.',
        type: 'return_submitted',
        link: 'owner.html',
        bookingId: 'bk_104',
        read: false,
        createdAt: today + 'T17:35:00Z'
      },
      {
        id: 'notif_04',
        userId: 'usr_alex',
        title: 'Overdue Rental Reminder',
        message: 'Notice: Generac 70kVA Diesel Generator was scheduled for return. Please return immediately or contact owner to avoid late penalties.',
        type: 'overdue_alert',
        link: 'customer.html',
        bookingId: 'bk_106',
        read: false,
        createdAt: today + 'T08:00:00Z'
      },
      {
        id: 'notif_05',
        userId: 'usr_marcus',
        title: 'Overdue Rental Alert',
        message: 'Rental #bk_106 (Generac 70kVA Generator) is past scheduled return date. Late penalty accumulation active.',
        type: 'overdue_alert',
        link: 'owner.html',
        bookingId: 'bk_106',
        read: false,
        createdAt: today + 'T08:05:00Z'
      }
    ];
  }

  const Storage = {
    /**
     * Initializes storage with seed data if not previously initialized
     */
    init() {
      if (!localStorage.getItem(STORAGE_KEYS.INIT_FLAG)) {
        this.resetToDefaults();
      }
      this.ensureCurrentUser();
    },

    resetToDefaults() {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(SEED_USERS[0])); // Alex Rivera (Customer) default
      localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(getInitialEquipment()));
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(getInitialBookings()));
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(getInitialReviews()));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(getInitialNotifications()));
      localStorage.setItem(STORAGE_KEYS.INIT_FLAG, 'true');
      this.notifyChange('reset');
    },

    ensureCurrentUser() {
      const cur = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (!cur) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(SEED_USERS[0]));
      }
    },

    // -------------------------------------------------------------
    // USER METHODS
    // -------------------------------------------------------------
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

    // -------------------------------------------------------------
    // EQUIPMENT METHODS
    // -------------------------------------------------------------
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

    // -------------------------------------------------------------
    // BOOKING CONFLICT & DATE AVAILABILITY
    // -------------------------------------------------------------
    /**
     * Checks if a piece of equipment is available for the given dates.
     * Prevents overlapping bookings that are confirmed ('approved' or 'active').
     * If checkPending is true, also treats pending requests as soft holds.
     */
    isEquipmentAvailable(equipmentId, startDate, endDate, excludeBookingId = null) {
      if (!equipmentId || !startDate || !endDate) return false;
      const bookings = this.getBookings();

      // Confirmed active/approved bookings that occupy the equipment
      const blockingBookings = bookings.filter(b => {
        if (b.equipmentId !== equipmentId) return false;
        if (excludeBookingId && b.id === excludeBookingId) return false;
        // Statuses that prevent new rentals on the same dates
        return ['approved', 'active'].includes(b.status);
      });

      for (const b of blockingBookings) {
        if (window.RentEquip.Calc.areDatesOverlapping(startDate, endDate, b.startDate, b.endDate)) {
          return {
            available: false,
            conflictingBooking: b,
            reason: `Conflicted with existing booking (${window.RentEquip.Calc.formatDate(b.startDate)} to ${window.RentEquip.Calc.formatDate(b.endDate)})`
          };
        }
      }

      return { available: true };
    },

    /**
     * Returns all booked date intervals for a piece of equipment
     */
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

    // -------------------------------------------------------------
    // BOOKING CRUD & LIFECYCLE
    // -------------------------------------------------------------
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
          transactionId: 'TX-SIM-' + Math.floor(100000 + Math.random() * 900000),
          rentalPaymentStatus: 'paid',
          depositStatus: 'held',
          method: bookingData.paymentMethod || 'Simulated Card •••• 4242',
          timestamp: new Date().toISOString()
        },
        ...bookingData
      };

      bookings.unshift(newBooking);
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

      // Notify owner about incoming request
      this.addNotification({
        userId: newBooking.ownerId,
        title: 'New Rental Request',
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

    /**
     * Transition booking lifecycle:
     * - 'approved': Owner accepts request
     * - 'rejected': Owner declines with reason
     * - 'active': Customer confirms pickup
     * - 'returned': Customer returns equipment
     * - 'completed': Owner inspects, settles deductions and refunds deposit
     * - 'cancelled': Customer cancels before approval
     */
    transitionBookingStatus(bookingId, newStatus, payload = {}) {
      const booking = this.getBookingById(bookingId);
      if (!booking) return { success: false, error: 'Booking not found' };

      const oldStatus = booking.status;
      const nowISO = new Date().toISOString();
      const todayISO = window.RentEquip.Calc.getTodayISO();

      booking.status = newStatus;

      if (newStatus === 'approved') {
        booking.approvedAt = nowISO;
        // Equipment status becomes reserved or ready
        this.addNotification({
          userId: booking.customerId,
          title: 'Booking Approved!',
          message: `Your booking for ${booking.equipmentTitle} has been approved by ${booking.ownerName}. You can now pick up the equipment.`,
          type: 'booking_approved',
          link: 'customer.html',
          bookingId: booking.id
        });
      } else if (newStatus === 'rejected') {
        booking.rejectionReason = payload.reason || 'Owner unavailable for these dates';
        booking.rejectedAt = nowISO;
        // Refund payment in simulation
        booking.payment.rentalPaymentStatus = 'refunded';
        booking.payment.depositStatus = 'fully_refunded';
        this.addNotification({
          userId: booking.customerId,
          title: 'Booking Request Declined',
          message: `Your request for ${booking.equipmentTitle} was declined: ${booking.rejectionReason}. Full simulated refund issued.`,
          type: 'booking_rejected',
          link: 'customer.html',
          bookingId: booking.id
        });
      } else if (newStatus === 'active') {
        booking.pickedUpAt = nowISO;
        // Update equipment status to rented
        const eq = this.getEquipmentById(booking.equipmentId);
        if (eq) {
          eq.status = 'rented';
          this.saveEquipment(eq);
        }
        this.addNotification({
          userId: booking.ownerId,
          title: 'Equipment Picked Up',
          message: `${booking.customerName} confirmed pickup of ${booking.equipmentTitle}. Rental is now active.`,
          type: 'rental_active',
          link: 'owner.html',
          bookingId: booking.id
        });
      } else if (newStatus === 'returned') {
        booking.returnedAt = nowISO;
        booking.actualReturnDate = payload.actualReturnDate || todayISO;
        this.addNotification({
          userId: booking.ownerId,
          title: 'Equipment Returned - Inspection Needed',
          message: `${booking.equipmentTitle} was marked returned by ${booking.customerName}. Please complete condition inspection.`,
          type: 'return_submitted',
          link: 'owner.html',
          bookingId: booking.id
        });
      } else if (newStatus === 'completed') {
        // payload includes inspection details: condition, damageFee, damageNotes, lateDays, latePenaltyFee, depositRefunded
        booking.completedAt = nowISO;
        booking.inspection = {
          condition: payload.condition || 'good',
          damageFee: Number(payload.damageFee) || 0,
          damageNotes: payload.damageNotes || 'Normal wear and tear',
          lateDays: Number(payload.lateDays) || 0,
          latePenaltyFee: Number(payload.latePenaltyFee) || 0,
          depositRefunded: Number(payload.depositRefunded) || 0,
          inspectedBy: payload.inspectedBy || booking.ownerName,
          inspectedAt: nowISO
        };

        // Update payment deposit status
        if (booking.inspection.depositRefunded >= booking.securityDeposit) {
          booking.payment.depositStatus = 'fully_refunded';
        } else if (booking.inspection.depositRefunded > 0) {
          booking.payment.depositStatus = 'partially_refunded';
        } else {
          booking.payment.depositStatus = 'forfeited';
        }

        // Equipment status returns to available
        const eq = this.getEquipmentById(booking.equipmentId);
        if (eq && eq.status === 'rented') {
          eq.status = 'available';
          this.saveEquipment(eq);
        }

        this.addNotification({
          userId: booking.customerId,
          title: 'Rental Completed & Deposit Settled',
          message: `Inspection finalized for ${booking.equipmentTitle}. Deposit refund: ${window.RentEquip.Calc.formatCurrency(booking.inspection.depositRefunded)}. You can now leave a review!`,
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
          title: 'Booking Cancelled',
          message: `${booking.customerName} cancelled their request for ${booking.equipmentTitle}.`,
          type: 'booking_rejected',
          link: 'owner.html',
          bookingId: booking.id
        });
      }

      this.updateBooking(booking);
      return { success: true, booking };
    },

    // -------------------------------------------------------------
    // REVIEW METHODS
    // -------------------------------------------------------------
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

      // Verify that rental was actually completed
      if (!booking || booking.status !== 'completed') {
        return { success: false, error: 'Reviews are only permitted for completed, inspected rentals.' };
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

      // Mark booking as reviewed
      booking.reviewed = true;
      this.updateBooking(booking);

      // Recalculate equipment rating
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

    // -------------------------------------------------------------
    // NOTIFICATION METHODS
    // -------------------------------------------------------------
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

    // -------------------------------------------------------------
    // EVENT BUS
    // -------------------------------------------------------------
    notifyChange(eventName, detail = {}) {
      window.dispatchEvent(new CustomEvent('rentequip:change', {
        detail: { type: eventName, ...detail }
      }));
    },

    subscribe(callback) {
      window.addEventListener('rentequip:change', callback);
    }
  };

  // Initialize immediately
  Storage.init();

  window.RentEquip = window.RentEquip || {};
  window.RentEquip.Storage = Storage;
})(window);
