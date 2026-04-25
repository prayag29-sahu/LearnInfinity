const mongoose = require("mongoose");

const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

const User     = require("./models/User");
const Category = require("./models/Category");
const Content  = require("./models/Content");

const categories = [
  // School — CBSE
  { name: "CBSE", slug: "cbse", level: "board", board: "CBSE", parent: null, order: 1 },
  { name: "Class 10", slug: "cbse-class-10", level: "class", board: "CBSE", order: 1 },
  { name: "Class 12", slug: "cbse-class-12", level: "class", board: "CBSE", order: 2 },
  { name: "Mathematics", slug: "cbse-10-maths", level: "subject", board: "CBSE", order: 1 },
  { name: "Science",     slug: "cbse-10-science", level: "subject", board: "CBSE", order: 2 },
  { name: "Physics",     slug: "cbse-12-physics",   level: "subject", board: "CBSE", order: 1 },
  { name: "Chemistry",   slug: "cbse-12-chemistry",  level: "subject", board: "CBSE", order: 2 },
  { name: "Biology",     slug: "cbse-12-biology",    level: "subject", board: "CBSE", order: 3 },

  // Competitive Exams
  { name: "JEE",  slug: "jee",  level: "exam", order: 1, parent: null },
  { name: "NEET", slug: "neet", level: "exam", order: 2, parent: null },
  { name: "UPSC", slug: "upsc", level: "exam", order: 3, parent: null },
  { name: "GATE", slug: "gate", level: "exam", order: 4, parent: null },

  // Higher Education
  { name: "Engineering", slug: "engineering", level: "stream", order: 1, parent: null },
  { name: "Medical",     slug: "medical",     level: "stream", order: 2, parent: null },
  { name: "Law",         slug: "law",         level: "stream", order: 3, parent: null },
  { name: "Business",    slug: "business",    level: "stream", order: 4, parent: null },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Content.deleteMany({});
    console.log("Existing data cleared.");

    // Create admin user
    const admin = await User.create({
      name:       "LearnInfinity Admin",
      email:      "admin@learninfinity.in",
      password:   "Admin@123",
      role:       "admin",
      isVerified: true,
      isActive:   true,
    });
    console.log(`Admin created: ${admin.email} / password: Admin@123`);


    // Create demo teacher
    const teacher = await User.create({
      name: "Demo Teacher",
      email: "teacher@learninfinity.in",
      password: "Teacher@123",
      role: "teacher",
      bio: "Mathematics teacher with 5 years experience",
      expertise: ["Mathematics", "Physics"],
      isVerified: true,
      isActive: true,
    });
    console.log(`Teacher created: ${teacher.email} / password: Teacher@123`);

    // Create demo student
    const student = await User.create({
      name: "Demo Student",
      email: "student@learninfinity.in",
      password: "Student@123",
      role: "student",
      board: "CBSE",
      classLevel: "Class 12",
      medium: "English",
      subjects: ["Physics", "Chemistry", "Mathematics"],
      examTarget: "JEE",
      isVerified: true,
      isActive: true,
    });


    console.log(`Student created: ${student.email} / password: Student@123`);

    // Seed categories (without parent links first)
    const rootCats = categories.filter((c) => c.parent === null);
    const savedRoots = {};
    for (const cat of rootCats) {
      const saved = await Category.create({ ...cat, parent: null });
      savedRoots[cat.slug] = saved._id;
    }

    // Seed child categories with parent links
    const childCats = [
      { name: "Class 10", slug: "cbse-class-10", level: "class", board: "CBSE", parentSlug: "cbse", order: 1 },
      { name: "Class 12", slug: "cbse-class-12", level: "class", board: "CBSE", parentSlug: "cbse", order: 2 },
    ];
    const savedChilds = {};
    for (const cat of childCats) {
      const saved = await Category.create({
        name: cat.name, slug: cat.slug, level: cat.level,
        board: cat.board, order: cat.order,
        parent: savedRoots[cat.parentSlug] || null,
      });
      savedChilds[cat.slug] = saved._id;
    }

    // Seed subjects under Class 10
    const subjects10 = [
      { name: "Mathematics", slug: "cbse-10-maths",   subject: "Mathematics" },
      { name: "Science",     slug: "cbse-10-science",  subject: "Science" },
      { name: "English",     slug: "cbse-10-english",  subject: "English" },
      { name: "Social Science", slug: "cbse-10-sst",   subject: "Social Science" },
    ];
    const savedSubjects = {};
    for (const sub of subjects10) {
      const saved = await Category.create({
        name: sub.name, slug: sub.slug, level: "subject",
        board: "CBSE", parent: savedChilds["cbse-class-10"],
      });
      savedSubjects[sub.slug] = saved._id;
    }

    // Seed sample content
    const sampleContent = [
      {
        title:       "CBSE Class 10 Maths — Real Numbers | Chapter 1 Full Explanation",
        url:         "https://www.youtube.com/watch?v=example1",
        type:        "video",
        category:    savedSubjects["cbse-10-maths"],
        board:       "CBSE",
        classLevel:  "Class 10",
        subject:     "Mathematics",
        medium:      "English",
        difficulty:  "basic",
        tags:        ["real numbers", "class10", "cbse", "maths"],
        description: "Complete explanation of CBSE Class 10 Chapter 1 Real Numbers",
        addedBy:     admin._id,
        isFeatured:  true,
      },
      {
        title:       "CBSE Class 10 Science — Life Processes Full Chapter",
        url:         "https://www.youtube.com/watch?v=example2",
        type:        "video",
        category:    savedSubjects["cbse-10-science"],
        board:       "CBSE",
        classLevel:  "Class 10",
        subject:     "Science",
        medium:      "English",
        difficulty:  "basic",
        tags:        ["life processes", "class10", "cbse", "science", "biology"],
        addedBy:     admin._id,
      },
      {
        title:       "JEE Mains 2023 Previous Year Question Paper with Solutions",
        url:         "https://example.com/jee-2023-pyq.pdf",
        type:        "pyq",
        category:    savedRoots["jee"],
        examType:    "JEE",
        medium:      "English",
        difficulty:  "advanced",
        tags:        ["jee", "pyq", "2023", "mains"],
        year:        2023,
        addedBy:     admin._id,
        isFeatured:  true,
      },
    ];

    await Content.insertMany(sampleContent);
    
    console.log(`Seeded ${sampleContent.length} sample content items.`);
    console.log("\nDatabase seeded successfully!\n");
    console.log("Login credentials:");
    console.log("Admin:   admin@learninfinity.in   / Admin@123");
    console.log("Teacher: teacher@learninfinity.in / Teacher@123");
    console.log("Student: student@learninfinity.in / Student@123\n");

    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exit(1);
  }
};

seedDB();
