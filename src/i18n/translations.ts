export type Language = 'en' | 'kn' | 'hi';

export interface Translations {
  // Header & Navigation
  govHeader: string;
  smartwasteTitle: string;
  smartwasteSubtitle: string;
  karnatakaInitiativeBadge: string;
  home: string;
  wasteSegregation: string;
  awareness: string;
  reportWaste: string;
  requestPickup: string;
  trackComplaint: string;
  collectionMap: string;
  aboutUs: string;
  helpSupport: string;
  login: string;
  register: string;
  logout: string;
  myDashboard: string;
  roleCitizen: string;
  roleStaff: string;
  roleAdmin: string;
  notificationsTitle: string;
  markAllAsRead: string;
  noNotifications: string;
  emergencyHelplineLabel: string;

  // Hero Section
  heroHeading: string;
  heroSubHeading: string;
  heroDescription: string;
  btnReportWaste: string;
  btnLearnSegregation: string;
  btnTrackComplaint: string;

  // Highlights & Stats
  statComplaints: string;
  statResolved: string;
  statWasteRecycled: string;
  statActiveWards: string;

  // Homepage Source Segregation Standard
  secSegregationBadge: string;
  secSegregationTitle: string;
  secSegregationDesc: string;
  greenBinTitle: string;
  greenBinTime: string;
  greenBinName: string;
  greenBinDesc: string;
  greenBinDo: string;
  greenBinDont: string;
  blueBinTitle: string;
  blueBinTime: string;
  blueBinName: string;
  blueBinDesc: string;
  blueBinDo: string;
  blueBinDont: string;
  yellowBinTitle: string;
  yellowBinTime: string;
  yellowBinName: string;
  yellowBinDesc: string;
  yellowBinDo: string;
  yellowBinDont: string;
  redBinTitle: string;
  redBinTime: string;
  redBinName: string;
  redBinDesc: string;
  redBinDo: string;
  redBinDont: string;
  exploreCategoriesBtn: string;

  // How It Works
  howItWorksBadge: string;
  howItWorksTitle: string;
  howItWorksSubtitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;

  // Quick Municipal Services (Homepage Cards)
  servicesBadge: string;
  servicesTitle: string;
  servicesSubtitle: string;
  cardReportTitle: string;
  cardReportDesc: string;
  cardReportAction: string;
  cardPickupTitle: string;
  cardPickupDesc: string;
  cardPickupAction: string;
  cardTrackTitle: string;
  cardTrackDesc: string;
  cardTrackAction: string;
  cardMapTitle: string;
  cardMapDesc: string;
  cardMapAction: string;

  // Quiz & Game Banner
  quizBannerBadge: string;
  quizTitle: string;
  quizSubtitle: string;
  startQuiz: string;
  sortingGameBtn: string;
  gameTitle: string;
  gameSubtitle: string;

  // FAQs Section
  faqBadge: string;
  faqTitle: string;
  faqSubtitle: string;
  faq1Q: string;
  faq1A: string;
  faq2Q: string;
  faq2A: string;
  faq3Q: string;
  faq3A: string;
  faq4Q: string;
  faq4A: string;
  faq5Q: string;
  faq5A: string;

  // Segregation Guide Page
  segGuideBadge: string;
  segGuideTitle: string;
  segGuideSubtitle: string;
  tabGuide: string;
  tabGame: string;
  tabCompost: string;
  searchCategoryPlaceholder: string;
  filterAll: string;
  filterWet: string;
  filterDry: string;
  filterHazardous: string;
  filterSpecial: string;
  labelStandardRule: string;
  labelCommonExamples: string;
  labelProtocol: string;
  labelDoNotMix: string;

  // Reporting Form (8 Steps)
  reportPageBadge: string;
  reportPageTitle: string;
  reportPageSubtitle: string;
  stepIndicator: string;
  stepCategory: string;
  stepQuantity: string;
  stepLocation: string;
  stepMedia: string;
  stepDescription: string;
  stepContact: string;
  stepReview: string;
  stepSubmit: string;
  btnNext: string;
  btnBack: string;
  btnSubmitComplaint: string;
  submitSuccess: string;
  complaintIdLabel: string;
  detectGpsBtn: string;
  gpsDetecting: string;
  gpsDetectedSuccess: string;
  uploadPhotosTitle: string;
  uploadPhotosDesc: string;
  descPlaceholder: string;
  mobilePlaceholder: string;
  successTitle: string;
  successDesc: string;
  trackNowBtn: string;
  fileComplaintAnotherBtn: string;

  // Pickup Request Page
  pickupTitle: string;
  pickupSubtitle: string;
  wasteTypeLabel: string;
  estimatedQtyLabel: string;
  preferredDateLabel: string;
  preferredSlotLabel: string;
  addressLabel: string;
  instructionsLabel: string;
  btnBookPickup: string;
  slotMorning: string;
  slotAfternoon: string;
  slotEvening: string;
  pickupSuccessTitle: string;
  pickupSuccessDesc: string;

  // Tracking Page
  trackingTitle: string;
  trackingSubtitle: string;
  enterComplaintId: string;
  trackBtn: string;
  statusLabel: string;
  assignedStaffLabel: string;
  timelineLabel: string;
  rateService: string;
  ratingPrompt: string;
  feedbackPlaceholder: string;
  btnSubmitFeedback: string;
  feedbackSubmittedSuccess: string;
  quickPickTitle: string;

  // Dashboards Common
  welcomeBack: string;
  ecoPointsLabel: string;
  badgesEarned: string;
  recentComplaints: string;
  activePickupsTitle: string;
  staffTasksTitle: string;
  adminConsoleTitle: string;
  viewAll: string;
  noComplaintsFound: string;
  noPickupsFound: string;
  colId: string;
  colCategory: string;
  colLocation: string;
  colDate: string;
  colStatus: string;
  colAction: string;

  // Staff Dashboard
  staffBadge: string;
  staffAssignedWards: string;
  filterAllTasks: string;
  filterPending: string;
  filterInProgress: string;
  filterResolved: string;
  btnUpdateStatus: string;
  modalUpdateTitle: string;
  lblActualWeight: string;
  lblUploadProof: string;
  btnConfirmResolution: string;

  // Admin Dashboard
  adminBadge: string;
  kpiTotalComplaints: string;
  kpiResolvedRate: string;
  kpiWasteDiverted: string;
  kpiActiveStaff: string;
  tableWardsOverview: string;
  btnExportCsv: string;
  colWardName: string;
  colAssignedOfficer: string;
  colResolutionPct: string;

  // Auth Modal
  authModalTitleLogin: string;
  authModalTitleRegister: string;
  authPortalBadge: string;
  lblEmail: string;
  lblPassword: string;
  lblConfirmPassword: string;
  lblName: string;
  lblMobile: string;
  lblDistrict: string;
  lblTaluk: string;
  lblWard: string;
  lblAddress: string;
  lblTermsAgree: string;
  btnSignIn: string;
  btnRegisterCitizen: string;
  demoAccountsNotice: string;

  // Common Statuses & Actions
  statusSubmitted: string;
  statusUnderVerification: string;
  statusAssigned: string;
  statusInProgress: string;
  statusResolved: string;
  statusClosed: string;
  statusScheduled: string;
  statusCompleted: string;
  statusCancelled: string;

  // Footer
  footerDesc: string;
  footerProjectNotice: string;
  quickLinks: string;
  contactEmergency: string;
  privacyPolicy: string;
  termsConditions: string;
  allRightsReserved: string;
  cleanKarnatakaMission: string;
  cleanMissionNotice: string;
  readManual: string;
  projectScopeNoticeLabel: string;
  karnatakaMunicipalities: string;
  civicHelplineLabel: string;
  bbmpControlRoom: string;
  grievanceEmailLabel: string;
  citizenCharterLabel: string;
  citizenCharterDesc: string;
  developedForKarnataka: string;
  tollFree: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Header & Navigation
    govHeader: 'GOVERNMENT OF KARNATAKA',
    smartwasteTitle: 'SMARTWASTE – Smart Waste Segregation, Awareness and Tracking Platform',
    smartwasteSubtitle: 'Empowering clean and sustainable municipal waste management across Karnataka',
    karnatakaInitiativeBadge: 'Government of Karnataka • DMA / BBMP SWM',
    home: 'Home',
    wasteSegregation: 'Waste Segregation',
    awareness: 'Awareness',
    reportWaste: 'Report Waste',
    requestPickup: 'Request Pickup',
    trackComplaint: 'Track Complaint',
    collectionMap: 'Collection Map',
    aboutUs: 'About Us',
    helpSupport: 'Help & Support',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    myDashboard: 'Dashboard',
    roleCitizen: 'Citizen',
    roleStaff: 'Collection Staff',
    roleAdmin: 'Administrator',
    notificationsTitle: 'Notifications & Alerts',
    markAllAsRead: 'Mark all as read',
    noNotifications: 'No notifications at this time',
    emergencyHelplineLabel: 'BBMP / DMA Control Room: 1533',

    // Hero Section
    heroHeading: 'SMARTWASTE – Smart Waste Management for a Cleaner Karnataka',
    heroSubHeading: 'Smart Waste Management for a Cleaner Karnataka',
    heroDescription: 'Promoting waste segregation, environmental awareness, responsible collection, and cleaner communities across Karnataka.',
    btnReportWaste: 'Report Waste',
    btnLearnSegregation: 'Learn Waste Segregation',
    btnTrackComplaint: 'Track Complaint',

    // Highlights & Stats
    statComplaints: 'Complaints Managed',
    statResolved: 'Resolved Cleanups',
    statWasteRecycled: 'Kg Waste Diverted',
    statActiveWards: 'Wards Connected',

    // Homepage Source Segregation Standard
    secSegregationBadge: 'Karnataka Municipal Corporation Standard',
    secSegregationTitle: 'Color-Coded Source Segregation',
    secSegregationDesc: 'Karnataka Municipalities mandate 4-stream segregation at the source. Segregating waste prevents 90% of landfill accumulation and protects sanitation team health.',
    greenBinTitle: 'Green Bin',
    greenBinTime: 'Daily Morning',
    greenBinName: 'Wet / Organic Waste',
    greenBinDesc: 'Biodegradable food scraps, fruit/vegetable peels, tea grounds, garden leaves for municipal composting.',
    greenBinDo: 'Food, peels, eggshells, floral waste.',
    greenBinDont: 'Plastic liners, diapers, sanitary pads.',
    blueBinTitle: 'Blue Bin',
    blueBinTime: 'Bi-Weekly Pickup',
    blueBinName: 'Dry Recyclables',
    blueBinDesc: 'Clean paper, newspapers, cardboard cartons, metal tins, aluminum foils, glass bottles, and cans.',
    blueBinDo: 'Clean paper, boxes, glass, dry cans.',
    blueBinDont: 'Oily pizza boxes, soiled tissues.',
    yellowBinTitle: 'Yellow Bin',
    yellowBinTime: 'Recycling Day',
    yellowBinName: 'Plastic & Packaging',
    yellowBinDesc: 'Rinsed milk pouches, HDPE/PP containers, plastic bottles, packaging films, grocery tubs.',
    yellowBinDo: 'Clean milk pouches, bottles, caps.',
    yellowBinDont: 'Banned single-use plastic bags.',
    redBinTitle: 'Red Bin',
    redBinTime: 'Mark with Red Cross',
    redBinName: 'Domestic Hazardous & Sanitary',
    redBinDesc: 'Sanitary pads, diapers, expired medicines, razor blades, paint cans, tube lights, batteries.',
    redBinDo: 'Wrap in paper marked with Red Cross.',
    redBinDont: 'Never mix with organic food waste.',
    exploreCategoriesBtn: 'Explore all 14 waste categories & municipal disposal rules',

    // How It Works
    howItWorksBadge: 'Civic Redressal Lifecycle',
    howItWorksTitle: 'How SMARTWASTE Works',
    howItWorksSubtitle: 'A structured, transparent 4-stage civic lifecycle ensuring zero roadside waste accumulation.',
    step1Title: '1. Citizen Reports',
    step1Desc: 'Citizen pins location, snaps a photo, and submits waste details in under 2 minutes.',
    step2Title: '2. Municipal Verification',
    step2Desc: 'Ward officer verifies location and dispatches nearest sanitation squad.',
    step3Title: '3. Field Collection',
    step3Desc: 'Staff clears waste, weighs collected quantity, and uploads completion proof.',
    step4Title: '4. Resolution & Feedback',
    step4Desc: 'Citizen receives SMS/in-app alert, inspects cleanup photos, and rates service.',

