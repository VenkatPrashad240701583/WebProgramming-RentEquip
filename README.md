# RentEquip — College Campus Equipment & Resource Marketplace

RentEquip is a college campus equipment and study resource sharing marketplace built exclusively with **native HTML5, modern CSS3, and vanilla JavaScript (ES6+)**.

It allows engineering, science, arts, and college students to borrow essentials—such as scientific calculators, lab coats, mini-drafters, drawing boards, Arduino prototyping kits, textbooks, and sports equipment—directly from peers, senior mentors, and student clubs with student-friendly daily pricing in **Indian Rupees (₹)**.

All industrial machinery and construction equipment have been removed.

---

## 🎒 Academic Categories & 50+ Campus Inventory

The marketplace is pre-seeded with 52 campus items across 10 academic and student categories:

1. **Stationery & Writing**: Pilot V7 gel pens (₹2/day), Camlin geometry box (₹10/day), heavy-duty brass drawing compass (₹15/day), 30cm triangular drafting scale (₹8/day), whiteboard markers, mechanical pencils.
2. **Engineering Drawing**: Imperial pine-wood drawing board with clips (₹30/day), Omega mini-drafter (₹25/day), French curves set (₹8/day), Rotring technical pens (₹20/day), 80cm acrylic T-square.
3. **Lab Essentials**: 100% cotton student lab coat (₹20/day), anti-fog chemical splash goggles (₹5/day), Mastech auto-ranging digital multimeter (₹25/day), Arduino Uno starter kit (₹40/day), ESP32 Wi-Fi/BLE dev board (₹30/day), 60W temp-controlled soldering station (₹25/day), breadboard jumper wires.
4. **Academic Resources**: Casio fx-991EX ClassWiz scientific calculator (₹20/day), TI-84 Plus graphing calculator (₹45/day), B.S. Grewal Higher Engineering Mathematics (₹10/day), CLRS Algorithms (₹15/day), GATE 2026 CSE solved papers.
5. **Electronics & Computing**: Dell Latitude coding laptop (₹250/day), Logitech C920 1080p webcam (₹35/day), USB-C 7-in-1 multi-hub (₹15/day), 1TB portable hard drive (₹20/day), mechanical keyboard, Raspberry Pi 4 Model B (₹60/day).
6. **Fine Arts & Design**: Acrylic painting kit with tabletop easel (₹35/day), A3 160 GSM spiral sketchbook (₹15/day), A2 self-healing cutting mat with precision knife (₹15/day), TouchFive 48-color dual brush markers (₹30/day), stretched canvas boards.
7. **Projects & Presentations**: BenQ 1080p classroom presentation projector (₹150/day), wireless laser clicker (₹15/day), Digitek 65" camera tripod (₹25/day), 5-meter spike guard extension board (₹15/day).
8. **Sports & Recreation**: Yonex Muscle Power badminton rackets pair (₹20/day), Nivia Storm match football (₹15/day), SS Kashmir willow cricket kit (₹40/day), wooden tournament chess set (₹10/day), Settlers of Catan board game (₹25/day).
9. **Campus Events & Culturals**: JBL PartyBox 100W portable Bluetooth speaker (₹120/day), dual wireless collar & handheld mic system (₹50/day), RGB LED stage focus par cans (₹60/day).
10. **Everyday Student Essentials**: Windproof campus storm umbrella (₹10/day), Mi 20,000mAh fast-charging power bank (₹25/day), hardened steel bicycle combination U-lock (₹10/day), waterproof raincoat set (₹15/day), daypack backpack.

---

## 🏫 Campus Locations & Pickup Desks

- **Central Library** — 1st Floor Helpdesk
- **Mechanical Engineering Workshop** — Block B
- **Electronics & VLSI Lab** — Block C, 2nd Floor
- **Science Labs Corridor** — Block C, Chemistry & Physics Labs
- **Kaveri Boys Hostel** — Common Room
- **Saraswati Girls Hostel** — Wing A
- **Student Activity Center (SAC)** — Room 102
- **Tech Hub & Makerspace** — Innovation Wing
- **Fine Arts & Architecture Studio** — Block E
- **Campus Canteen & Student Mart** — Central Square
- **Computer Center** — Ground Floor

---

## 👥 Student Demo Roles & Perspectives

Use the perspective dropdown in the top navigation bar to switch between campus roles:

1. **Aarav Sharma — Student Renter (`usr_aarav`)**
   - 2nd Year B.Tech CSE, Room 314, Kaveri Hostel Block.
   - Pre-seeded with an active exam rental (Casio fx-991EX calculator), a pending Arduino request, an approved mini-drafter ready for pickup, and an overdue multimeter alert.
2. **Priya Patel — Student Lender / Senior (`usr_priya`)**
   - Final Year Mechanical Engineering & Robotics Club Lead, Saraswati Hostel.
   - Manages personal and club equipment listings, reviews incoming borrow requests, and conducts return inspections with deposit refunds.
3. **Student Affairs Council (SAC) — Campus Admin (`usr_council`)**
   - Central Equipment Library & Student Council Desk.
   - Oversees campus sharing analytics, student registry, catalog audits, and backup tools.

---

## 🧮 Student-Friendly Rental Rules

- **Currency**: Indian Rupees (₹).
- **Duration**: Same-day urgent borrow (exam or lab session) counts as 1 day minimum.
- **Community Pool Fee**: 5% maintenance fee (max ₹15) for platform upkeep.
- **Refundable Escrow Deposit**: Held safely in simulated escrow and refunded upon return check.
- **Date Overlap Prevention**: Confirmed borrows (`approved` or `active`) block the equipment calendar to prevent double bookings.
- **Overdue Penalty**: Student rate of 1.25x daily rate per overdue day.
- **Deposit Refund**:
  $$\text{Refund} = \max(0, \text{Deposit} - \text{Late Penalty} - \text{Damage Deductions})$$

---

## 🚀 GitHub Pages Deployment

The automated deployment pipeline `.github/workflows/deploy.yml` deploys static files directly to GitHub Pages on every push to `main`.

### Repository Configuration
1. Repository: `https://github.com/VenkatPrashad240701583/WebProgramming-RentEquip`
2. Under **Settings** &rarr; **Pages**, set **Source** to **GitHub Actions**.
3. Live site URL: `https://venkatprashad240701583.github.io/WebProgramming-RentEquip/`

---

## ⚠️ Simulation Disclaimer

All peer UPI transactions, security deposits, and student profiles are simulated in `localStorage`. Use the **Reset Campus Data** button in the footer or SAC Admin portal to restore the 52 default campus listings at any time.
