export const REG_PREFIX = "BIESF26-BD-";

export const formatRegId = (id: number) => `${REG_PREFIX}${String(id).padStart(4, "0")}`;

export const CATEGORIES = [
  { name: "Mathematics, Science & Technology", icon: "Sigma" },
  { name: "Environmental", icon: "Leaf" },
  { name: "IoT & Robotics", icon: "Bot" },
  { name: "Informatics & AI", icon: "BrainCircuit" },
  { name: "Life Sciences", icon: "Dna" },
  { name: "Social Sciences & Humanities", icon: "Users" },
  { name: "Physics, Energy & Engineering", icon: "Zap" },
  { name: "Health & Medicine", icon: "HeartPulse" },
] as const;

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

export const MODES = ["Offline (Bali)", "Online (Zoom)", "Not sure"] as const;
export const ENTRY_TYPES = ["Individual", "Team"] as const;
export const LEVELS = ["School", "College", "University"] as const;
export const PASSPORT_OPTIONS = ["Yes", "No", "Applying"] as const;
export const PROJECT_STAGES = ["Idea", "In progress", "Prototype", "Completed"] as const;
export const PAPER_READY = ["Yes", "In progress", "Need help"] as const;
export const HEARD_FROM = [
  "Facebook",
  "Instagram",
  "YouTube",
  "Friend / Classmate",
  "Teacher / Institution",
  "Previous DoB participant",
  "Other",
] as const;

export const STATUSES = [
  "New",
  "Under Review",
  "Interview",
  "Selected",
  "Waitlist",
  "Not Selected",
  "Confirmed",
  "Submitted to ICGI",
  "Competed",
  "Awarded",
] as const;

export const STATUS_STYLES: Record<string, string> = {
  New: "bg-sky-100 text-sky-800",
  "Under Review": "bg-indigo-100 text-indigo-800",
  Interview: "bg-violet-100 text-violet-800",
  Selected: "bg-emerald-100 text-emerald-800",
  Waitlist: "bg-amber-100 text-amber-800",
  "Not Selected": "bg-rose-100 text-rose-800",
  Confirmed: "bg-green-200 text-green-900",
  "Submitted to ICGI": "bg-blue-200 text-blue-900",
  Competed: "bg-orange-100 text-orange-800",
  Awarded: "bg-yellow-200 text-yellow-900",
};

/** The 8-step Bangladesh selection journey. Steps 1–6 = DoB, 7–8 = ICGI. */
export const SELECTION_STEPS = [
  { n: 1, title: "Register", text: "Fill in the form on this website and get your Registration ID.", by: "dob" },
  { n: 2, title: "Review", text: "DoB checks your project idea, category and details.", by: "dob" },
  { n: 3, title: "Interview", text: "A short Zoom or phone interview with the DoB team.", by: "dob" },
  { n: 4, title: "Result", text: "DoB tells you on WhatsApp/phone if you are selected.", by: "dob" },
  { n: 5, title: "Confirm", text: "Selected students confirm their place directly with DoB.", by: "dob" },
  { n: 6, title: "Prepare", text: "DoB helps with your paper, poster and presentation, and registers your team with ICGI.", by: "dob" },
  { n: 7, title: "Compete", text: "International round: in Bali ({offline}) or online on Zoom ({online}).", by: "icgi" },
  { n: 8, title: "Awards", text: "ICGI gives the awards; DoB posts Bangladesh results on this website.", by: "icgi" },
] as const;

export const DISTRICTS = [
  "Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola", "Bogura", "Brahmanbaria", "Chandpur",
  "Chapai Nawabganj", "Chattogram", "Chuadanga", "Cox's Bazar", "Cumilla", "Dhaka", "Dinajpur",
  "Faridpur", "Feni", "Gaibandha", "Gazipur", "Gopalganj", "Habiganj", "Jamalpur", "Jashore",
  "Jhalokathi", "Jhenaidah", "Joypurhat", "Khagrachhari", "Khulna", "Kishoreganj", "Kurigram",
  "Kushtia", "Lakshmipur", "Lalmonirhat", "Madaripur", "Magura", "Manikganj", "Meherpur",
  "Moulvibazar", "Munshiganj", "Mymensingh", "Naogaon", "Narail", "Narayanganj", "Narsingdi",
  "Natore", "Netrokona", "Nilphamari", "Noakhali", "Pabna", "Panchagarh", "Patuakhali", "Pirojpur",
  "Rajbari", "Rajshahi", "Rangamati", "Rangpur", "Satkhira", "Shariatpur", "Sherpur", "Sirajganj",
  "Sunamganj", "Sylhet", "Tangail", "Thakurgaon", "Outside Bangladesh",
];

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/biesf-2026", label: "BIESF 2026" },
  { href: "/how-to-join", label: "How to Join" },
  { href: "/support", label: "Support" },
  { href: "/achievements", label: "Achievements" },
  { href: "/news", label: "News & Results" },
  { href: "/gallery", label: "Gallery" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export const SUPPORT_ICONS = [
  "Sparkles", "GraduationCap", "FileText", "Presentation", "Plane", "Video", "ClipboardCheck",
  "MessagesSquare", "Lightbulb", "Users", "Globe", "Award",
];