    // Quick Municipal Services
    servicesBadge: 'Citizen Services',
    servicesTitle: 'Quick Municipal Services',
    servicesSubtitle: 'Direct access to waste management and municipal sanitation tools.',
    cardReportTitle: 'Report Waste Dump',
    cardReportDesc: 'Report illegal dumping, overflowing bins, or uncollected garbage with GPS location & photo proof.',
    cardReportAction: 'Open 8-step portal',
    cardPickupTitle: 'Request Bulk Pickup',
    cardPickupDesc: 'Schedule doorstep municipal collection for bulky household furniture, construction debris, or e-waste.',
    cardPickupAction: 'Book doorstep slot',
    cardTrackTitle: 'Track Complaint Status',
    cardTrackDesc: 'Check live timeline from submission to ward officer inspection and sanitation team clearance.',
    cardTrackAction: 'Track by ID',
    cardMapTitle: 'Ward Collection Map',
    cardMapDesc: 'Interactive map of Dry Waste Collection Centres (DWCC), sorting facilities, and vehicle routes.',
    cardMapAction: 'View live map',

    // Quiz & Game Banner
    quizBannerBadge: 'Earn Eco-Points & Green Citizen Certification',
    quizTitle: 'Segregation Awareness Quiz',
    quizSubtitle: 'Test your municipal waste knowledge, earn Eco-Points, and unlock your Green Citizen certificate.',
    startQuiz: 'Start Segregation Quiz',
    sortingGameBtn: 'Waste Sorting Game',
    gameTitle: 'Interactive Waste Sorting Challenge',
    gameSubtitle: 'Drag and drop items into Green, Blue, Red, or Black bins to test your source-segregation speed!',

    // FAQs Section
    faqBadge: 'Citizen Guidance',
    faqTitle: 'Frequently Asked Questions',
    faqSubtitle: 'Standard operating procedures for urban solid waste segregation and disposal in Karnataka.',
    faq1Q: 'What is the "2-Bin-1-Bag" system mandated in Karnataka municipal corporations?',
    faq1A: 'Karnataka Municipalities mandate source segregation into three distinct streams: Green Bin for wet/kitchen compostable waste, Blue Bin (or bag) for dry recyclables (paper, plastic, metal, clean glass), and a marked pouch/bag with a Red Cross for domestic sanitary and hazardous waste.',
    faq2Q: 'How fast will my reported waste complaint be resolved?',
    faq2A: 'Under the Karnataka Municipal Citizen Charter, open waste dumps and community blackspots are verified by ward officers within 4 to 8 hours and assigned to local sanitation units for clearance within 24 to 48 hours.',
    faq3Q: 'How do I schedule a doorstep pickup for old furniture or heavy e-waste?',
    faq3A: 'Navigate to "Request Pickup" in the top menu, select your waste type (Bulky Waste or E-Waste), select your locality and preferred date/slot, and our specialized collection vehicle will arrive at your doorstep.',
    faq4Q: 'What plastics are completely banned across Karnataka?',
    faq4A: 'Under Karnataka State Pollution Control Board (KSPCB) notifications, single-use plastic carry bags (<120 microns), plastic cutlery, thermocol decorations, plastic banners, and cling films under 50 microns are strictly prohibited.',
    faq5Q: 'Can I earn badges or points for learning waste segregation?',
    faq5A: 'Yes! When you complete our interactive Segregation Quiz and report cleanups, you earn Eco-Points and unlock badges like "Green Citizen" and "Segregation Master" on your Citizen Dashboard.',

    // Segregation Guide Page
    segGuideBadge: 'Karnataka SWM Rulebook 2026',
    segGuideTitle: 'Municipal Waste Segregation Guidelines',
    segGuideSubtitle: 'Detailed protocols for 14 municipal waste categories recognized under Karnataka Urban Development Department regulations.',
    tabGuide: 'Classification Guide',
    tabGame: 'Waste Sorting Game',
    tabCompost: 'Home Composting',
    searchCategoryPlaceholder: 'Search by waste name, item, or bin color...',
    filterAll: 'All Streams (14)',
    filterWet: 'Wet / Organic',
    filterDry: 'Dry Recyclable',
    filterHazardous: 'Sanitary & Hazardous',
    filterSpecial: 'E-Waste & Bulk',
    labelStandardRule: 'Standard Rule',
    labelCommonExamples: 'Common Examples:',
    labelProtocol: 'Segregation Protocol:',
    labelDoNotMix: 'Never Mix With:',

    // Reporting Form (8 Steps)
    reportPageBadge: 'Civic Grievance Redressal',
    reportPageTitle: 'Report Roadside Waste & Illegal Dumping',
    reportPageSubtitle: 'Submit GPS-verified complaints with photo evidence directly to your local Ward Sanitation Officer.',
    stepIndicator: 'Step',
    stepCategory: 'Waste Category',
    stepQuantity: 'Estimated Weight',
    stepLocation: 'Location & Ward',
    stepMedia: 'Photos & Evidence',
    stepDescription: 'Issue Description',
    stepContact: 'Contact Details',
    stepReview: 'Review Details',
    stepSubmit: 'Submit Complaint',
    btnNext: 'Next Step',
    btnBack: 'Previous Step',
    btnSubmitComplaint: 'Submit Official Complaint',
    submitSuccess: 'Complaint Registered Successfully!',
    complaintIdLabel: 'Complaint Tracking ID',
    detectGpsBtn: 'Auto-Detect Current GPS Coordinates',
    gpsDetecting: 'Acquiring GPS location...',
    gpsDetectedSuccess: 'GPS Location coordinates pinned successfully',
    uploadPhotosTitle: 'Upload Photographic Evidence (Up to 3 Photos/Videos)',
    uploadPhotosDesc: 'Clear pictures of the dump assist field squads in dispatching suitable collection tippers.',
    descPlaceholder: 'Provide specific landmarks, street numbers, or dump severity notes for the field team...',
    mobilePlaceholder: '10-digit mobile number for SMS tracking updates',
    successTitle: 'Complaint Submitted to Local Ward Office!',
    successDesc: 'Your complaint has been logged in the Karnataka Municipal SWM system and routed to the ward health inspector.',
    trackNowBtn: 'Track Complaint Live',
    fileComplaintAnotherBtn: 'Report Another Waste Issue',

    // Pickup Request Page
    pickupTitle: 'Doorstep Bulk & Recyclable Pickup',
    pickupSubtitle: 'Schedule doorstep municipal collection for heavy furniture, electronic waste, and bulk recyclables.',
    wasteTypeLabel: 'Select Waste Type',
    estimatedQtyLabel: 'Approximate Quantity (Kg / Units)',
    preferredDateLabel: 'Preferred Collection Date',
    preferredSlotLabel: 'Available Time Slot',
    addressLabel: 'Pickup Address & Landmark',
    instructionsLabel: 'Access Instructions / Notes',
    btnBookPickup: 'Confirm Pickup Slot',
    slotMorning: 'Morning: 08:00 AM – 11:00 AM',
    slotAfternoon: 'Afternoon: 01:00 PM – 04:00 PM',
    slotEvening: 'Evening: 04:00 PM – 07:00 PM',
    pickupSuccessTitle: 'Doorstep Pickup Scheduled!',
    pickupSuccessDesc: 'Your pickup reservation has been sent to the designated ward collection team.',

    // Tracking Page
    trackingTitle: 'Real-Time Complaint & Pickup Tracker',
    trackingSubtitle: 'Monitor verification, sanitation squad assignment, and photo-verified completion milestones.',
    enterComplaintId: 'Enter Complaint ID (e.g. SW-2026-000001 or PK-2026-000001)',
    trackBtn: 'Track Status',
    statusLabel: 'Current Status',
    assignedStaffLabel: 'Assigned Sanitation Officer',
    timelineLabel: 'Verification & Resolution Timeline',
    rateService: 'Rate Cleanup Satisfaction',
    ratingPrompt: 'How satisfied are you with the cleanup speed and cleanliness?',
    feedbackPlaceholder: 'Add feedback for the municipal sanitation team...',
    btnSubmitFeedback: 'Submit Rating & Feedback',
    feedbackSubmittedSuccess: 'Thank you! Your feedback helps evaluate municipal staff performance.',
    quickPickTitle: 'Quick Select from Your Recent Submissions:',

    // Dashboards Common
    welcomeBack: 'Welcome back',
    ecoPointsLabel: 'Eco-Points',
    badgesEarned: 'Badges Earned',
    recentComplaints: 'My Recent Reports',
    activePickupsTitle: 'Active Doorstep Pickups',
    staffTasksTitle: 'Assigned Municipal Sanitation Tasks',
    adminConsoleTitle: 'Karnataka Municipal Administration Console',
    viewAll: 'View All',
    noComplaintsFound: 'No complaints logged under this account yet.',
    noPickupsFound: 'No doorstep pickups scheduled yet.',
    colId: 'ID',
    colCategory: 'Category',
    colLocation: 'Location',
    colDate: 'Date',
    colStatus: 'Status',
    colAction: 'Action',

    // Staff Dashboard
    staffBadge: 'Municipal Field Squad',
    staffAssignedWards: 'Assigned Ward Duty',
    filterAllTasks: 'All Tasks',
    filterPending: 'Pending Inspection',
    filterInProgress: 'In Progress',
    filterResolved: 'Cleared',
    btnUpdateStatus: 'Update Clearance Status',
    modalUpdateTitle: 'Log Field Clearance & Upload Proof',
    lblActualWeight: 'Actual Weighed Garbage (Kg)',
    lblUploadProof: 'Upload Cleaned Spot Photo Proof',
    btnConfirmResolution: 'Mark Cleanup as Resolved',

    // Admin Dashboard
    adminBadge: 'Karnataka Urban Administration (DMA / BBMP)',
    kpiTotalComplaints: 'Total Complaints',
    kpiResolvedRate: 'Resolution Rate',
    kpiWasteDiverted: 'Recycled Waste',
    kpiActiveStaff: 'Field Squads on Duty',
    tableWardsOverview: 'Ward-by-Ward Redressal Performance',
    btnExportCsv: 'Export Performance Report (CSV)',
    colWardName: 'Ward & Zone',
    colAssignedOfficer: 'Lead Inspector',
    colResolutionPct: 'Resolved %',

    // Auth Modal
    authModalTitleLogin: 'Sign In to SMARTWASTE',
    authModalTitleRegister: 'Citizen Registration',
    authPortalBadge: 'Official Access Portal',
    lblEmail: 'Email Address',
    lblPassword: 'Password',
    lblConfirmPassword: 'Confirm Password',
    lblName: 'Full Name',
    lblMobile: '10-Digit Mobile Number',
    lblDistrict: 'District',
    lblTaluk: 'Taluk',
    lblWard: 'Ward',
    lblAddress: 'Residential Address',
    lblTermsAgree: 'I agree to Karnataka Municipal Solid Waste Management citizen bylaws',
    btnSignIn: 'Sign In to Portal',
    btnRegisterCitizen: 'Create Citizen Account',
    demoAccountsNotice: 'Evaluation Demo Accounts (Click to test any role):',

    // Common Statuses & Actions
    statusSubmitted: 'Submitted',
    statusUnderVerification: 'Under Verification',
    statusAssigned: 'Assigned to Staff',
    statusInProgress: 'In Progress',
    statusResolved: 'Resolved',
    statusClosed: 'Closed',
    statusScheduled: 'Scheduled',
    statusCompleted: 'Completed',
    statusCancelled: 'Cancelled',

