#!/usr/bin/env python3
"""
RentEquip - PowerPoint Generator
Creates a professional 6-slide presentation (16:9 widescreen) for Web Programming course.
Student: VENKAT PRASHAD A (Roll: 240701583)
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from PIL import Image, ImageDraw, ImageFont

# Dimensions: 16:9 widescreen (13.333 x 7.5 inches)
SLIDE_WIDTH = Inches(13.333)
SLIDE_HEIGHT = Inches(7.5)

# Color Palette: Campus Academic Theme
COLOR_BG = RGBColor(252, 250, 244)         # Warm notebook cream
COLOR_PRIMARY = RGBColor(27, 67, 50)       # Deep Academic Forest Green
COLOR_PRIMARY_HOVER = RGBColor(8, 47, 30)
COLOR_ORANGE = RGBColor(255, 107, 53)      # Vibrant student orange
COLOR_AMBER = RGBColor(245, 158, 11)       # Warm sunshine yellow
COLOR_BLUE = RGBColor(2, 132, 199)         # Sky blue engineering
COLOR_CARD_BG = RGBColor(255, 255, 255)    # Clean card white
COLOR_TEXT_MAIN = RGBColor(28, 40, 38)     # Deep dark slate ink
COLOR_TEXT_MUTED = RGBColor(75, 93, 86)    # Academic green-slate
COLOR_BORDER = RGBColor(232, 226, 210)     # Lined paper border

os.makedirs('assets/presentation', exist_ok=True)

def generate_slide_illustrations():
    """Generates crisp illustrative cards for each slide using Pillow"""
    # 1. Slide 1 Graphic: Campus gear collage
    im1 = Image.new('RGB', (800, 600), '#f7f4ea')
    d1 = ImageDraw.Draw(im1)
    # Background card accents
    d1.rectangle([(20, 20), (780, 580)], fill='#ffffff', outline='#e8e2d2', width=4)
    d1.rectangle([(60, 60), (360, 260)], fill='#dcfce7', outline='#86efac', width=3)
    d1.text((80, 80), "🔬 Lab Essentials", fill='#166534', font_size=24)
    d1.text((80, 120), "• Lab Coats (₹20/day)\n• Safety Goggles (₹5/day)\n• Multimeters (₹25/day)\n• Arduino Kits (₹40/day)", fill='#14532d', font_size=18)

    d1.rectangle([(400, 60), (740, 260)], fill='#fef3c7', outline='#fde047', width=3)
    d1.text((420, 80), "📐 Engineering Drawing", fill='#92400e', font_size=24)
    d1.text((420, 120), "• Drawing Boards (₹30/day)\n• Mini-Drafters (₹25/day)\n• French Curves (₹8/day)\n• Technical Pens (₹20/day)", fill='#78350f', font_size=18)

    d1.rectangle([(60, 300), (360, 540)], fill='#e0f2fe', outline='#7dd3fc', width=3)
    d1.text((80, 320), "📖 Academic Resources", fill='#075985', font_size=24)
    d1.text((80, 360), "• Casio fx-991EX (₹20/day)\n• TI-84 Plus (₹45/day)\n• BS Grewal Maths (₹10/day)\n• GATE Prep (₹12/day)", fill='#0c4a6e', font_size=18)

    d1.rectangle([(400, 300), (740, 540)], fill='#ede9fe', outline='#c4b5fd', width=3)
    d1.text((420, 320), "💻 Electronics & Tech", fill='#5b21b6', font_size=24)
    d1.text((420, 360), "• Coding Laptops (₹250/day)\n• HD Webcams (₹35/day)\n• 1080p Projectors (₹150/day)\n• Power Banks (₹25/day)", fill='#4c1d95', font_size=18)
    im1.save('assets/presentation/slide1_gear.png')

    # 2. Slide 2 Graphic: Student problem vs solution infographic
    im2 = Image.new('RGB', (800, 500), '#ffffff')
    d2 = ImageDraw.Draw(im2)
    # Left box: Problem
    d2.rounded_rectangle([(30, 40), (370, 460)], radius=16, fill='#fee2e2', outline='#fca5a5', width=3)
    d2.text((60, 70), "THE CAMPUS DILEMMA", fill='#991b1b', font_size=24)
    d2.text((60, 120), "❌ Expensive single-use items\n   (Drafters ₹600+, Calculators ₹1500+)\n❌ Lab entry denied without coat/goggles\n❌ High cost for semester exams\n❌ Wasteful unused clutter in hostels\n❌ Lack of trusted peer sharing", fill='#7f1d1d', font_size=18)

    # Right box: RentEquip Solution
    d2.rounded_rectangle([(430, 40), (770, 460)], radius=16, fill='#dcfce7', outline='#86efac', width=3)
    d2.text((460, 70), "RENTEQUIP SOLUTION", fill='#166534', font_size=24)
    d2.text((460, 120), "✓ Instant same-day campus pickup\n✓ Student rates from ₹2 to ₹40/day\n✓ 100% refundable escrow deposits\n✓ 52+ verified academic items\n✓ Direct peer & club lending\n✓ Zero paper bureaucracy", fill='#14532d', font_size=18)
    im2.save('assets/presentation/slide2_solution.png')

    # 3. Slide 3 Graphic: Category matrix
    im3 = Image.new('RGB', (800, 500), '#fdfbf7')
    d3 = ImageDraw.Draw(im3)
    cats = [
        ("Stationery", "Pens, Geometry Sets, Scales", "#fef3c7", "#92400e"),
        ("Engg Drawing", "Boards, Drafters, T-Squares", "#e0f2fe", "#0369a1"),
        ("Lab Essentials", "Lab Coats, Multimeters, Arduino", "#dcfce7", "#15803d"),
        ("Academic Books", "Calculators, GATE Guides", "#fce7f3", "#9d174d"),
        ("Electronics", "Laptops, Webcams, USB Hubs", "#ede9fe", "#6d28d9"),
        ("Sports & Recreation", "Badminton, Football, Cricket", "#ccfbf1", "#0f766e"),
    ]
    for i, (name, desc, bg, fg) in enumerate(cats):
        x = 40 + (i % 2) * 380
        y = 40 + (i // 2) * 140
        d3.rounded_rectangle([(x, y), (x + 350, y + 115)], radius=12, fill=bg, outline=fg, width=2)
        d3.text((x + 20, y + 25), name, fill=fg, font_size=22)
        d3.text((x + 20, y + 65), desc, fill='#334155', font_size=16)
    im3.save('assets/presentation/slide3_categories.png')

    # 4. Slide 4 Graphic: Architecture diagram
    im4 = Image.new('RGB', (800, 500), '#f8fafc')
    d4 = ImageDraw.Draw(im4)
    layers = [
        ("Client UI Layer", "Native HTML5, Responsive Modern CSS3, Floating Animations", "#1b4332", "#ffffff"),
        ("Business Logic Layer", "Pricing Engine (₹), Date Conflict Detection, Inspection Settlement", "#ff6b35", "#ffffff"),
        ("Persistence Layer", "Browser LocalStorage (52+ Equipment, Bookings, Users, Reviews)", "#0284c7", "#ffffff"),
        ("Deployment Pipeline", "GitHub Actions (.github/workflows/deploy.yml) -> GitHub Pages", "#7c3aed", "#ffffff"),
    ]
    for i, (title, sub, bg, fg) in enumerate(layers):
        y = 40 + i * 105
        d4.rounded_rectangle([(40, y), (760, y + 80)], radius=12, fill=bg, outline='#334155', width=2)
        d4.text((70, y + 16), title, fill=fg, font_size=22)
        d4.text((70, y + 46), sub, fill='#f1f5f9', font_size=16)
    im4.save('assets/presentation/slide4_architecture.png')

    # 5. Slide 5 Graphic: State machine lifecycle
    im5 = Image.new('RGB', (800, 480), '#ffffff')
    d5 = ImageDraw.Draw(im5)
    steps = [
        ("1. REQUEST", "Student requests item on date range", "#fef3c7", "#b45309"),
        ("2. APPROVE", "Host/senior approves availability", "#e0f2fe", "#0369a1"),
        ("3. ACTIVE", "Pickup confirmed at campus spot", "#dcfce7", "#15803d"),
        ("4. RETURN", "Item handed back at campus desk", "#ede9fe", "#6d28d9"),
        ("5. SETTLE", "Condition checked, deposit refunded", "#d1fae5", "#065f46"),
    ]
    for i, (step, desc, bg, fg) in enumerate(steps):
        y = 35 + i * 85
        d5.rounded_rectangle([(50, y), (750, y + 65)], radius=10, fill=bg, outline=fg, width=2)
        d5.text((75, y + 12), step, fill=fg, font_size=20)
        d5.text((260, y + 20), desc, fill='#334155', font_size=16)
    im5.save('assets/presentation/slide5_lifecycle.png')

    # 6. Slide 6 Graphic: Testing & results summary
    im6 = Image.new('RGB', (800, 480), '#ffffff')
    d6 = ImageDraw.Draw(im6)
    cards = [
        ("176 / 176 Tests Passed", "Full automated headless verification suite", "#dcfce7", "#166534"),
        ("100% Local Storage", "Zero server backend, zero database maintenance", "#fef3c7", "#92400e"),
        ("Indian Rupees (₹)", "Student-friendly pricing starting from ₹2/day", "#e0f2fe", "#075985"),
        ("Zero Dependencies", "Pure vanilla HTML5, CSS3, ES6 JavaScript", "#ede9fe", "#5b21b6"),
    ]
    for i, (title, sub, bg, fg) in enumerate(cards):
        x = 40 + (i % 2) * 380
        y = 50 + (i // 2) * 200
        d6.rounded_rectangle([(x, y), (x + 350, y + 160)], radius=14, fill=bg, outline=fg, width=2)
        d6.text((x + 25, y + 35), title, fill=fg, font_size=22)
        d6.text((x + 25, y + 80), sub, fill='#475569', font_size=16)
    im6.save('assets/presentation/slide6_summary.png')

def create_presentation():
    generate_slide_illustrations()
    prs = Presentation()
    prs.slide_width = SLIDE_WIDTH
    prs.slide_height = SLIDE_HEIGHT
    blank_layout = prs.slide_layouts[6]

    # Helper function to add a header bar
    def add_slide_header(slide, title_text, category_text="WEB PROGRAMMING PROJECT"):
        # Header banner shape
        header_shape = slide.shapes.add_shape(
            MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), SLIDE_WIDTH, Inches(1.2)
        )
        header_shape.fill.solid()
        header_shape.fill.fore_color.rgb = COLOR_PRIMARY
        header_shape.line.fill.background()

        # Accent line below header
        accent_line = slide.shapes.add_shape(
            MSO_SHAPE.RECTANGLE, Inches(0), Inches(1.2), SLIDE_WIDTH, Inches(0.08)
        )
        accent_line.fill.solid()
        accent_line.fill.fore_color.rgb = COLOR_ORANGE
        accent_line.line.fill.background()

        # Category chip
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.18), Inches(5), Inches(0.3))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = f"🎓 {category_text.upper()}"
        p_cat.font.size = Pt(11)
        p_cat.font.bold = True
        p_cat.font.color.rgb = COLOR_AMBER

        # Main Slide Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.45), Inches(11), Inches(0.6))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(26)
        p_title.font.bold = True
        p_title.font.color.rgb = RGBColor(255, 255, 255)

    # -------------------------------------------------------------
    # SLIDE 1: Title & Student Details
    # -------------------------------------------------------------
    slide1 = prs.slides.add_slide(blank_layout)
    
    # Left Hero Banner
    hero_left = slide1.shapes.add_shape(
        MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(6.8), SLIDE_HEIGHT
    )
    hero_left.fill.solid()
    hero_left.fill.fore_color.rgb = COLOR_PRIMARY
    hero_left.line.fill.background()

    # Right Background
    hero_right = slide1.shapes.add_shape(
        MSO_SHAPE.RECTANGLE, Inches(6.8), Inches(0), Inches(6.533), SLIDE_HEIGHT
    )
    hero_right.fill.solid()
    hero_right.fill.fore_color.rgb = COLOR_BG
    hero_right.line.fill.background()

    # Course tag
    tag_box = slide1.shapes.add_textbox(Inches(0.8), Inches(1.0), Inches(5), Inches(0.4))
    tf_tag = tag_box.text_frame
    p_tag = tf_tag.paragraphs[0]
    p_tag.text = "COURSE PROJECT PRESENTATION"
    p_tag.font.size = Pt(12)
    p_tag.font.bold = True
    p_tag.font.color.rgb = COLOR_AMBER

    # Project Title
    pname_box = slide1.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(5.5), Inches(1.2))
    tf_pname = pname_box.text_frame
    p_pname = tf_pname.paragraphs[0]
    p_pname.text = "RentEquip"
    p_pname.font.size = Pt(54)
    p_pname.font.bold = True
    p_pname.font.color.rgb = RGBColor(255, 255, 255)

    # Project Subtitle
    sub_box = slide1.shapes.add_textbox(Inches(0.8), Inches(2.7), Inches(5.5), Inches(1.0))
    tf_sub = sub_box.text_frame
    tf_sub.word_wrap = True
    p_sub = tf_sub.paragraphs[0]
    p_sub.text = "College Campus Equipment & Study Resource Rental Marketplace"
    p_sub.font.size = Pt(18)
    p_sub.font.color.rgb = RGBColor(209, 220, 215)

    # Divider bar
    div = slide1.shapes.add_shape(
        MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(3.8), Inches(4.5), Inches(0.06)
    )
    div.fill.solid()
    div.fill.fore_color.rgb = COLOR_ORANGE
    div.line.fill.background()

    # Student & Course Credentials Card (Requested in prompt)
    cred_box = slide1.shapes.add_textbox(Inches(0.8), Inches(4.1), Inches(5.5), Inches(2.8))
    tf_cred = cred_box.text_frame
    tf_cred.word_wrap = True

    p1 = tf_cred.paragraphs[0]
    p1.text = "Course: Web Programming"
    p1.font.size = Pt(16)
    p1.font.bold = True
    p1.font.color.rgb = RGBColor(254, 243, 199)

    p2 = tf_cred.add_paragraph()
    p2.text = "Student Name: VENKAT PRASHAD A"
    p2.font.size = Pt(20)
    p2.font.bold = True
    p2.font.color.rgb = RGBColor(255, 255, 255)

    p3 = tf_cred.add_paragraph()
    p3.text = "Roll Number: 240701583"
    p3.font.size = Pt(18)
    p3.font.bold = True
    p3.font.color.rgb = COLOR_AMBER

    p4 = tf_cred.add_paragraph()
    p4.text = "Department of Computer Science & Engineering"
    p4.font.size = Pt(14)
    p4.font.color.rgb = RGBColor(163, 184, 176)

    # Right side graphic image
    slide1.shapes.add_picture('assets/presentation/slide1_gear.png', Inches(7.2), Inches(1.0), Inches(5.5), Inches(5.5))

    # -------------------------------------------------------------
    # SLIDE 2: Project Motivation & Problem Statement
    # -------------------------------------------------------------
    slide2 = prs.slides.add_slide(blank_layout)
    add_slide_header(slide2, "Problem Statement & Project Motivation", "The Campus Challenge")

    # Left content box
    left_box2 = slide2.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(6.0), Inches(5.2))
    tf2 = left_box2.text_frame
    tf2.word_wrap = True

    p = tf2.paragraphs[0]
    p.text = "Why Do Students Need RentEquip?"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY

    bullets2 = [
        ("Sudden Exam & Lab Emergencies: ", "Students frequently forget mandatory items (white lab coats, safety goggles, scientific calculators, or drafters) right before lab sessions or semester finals."),
        ("High Cost for Temporary Usage: ", "Buying a ₹1,500+ Casio fx-991EX calculator, ₹800 drawing board, or ₹600 mini-drafter for a single semester course creates unnecessary financial burden."),
        ("Hostel Clutter & Waste: ", "Graduating seniors and higher-semester students have perfectly functional tools gathering dust in hostel rooms with no easy peer-sharing channel."),
        ("Campus Circular Economy: ", "RentEquip bridges students needing temporary gear with peers willing to lend, creating affordable access starting from just ₹2/day.")
    ]
    for b_title, b_desc in bullets2:
        p_b = tf2.add_paragraph()
        p_b.space_before = Pt(10)
        run_title = p_b.add_run()
        run_title.text = b_title
        run_title.font.bold = True
        run_title.font.size = Pt(14)
        run_title.font.color.rgb = COLOR_TEXT_MAIN
        run_desc = p_b.add_run()
        run_desc.text = b_desc
        run_desc.font.size = Pt(13)
        run_desc.font.color.rgb = COLOR_TEXT_MUTED

    # Right Illustration Image
    slide2.shapes.add_picture('assets/presentation/slide2_solution.png', Inches(7.1), Inches(1.6), Inches(5.5), Inches(5.2))

    # -------------------------------------------------------------
    # SLIDE 3: Key Features & Campus Inventory
    # -------------------------------------------------------------
    slide3 = prs.slides.add_slide(blank_layout)
    add_slide_header(slide3, "Core Features & 50+ Campus Inventory", "Campus-Centric Features")

    # Left content box
    left_box3 = slide3.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(6.0), Inches(5.2))
    tf3 = left_box3.text_frame
    tf3.word_wrap = True

    p = tf3.paragraphs[0]
    p.text = "Built for Daily Student Life"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY

    bullets3 = [
        ("10 Comprehensive Categories: ", "Stationery, Engineering Drawing, Lab Essentials, Academic Resources, Electronics, Art & Design, Presentations, Sports, Events, and Everyday Student Essentials."),
        ("Strategic Campus Pickup Points: ", "Collect items within minutes at Central Library Helpdesk, SAC Room 102, Mechanical Workshop, Science Labs, or Hostel Common Rooms."),
        ("Real-time Cost & Deposit Engine: ", "Dynamic quote calculator displaying daily rate in ₹, 5% student pool fee, and 100% refundable escrow security deposit."),
        ("Condition Transparency: ", "Items labeled by condition (Pristine, Gently Used, Working) with verified student reviews to ensure reliability during critical exams.")
    ]
    for b_title, b_desc in bullets3:
        p_b = tf3.add_paragraph()
        p_b.space_before = Pt(10)
        run_title = p_b.add_run()
        run_title.text = b_title
        run_title.font.bold = True
        run_title.font.size = Pt(14)
        run_title.font.color.rgb = COLOR_TEXT_MAIN
        run_desc = p_b.add_run()
        run_desc.text = b_desc
        run_desc.font.size = Pt(13)
        run_desc.font.color.rgb = COLOR_TEXT_MUTED

    # Right Image
    slide3.shapes.add_picture('assets/presentation/slide3_categories.png', Inches(7.1), Inches(1.6), Inches(5.5), Inches(5.2))

    # -------------------------------------------------------------
    # SLIDE 4: Technical Architecture & System Implementation
    # -------------------------------------------------------------
    slide4 = prs.slides.add_slide(blank_layout)
    add_slide_header(slide4, "Technical Architecture & Zero-Dependency Stack", "Engineering Details")

    # Left content box
    left_box4 = slide4.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(6.0), Inches(5.2))
    tf4 = left_box4.text_frame
    tf4.word_wrap = True

    p = tf4.paragraphs[0]
    p.text = "Pure Vanilla Web Implementation"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY

    bullets4 = [
        ("Zero Frameworks & Libraries: ", "Engineered exclusively with semantic HTML5, modern CSS3 (Flexbox/Grid, tokens), and vanilla ES6+ JavaScript. No npm, React, Vue, or build tools."),
        ("LocalStorage Persistence Engine: ", "Complete state repository storing users, 52+ equipment items, bookings, reviews, and notifications in client-side localStorage."),
        ("Mathematical Conflict Engine: ", "Deterministic date interval overlap algorithm (startA <= endB && startB <= endA) preventing double bookings on confirmed equipment."),
        ("GitHub Actions CI/CD: ", "Automated static deployment workflow (.github/workflows/deploy.yml) with subpath-safe relative paths for instant live hosting.")
    ]
    for b_title, b_desc in bullets4:
        p_b = tf4.add_paragraph()
        p_b.space_before = Pt(10)
        run_title = p_b.add_run()
        run_title.text = b_title
        run_title.font.bold = True
        run_title.font.size = Pt(14)
        run_title.font.color.rgb = COLOR_TEXT_MAIN
        run_desc = p_b.add_run()
        run_desc.text = b_desc
        run_desc.font.size = Pt(13)
        run_desc.font.color.rgb = COLOR_TEXT_MUTED

    # Right Image
    slide4.shapes.add_picture('assets/presentation/slide4_architecture.png', Inches(7.1), Inches(1.6), Inches(5.5), Inches(5.2))

    # -------------------------------------------------------------
    # SLIDE 5: Rental Lifecycle & Role Workflows
    # -------------------------------------------------------------
    slide5 = prs.slides.add_slide(blank_layout)
    add_slide_header(slide5, "Rental Lifecycle & Multi-Role Ecosystem", "Workflow & State Machine")

    # Left content box
    left_box5 = slide5.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(6.0), Inches(5.2))
    tf5 = left_box5.text_frame
    tf5.word_wrap = True

    p = tf5.paragraphs[0]
    p.text = "End-to-End State Machine"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY

    bullets5 = [
        ("Simulated Multi-Role Personas: ", "Instant navbar switcher between Aarav Sharma (Student Renter), Priya Patel (Student Lender/Host), and SAC Council (Admin)."),
        ("Borrow Lifecycle Stages: ", "Pending Request -> Host Approval -> Handover/Active -> Return Trigger -> Condition Check -> Deposit Settlement -> Verified Review."),
        ("Deposit Escrow & Late Fees: ", "Automatic late penalty calculation (1.25x daily rate) and wear deductions, ensuring fair protection for student hosts."),
        ("Verified Peer Feedback: ", "Strict verification rule: reviews permitted exclusively after an item return has been inspected and completed.")
    ]
    for b_title, b_desc in bullets5:
        p_b = tf5.add_paragraph()
        p_b.space_before = Pt(10)
        run_title = p_b.add_run()
        run_title.text = b_title
        run_title.font.bold = True
        run_title.font.size = Pt(14)
        run_title.font.color.rgb = COLOR_TEXT_MAIN
        run_desc = p_b.add_run()
        run_desc.text = b_desc
        run_desc.font.size = Pt(13)
        run_desc.font.color.rgb = COLOR_TEXT_MUTED

    # Right Image
    slide5.shapes.add_picture('assets/presentation/slide5_lifecycle.png', Inches(7.1), Inches(1.6), Inches(5.5), Inches(5.2))

    # -------------------------------------------------------------
    # SLIDE 6: Testing, Results & Conclusion
    # -------------------------------------------------------------
    slide6 = prs.slides.add_slide(blank_layout)
    add_slide_header(slide6, "Testing, Verification & Conclusion", "Results & Takeaways")

    # Left content box
    left_box6 = slide6.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(6.0), Inches(5.2))
    tf6 = left_box6.text_frame
    tf6.word_wrap = True

    p = tf6.paragraphs[0]
    p.text = "Validated Results & Deliverables"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY

    bullets6 = [
        ("176/176 Test Checks Passed: ", "Rigorous automated test suite covering financial calculations in ₹, date collision prevention, and DOM binding contracts across all 6 pages."),
        ("Responsive Campus Design: ", "Student-friendly notebook cream aesthetic with floating academic doodles, tactile hover cards, status badges, and mobile drawer navigation."),
        ("Live GitHub Pages Deployment: ", "Automated CI/CD pipeline deploys static files directly to production upon push to main with subpath compatibility."),
        ("Summary: ", "RentEquip demonstrates that modern, rich web applications can be constructed with zero bloated dependencies, providing real-world utility for university campuses.")
    ]
    for b_title, b_desc in bullets6:
        p_b = tf6.add_paragraph()
        p_b.space_before = Pt(10)
        run_title = p_b.add_run()
        run_title.text = b_title
        run_title.font.bold = True
        run_title.font.size = Pt(14)
        run_title.font.color.rgb = COLOR_TEXT_MAIN
        run_desc = p_b.add_run()
        run_desc.text = b_desc
        run_desc.font.size = Pt(13)
        run_desc.font.color.rgb = COLOR_TEXT_MUTED

    # Right Image
    slide6.shapes.add_picture('assets/presentation/slide6_summary.png', Inches(7.1), Inches(1.6), Inches(5.5), Inches(5.2))

    # Save presentation file
    output_path = 'RentEquip_Presentation.pptx'
    prs.save(output_path)
    print(f"Presentation successfully saved to {output_path}")

if __name__ == '__main__':
    create_presentation()
