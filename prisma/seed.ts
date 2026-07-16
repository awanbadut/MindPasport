import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config();

neonConfig.fetchConnectionCache = true;
const connectionString = process.env.DATABASE_URL ?? "";
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });


async function main() {
  console.log("🌱 Mulai seeding database...");

  // ==================== SKILLS ====================
  const skills = await Promise.all([
    // Hard Skills - Data & Analytics
    prisma.skill.upsert({ where: { name: "Microsoft Excel" }, update: {}, create: { name: "Microsoft Excel", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "SQL" }, update: {}, create: { name: "SQL", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "Python" }, update: {}, create: { name: "Python", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "R Programming" }, update: {}, create: { name: "R Programming", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "Data Visualization" }, update: {}, create: { name: "Data Visualization", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "Statistik" }, update: {}, create: { name: "Statistik", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "Machine Learning" }, update: {}, create: { name: "Machine Learning", category: "Hard Skill" } }),
    // Hard Skills - Product & Design
    prisma.skill.upsert({ where: { name: "User Research" }, update: {}, create: { name: "User Research", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "Wireframing" }, update: {}, create: { name: "Wireframing", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "Prototyping" }, update: {}, create: { name: "Prototyping", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "Product Roadmapping" }, update: {}, create: { name: "Product Roadmapping", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "A/B Testing" }, update: {}, create: { name: "A/B Testing", category: "Hard Skill" } }),
    // Hard Skills - Software Engineering
    prisma.skill.upsert({ where: { name: "JavaScript" }, update: {}, create: { name: "JavaScript", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "TypeScript" }, update: {}, create: { name: "TypeScript", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "React.js" }, update: {}, create: { name: "React.js", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "Node.js" }, update: {}, create: { name: "Node.js", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "Git & Version Control" }, update: {}, create: { name: "Git & Version Control", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "RESTful API" }, update: {}, create: { name: "RESTful API", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "Database Design" }, update: {}, create: { name: "Database Design", category: "Hard Skill" } }),
    // Hard Skills - Marketing
    prisma.skill.upsert({ where: { name: "SEO & SEM" }, update: {}, create: { name: "SEO & SEM", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "Content Marketing" }, update: {}, create: { name: "Content Marketing", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "Social Media Marketing" }, update: {}, create: { name: "Social Media Marketing", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "Email Marketing" }, update: {}, create: { name: "Email Marketing", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "Google Analytics" }, update: {}, create: { name: "Google Analytics", category: "Hard Skill" } }),
    // Soft Skills
    prisma.skill.upsert({ where: { name: "Critical Thinking" }, update: {}, create: { name: "Critical Thinking", category: "Soft Skill" } }),
    prisma.skill.upsert({ where: { name: "Problem Solving" }, update: {}, create: { name: "Problem Solving", category: "Soft Skill" } }),
    prisma.skill.upsert({ where: { name: "Communication Skill" }, update: {}, create: { name: "Communication Skill", category: "Soft Skill" } }),
    prisma.skill.upsert({ where: { name: "Teamwork & Collaboration" }, update: {}, create: { name: "Teamwork & Collaboration", category: "Soft Skill" } }),
    prisma.skill.upsert({ where: { name: "Leadership" }, update: {}, create: { name: "Leadership", category: "Soft Skill" } }),
    prisma.skill.upsert({ where: { name: "Adaptability" }, update: {}, create: { name: "Adaptability", category: "Soft Skill" } }),
    prisma.skill.upsert({ where: { name: "Time Management" }, update: {}, create: { name: "Time Management", category: "Soft Skill" } }),
    prisma.skill.upsert({ where: { name: "Presentation Skill" }, update: {}, create: { name: "Presentation Skill", category: "Soft Skill" } }),
    prisma.skill.upsert({ where: { name: "Creativity & Innovation" }, update: {}, create: { name: "Creativity & Innovation", category: "Soft Skill" } }),
    prisma.skill.upsert({ where: { name: "Business Understanding" }, update: {}, create: { name: "Business Understanding", category: "Soft Skill" } }),
    // Tools & Technical
    prisma.skill.upsert({ where: { name: "Tableau" }, update: {}, create: { name: "Tableau", category: "Tools & Technical Competencies" } }),
    prisma.skill.upsert({ where: { name: "Power BI" }, update: {}, create: { name: "Power BI", category: "Tools & Technical Competencies" } }),
    prisma.skill.upsert({ where: { name: "Figma" }, update: {}, create: { name: "Figma", category: "Tools & Technical Competencies" } }),
    prisma.skill.upsert({ where: { name: "Adobe XD" }, update: {}, create: { name: "Adobe XD", category: "Tools & Technical Competencies" } }),
    prisma.skill.upsert({ where: { name: "Jira" }, update: {}, create: { name: "Jira", category: "Tools & Technical Competencies" } }),
    prisma.skill.upsert({ where: { name: "Notion" }, update: {}, create: { name: "Notion", category: "Tools & Technical Competencies" } }),
    prisma.skill.upsert({ where: { name: "Google Workspace" }, update: {}, create: { name: "Google Workspace", category: "Tools & Technical Competencies" } }),
    prisma.skill.upsert({ where: { name: "Meta Ads Manager" }, update: {}, create: { name: "Meta Ads Manager", category: "Tools & Technical Competencies" } }),
  ]);

  console.log(`✅ ${skills.length} skills created/updated`);

  // Helper function to get skill by name
  const getSkill = (name: string) => skills.find(s => s.name === name)!;

  // ==================== CAREER ROLES ====================
  const dataAnalyst = await prisma.careerRole.upsert({
    where: { title: "Data Analyst" },
    update: {},
    create: {
      title: "Data Analyst",
      category: "Data & Analytics",
      level: "Entry Level",
      description: "Menganalisis data untuk menghasilkan insight bisnis yang actionable, membuat laporan dan dashboard, serta mendukung pengambilan keputusan berbasis data.",
    },
  });

  const productManager = await prisma.careerRole.upsert({
    where: { title: "Product Manager" },
    update: {},
    create: {
      title: "Product Manager",
      category: "Product",
      level: "Mid",
      description: "Memimpin pengembangan produk digital dari ideasi hingga launch, berkolaborasi dengan tim engineering, design, dan bisnis.",
    },
  });

  const uiUxDesigner = await prisma.careerRole.upsert({
    where: { title: "UI/UX Designer" },
    update: {},
    create: {
      title: "UI/UX Designer",
      category: "Design",
      level: "Entry Level",
      description: "Merancang pengalaman pengguna dan antarmuka visual yang intuitif dan estetis untuk produk digital.",
    },
  });

  const softwareEngineer = await prisma.careerRole.upsert({
    where: { title: "Software Engineer" },
    update: {},
    create: {
      title: "Software Engineer",
      category: "Engineering",
      level: "Entry Level",
      description: "Membangun dan memelihara aplikasi perangkat lunak, bekerja dalam tim agile dengan kode berkualitas tinggi.",
    },
  });

  const digitalMarketer = await prisma.careerRole.upsert({
    where: { title: "Digital Marketer" },
    update: {},
    create: {
      title: "Digital Marketer",
      category: "Marketing",
      level: "Entry Level",
      description: "Merancang dan menjalankan strategi pemasaran digital melalui berbagai kanal online untuk meningkatkan brand awareness dan konversi.",
    },
  });

  const dataScientist = await prisma.careerRole.upsert({
    where: { title: "Data Scientist" },
    update: {},
    create: {
      title: "Data Scientist",
      category: "Data & Analytics",
      level: "Mid",
      description: "Mengembangkan model machine learning dan analisis prediktif untuk memecahkan masalah bisnis kompleks.",
    },
  });

  const frontendDeveloper = await prisma.careerRole.upsert({
    where: { title: "Frontend Developer" },
    update: {},
    create: {
      title: "Frontend Developer",
      category: "Engineering",
      level: "Entry Level",
      description: "Membangun antarmuka web yang responsif dan interaktif menggunakan teknologi modern seperti React, TypeScript, dan CSS.",
    },
  });

  const backendDeveloper = await prisma.careerRole.upsert({
    where: { title: "Backend Developer" },
    update: {},
    create: {
      title: "Backend Developer",
      category: "Engineering",
      level: "Entry Level",
      description: "Membangun server-side logic, API, dan integrasi database untuk mendukung aplikasi web dan mobile.",
    },
  });

  console.log(`✅ 8 career roles created/updated`);

  // ==================== INDUSTRY STANDARD SKILLS ====================
  // Data Analyst (total bobot = 100)
  const dataAnalystStandards = [
    { skill: "Microsoft Excel", weight: 10, score: 80 },
    { skill: "SQL", weight: 20, score: 85 },
    { skill: "Python", weight: 15, score: 75 },
    { skill: "Data Visualization", weight: 15, score: 80 },
    { skill: "Statistik", weight: 15, score: 75 },
    { skill: "Critical Thinking", weight: 10, score: 75 },
    { skill: "Problem Solving", weight: 8, score: 75 },
    { skill: "Communication Skill", weight: 5, score: 70 },
    { skill: "Business Understanding", weight: 2, score: 65 },
  ];

  for (const std of dataAnalystStandards) {
    const skill = getSkill(std.skill);
    if (!skill) continue;
    await prisma.industryStandardSkill.upsert({
      where: { careerRoleId_skillId: { careerRoleId: dataAnalyst.id, skillId: skill.id } },
      update: { weightPercent: std.weight, standardScore: std.score },
      create: { careerRoleId: dataAnalyst.id, skillId: skill.id, weightPercent: std.weight, standardScore: std.score },
    });
  }

  // Product Manager (total bobot = 100)
  const productManagerStandards = [
    { skill: "Product Roadmapping", weight: 20, score: 80 },
    { skill: "A/B Testing", weight: 10, score: 75 },
    { skill: "User Research", weight: 15, score: 80 },
    { skill: "Communication Skill", weight: 15, score: 85 },
    { skill: "Problem Solving", weight: 10, score: 80 },
    { skill: "Leadership", weight: 10, score: 75 },
    { skill: "Business Understanding", weight: 10, score: 80 },
    { skill: "Data Visualization", weight: 5, score: 65 },
    { skill: "Jira", weight: 5, score: 70 },
  ];

  for (const std of productManagerStandards) {
    const skill = getSkill(std.skill);
    if (!skill) continue;
    await prisma.industryStandardSkill.upsert({
      where: { careerRoleId_skillId: { careerRoleId: productManager.id, skillId: skill.id } },
      update: { weightPercent: std.weight, standardScore: std.score },
      create: { careerRoleId: productManager.id, skillId: skill.id, weightPercent: std.weight, standardScore: std.score },
    });
  }

  // UI/UX Designer (total bobot = 100)
  const uiUxStandards = [
    { skill: "Figma", weight: 25, score: 85 },
    { skill: "User Research", weight: 20, score: 80 },
    { skill: "Wireframing", weight: 15, score: 80 },
    { skill: "Prototyping", weight: 15, score: 80 },
    { skill: "Creativity & Innovation", weight: 10, score: 80 },
    { skill: "Communication Skill", weight: 8, score: 75 },
    { skill: "Problem Solving", weight: 7, score: 75 },
  ];

  for (const std of uiUxStandards) {
    const skill = getSkill(std.skill);
    if (!skill) continue;
    await prisma.industryStandardSkill.upsert({
      where: { careerRoleId_skillId: { careerRoleId: uiUxDesigner.id, skillId: skill.id } },
      update: { weightPercent: std.weight, standardScore: std.score },
      create: { careerRoleId: uiUxDesigner.id, skillId: skill.id, weightPercent: std.weight, standardScore: std.score },
    });
  }

  // Software Engineer (total bobot = 100)
  const softwareEngineerStandards = [
    { skill: "JavaScript", weight: 15, score: 80 },
    { skill: "Git & Version Control", weight: 15, score: 80 },
    { skill: "Database Design", weight: 10, score: 75 },
    { skill: "RESTful API", weight: 10, score: 80 },
    { skill: "Problem Solving", weight: 15, score: 80 },
    { skill: "Teamwork & Collaboration", weight: 10, score: 75 },
    { skill: "Communication Skill", weight: 10, score: 70 },
    { skill: "Python", weight: 10, score: 70 },
    { skill: "SQL", weight: 5, score: 70 },
  ];

  for (const std of softwareEngineerStandards) {
    const skill = getSkill(std.skill);
    if (!skill) continue;
    await prisma.industryStandardSkill.upsert({
      where: { careerRoleId_skillId: { careerRoleId: softwareEngineer.id, skillId: skill.id } },
      update: { weightPercent: std.weight, standardScore: std.score },
      create: { careerRoleId: softwareEngineer.id, skillId: skill.id, weightPercent: std.weight, standardScore: std.score },
    });
  }

  // Digital Marketer (total bobot = 100)
  const digitalMarketerStandards = [
    { skill: "SEO & SEM", weight: 20, score: 80 },
    { skill: "Content Marketing", weight: 15, score: 80 },
    { skill: "Social Media Marketing", weight: 15, score: 80 },
    { skill: "Google Analytics", weight: 15, score: 75 },
    { skill: "Email Marketing", weight: 10, score: 75 },
    { skill: "Meta Ads Manager", weight: 10, score: 75 },
    { skill: "Creativity & Innovation", weight: 10, score: 75 },
    { skill: "Communication Skill", weight: 5, score: 70 },
  ];

  for (const std of digitalMarketerStandards) {
    const skill = getSkill(std.skill);
    if (!skill) continue;
    await prisma.industryStandardSkill.upsert({
      where: { careerRoleId_skillId: { careerRoleId: digitalMarketer.id, skillId: skill.id } },
      update: { weightPercent: std.weight, standardScore: std.score },
      create: { careerRoleId: digitalMarketer.id, skillId: skill.id, weightPercent: std.weight, standardScore: std.score },
    });
  }

  // Data Scientist (total bobot = 100)
  const dataScientistStandards = [
    { skill: "Python", weight: 25, score: 85 },
    { skill: "Machine Learning", weight: 20, score: 80 },
    { skill: "Statistik", weight: 15, score: 85 },
    { skill: "SQL", weight: 10, score: 80 },
    { skill: "Data Visualization", weight: 10, score: 75 },
    { skill: "Problem Solving", weight: 10, score: 80 },
    { skill: "Communication Skill", weight: 5, score: 70 },
    { skill: "Critical Thinking", weight: 5, score: 80 },
  ];

  for (const std of dataScientistStandards) {
    const skill = getSkill(std.skill);
    if (!skill) continue;
    await prisma.industryStandardSkill.upsert({
      where: { careerRoleId_skillId: { careerRoleId: dataScientist.id, skillId: skill.id } },
      update: { weightPercent: std.weight, standardScore: std.score },
      create: { careerRoleId: dataScientist.id, skillId: skill.id, weightPercent: std.weight, standardScore: std.score },
    });
  }

  // Frontend Developer (total bobot = 100)
  const frontendDevStandards = [
    { skill: "React.js", weight: 25, score: 85 },
    { skill: "JavaScript", weight: 20, score: 85 },
    { skill: "TypeScript", weight: 15, score: 75 },
    { skill: "Git & Version Control", weight: 10, score: 80 },
    { skill: "Figma", weight: 10, score: 65 },
    { skill: "Problem Solving", weight: 10, score: 75 },
    { skill: "Teamwork & Collaboration", weight: 10, score: 75 },
  ];

  for (const std of frontendDevStandards) {
    const skill = getSkill(std.skill);
    if (!skill) continue;
    await prisma.industryStandardSkill.upsert({
      where: { careerRoleId_skillId: { careerRoleId: frontendDeveloper.id, skillId: skill.id } },
      update: { weightPercent: std.weight, standardScore: std.score },
      create: { careerRoleId: frontendDeveloper.id, skillId: skill.id, weightPercent: std.weight, standardScore: std.score },
    });
  }

  // Backend Developer (total bobot = 100)
  const backendDevStandards = [
    { skill: "Node.js", weight: 20, score: 85 },
    { skill: "SQL", weight: 15, score: 80 },
    { skill: "RESTful API", weight: 20, score: 85 },
    { skill: "Database Design", weight: 15, score: 80 },
    { skill: "Git & Version Control", weight: 10, score: 80 },
    { skill: "Problem Solving", weight: 10, score: 80 },
    { skill: "Teamwork & Collaboration", weight: 10, score: 75 },
  ];

  for (const std of backendDevStandards) {
    const skill = getSkill(std.skill);
    if (!skill) continue;
    await prisma.industryStandardSkill.upsert({
      where: { careerRoleId_skillId: { careerRoleId: backendDeveloper.id, skillId: skill.id } },
      update: { weightPercent: std.weight, standardScore: std.score },
      create: { careerRoleId: backendDeveloper.id, skillId: skill.id, weightPercent: std.weight, standardScore: std.score },
    });
  }

  console.log("✅ Industry standard skills seeded");
  console.log("🎉 Seeding selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