    // Footer
    footerDesc: 'SMARTWASTE – Smart Waste Segregation, Awareness and Tracking Platform designed to support cleaner communities and responsible waste management across Karnataka.',
    footerProjectNotice: 'Karnataka-focused environmental awareness and waste management project. Academic major project prototype.',
    quickLinks: 'Quick Portals',
    contactEmergency: 'Helplines & Grievances',
    privacyPolicy: 'Privacy Policy',
    termsConditions: 'Terms of Use',
    allRightsReserved: 'All rights reserved.',
    cleanKarnatakaMission: 'Clean Karnataka Mission',
    cleanMissionNotice: 'Segregate wet, dry, and sanitary waste at your doorstep daily to protect sanitation workers and our environment.',
    readManual: 'Read Segregation Manual',
    projectScopeNoticeLabel: 'Project Scope Notice',
    karnatakaMunicipalities: 'Karnataka Municipalities',
    civicHelplineLabel: 'Civic Grievance Helpline',
    bbmpControlRoom: 'BBMP Control Room',
    grievanceEmailLabel: 'Grievance Portal Email',
    citizenCharterLabel: 'Citizen Charter SLA',
    citizenCharterDesc: 'Maximum 24–48 hours resolution SLA for reported waste blackspots.',
    developedForKarnataka: 'Developed for Karnataka Communities',
    tollFree: 'Toll-Free'
  },
  kn: {
    // Header & Navigation
    govHeader: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರ',
    smartwasteTitle: 'ಸ್ಮಾರ್ಟ್‌ವೇಸ್ಟ್ – ತ್ಯಾಜ್ಯ ವಿಂಗಡಣೆ, ಜಾಗೃತಿ ಮತ್ತು ಟ್ರ್ಯಾಕಿಂಗ್ ವೇದಿಕೆ',
    smartwasteSubtitle: 'ಕರ್ನಾಟಕದಾದ್ಯಂತ ಸ್ವಚ್ಛ ಮತ್ತು ಸುಸ್ಥಿರ ಪುರಸಭೆಯ ತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆ',
    karnatakaInitiativeBadge: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರ • ಪೌರಾಡಳಿತ ನಿರ್ದೇಶನಾಲಯ / ಬಿಬಿಎಂಪಿ ಘನತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆ',
    home: 'ಮುಖಪುಟ',
    wasteSegregation: 'ತ್ಯಾಜ್ಯ ವಿಂಗಡಣೆ',
    awareness: 'ಪರಿಸರ ಜಾಗೃತಿ',
    reportWaste: 'ತ್ಯಾಜ್ಯ ವರದಿ ಮಾಡಿ',
    requestPickup: 'ಸಂಗ್ರಹಣೆಗೆ ವಿನಂತಿಸಿ',
    trackComplaint: 'ದೂರು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
    collectionMap: 'ಸಂಗ್ರಹಣೆ ನಕ್ಷೆ',
    aboutUs: 'ನಮ್ಮ ಬಗ್ಗೆ',
    helpSupport: 'ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ',
    login: 'ಲಾಗಿನ್',
    register: 'ನೋಂದಣಿ',
    logout: 'ಲಾಗೌಟ್',
    myDashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    roleCitizen: 'ನಾಗರಿಕ',
    roleStaff: 'ಸಂಗ್ರಹಣಾ ಸಿಬ್ಬಂದಿ',
    roleAdmin: 'ಆಡಳಿತಾಧಿಕಾರಿ',
    notificationsTitle: 'ಅಧಿಸೂಚನೆಗಳು ಮತ್ತು ಎಚ್ಚರಿಕೆಗಳು',
    markAllAsRead: 'ಎಲ್ಲವನ್ನೂ ಓದಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ',
    noNotifications: 'ಈ ಸಮಯದಲ್ಲಿ ಯಾವುದೇ ಹೊಸ ಅಧಿಸೂಚನೆಗಳಿಲ್ಲ',
    emergencyHelplineLabel: 'ಬಿಬಿಎಂಪಿ / ಪೌರಾಡಳಿತ ನಿಯಂತ್ರಣ ಕೊಠಡಿ: ೧೫೩೩',

    // Hero Section
    heroHeading: 'ಸ್ಮಾರ್ಟ್‌ವೇಸ್ಟ್ – ಸ್ವಚ್ಛ ಕರ್ನಾಟಕಕ್ಕಾಗಿ ಸ್ಮಾರ್ಟ್ ತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆ',
    heroSubHeading: 'ಸ್ವಚ್ಛ ಕರ್ನಾಟಕಕ್ಕಾಗಿ ಸ್ಮಾರ್ಟ್ ತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆ',
    heroDescription: 'ಕರ್ನಾಟಕದಾದ್ಯಂತ ತ್ಯಾಜ್ಯ ವಿಂಗಡಣೆ, ಪರಿಸರ ಜಾಗೃತಿ, ಜವಾಬ್ದಾರಿಯುತ ಸಂಗ್ರಹಣೆ ಮತ್ತು ಸ್ವಚ್ಛ ಸಮುದಾಯಗಳನ್ನು ಉತ್ತೇಜಿಸುವುದು.',
    btnReportWaste: 'ತ್ಯಾಜ್ಯ ವರದಿ ಮಾಡಿ',
    btnLearnSegregation: 'ತ್ಯಾಜ್ಯ ವಿಂಗಡಣೆ ಕಲಿಯಿರಿ',
    btnTrackComplaint: 'ದೂರು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',

    // Highlights & Stats
    statComplaints: 'ನಿರ್ವಹಿಸಿದ ದೂರುಗಳು',
    statResolved: 'ಪರಿಹರಿಸಲಾದ ಸ್ವಚ್ಛತೆ',
    statWasteRecycled: 'ಕೆಜಿ ಮರುಬಳಕೆಯಾದ ತ್ಯಾಜ್ಯ',
    statActiveWards: 'ಸಂಪರ್ಕಿತ ವಾರ್ಡ್‌ಗಳು',

    // Homepage Source Segregation Standard
    secSegregationBadge: 'ಕರ್ನಾಟಕ ಮಹಾನಗರ ಪಾಲಿಕೆ ಮಾನದಂಡ',
    secSegregationTitle: 'ಬಣ್ಣ-ಆಧಾರಿತ ಮೂಲದಲ್ಲೇ ತ್ಯಾಜ್ಯ ವಿಂಗಡಣೆ',
    secSegregationDesc: 'ಕರ್ನಾಟಕದ ಪುರಸಭೆಗಳು ಮೂಲದಲ್ಲೇ ೪-ವಿಧದ ವಿಂಗಡಣೆಯನ್ನು ಕಡ್ಡಾಯಗೊಳಿಸಿವೆ. ವಿಂಗಡಣೆಯು ಶೇ. ೯೦ ರಷ್ಟು ತ್ಯಾಜ್ಯ ಸಂಗ್ರಹವನ್ನು ತಪ್ಪಿಸುತ್ತದೆ ಮತ್ತು ಪೌರಕಾರ್ಮಿಕರ ಆರೋಗ್ಯವನ್ನು ರಕ್ಷಿಸುತ್ತದೆ.',
    greenBinTitle: 'ಹಸಿರು ಬುಟ್ಟಿ',
    greenBinTime: 'ಪ್ರತಿದಿನ ಬೆಳಗ್ಗೆ',
    greenBinName: 'ಹಸಿ / ಜೈವಿಕ ತ್ಯಾಜ್ಯ',
    greenBinDesc: 'ಪುರಸಭೆಯ ಕಾಂಪೋಸ್ಟಿಂಗ್‌ಗಾಗಿ ಜೈವಿಕ ವಿಘಟನೀಯ ಆಹಾರ ಪದಾರ್ಥಗಳು, ಹಣ್ಣು/ತರಕಾರಿ ಸಿಪ್ಪೆಗಳು, ಚಹಾ ಪುಡಿ, ಎಲೆಗಳು.',
    greenBinDo: 'ಆಹಾರ, ಸಿಪ್ಪೆಗಳು, ಮೊಟ್ಟೆಯ ಕವಚ, ಹೂವಿನ ತ್ಯಾಜ್ಯ.',
    greenBinDont: 'ಪ್ಲಾಸ್ಟಿಕ್ ಚೀಲ, ಡೈಪರ್, ಸ್ಯಾನಿಟರಿ ಪ್ಯಾಡ್‌ಗಳು.',
    blueBinTitle: 'ನೀಲಿ ಬುಟ್ಟಿ',
    blueBinTime: 'ವಾರಕ್ಕೆ ಎರಡು ಬಾರಿ',
    blueBinName: 'ಒಣ ಮರುಬಳಕೆಯಾಗುವ ತ್ಯಾಜ್ಯ',
    blueBinDesc: 'ಶುದ್ಧ ಕಾಗದ, ಪತ್ರಿಕೆಗಳು, ರಟ್ಟು, ಲೋಹದ ಡಬ್ಬಿಗಳು, ಅಲ್ಯೂಮಿನಿಯಂ ಫಾಯಿಲ್, ಗಾಜಿನ ಬಾಟಲಿಗಳು.',
    blueBinDo: 'ಸ್ವಚ್ಛ ಕಾಗದ, ಪೆಟ್ಟಿಗೆಗಳು, ಗಾಜು, ಒಣ ಡಬ್ಬಿಗಳು.',
    blueBinDont: 'ಎಣ್ಣೆಯುಕ್ತ ಪಿಜ್ಜಾ ಬಾಕ್ಸ್, ಕೊಳಕು ಟಿಶ್ಯೂ.',
    yellowBinTitle: 'ಹಳದಿ ಬುಟ್ಟಿ',
    yellowBinTime: 'ಮರುಬಳಕೆ ದಿನ',
    yellowBinName: 'ಪ್ಲಾಸ್ಟಿಕ್ ಮತ್ತು ಪ್ಯಾಕೇಜಿಂಗ್',
    yellowBinDesc: 'ತೊಳೆದ ಹಾಲಿನ ಪ್ಯಾಕೆಟ್‌ಗಳು, ಎಚ್‌ಡಿಪಿಇ/ಪಿಪಿ ಡಬ್ಬಿಗಳು, ಪ್ಲಾಸ್ಟಿಕ್ ಬಾಟಲಿಗಳು, ಕವರ್‌ಗಳು.',
    yellowBinDo: 'ಸ್ವಚ್ಛ ಹಾಲಿನ ಪ್ಯಾಕೆಟ್, ಬಾಟಲಿಗಳು, ಮುಚ್ಚಳಗಳು.',
    yellowBinDont: 'ನಿಷೇಧಿತ ಏಕ-ಬಳಕೆಯ ಪ್ಲಾಸ್ಟಿಕ್ ಚೀಲಗಳು.',
    redBinTitle: 'ಕೆಂಪು ಬುಟ್ಟಿ',
    redBinTime: 'ಕೆಂಪು ಕ್ರಾಸ್ ಗುರುತು ಮಾಡಿ',
    redBinName: 'ಮನೆಬಳಕೆಯ ಅಪಾಯಕಾರಿ ಮತ್ತು ನೈರ್ಮಲ್ಯ ತ್ಯಾಜ್ಯ',
    redBinDesc: 'ಸ್ಯಾನಿಟರಿ ಪ್ಯಾಡ್‌ಗಳು, ಡೈಪರ್‌ಗಳು, ಅವಧಿ ಮೀರಿದ ಔಷಧಗಳು, ಬ್ಲೇಡ್‌ಗಳು, ಪೇಂಟ್ ಡಬ್ಬಿ, ಬ್ಯಾಟರಿಗಳು.',
    redBinDo: 'ಕೆಂಪು ಕ್ರಾಸ್ ಗುರುತಿನ ಕಾಗದದಲ್ಲಿ ಸುತ್ತಿ ನೀಡಿ.',
    redBinDont: 'ಹಸಿ ಆಹಾರ ತ್ಯಾಜ್ಯದೊಂದಿಗೆ ಎಂದಿಗೂ ಬೆರೆಸಬೇಡಿ.',
    exploreCategoriesBtn: 'ಎಲ್ಲಾ ೧೪ ತ್ಯಾಜ್ಯ ವರ್ಗಗಳು ಮತ್ತು ಪುರಸಭೆಯ ವಿಲೇವಾರಿ ನಿಯಮಗಳನ್ನು ವೀಕ್ಷಿಸಿ',

    // How It Works
    howItWorksBadge: 'ನಾಗರಿಕ ಕುಂದುಕೊರತೆ ಪರಿಹಾರ ಪ್ರಕ್ರಿಯೆ',
    howItWorksTitle: 'ಸ್ಮಾರ್ಟ್‌ವೇಸ್ಟ್ ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ',
    howItWorksSubtitle: 'ರಸ್ತೆಬದಿಯ ತ್ಯಾಜ್ಯ ಶೇಖರಣೆಯನ್ನು ತಡೆಗಟ್ಟುವ ೪-ಹಂತದ ಪಾರದರ್ಶಕ ನಾಗರಿಕ ವ್ಯವಸ್ಥೆ.',
    step1Title: '೧. ನಾಗರಿಕರ ವರದಿ',
    step1Desc: 'ಸ್ಥಳವನ್ನು ಗುರುತಿಸಿ, ಫೋಟೋ ತೆಗೆದು, ೨ ನಿಮಿಷದಲ್ಲಿ ವಿವರಗಳನ್ನು ಸಲ್ಲಿಸಿ.',
    step2Title: '೨. ಪುರಸಭೆ ಪರಿಶೀಲನೆ',
    step2Desc: 'ವಾರ್ಡ್ ಅಧಿಕಾರಿ ಸ್ಥಳ ಪರಿಶೀಲಿಸಿ ಹತ್ತಿರದ ನೈರ್ಮಲ್ಯ ಸಿಬ್ಬಂದಿಯನ್ನು ನಿಯೋಜಿಸುತ್ತಾರೆ.',
    step3Title: '೩. ಸ್ಥಳದಲ್ಲಿ ಸಂಗ್ರಹಣೆ',
    step3Desc: 'ಸಿಬ್ಬಂದಿ ತ್ಯಾಜ್ಯ ತೆರವುಗೊಳಿಸಿ, ತೂಕ ದಾಖಲಿಸಿ, ಪರಿಹಾರದ ಪುರಾವೆ ಅಪ್‌ಲೋಡ್ ಮಾಡುತ್ತಾರೆ.',
    step4Title: '೪. ಪರಿಹಾರ ಮತ್ತು ಪ್ರತಿಕ್ರಿಯೆ',
    step4Desc: 'ನಾಗರಿಕರು ಎಸ್‌ಎಂಎಸ್/ಆ್ಯಪ್ ಅಧಿಸೂಚನೆ ಪಡೆದು, ಕೆಲಸವನ್ನು ಪರಿಶೀಲಿಸಿ ರೇಟಿಂಗ್ ನೀಡುತ್ತಾರೆ.',

    // Quick Municipal Services
    servicesBadge: 'ನಾಗರಿಕ ಸೇವೆಗಳು',
    servicesTitle: 'ತ್ವರಿತ ಪುರಸಭೆ ಸೇವೆಗಳು',
    servicesSubtitle: 'ತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆ ಮತ್ತು ಪುರಸಭೆ ನೈರ್ಮಲ್ಯ ಪರಿಕರಗಳಿಗೆ ನೇರ ಪ್ರವೇಶ.',
    cardReportTitle: 'ತ್ಯಾಜ್ಯ ರಾಶಿ ವರದಿ ಮಾಡಿ',
    cardReportDesc: 'ಜಿಪಿಎಸ್ ಸ್ಥಳ ಮತ್ತು ಫೋಟೋ ಪುರಾವೆಯೊಂದಿಗೆ ಅನಧಿಕೃತ ಕಸ ಸುರಿಯುವಿಕೆ ಅಥವಾ ತುಂಬಿ ಹರಿಯುವ ಕಸದ ತೊಟ್ಟಿಗಳನ್ನು ವರದಿ ಮಾಡಿ.',
    cardReportAction: '೮-ಹಂತದ ಪೋರ್ಟಲ್ ತೆರೆಯಿರಿ',
    cardPickupTitle: 'ಬೃಹತ್ ತ್ಯಾಜ್ಯ ಸಂಗ್ರಹಣೆ',
    cardPickupDesc: 'ಹಳೆಯ ಪೀಠೋಪಕರಣಗಳು, ಕಟ್ಟಡದ ಅವಶೇಷಗಳು ಅಥವಾ ಇ-ತ್ಯಾಜ್ಯಕ್ಕಾಗಿ ಮನೆಬಾಗಿಲಿಗೆ ಪುರಸಭೆ ವಾಹನ ಕಾಯ್ದಿರಿಸಿ.',
    cardPickupAction: 'ಸ್ಲಾಟ್ ಕಾಯ್ದಿರಿಸಿ',
    cardTrackTitle: 'ದೂರಿನ ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ',
    cardTrackDesc: 'ದೂರು ಸಲ್ಲಿಕೆಯಿಂದ ವಾರ್ಡ್ ಅಧಿಕಾರಿ ಪರಿಶೀಲನೆ ಮತ್ತು ಸಿಬ್ಬಂದಿ ತೆರವುಗೊಳಿಸುವಿಕೆಯವರೆಗೆ ನೈಜ-ಸಮಯದ ಪ್ರಗತಿ ನೋಡಿ.',
    cardTrackAction: 'ಐಡಿ ಮೂಲಕ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
    cardMapTitle: 'ವಾರ್ಡ್ ಸಂಗ್ರಹಣೆ ನಕ್ಷೆ',
    cardMapDesc: 'ಒಣ ತ್ಯಾಜ್ಯ ಸಂಗ್ರಹಣಾ ಕೇಂದ್ರಗಳು (DWCC), ವಿಂಗಡಣಾ ಘಟಕಗಳು ಮತ್ತು ವಾಹನ ಮಾರ್ಗಗಳ ಸಂವಾದಾತ್ಮಕ ನಕ್ಷೆ.',
    cardMapAction: 'ಲೈವ್ ನಕ್ಷೆ ವೀಕ್ಷಿಸಿ',

    // Quiz & Game Banner
    quizBannerBadge: 'ಇಕೋ-ಪಾಯಿಂಟ್‌ಗಳು ಮತ್ತು ಗ್ರೀನ್ ಸಿಟಿಜನ್ ಪ್ರಮಾಣಪತ್ರ ಗಳಿಸಿ',
    quizTitle: 'ತ್ಯಾಜ್ಯ ವಿಂಗಡಣೆ ಜಾಗೃತಿ ರಸಪ್ರಶ್ನೆ',
    quizSubtitle: 'ನಿಮ್ಮ ಜ್ಞಾನವನ್ನು ಪರೀಕ್ಷಿಸಿ, ಇಕೋ-ಪಾಯಿಂಟ್‌ಗಳನ್ನು ಗಳಿಸಿ ಮತ್ತು ಪ್ರಮಾಣಪತ್ರ ಪಡೆಯಿರಿ.',
    startQuiz: 'ರಸಪ್ರಶ್ನೆ ಪ್ರಾರಂಭಿಸಿ',
    sortingGameBtn: 'ತ್ಯಾಜ್ಯ ವಿಂಗಡಣೆ ಆಟ',
    gameTitle: 'ಸಂವಾದಾತ್ಮಕ ತ್ಯಾಜ್ಯ ವಿಂಗಡಣೆ ಆಟ',
    gameSubtitle: 'ವಸ್ತುಗಳನ್ನು ಸರಿಯಾದ ಬುಟ್ಟಿಗಳಿಗೆ ಹಾಕಿ ನಿಮ್ಮ ವಿಂಗಡಣಾ ಕೌಶಲ್ಯ ಪರೀಕ್ಷಿಸಿ!',

    // FAQs Section
    faqBadge: 'ನಾಗರಿಕ ಮಾರ್ಗದರ್ಶಿ',
    faqTitle: 'ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು',
    faqSubtitle: 'ಕರ್ನಾಟಕದಲ್ಲಿ ನಗರ ಘನತ್ಯಾಜ್ಯ ವಿಂಗಡಣೆ ಮತ್ತು ವಿಲೇವಾರಿಗಾಗಿ ಗುಣಮಟ್ಟದ ಕಾರ್ಯವಿಧಾನಗಳು.',
    faq1Q: 'ಕರ್ನಾಟಕದ ಮಹಾನಗರ ಪಾಲಿಕೆಗಳಲ್ಲಿ ಕಡ್ಡಾಯವಾಗಿರುವ "೨-ಬುಟ್ಟಿ-೧-ಚೀಲ" ವ್ಯವಸ್ಥೆ ಎಂದರೇನು?',
    faq1A: 'ಕರ್ನಾಟಕದ ಪುರಸಭೆಗಳು ಮೂರು ವಿಧಗಳಾಗಿ ವಿಂಗಡಿಸುವುದನ್ನು ಕಡ್ಡಾಯಗೊಳಿಸಿವೆ: ಹಸಿ/ಅಡುಗೆಮನೆ ತ್ಯಾಜ್ಯಕ್ಕೆ ಹಸಿರು ಬುಟ್ಟಿ, ಒಣ ಮರುಬಳಕೆ ತ್ಯಾಜ್ಯಕ್ಕೆ ನೀಲಿ ಬುಟ್ಟಿ (ಅಥವಾ ಚೀಲ), ಮತ್ತು ಗೃಹ ನೈರ್ಮಲ್ಯ ಹಾಗೂ ಅಪಾಯಕಾರಿ ತ್ಯಾಜ್ಯಕ್ಕೆ ಕೆಂಪು ಕ್ರಾಸ್ ಗುರುತಿನ ಚೀಲ.',
    faq2Q: 'ನಾನು ವರದಿ ಮಾಡಿದ ಕಸದ ದೂರು ಎಷ್ಟು ಬೇಗ ಪರಿಹಾರವಾಗುತ್ತದೆ?',
    faq2A: 'ಕರ್ನಾಟಕ ಪೌರ ನಾಗರಿಕ ಸನ್ನದಿನ ಪ್ರಕಾರ, ಕಸದ ರಾಶಿಗಳನ್ನು ವಾರ್ಡ್ ಅಧಿಕಾರಿಗಳು ೪ ರಿಂದ ೮ ಗಂಟೆಗಳಲ್ಲಿ ಪರಿಶೀಲಿಸಿ, ೨೪ ರಿಂದ ೪೮ ಗಂಟೆಗಳಲ್ಲಿ ಸ್ವಚ್ಛಗೊಳಿಸಲು ಸ್ಥಳೀಯ ನೈರ್ಮಲ್ಯ ಘಟಕಗಳಿಗೆ ನಿಯೋಜಿಸುತ್ತಾರೆ.',
    faq3Q: 'ಹಳೆಯ ಪೀಠೋಪಕರಣ ಅಥವಾ ಇ-ತ್ಯಾಜ್ಯಕ್ಕೆ ಮನೆಬಾಗಿಲಿನ ಸಂಗ್ರಹಣೆಯನ್ನು ಹೇಗೆ ನಿಗದಿಪಡಿಸುವುದು?',
    faq3A: 'ಮೆನುವಿನಲ್ಲಿ "ಸಂಗ್ರಹಣೆಗೆ ವಿನಂತಿಸಿ" ಆಯ್ಕೆಮಾಡಿ, ನಿಮ್ಮ ತ್ಯಾಜ್ಯದ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ, ದಿನಾಂಕ ಮತ್ತು ಸಮಯದ ಸ್ಲಾಟ್ ನಿಗದಿಪಡಿಸಿ; ನಮ್ಮ ವಿಶೇಷ ವಾಹನವು ನಿಮ್ಮ ಮನೆಬಾಗಿಲಿಗೆ ಬರುತ್ತದೆ.',
    faq4Q: 'ಕರ್ನಾಟಕದಾದ್ಯಂತ ಸಂಪೂರ್ಣವಾಗಿ ನಿಷೇಧಿಸಲಾದ ಪ್ಲಾಸ್ಟಿಕ್‌ಗಳು ಯಾವುವು?',
    faq4A: 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಮಾಲಿನ್ಯ ನಿಯಂತ್ರಣ ಮಂಡಳಿ (KSPCB) ಆದೇಶದಂತೆ, ೧೨೦ ಮೈಕ್ರಾನ್‌ಗಿಂತ ಕಡಿಮೆ ಇರುವ ಏಕ-ಬಳಕೆಯ ಪ್ಲಾಸ್ಟಿಕ್ ಚೀಲಗಳು, ಪ್ಲಾಸ್ಟಿಕ್ ಚಮಚ/ತಟ್ಟೆಗಳು, ಥರ್ಮೋಕೋಲ್ ಅಲಂಕಾರಗಳು ಸಂಪೂರ್ಣ ನಿಷೇಧಿತವಾಗಿವೆ.',
    faq5Q: 'ತ್ಯಾಜ್ಯ ವಿಂಗಡಣೆ ಕಲಿಯುವುದರಿಂದ ನಾನು ಅಂಕಗಳು ಅಥವಾ ಬ್ಯಾಡ್ಜ್‌ಗಳನ್ನು ಪಡೆಯಬಹುದೇ?',
    faq5A: 'ಖಂಡಿತವಾಗಿ! ನೀವು ರಸಪ್ರಶ್ನೆ ಪೂರ್ಣಗೊಳಿಸಿದಾಗ ಮತ್ತು ಕಸದ ದೂರುಗಳನ್ನು ವರದಿ ಮಾಡಿದಾಗ, ನೀವು ಇಕೋ-ಪಾಯಿಂಟ್‌ಗಳನ್ನು ಗಳಿಸಿ "ಗ್ರೀನ್ ಸಿಟಿಜನ್" ಬ್ಯಾಡ್ಜ್ ಪಡೆಯುತ್ತೀರಿ.',

    // Segregation Guide Page
    segGuideBadge: 'ಕರ್ನಾಟಕ ಘನತ್ಯಾಜ್ಯ ನಿಯಮಾವಳಿ ೨೦೨೬',
    segGuideTitle: 'ಪುರಸಭೆಯ ತ್ಯಾಜ್ಯ ವಿಂಗಡಣಾ ಮಾರ್ಗಸೂಚಿಗಳು',
    segGuideSubtitle: 'ಕರ್ನಾಟಕ ನಗರಾಭಿವೃದ್ಧಿ ಇಲಾಖೆ ನಿಯಮಗಳ ಅಡಿಯಲ್ಲಿ ಗುರುತಿಸಲಾದ ೧೪ ತ್ಯಾಜ್ಯ ವರ್ಗಗಳ ವಿವರವಾದ ಮಾರ್ಗದರ್ಶಿ.',
    tabGuide: 'ವರ್ಗೀಕರಣ ಮಾರ್ಗದರ್ಶಿ',
    tabGame: 'ತ್ಯಾಜ್ಯ ವಿಂಗಡಣೆ ಆಟ',
    tabCompost: 'ಮನೆಯಲ್ಲಿ ಕಾಂಪೋಸ್ಟಿಂಗ್',
    searchCategoryPlaceholder: 'ತ್ಯಾಜ್ಯದ ಹೆಸರು, ವಸ್ತು ಅಥವಾ ಬುಟ್ಟಿಯ ಬಣ್ಣದಿಂದ ಹುಡುಕಿ...',
    filterAll: 'ಎಲ್ಲಾ ತ್ಯಾಜ್ಯಗಳು (೧೪)',
    filterWet: 'ಹಸಿ / ಜೈವಿಕ',
    filterDry: 'ಒಣ ಮರುಬಳಕೆ',
    filterHazardous: 'ನೈರ್ಮಲ್ಯ ಮತ್ತು ಅಪಾಯಕಾರಿ',
    filterSpecial: 'ಇ-ತ್ಯಾಜ್ಯ ಮತ್ತು ಬೃಹತ್',
    labelStandardRule: 'ಪ್ರಮಾಣಿತ ನಿಯಮ',
    labelCommonExamples: 'ಸಾಮಾನ್ಯ ಉದಾಹರಣೆಗಳು:',
    labelProtocol: 'ವಿಂಗಡಣಾ ವಿಧಾನ:',
    labelDoNotMix: 'ಇದರೊಂದಿಗೆ ಬೆರೆಸಬೇಡಿ:',

    // Reporting Form (8 Steps)
    reportPageBadge: 'ನಾಗರಿಕ ಕುಂದುಕೊರತೆ ನಿವಾರಣೆ',
    reportPageTitle: 'ರಸ್ತೆಬದಿಯ ಕಸ ಮತ್ತು ಅನಧಿಕೃತ ತ್ಯಾಜ್ಯ ವರದಿ ಮಾಡಿ',
    reportPageSubtitle: 'ಜಿಪಿಎಸ್ ಪರಿಶೀಲಿಸಿದ ಫೋಟೋ ಪುರಾವೆಯೊಂದಿಗೆ ನಿಮ್ಮ ವಾರ್ಡ್ ನೈರ್ಮಲ್ಯ ಅಧಿಕಾರಿಗೆ ನೇರವಾಗಿ ದೂರು ಸಲ್ಲಿಸಿ.',
    stepIndicator: 'ಹಂತ',
    stepCategory: 'ತ್ಯಾಜ್ಯ ವರ್ಗ',
    stepQuantity: 'ಅಂದಾಜು ತೂಕ',
    stepLocation: 'ಸ್ಥಳ ಮತ್ತು ವಾರ್ಡ್',
    stepMedia: 'ಫೋಟೋಗಳು ಮತ್ತು ಪುರಾವೆ',
    stepDescription: 'ಸಮಸ್ಯೆಯ ವಿವರಣೆ',
    stepContact: 'ಸಂಪರ್ಕ ಮಾಹಿತಿ',
    stepReview: 'ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ',
    stepSubmit: 'ದೂರು ಸಲ್ಲಿಸಿ',
    btnNext: 'ಮುಂದಿನ ಹಂತ',
    btnBack: 'ಹಿಂದಿನ ಹಂತ',
    btnSubmitComplaint: 'ಅಧಿಕೃತ ದೂರು ಸಲ್ಲಿಸಿ',
    submitSuccess: 'ದೂರು ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಾಗಿದೆ!',
    complaintIdLabel: 'ದೂರು ಟ್ರ್ಯಾಕಿಂಗ್ ಐಡಿ',
    detectGpsBtn: 'ಪ್ರಸ್ತುತ ಜಿಪಿಎಸ್ ಸ್ಥಳವನ್ನು ಪತ್ತೆ ಮಾಡಿ',
    gpsDetecting: 'ಜಿಪಿಎಸ್ ಸ್ಥಳವನ್ನು ಪಡೆಯಲಾಗುತ್ತಿದೆ...',
    gpsDetectedSuccess: 'ಜಿಪಿಎಸ್ ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ',
    uploadPhotosTitle: 'ಫೋಟೋ ಪುರಾವೆಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ (ಗರಿಷ್ಠ ೩ ಫೋಟೋಗಳು/ವೀಡಿಯೊಗಳು)',
    uploadPhotosDesc: 'ಸ್ಪಷ್ಟ ಫೋಟೋಗಳು ಸ್ಥಳೀಯ ನೈರ್ಮಲ್ಯ ತಂಡಕ್ಕೆ ಸೂಕ್ತ ವಾಹನ ಕಳುಹಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತವೆ.',
    descPlaceholder: 'ಸ್ಥಳದ ಗುರುತುಗಳು ಅಥವಾ ಕಸದ ರಾಶಿಯ ಗಂಭೀರತೆಯ ಬಗ್ಗೆ ವಿವರಣೆ ನೀಡಿ...',
    mobilePlaceholder: 'ಎಸ್‌ಎಂಎಸ್ ನವೀಕರಣಗಳಿಗಾಗಿ ೧೦-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    successTitle: 'ವಾರ್ಡ್ ಕಚೇರಿಗೆ ದೂರು ಸಲ್ಲಿಸಲಾಗಿದೆ!',
    successDesc: 'ನಿಮ್ಮ ದೂರನ್ನು ಕರ್ನಾಟಕ ಪುರಸಭೆ ವ್ಯವಸ್ಥೆಯಲ್ಲಿ ದಾಖಲಿಸಲಾಗಿದ್ದು, ವಾರ್ಡ್ ಅಧಿಕಾರಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ.',
    trackNowBtn: 'ದೂರನ್ನು ಈಗಲೇ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
    fileComplaintAnotherBtn: 'ಮತ್ತೊಂದು ಕಸದ ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಿ',

    // Pickup Request Page
    pickupTitle: 'ಮನೆಬಾಗಿಲಿಗೆ ಬೃಹತ್ ತ್ಯಾಜ್ಯ ಸಂಗ್ರಹಣೆ',
    pickupSubtitle: 'ಹಳೆಯ ಪೀಠೋಪಕರಣಗಳು, ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ ಮತ್ತು ಬೃಹತ್ ಮರುಬಳಕೆಯ ತ್ಯಾಜ್ಯ ಸಂಗ್ರಹಣೆಗೆ ಸಮಯ ನಿಗದಿಪಡಿಸಿ.',
    wasteTypeLabel: 'ತ್ಯಾಜ್ಯದ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    estimatedQtyLabel: 'ಅಂದಾಜು ಪ್ರಮಾಣ (ಕೆಜಿ / ಯೂನಿಟ್)',
    preferredDateLabel: 'ಆದ್ಯತೆಯ ಸಂಗ್ರಹಣಾ ದಿನಾಂಕ',
    preferredSlotLabel: 'ಲಭ್ಯವಿರುವ ಸಮಯದ ಸ್ಲಾಟ್',
    addressLabel: 'ಸಂಗ್ರಹಣಾ ವಿಳಾಸ ಮತ್ತು ಗುರುತು',
    instructionsLabel: 'ಹೆಚ್ಚುವರಿ ಸೂಚನೆಗಳು / ಟಿಪ್ಪಣಿಗಳು',
    btnBookPickup: 'ಸ್ಲಾಟ್ ಖಚಿತಪಡಿಸಿ',
    slotMorning: 'ಬೆಳಗ್ಗೆ: ೦೮:೦೦ – ೧೧:೦೦ AM',
    slotAfternoon: 'ಮಧ್ಯಾಹ್ನ: ೦೧:೦೦ – ೦೪:೦೦ PM',
    slotEvening: 'ಸಂಜೆ: ೦೪:೦೦ – ೦೭:೦೦ PM',
    pickupSuccessTitle: 'ಮನೆಬಾಗಿಲಿನ ಸಂಗ್ರಹಣೆ ನಿಗದಿಯಾಗಿದೆ!',
    pickupSuccessDesc: 'ನಿಮ್ಮ ಕಾಯ್ದಿರಿಸುವಿಕೆಯನ್ನು ನಿಗದಿತ ವಾರ್ಡ್ ಸಂಗ್ರಹಣಾ ತಂಡಕ್ಕೆ ಕಳುಹಿಸಲಾಗಿದೆ.',

    // Tracking Page
    trackingTitle: 'ನೈಜ-ಸಮಯದ ದೂರು ಮತ್ತು ಪಿಕಪ್ ಟ್ರ್ಯಾಕರ್',
    trackingSubtitle: 'ಪರಿಶೀಲನೆ, ಸಿಬ್ಬಂದಿ ನಿಯೋಜನೆ ಮತ್ತು ಸ್ವಚ್ಛತೆಯ ಫೋಟೋ-ಪರಿಶೀಲಿಸಿದ ಹಂತಗಳನ್ನು ಗಮನಿಸಿ.',
    enterComplaintId: 'ದೂರು ಐಡಿ ನಮೂದಿಸಿ (ಉದಾ: SW-2026-000001 ಅಥವಾ PK-2026-000001)',
    trackBtn: 'ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ',
    statusLabel: 'ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ',
    assignedStaffLabel: 'ನಿಯೋಜಿತ ನೈರ್ಮಲ್ಯ ಅಧಿಕಾರಿ',
    timelineLabel: 'ಪರಿಶೀಲನೆ ಮತ್ತು ಪರಿಹಾರದ ಸಮಯರೇಖೆ',
    rateService: 'ಸ್ವಚ್ಛತಾ ಸೇವೆಗೆ ರೇಟಿಂಗ್ ನೀಡಿ',
    ratingPrompt: 'ಸ್ವಚ್ಛತೆಯ ವೇಗ ಮತ್ತು ಗುಣಮಟ್ಟದ ಬಗ್ಗೆ ನಿಮ್ಮ ಅನುಭವ ಹೇಗಿದೆ?',
    feedbackPlaceholder: 'ನೈರ್ಮಲ್ಯ ತಂಡಕ್ಕೆ ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಬರೆಯಿರಿ...',
    btnSubmitFeedback: 'ರೇಟಿಂಗ್ ಮತ್ತು ಪ್ರತಿಕ್ರಿಯೆ ಸಲ್ಲಿಸಿ',
    feedbackSubmittedSuccess: 'ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಯು ಸಿಬ್ಬಂದಿಯ ಕಾರ್ಯಕ್ಷಮತೆಯನ್ನು ಸುಧಾರಿಸಲು ನೆರವಾಗುತ್ತದೆ.',
    quickPickTitle: 'ನಿಮ್ಮ ಇತ್ತೀಚಿನ ಸಲ್ಲಿಕೆಗಳಿಂದ ತ್ವರಿತವಾಗಿ ಆಯ್ಕೆಮಾಡಿ:',

    // Dashboards Common
    welcomeBack: 'ಸುಸ್ವಾಗತ',
    ecoPointsLabel: 'ಇಕೋ-ಪಾಯಿಂಟ್‌ಗಳು',
    badgesEarned: 'ಗಳಿಸಿದ ಬ್ಯಾಡ್ಜ್‌ಗಳು',
    recentComplaints: 'ನನ್ನ ಇತ್ತೀಚಿನ ವರದಿಗಳು',
    activePickupsTitle: 'ಸಕ್ರಿಯ ಮನೆಬಾಗಿಲಿನ ಪಿಕಪ್‌ಗಳು',
    staffTasksTitle: 'ನಿಯೋಜಿಸಲಾದ ಪುರಸಭೆ ನೈರ್ಮಲ್ಯ ಕಾರ್ಯಗಳು',
    adminConsoleTitle: 'ಕರ್ನಾಟಕ ಪುರಸಭೆ ಆಡಳಿತ ನಿಯಂತ್ರಣ ಫಲಕ',
    viewAll: 'ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ',
    noComplaintsFound: 'ಈ ಖಾತೆಯಲ್ಲಿ ಯಾವುದೇ ದೂರುಗಳು ದಾಖಲಾಗಿಲ್ಲ.',
    noPickupsFound: 'ಯಾವುದೇ ಪಿಕಪ್‌ಗಳು ನಿಗದಿಯಾಗಿಲ್ಲ.',
    colId: 'ಐಡಿ',
    colCategory: 'ವರ್ಗ',
    colLocation: 'ಸ್ಥಳ',
    colDate: 'ದಿನಾಂಕ',
    colStatus: 'ಸ್ಥಿತಿ',
    colAction: 'ಕ್ರಿಯೆ',

    // Staff Dashboard
    staffBadge: 'ಪುರಸಭೆ ನೈರ್ಮಲ್ಯ ತಂಡ',
    staffAssignedWards: 'ನಿಯೋಜಿತ ವಾರ್ಡ್ ಕರ್ತವ್ಯ',
    filterAllTasks: 'ಎಲ್ಲಾ ಕಾರ್ಯಗಳು',
    filterPending: 'ಪರಿಶೀಲನೆ ಬಾಕಿ',
    filterInProgress: 'ಪ್ರಗತಿಯಲ್ಲಿದೆ',
    filterResolved: 'ಸ್ವಚ್ಛಗೊಳಿಸಲಾಗಿದೆ',
    btnUpdateStatus: 'ಸ್ಥಿತಿಯನ್ನು ನವೀಕರಿಸಿ',
    modalUpdateTitle: 'ಸ್ವಚ್ಛತೆಯ ಪುರಾವೆ ಮತ್ತು ತೂಕ ದಾಖಲಿಸಿ',
    lblActualWeight: 'ಸಂಗ್ರಹಿಸಿದ ಕಸದ ನಿಜವಾದ ತೂಕ (ಕೆಜಿ)',
    lblUploadProof: 'ಸ್ವಚ್ಛಗೊಳಿಸಿದ ಸ್ಥಳದ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    btnConfirmResolution: 'ಪರಿಹರಿಸಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ',

    // Admin Dashboard
    adminBadge: 'ಕರ್ನಾಟಕ ನಗರಾಡಳಿತ (DMA / BBMP)',
    kpiTotalComplaints: 'ಒಟ್ಟು ದೂರುಗಳು',
    kpiResolvedRate: 'ಪರಿಹಾರದ ದರ',
    kpiWasteDiverted: 'ಮರುಬಳಕೆಯಾದ ತ್ಯಾಜ್ಯ',
    kpiActiveStaff: 'ಕರ್ತವ್ಯದಲ್ಲಿರುವ ಸಿಬ್ಬಂದಿ',
    tableWardsOverview: 'ವಾರ್ಡ್‌ವಾರು ದೂರು ಪರಿಹಾರ ಕಾರ್ಯಕ್ಷಮತೆ',
    btnExportCsv: 'ವರದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ (CSV)',
    colWardName: 'ವಾರ್ಡ್ ಮತ್ತು ವಲಯ',
    colAssignedOfficer: 'ಮುಖ್ಯ ನಿರೀಕ್ಷಕರು',
    colResolutionPct: 'ಪರಿಹಾರ %',

    // Auth Modal
    authModalTitleLogin: 'ಸ್ಮಾರ್ಟ್‌ವೇಸ್ಟ್‌ಗೆ ಲಾಗಿನ್ ಮಾಡಿ',
    authModalTitleRegister: 'ನಾಗರಿಕ ನೋಂದಣಿ',
    authPortalBadge: 'ಅಧಿಕೃತ ಪ್ರವೇಶ ಪೋರ್ಟಲ್',
    lblEmail: 'ಇಮೇಲ್ ವಿಳಾಸ',
    lblPassword: 'ಪಾಸ್‌ವರ್ಡ್',
    lblConfirmPassword: 'ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ',
    lblName: 'ಪೂರ್ಣ ಹೆಸರು',
    lblMobile: '೧೦-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    lblDistrict: 'ಜಿಲ್ಲೆ',
    lblTaluk: 'ತಾಲೂಕು',
    lblWard: 'ವಾರ್ಡ್',
    lblAddress: 'ವಾಸಸ್ಥಳದ ವಿಳಾಸ',
    lblTermsAgree: 'ನಾನು ಕರ್ನಾಟಕ ಪುರಸಭೆ ಘನತ್ಯಾಜ್ಯ ನಿರ್ವಹಣಾ ನಿಯಮಗಳಿಗೆ ಒಪ್ಪುತ್ತೇನೆ',
    btnSignIn: 'ಪೋರ್ಟಲ್‌ಗೆ ಪ್ರವೇಶಿಸಿ',
    btnRegisterCitizen: 'ನಾಗರಿಕ ಖಾತೆ ರಚಿಸಿ',
    demoAccountsNotice: 'ಪರೀಕ್ಷಾರ್ಥ ಡೆಮೊ ಖಾತೆಗಳು (ಯಾವುದೇ ಪಾತ್ರವನ್ನು ಪರೀಕ್ಷಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ):',

    // Common Statuses & Actions
    statusSubmitted: 'ಸಲ್ಲಿಸಲಾಗಿದೆ',
    statusUnderVerification: 'ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ',
    statusAssigned: 'ಸಿಬ್ಬಂದಿಗೆ ನಿಯೋಜಿಸಲಾಗಿದೆ',
    statusInProgress: 'ಪ್ರಗತಿಯಲ್ಲಿದೆ',
    statusResolved: 'ಪರಿಹರಿಸಲಾಗಿದೆ',
    statusClosed: 'ಮುಕ್ತಾಯಗೊಂಡಿದೆ',
    statusScheduled: 'ನಿಗದಿಯಾಗಿದೆ',
    statusCompleted: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    statusCancelled: 'ರದ್ದುಗೊಳಿಸಲಾಗಿದೆ',

    // Footer
    footerDesc: 'ಸ್ಮಾರ್ಟ್‌ವೇಸ್ಟ್ – ಕರ್ನಾಟಕದ ಸಮುದಾಯಗಳ ಸ್ವಚ್ಛತೆ ಮತ್ತು ಜವಾಬ್ದಾರಿಯುತ ತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ವೇದಿಕೆ.',
    footerProjectNotice: 'ಕರ್ನಾಟಕ-ಕೇಂದ್ರಿತ ಪರಿಸರ ಜಾಗೃತಿ ಮತ್ತು ತ್ಯಾಜ್ಯ ನಿರ್ವಹಣಾ ಶೈಕ್ಷಣಿಕ ಯೋಜನೆ.',
    quickLinks: 'ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು',
    contactEmergency: 'ಸಹಾಯವಾಣಿಗಳು ಮತ್ತು ದೂರುಗಳು',
    privacyPolicy: 'ಗೌಪ್ಯತಾ ನೀತಿ',
    termsConditions: 'ಬಳಕೆಯ ನಿಯಮಗಳು',
    allRightsReserved: 'ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
    cleanKarnatakaMission: 'ಸ್ವಚ್ಛ ಕರ್ನಾಟಕ ಅಭಿಯಾನ',
    cleanMissionNotice: 'ಪೌರಕಾರ್ಮಿಕರು ಮತ್ತು ಪರಿಸರವನ್ನು ರಕ್ಷಿಸಲು ನಿಮ್ಮ ಮನೆಬಾಗಿಲಿನಲ್ಲಿ ಹಸಿ, ಒಣ ಮತ್ತು ನೈರ್ಮಲ್ಯ ತ್ಯಾಜ್ಯವನ್ನು ಪ್ರತಿದಿನ ವಿಂಗಡಿಸಿ.',
    readManual: 'ವಿಂಗಡಣೆ ಕೈಪಿಡಿ ಓದಿ',
    projectScopeNoticeLabel: 'ಯೋಜನಾ ವ್ಯಾಪ್ತಿ ಸೂಚನೆ',
    karnatakaMunicipalities: 'ಕರ್ನಾಟಕದ ಮಹಾನಗರ ಪಾಲಿಕೆಗಳು',
    civicHelplineLabel: 'ನಾಗರಿಕ ದೂರು ಸಹಾಯವಾಣಿ',
    bbmpControlRoom: 'ಬಿಬಿಎಂಪಿ ನಿಯಂತ್ರಣ ಕೊಠಡಿ',
    grievanceEmailLabel: 'ದೂರು ಪೋರ್ಟಲ್ ಇಮೇಲ್',
    citizenCharterLabel: 'ನಾಗರಿಕ ಸನ್ನದು ಎಸ್‌ಎಲ್‌ಎ',
    citizenCharterDesc: 'ವರದಿಯಾದ ತ್ಯಾಜ್ಯ ತಾಣಗಳಿಗೆ ಗರಿಷ್ಠ 24–48 ಗಂಟೆಗಳ ಪರಿಹಾರ ಗಡುವು.',
    developedForKarnataka: 'ಕರ್ನಾಟಕದ ಸಮುದಾಯಗಳಿಗಾಗಿ ಅಭಿವೃದ್ಧಿಪಡಿಸಲಾಗಿದೆ',
    tollFree: 'ಶುಲ್ಕರಹಿತ'
  },
  hi: {
    // Header & Navigation
    govHeader: 'कर्नाटक सरकार',
    smartwasteTitle: 'स्मार्टवेस्ट – स्मार्ट अपशिष्ट पृथक्करण, जागरूकता और ट्रैकिंग मंच',
    smartwasteSubtitle: 'पूरे कर्नाटक में स्वच्छ और सतत अपशिष्ट प्रबंधन को सशक्त बनाना',
    karnatakaInitiativeBadge: 'कर्नाटक सरकार • नगर प्रशासन निदेशालय / बीबीएमपी ठोस अपशिष्ट प्रबंधन',
    home: 'होम',
    wasteSegregation: 'कचरा पृथक्करण',
    awareness: 'पर्यावरण जागरूकता',
    reportWaste: 'कचरा रिपोर्ट करें',
    requestPickup: 'पिकअप का अनुरोध करें',
    trackComplaint: 'शिकायत ट्रैक करें',
    collectionMap: 'संग्रहण मानचित्र',
    aboutUs: 'हमारे बारे में',
    helpSupport: 'सहायता और संपर्क',
    login: 'लॉग इन',
    register: 'पंजीकरण',
    logout: 'लॉग आउट',
    myDashboard: 'डैशबोर्ड',
    roleCitizen: 'नागरिक',
    roleStaff: 'सफाई कर्मी',
    roleAdmin: 'प्रशासक',
    notificationsTitle: 'सूचनाएं और अलर्ट',
    markAllAsRead: 'सभी को पढ़ा हुआ चिह्नित करें',
    noNotifications: 'वर्तमान में कोई नई सूचना नहीं है',
    emergencyHelplineLabel: 'बीबीएमपी / नगर प्रशासन कंट्रोल रूम: 1533',

    // Hero Section
    heroHeading: 'स्मार्टवेस्ट – स्वच्छ कर्नाटक के लिए स्मार्ट अपशिष्ट प्रबंधन',
    heroSubHeading: 'स्वच्छ कर्नाटक के लिए स्मार्ट अपशिष्ट प्रबंधन',
    heroDescription: 'कर्नाटक भर में कचरा पृथक्करण, पर्यावरण जागरूकता, जिम्मेदार संग्रह और स्वच्छ समुदायों को बढ़ावा देना।',
    btnReportWaste: 'कचरा रिपोर्ट करें',
    btnLearnSegregation: 'कचरा पृथक्करण सीखें',
    btnTrackComplaint: 'शिकायत ट्रैक करें',

    // Highlights & Stats
    statComplaints: 'प्रबंधित शिकायतें',
    statResolved: 'सुलझाई गई शिकायतें',
    statWasteRecycled: 'किलो पुनर्चक्रित कचरा',
    statActiveWards: 'सक्रिय वार्ड',

    // Homepage Source Segregation Standard
    secSegregationBadge: 'कर्नाटक नगर निगम मानक',
    secSegregationTitle: 'रंग-आधारित स्रोत पर कचरा पृथक्करण',
    secSegregationDesc: 'कर्नाटक की नगर पालिकाएं स्रोत पर 4-प्रकार के पृथक्करण को अनिवार्य करती हैं। पृथक्करण से 90% कचरा डंप होने से बचता है और सफाई कर्मियों के स्वास्थ्य की रक्षा होती है।',
    greenBinTitle: 'हरा कूड़ेदान',
    greenBinTime: 'प्रतिदिन सुबह',
    greenBinName: 'गीला / जैविक कचरा',
    greenBinDesc: 'नगर निगम कंपोस्टिंग के लिए जैविक भोजन के अवशेष, फल/सब्जी के छिलके, चाय पत्ती, सूखे पत्ते।',
    greenBinDo: 'भोजन, छिलके, अंडे के छिलके, फूल।',
    greenBinDont: 'प्लास्टिक थैली, डायपर, सैनिटरी पैड।',
    blueBinTitle: 'नीला कूड़ेदान',
    blueBinTime: 'सप्ताह में दो बार',
    blueBinName: 'सूखा रिसाइकिल कचरा',
    blueBinDesc: 'साफ कागज, अखबार, गत्ते, धातु के डिब्बे, एल्युमिनियम फॉयल, कांच की बोतलें।',
    blueBinDo: 'साफ कागज, डिब्बे, कांच, सूखे कैन।',
    blueBinDont: 'तैलीय पिज्जा बॉक्स, गंदा टिशू।',
    yellowBinTitle: 'पीला कूड़ेदान',
    yellowBinTime: 'रिसाइक्लिंग दिवस',
    yellowBinName: 'प्लास्टिक और पैकेजिंग',
    yellowBinDesc: 'धुली हुई दूध की थैलियां, एचडीपीई/पीपी डिब्बे, प्लास्टिक की बोतलें, पैकेजिंग फिल्म।',
    yellowBinDo: 'साफ दूध की थैलियां, बोतलें, ढक्कन।',
    yellowBinDont: 'प्रतिबंधित एकल-उपयोग प्लास्टिक थैलियां।',
    redBinTitle: 'लाल कूड़ेदान',
    redBinTime: 'लाल क्रॉस का निशान लगाएं',
    redBinName: 'घरेलू खतरनाक और सैनिटरी कचरा',
    redBinDesc: 'सैनिटरी पैड, डायपर, एक्सपायर्ड दवाएं, ब्लेड, पेंट के डिब्बे, ट्यूबलाइट, बैटरियां।',
    redBinDo: 'लाल क्रॉस चिह्नित कागज में लपेट कर दें।',
    redBinDont: 'गीले जैविक कचरे में कभी न मिलाएं।',
    exploreCategoriesBtn: 'सभी 14 अपशिष्ट श्रेणियां और निपटान नियम देखें',

    // How It Works
    howItWorksBadge: 'नागरिक निवारण जीवनचक्र',
    howItWorksTitle: 'स्मार्टवेस्ट कैसे काम करता है',
    howItWorksSubtitle: 'सड़कों पर कचरा जमा होने से रोकने के लिए 4-चरणीय पारदर्शी नागरिक प्रणाली।',
    step1Title: '१. नागरिक रिपोर्ट',
    step1Desc: 'स्थान चुनें, फोटो खींचें और 2 मिनट में विवरण जमा करें।',
    step2Title: '२. नगर निगम सत्यापन',
    step2Desc: 'वार्ड अधिकारी स्थान का सत्यापन कर नजदीकी सफाई दल को भेजते हैं।',
    step3Title: '३. स्थल पर संग्रहण',
    step3Desc: 'सफाई कर्मी कचरा हटाकर वजन दर्ज करते हैं और फोटो अपलोड करते हैं।',
    step4Title: '४. समाधान और फीडबैक',
    step4Desc: 'नागरिक अलर्ट पाते हैं, कार्य सत्यापन देखते हैं और रेटिंग देते हैं।',

    // Quick Municipal Services
    servicesBadge: 'नागरिक सेवाएं',
    servicesTitle: 'त्वरित नगरपालिका सेवाएं',
    servicesSubtitle: 'अपशिष्ट प्रबंधन और स्वच्छता उपकरणों तक सीधी पहुंच।',
    cardReportTitle: 'कचरा डंप की रिपोर्ट करें',
    cardReportDesc: 'जीपीएस लोकेशन और फोटो प्रमाण के साथ अवैध डंपिंग या कचरे के डिब्बे भरने की रिपोर्ट करें।',
    cardReportAction: '8-चरणीय पोर्टल खोलें',
    cardPickupTitle: 'भारी कचरा पिकअप का अनुरोध करें',
    cardPickupDesc: 'भारी फर्नीचर, निर्माण मलबे या ई-कचरे के लिए घर-घर पिकअप बुक करें।',
    cardPickupAction: 'स्लॉट बुक करें',
    cardTrackTitle: 'शिकायत की स्थिति देखें',
    cardTrackDesc: 'शिकायत दर्ज करने से लेकर सफाई दल द्वारा सफाई तक की लाइव प्रगति देखें।',
    cardTrackAction: 'आईडी द्वारा ट्रैक करें',
    cardMapTitle: 'वार्ड संग्रहण मानचित्र',
    cardMapDesc: 'सूखा कचरा संग्रहण केंद्र (DWCC), छंटाई केंद्र और वाहन मार्गों का इंटरैक्टिव मानचित्र।',
    cardMapAction: 'लाइव मैप देखें',

    // Quiz & Game Banner
    quizBannerBadge: 'इको-पॉइंट्स और ग्रीन सिटीजन प्रमाण पत्र कमाएं',
    quizTitle: 'कचरा पृथक्करण जागरूकता क्विज',
    quizSubtitle: 'अपने ज्ञान की जांच करें, इको-पॉइंट्स कमाएं और ग्रीन सिटीजन बैज प्राप्त करें।',
    startQuiz: 'क्विज शुरू करें',
    sortingGameBtn: 'कचरा छांटने का खेल',
    gameTitle: 'इंटरैक्टिव कचरा छांटने का खेल',
    gameSubtitle: 'कचरे को सही डिब्बे (हरा, नीला, लाल, काला) में डालकर अपना स्कोर बढ़ाएं!',

    // FAQs Section
    faqBadge: 'नागरिक मार्गदर्शन',
    faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
    faqSubtitle: 'कर्नाटक में ठोस कचरा पृथक्करण और निपटान के लिए मानक संचालन प्रक्रियाएं।',
    faq1Q: 'कर्नाटक के नगर निगमों में अनिवार्य "2-डस्टबिन-1-थैला" प्रणाली क्या है?',
    faq1A: 'कर्नाटक की नगर पालिकाएं 3 श्रेणियों में पृथक्करण अनिवार्य करती हैं: गीले कचरे के लिए हरा कूड़ेदान, सूखे रिसाइकिल कचरे के लिए नीला कूड़ेदान (या थैला), और सैनिटरी व खतरनाक कचरे के लिए लाल क्रॉस चिह्नित थैला।',
    faq2Q: 'मेरी दर्ज की गई कचरा शिकायत कितने समय में सुलझाई जाएगी?',
    faq2A: 'कर्नाटक नागरिक चार्टर के अनुसार, वार्ड अधिकारी 4 से 8 घंटे के भीतर निरीक्षण करते हैं और 24 से 48 घंटे में सफाई दल द्वारा समाधान किया जाता है।',
    faq3Q: 'पुराने फर्नीचर या भारी ई-कचरे के लिए पिकअप कैसे शेड्यूल करें?',
    faq3A: 'शीर्ष मेनू में "पिकअप का अनुरोध करें" चुनें, कचरे का प्रकार चुनें, पसंदीदा तारीख और समय स्लॉट चुनें; हमारा वाहन आपके दरवाजे पर पहुंचेगा।',
    faq4Q: 'पूरे कर्नाटक में कौन से प्लास्टिक पूरी तरह से प्रतिबंधित हैं?',
    faq4A: 'राज्य प्रदूषण नियंत्रण बोर्ड (KSPCB) के नियमों के तहत, 120 माइक्रोन से कम के एकल-उपयोग प्लास्टिक बैग, प्लास्टिक कटलरी, थर्माकोल सजावट पूर्णतः प्रतिबंधित हैं।',
    faq5Q: 'क्या कचरा पृथक्करण सीखने से मुझे पॉइंट्स या बैज मिल सकते हैं?',
    faq5A: 'जी हां! जब आप क्विज पूरी करते हैं और सफाई रिपोर्ट करते हैं, तो आपको इको-पॉइंट्स मिलते हैं और "ग्रीन सिटीजन" बैज अनलॉक होता है।',

    // Segregation Guide Page
    segGuideBadge: 'कर्नाटक ठोस अपशिष्ट नियमावली 2026',
    segGuideTitle: 'नगरपालिका अपशिष्ट पृथक्करण दिशानिर्देश',
    segGuideSubtitle: 'कर्नाटक नगर विकास विभाग द्वारा मान्यता प्राप्त 14 अपशिष्ट श्रेणियों का विस्तृत प्रोटोकॉल।',
    tabGuide: 'वर्गीकरण गाइड',
    tabGame: 'कचरा छांटने का खेल',
    tabCompost: 'घर पर कंपोस्टिंग',
    searchCategoryPlaceholder: 'कचरे का नाम, वस्तु या डिब्बे के रंग से खोजें...',
    filterAll: 'सभी श्रेणियां (14)',
    filterWet: 'गीला / जैविक',
    filterDry: 'सूखा रिसाइकिल',
    filterHazardous: 'सैनिटरी और खतरनाक',
    filterSpecial: 'ई-कचरा और भारी वस्तुएं',
    labelStandardRule: 'मानक नियम',
    labelCommonExamples: 'सामान्य उदाहरण:',
    labelProtocol: 'पृथक्करण प्रोटोकॉल:',
    labelDoNotMix: 'इसके साथ कभी न मिलाएं:',

    // Reporting Form (8 Steps)
    reportPageBadge: 'नागरिक शिकायत निवारण',
    reportPageTitle: 'सड़क किनारे कचरा और अवैध डंपिंग की रिपोर्ट करें',
    reportPageSubtitle: 'जीपीएस-सत्यापित फोटो साक्ष्य के साथ अपने वार्ड स्वच्छता अधिकारी को सीधे शिकायत दर्ज करें।',
    stepIndicator: 'चरण',
    stepCategory: 'कचरे की श्रेणी',
    stepQuantity: 'अनुमानित वजन',
    stepLocation: 'स्थान और वार्ड',
    stepMedia: 'फोटो और साक्ष्य',
    stepDescription: 'विवरण',
    stepContact: 'संपर्क सूत्र',
    stepReview: 'समीक्षा करें',
    stepSubmit: 'शिकायत दर्ज करें',
    btnNext: 'अगला चरण',
    btnBack: 'पिछला चरण',
    btnSubmitComplaint: 'शिकायत दर्ज करें',
    submitSuccess: 'शिकायत सफलतापूर्वक दर्ज हो गई!',
    complaintIdLabel: 'शिकायत ट्रैकिंग आईडी',
    detectGpsBtn: 'वर्तमान जीपीएस स्थान का स्वतः पता लगाएं',
    gpsDetecting: 'जीपीएस स्थान प्राप्त किया जा रहा है...',
    gpsDetectedSuccess: 'जीपीएस निर्देशांक सफलतापूर्वक दर्ज किए गए',
    uploadPhotosTitle: 'फोटो साक्ष्य अपलोड करें (अधिकतम 3 फोटो/वीडियो)',
    uploadPhotosDesc: 'स्पष्ट फोटो सफाई दल को उचित संग्रहण वाहन भेजने में मदद करती हैं।',
    descPlaceholder: 'सफाई दल के लिए विशिष्ट लैंडमार्क या कचरे की स्थिति का विवरण लिखें...',
    mobilePlaceholder: 'एसएमएस ट्रैकिंग अपडेट के लिए 10 अंकों का मोबाइल नंबर',
    successTitle: 'वार्ड कार्यालय में शिकायत दर्ज हो गई!',
    successDesc: 'आपकी शिकायत कर्नाटक नगरपालिका प्रणाली में दर्ज कर वार्ड निरीक्षक को भेज दी गई है।',
    trackNowBtn: 'शिकायत लाइव ट्रैक करें',
    fileComplaintAnotherBtn: 'एक और शिकायत दर्ज करें',

    // Pickup Request Page
    pickupTitle: 'घर-घर भारी कचरा संग्रहण',
    pickupSubtitle: 'पुराने फर्नीचर, इलेक्ट्रॉनिक्स और बगीचे के कचरे के लिए पिकअप बुक करें।',
    wasteTypeLabel: 'कचरे का प्रकार चुनें',
    estimatedQtyLabel: 'अनुमानित मात्रा (किलो / इकाई)',
    preferredDateLabel: 'पसंदीदा तारीख',
    preferredSlotLabel: 'उपलब्ध समय स्लॉट',
    addressLabel: 'पता और लैंडमार्क',
    instructionsLabel: 'विशेष निर्देश / नोट्स',
    btnBookPickup: 'पिकअप स्लॉट बुक करें',
    slotMorning: 'सुबह: 08:00 – 11:00 AM',
    slotAfternoon: 'दोपहर: 01:00 – 04:00 PM',
    slotEvening: 'शाम: 04:00 – 07:00 PM',
    pickupSuccessTitle: 'पिकअप सफलतापूर्वक निर्धारित!',
    pickupSuccessDesc: 'आपका पिकअप आरक्षण वार्ड सफाई दल को भेज दिया गया है।',

    // Tracking Page
    trackingTitle: 'रियल-टाइम शिकायत और पिकअप ट्रैकर',
    trackingSubtitle: 'सत्यापन, सफाई कर्मी की नियुक्ति और फोटो-सत्यापित कार्य प्रगति देखें।',
    enterComplaintId: 'शिकायत आईडी दर्ज करें (उदा: SW-2026-000001 या PK-2026-000001)',
    trackBtn: 'स्थिति देखें',
    statusLabel: 'वर्तमान स्थिति',
    assignedStaffLabel: 'नियुक्त सफाई अधिकारी',
    timelineLabel: 'सत्यापन और समाधान टाइमलाइन',
    rateService: 'सफाई सेवा को रेटिंग दें',
    ratingPrompt: 'सफाई की गति और गुणवत्ता से आप कितने संतुष्ट हैं?',
    feedbackPlaceholder: 'नगरपालिका सफाई दल के लिए अपनी प्रतिक्रिया लिखें...',
    btnSubmitFeedback: 'रेटिंग और फीडबैक जमा करें',
    feedbackSubmittedSuccess: 'धन्यवाद! आपकी प्रतिक्रिया सेवा गुणवत्ता में सुधार करने में मदद करती है।',
    quickPickTitle: 'अपनी हालिया शिकायतों में से तुरंत चुनें:',

    // Dashboards Common
    welcomeBack: 'स्वागत है',
    ecoPointsLabel: 'इको-पॉइंट्स',
    badgesEarned: 'अर्जित बैज',
    recentComplaints: 'मेरी हालिया शिकायतें',
    activePickupsTitle: 'सक्रिय डोरस्टेप पिकअप',
    staffTasksTitle: 'सफाई कार्य सूची',
    adminConsoleTitle: 'कर्नाटक नगर प्रशासन नियंत्रण कक्ष',
    viewAll: 'सभी देखें',
    noComplaintsFound: 'इस खाते के तहत अभी तक कोई शिकायत दर्ज नहीं है।',
    noPickupsFound: 'अभी तक कोई पिकअप निर्धारित नहीं है।',
    colId: 'आईडी',
    colCategory: 'श्रेणी',
    colLocation: 'स्थान',
    colDate: 'तारीख',
    colStatus: 'स्थिति',
    colAction: 'कार्य',

    // Staff Dashboard
    staffBadge: 'नगर निगम सफाई दस्ता',
    staffAssignedWards: 'आवंटित वार्ड ड्यूटी',
    filterAllTasks: 'सभी कार्य',
    filterPending: 'निरीक्षण लंबित',
    filterInProgress: 'प्रगति पर',
    filterResolved: 'साफ किया गया',
    btnUpdateStatus: 'सफाई स्थिति अपडेट करें',
    modalUpdateTitle: 'सफाई का प्रमाण और वजन दर्ज करें',
    lblActualWeight: 'एकत्रित कचरे का वास्तविक वजन (किलो)',
    lblUploadProof: 'साफ किए गए स्थान की फोटो अपलोड करें',
    btnConfirmResolution: 'समाधान के रूप में चिह्नित करें',

    // Admin Dashboard
    adminBadge: 'कर्नाटक नगर प्रशासन (DMA / BBMP)',
    kpiTotalComplaints: 'कुल शिकायतें',
    kpiResolvedRate: 'समाधान दर',
    kpiWasteDiverted: 'पुनर्चक्रित कचरा',
    kpiActiveStaff: 'ड्यूटी पर तैनात सफाई दल',
    tableWardsOverview: 'वार्ड-वार समाधान प्रदर्शन',
    btnExportCsv: 'रिपोर्ट डाउनलोड करें (CSV)',
    colWardName: 'वार्ड और ज़ोन',
    colAssignedOfficer: 'मुख्य निरीक्षक',
    colResolutionPct: 'समाधान %',

    // Auth Modal
    authModalTitleLogin: 'स्मार्टवेस्ट में लॉग इन करें',
    authModalTitleRegister: 'नागरिक पंजीकरण',
    authPortalBadge: 'आधिकारिक पोर्टल',
    lblEmail: 'ईमेल पता',
    lblPassword: 'पासवर्ड',
    lblConfirmPassword: 'पासवर्ड की पुष्टि करें',
    lblName: 'पूरा नाम',
    lblMobile: '10 अंकों का मोबाइल नंबर',
    lblDistrict: 'ज़िला',
    lblTaluk: 'तालुक',
    lblWard: 'वार्ड',
    lblAddress: 'निवास का पता',
    lblTermsAgree: 'मैं कर्नाटक नगर निगम ठोस अपशिष्ट प्रबंधन नियमों से सहमत हूं',
    btnSignIn: 'पोर्टल में प्रवेश करें',
    btnRegisterCitizen: 'नागरिक खाता बनाएं',
    demoAccountsNotice: 'मूल्यांकन डेमो खाते (किसी भी भूमिका का परीक्षण करने के लिए क्लिक करें):',

    // Common Statuses & Actions
    statusSubmitted: 'दर्ज किया गया',
    statusUnderVerification: 'सत्यापनाधीन',
    statusAssigned: 'सफाई कर्मी को सौंपा गया',
    statusInProgress: 'प्रगति पर',
    statusResolved: 'सुलझाया गया',
    statusClosed: 'बंद',
    statusScheduled: 'निर्धारित',
    statusCompleted: 'पूर्ण',
    statusCancelled: 'रद्द',

    // Footer
    footerDesc: 'स्मार्टवेस्ट – कर्नाटक के शहरों और गांवों में स्वच्छ समुदायों और जिम्मेदार अपशिष्ट प्रबंधन के लिए विकसित मंच।',
    footerProjectNotice: 'कर्नाटक केंद्रित पर्यावरण जागरूकता और कचरा प्रबंधन शैक्षणिक प्रमुख परियोजना।',
    quickLinks: 'त्वरित लिंक',
    contactEmergency: 'हेल्पलाइन और संपर्क',
    privacyPolicy: 'गोपनीयता नीति',
    termsConditions: 'उपयोग की शर्तें',
    allRightsReserved: 'सर्वाधिकार सुरक्षित।',
    cleanKarnatakaMission: 'स्वच्छ कर्नाटक अभियान',
    cleanMissionNotice: 'स्वच्छता कर्मियों और पर्यावरण की रक्षा के लिए प्रतिदिन अपने घर के द्वार पर गीला, सूखा और सैनिटरी कचरा अलग करें।',
    readManual: 'पृथक्करण नियमावली पढ़ें',
    projectScopeNoticeLabel: 'परियोजना दायरा सूचना',
    karnatakaMunicipalities: 'कर्नाटक नगर निगम',
    civicHelplineLabel: 'नागरिक शिकायत हेल्पलाइन',
    bbmpControlRoom: 'बीबीएमपी नियंत्रण कक्ष',
    grievanceEmailLabel: 'शिकायत पोर्टल ईमेल',
    citizenCharterLabel: 'नागरिक अधिकार पत्र',
    citizenCharterDesc: 'रिपोर्ट किए गए कचरा स्थलों के लिए अधिकतम 24-48 घंटे समाधान समय।',
    developedForKarnataka: 'कर्नाटक के समुदायों के लिए विकसित',
    tollFree: 'टोल-फ्री'
  }
};

// Helper translation functions
export function translateStatus(status: string, lang: Language): string {
  const norm = (status || '').toLowerCase().trim();
  const dict = translations[lang];
  if (norm.includes('submitted')) return dict.statusSubmitted;
  if (norm.includes('verification')) return dict.statusUnderVerification;
  if (norm.includes('assigned')) return dict.statusAssigned;
  if (norm.includes('progress')) return dict.statusInProgress;
  if (norm.includes('resolved')) return dict.statusResolved;
  if (norm.includes('closed')) return dict.statusClosed;
  if (norm.includes('scheduled')) return dict.statusScheduled;
  if (norm.includes('completed')) return dict.statusCompleted;
  if (norm.includes('cancelled')) return dict.statusCancelled;
  return status;
}

export function translateCategory(cat: string, lang: Language): string {
  if (lang === 'en') return cat;
  const norm = (cat || '').toLowerCase();
  if (norm.includes('wet') || norm.includes('biodegradable')) {
    return lang === 'kn' ? 'ಹಸಿ / ಜೈವಿಕ ತ್ಯಾಜ್ಯ' : 'गीला / जैविक कचरा';
  }
  if (norm.includes('dry') || norm.includes('recyclable')) {
    return lang === 'kn' ? 'ಒಣ / ಮರುಬಳಕೆಯಾಗುವ ತ್ಯಾಜ್ಯ' : 'सूखा / रिसाइकिल कचरा';
  }
  if (norm.includes('plastic')) {
    return lang === 'kn' ? 'ಪ್ಲಾಸ್ಟಿಕ್ ತ್ಯಾಜ್ಯ' : 'प्लास्टिक कचरा';
  }
  if (norm.includes('paper') || norm.includes('cardboard')) {
    return lang === 'kn' ? 'ಕಾಗದ ಮತ್ತು ಕಾರ್ಡ್‌ಬೋರ್ಡ್' : 'कागज और कार्डबोर्ड';
  }
  if (norm.includes('sanitary') || norm.includes('hazardous')) {
    return lang === 'kn' ? 'ನೈರ್ಮಲ್ಯ ಮತ್ತು ಅಪಾಯಕಾರಿ ತ್ಯಾಜ್ಯ' : 'सैनिटरी और खतरनाक कचरा';
  }
  if (norm.includes('e-waste') || norm.includes('electronic')) {
    return lang === 'kn' ? 'ಇ-ತ್ಯಾಜ್ಯ' : 'ई-कचरा';
  }
  if (norm.includes('bulk') || norm.includes('bulky')) {
    return lang === 'kn' ? 'ಬೃಹತ್ ಪೀಠೋಪಕರಣ ತ್ಯಾಜ್ಯ' : 'भारी फर्नीचर कचरा';
  }
  if (norm.includes('construction') || norm.includes('debris')) {
    return lang === 'kn' ? 'ಕಟ್ಟಡ ನಿರ್ಮಾಣ ಅವಶೇಷಗಳು' : 'निर्माण मलबा';
  }
  if (norm.includes('garden')) {
    return lang === 'kn' ? 'ಉದ್ಯಾನವನದ ಹಸಿರು ತ್ಯಾಜ್ಯ' : 'बगीचे का कचरा';
  }
  return cat;
}

export function translateRole(role: string, lang: Language): string {
  const norm = (role || '').toUpperCase();
  const dict = translations[lang];
  if (norm === 'CITIZEN') return dict.roleCitizen;
  if (norm === 'STAFF') return dict.roleStaff;
  if (norm === 'ADMIN') return dict.roleAdmin;
  return role;
}
