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
    // Hard Skills - Marketing, Media & Sales (Umum)
    prisma.skill.upsert({ where: { name: "SEO & SEM" }, update: {}, create: { name: "SEO & SEM", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "Content Marketing" }, update: {}, create: { name: "Content Marketing", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "Social Media Marketing" }, update: {}, create: { name: "Social Media Marketing", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "Email Marketing" }, update: {}, create: { name: "Email Marketing", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "Google Analytics" }, update: {}, create: { name: "Google Analytics", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "Copywriting & Storytelling" }, update: {}, create: { name: "Copywriting & Storytelling", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "Negosiasi Bisnis & B2B Sales" }, update: {}, create: { name: "Negosiasi Bisnis & B2B Sales", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "Public Relations & Media Relations" }, update: {}, create: { name: "Public Relations & Media Relations", category: "Hard Skill" } }),
    // Hard Skills - SDM, Manajemen & Operasional (Umum)
    prisma.skill.upsert({ where: { name: "Manajemen SDM & Rekrutmen" }, update: {}, create: { name: "Manajemen SDM & Rekrutmen", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "Hukum Ketenagakerjaan" }, update: {}, create: { name: "Hukum Ketenagakerjaan", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "Efisiensi Operasional" }, update: {}, create: { name: "Efisiensi Operasional", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "Supply Chain & Logistik" }, update: {}, create: { name: "Supply Chain & Logistik", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "Procurement & Vendor Management" }, update: {}, create: { name: "Procurement & Vendor Management", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "Project Management" }, update: {}, create: { name: "Project Management", category: "Hard Skill" } }),
    // Hard Skills - Keuangan & Akuntansi (Umum)
    prisma.skill.upsert({ where: { name: "Laporan Keuangan & Akuntansi" }, update: {}, create: { name: "Laporan Keuangan & Akuntansi", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "Financial Modeling & Valuasi" }, update: {}, create: { name: "Financial Modeling & Valuasi", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "Perpajakan & Brevet" }, update: {}, create: { name: "Perpajakan & Brevet", category: "Hard Skill" } }),
    prisma.skill.upsert({ where: { name: "Analisis Risiko Keuangan" }, update: {}, create: { name: "Analisis Risiko Keuangan", category: "Hard Skill" } }),

    // Soft Skills (Umum untuk semua bidang)
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
    prisma.skill.upsert({ where: { name: "Emphaty & Customer Relations" }, update: {}, create: { name: "Emphaty & Customer Relations", category: "Soft Skill" } }),

    // Tools & Technical Competencies
    prisma.skill.upsert({ where: { name: "Tableau" }, update: {}, create: { name: "Tableau", category: "Tools & Technical Competencies" } }),
    prisma.skill.upsert({ where: { name: "Power BI" }, update: {}, create: { name: "Power BI", category: "Tools & Technical Competencies" } }),
    prisma.skill.upsert({ where: { name: "Figma" }, update: {}, create: { name: "Figma", category: "Tools & Technical Competencies" } }),
    prisma.skill.upsert({ where: { name: "Adobe XD" }, update: {}, create: { name: "Adobe XD", category: "Tools & Technical Competencies" } }),
    prisma.skill.upsert({ where: { name: "Jira" }, update: {}, create: { name: "Jira", category: "Tools & Technical Competencies" } }),
    prisma.skill.upsert({ where: { name: "Notion" }, update: {}, create: { name: "Notion", category: "Tools & Technical Competencies" } }),
    prisma.skill.upsert({ where: { name: "Google Workspace" }, update: {}, create: { name: "Google Workspace", category: "Tools & Technical Competencies" } }),
    prisma.skill.upsert({ where: { name: "Meta Ads Manager" }, update: {}, create: { name: "Meta Ads Manager", category: "Tools & Technical Competencies" } }),
    prisma.skill.upsert({ where: { name: "SAP / Accurate System" }, update: {}, create: { name: "SAP / Accurate System", category: "Tools & Technical Competencies" } }),
    prisma.skill.upsert({ where: { name: "Canva & Visual Design" }, update: {}, create: { name: "Canva & Visual Design", category: "Tools & Technical Competencies" } }),
    prisma.skill.upsert({ where: { name: "Salesforce / Hubspot CRM" }, update: {}, create: { name: "Salesforce / Hubspot CRM", category: "Tools & Technical Competencies" } }),
    prisma.skill.upsert({ where: { name: "SPSS / Jamovi Statistical Software" }, update: {}, create: { name: "SPSS / Jamovi Statistical Software", category: "Tools & Technical Competencies" } }),
  ]);

  console.log(`✅ ${skills.length} skills created/updated`);

  // Helper function to get skill by name
  const getSkill = (name: string) => skills.find(s => s.name === name)!;

  // ==================== CAREER ROLES (Karier Umum & IT) ====================
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

  const hrSpecialist = await prisma.careerRole.upsert({
    where: { title: "Human Resources (HR) Officer" },
    update: {},
    create: {
      title: "Human Resources (HR) Officer",
      category: "Human Resources / SDM",
      level: "Entry Level",
      description: "Mengelola rekrutmen karyawan, administrasi kepegawaian, hubungan industrial, serta program pelatihan & pengembangan talent perusahaan.",
    },
  });

  const financialAnalyst = await prisma.careerRole.upsert({
    where: { title: "Financial Analyst" },
    update: {},
    create: {
      title: "Financial Analyst",
      category: "Keuangan & Perbankan",
      level: "Entry Level",
      description: "Melakukan analisis kelayakan keuangan, peramalan anggaran (budget forecasting), serta menyusun laporan performa investasi perusahaan.",
    },
  });

  const operationsManager = await prisma.careerRole.upsert({
    where: { title: "Business Operations Specialist" },
    update: {},
    create: {
      title: "Business Operations Specialist",
      category: "Manajemen & Operasional",
      level: "Entry Level",
      description: "Mengoptimalkan proses bisnis harian, efisiensi alur kerja operasional, serta berkolaborasi lintas divisi untuk mencapai KPI perusahaan.",
    },
  });

  const contentCreator = await prisma.careerRole.upsert({
    where: { title: "Content Creator & Copywriter" },
    update: {},
    create: {
      title: "Content Creator & Copywriter",
      category: "Media & Kreatif",
      level: "Entry Level",
      description: "Membuat konten kreatif menarik (teks, gambar, video) untuk kampanye brand, media sosial, serta menyusun narasi promosi yang persuasif.",
    },
  });

  const accountExecutive = await prisma.careerRole.upsert({
    where: { title: "Account Executive (Sales B2B)" },
    update: {},
    create: {
      title: "Account Executive (Sales B2B)",
      category: "Bisnis & Penjualan",
      level: "Entry Level",
      description: "Membangun hubungan dengan klien bisnis, melakukan negosiasi penawaran, serta mencapai target penjualan produk/layanan perusahaan.",
    },
  });

  const prSpecialist = await prisma.careerRole.upsert({
    where: { title: "Public Relations (PR) Officer" },
    update: {},
    create: {
      title: "Public Relations (PR) Officer",
      category: "Komunikasi & PR",
      level: "Entry Level",
      description: "Menjaga reputasi positif perusahaan di mata publik, mengelola siaran pers (press release), serta menjalin komunikasi erat dengan media.",
    },
  });

  const supplyChainSpecialist = await prisma.careerRole.upsert({
    where: { title: "Supply Chain & Logistics Officer" },
    update: {},
    create: {
      title: "Supply Chain & Logistics Officer",
      category: "Logistik & Operasional",
      level: "Entry Level",
      description: "Mengawasi alur pengadaan barang (procurement), manajemen persediaan (inventory control), serta efisiensi distribusi logistik.",
    },
  });

  const accountingOfficer = await prisma.careerRole.upsert({
    where: { title: "Accounting & Tax Staff" },
    update: {},
    create: {
      title: "Accounting & Tax Staff",
      category: "Keuangan & Akuntansi",
      level: "Entry Level",
      description: "Menyusun jurnal transaksi harian, laporan laba rugi, neraca perusahaan, serta pelaporan pajak badan dan perorangan.",
    },
  });

  console.log(`✅ 13 career roles (Umum + IT) created/updated`);

  // ==================== INDUSTRY STANDARD SKILLS ====================
  // Data Analyst
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

  // HR Officer (Karier Umum)
  const hrStandards = [
    { skill: "Manajemen SDM & Rekrutmen", weight: 25, score: 85 },
    { skill: "Hukum Ketenagakerjaan", weight: 20, score: 80 },
    { skill: "Communication Skill", weight: 20, score: 85 },
    { skill: "Emphaty & Customer Relations", weight: 10, score: 80 },
    { skill: "Presentation Skill", weight: 10, score: 75 },
    { skill: "Problem Solving", weight: 10, score: 75 },
    { skill: "Google Workspace", weight: 5, score: 70 },
  ];
  for (const std of hrStandards) {
    const skill = getSkill(std.skill);
    if (!skill) continue;
    await prisma.industryStandardSkill.upsert({
      where: { careerRoleId_skillId: { careerRoleId: hrSpecialist.id, skillId: skill.id } },
      update: { weightPercent: std.weight, standardScore: std.score },
      create: { careerRoleId: hrSpecialist.id, skillId: skill.id, weightPercent: std.weight, standardScore: std.score },
    });
  }

  // Financial Analyst (Karier Umum)
  const financialStandards = [
    { skill: "Laporan Keuangan & Akuntansi", weight: 25, score: 85 },
    { skill: "Financial Modeling & Valuasi", weight: 20, score: 80 },
    { skill: "Microsoft Excel", weight: 20, score: 90 },
    { skill: "Analisis Risiko Keuangan", weight: 15, score: 75 },
    { skill: "Critical Thinking", weight: 10, score: 80 },
    { skill: "Business Understanding", weight: 10, score: 80 },
  ];
  for (const std of financialStandards) {
    const skill = getSkill(std.skill);
    if (!skill) continue;
    await prisma.industryStandardSkill.upsert({
      where: { careerRoleId_skillId: { careerRoleId: financialAnalyst.id, skillId: skill.id } },
      update: { weightPercent: std.weight, standardScore: std.score },
      create: { careerRoleId: financialAnalyst.id, skillId: skill.id, weightPercent: std.weight, standardScore: std.score },
    });
  }

  // Business Operations Specialist (Karier Umum)
  const opsStandards = [
    { skill: "Efisiensi Operasional", weight: 25, score: 85 },
    { skill: "Project Management", weight: 20, score: 80 },
    { skill: "Problem Solving", weight: 15, score: 85 },
    { skill: "Leadership", weight: 15, score: 75 },
    { skill: "Communication Skill", weight: 15, score: 80 },
    { skill: "Microsoft Excel", weight: 10, score: 75 },
  ];
  for (const std of opsStandards) {
    const skill = getSkill(std.skill);
    if (!skill) continue;
    await prisma.industryStandardSkill.upsert({
      where: { careerRoleId_skillId: { careerRoleId: operationsManager.id, skillId: skill.id } },
      update: { weightPercent: std.weight, standardScore: std.score },
      create: { careerRoleId: operationsManager.id, skillId: skill.id, weightPercent: std.weight, standardScore: std.score },
    });
  }

  // Content Creator & Copywriter (Karier Umum)
  const contentStandards = [
    { skill: "Copywriting & Storytelling", weight: 30, score: 85 },
    { skill: "Content Marketing", weight: 20, score: 80 },
    { skill: "Social Media Marketing", weight: 15, score: 80 },
    { skill: "Creativity & Innovation", weight: 15, score: 85 },
    { skill: "Canva & Visual Design", weight: 10, score: 75 },
    { skill: "Communication Skill", weight: 10, score: 80 },
  ];
  for (const std of contentStandards) {
    const skill = getSkill(std.skill);
    if (!skill) continue;
    await prisma.industryStandardSkill.upsert({
      where: { careerRoleId_skillId: { careerRoleId: contentCreator.id, skillId: skill.id } },
      update: { weightPercent: std.weight, standardScore: std.score },
      create: { careerRoleId: contentCreator.id, skillId: skill.id, weightPercent: std.weight, standardScore: std.score },
    });
  }

  // Account Executive (Sales B2B) (Karier Umum)
  const salesStandards = [
    { skill: "Negosiasi Bisnis & B2B Sales", weight: 30, score: 85 },
    { skill: "Communication Skill", weight: 20, score: 90 },
    { skill: "Presentation Skill", weight: 15, score: 80 },
    { skill: "Salesforce / Hubspot CRM", weight: 15, score: 75 },
    { skill: "Emphaty & Customer Relations", weight: 10, score: 80 },
    { skill: "Business Understanding", weight: 10, score: 75 },
  ];
  for (const std of salesStandards) {
    const skill = getSkill(std.skill);
    if (!skill) continue;
    await prisma.industryStandardSkill.upsert({
      where: { careerRoleId_skillId: { careerRoleId: accountExecutive.id, skillId: skill.id } },
      update: { weightPercent: std.weight, standardScore: std.score },
      create: { careerRoleId: accountExecutive.id, skillId: skill.id, weightPercent: std.weight, standardScore: std.score },
    });
  }

  // Public Relations Officer (Karier Umum)
  const prStandards = [
    { skill: "Public Relations & Media Relations", weight: 30, score: 85 },
    { skill: "Communication Skill", weight: 25, score: 90 },
    { skill: "Copywriting & Storytelling", weight: 15, score: 80 },
    { skill: "Presentation Skill", weight: 15, score: 80 },
    { skill: "Adaptability", weight: 15, score: 80 },
  ];
  for (const std of prStandards) {
    const skill = getSkill(std.skill);
    if (!skill) continue;
    await prisma.industryStandardSkill.upsert({
      where: { careerRoleId_skillId: { careerRoleId: prSpecialist.id, skillId: skill.id } },
      update: { weightPercent: std.weight, standardScore: std.score },
      create: { careerRoleId: prSpecialist.id, skillId: skill.id, weightPercent: std.weight, standardScore: std.score },
    });
  }

  // Supply Chain & Logistics Officer (Karier Umum)
  const supplyChainStandards = [
    { skill: "Supply Chain & Logistik", weight: 30, score: 85 },
    { skill: "Procurement & Vendor Management", weight: 25, score: 80 },
    { skill: "Microsoft Excel", weight: 15, score: 80 },
    { skill: "Problem Solving", weight: 15, score: 80 },
    { skill: "SAP / Accurate System", weight: 15, score: 70 },
  ];
  for (const std of supplyChainStandards) {
    const skill = getSkill(std.skill);
    if (!skill) continue;
    await prisma.industryStandardSkill.upsert({
      where: { careerRoleId_skillId: { careerRoleId: supplyChainSpecialist.id, skillId: skill.id } },
      update: { weightPercent: std.weight, standardScore: std.score },
      create: { careerRoleId: supplyChainSpecialist.id, skillId: skill.id, weightPercent: std.weight, standardScore: std.score },
    });
  }

  // Accounting & Tax Staff (Karier Umum)
  const accountingStandards = [
    { skill: "Laporan Keuangan & Akuntansi", weight: 35, score: 90 },
    { skill: "Perpajakan & Brevet", weight: 25, score: 85 },
    { skill: "Microsoft Excel", weight: 20, score: 85 },
    { skill: "SAP / Accurate System", weight: 10, score: 75 },
    { skill: "Critical Thinking", weight: 10, score: 75 },
  ];
  for (const std of accountingStandards) {
    const skill = getSkill(std.skill);
    if (!skill) continue;
    await prisma.industryStandardSkill.upsert({
      where: { careerRoleId_skillId: { careerRoleId: accountingOfficer.id, skillId: skill.id } },
      update: { weightPercent: std.weight, standardScore: std.score },
      create: { careerRoleId: accountingOfficer.id, skillId: skill.id, weightPercent: std.weight, standardScore: std.score },
    });
  }

  // Product Manager
  const productManagerStandards = [
    { skill: "Product Roadmapping", weight: 20, score: 80 },
    { skill: "A/B Testing", weight: 10, score: 75 },
    { skill: "User Research", weight: 15, score: 80 },
    { skill: "Communication Skill", weight: 15, score: 85 },
    { skill: "Problem Solving", weight: 10, score: 80 },
    { skill: "Leadership", weight: 10, score: 75 },
    { skill: "Business Understanding", weight: 10, score: 80 },
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

  // UI/UX Designer
  const uiUxStandards = [
    { skill: "Figma", weight: 25, score: 85 },
    { skill: "User Research", weight: 20, score: 80 },
    { skill: "Wireframing", weight: 15, score: 80 },
    { skill: "Prototyping", weight: 15, score: 80 },
    { skill: "Creativity & Innovation", weight: 15, score: 80 },
    { skill: "Communication Skill", weight: 10, score: 75 },
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

  // Digital Marketer
  const digitalMarketerStandards = [
    { skill: "SEO & SEM", weight: 20, score: 80 },
    { skill: "Content Marketing", weight: 15, score: 80 },
    { skill: "Social Media Marketing", weight: 15, score: 80 },
    { skill: "Google Analytics", weight: 15, score: 75 },
    { skill: "Email Marketing", weight: 10, score: 75 },
    { skill: "Meta Ads Manager", weight: 15, score: 75 },
    { skill: "Communication Skill", weight: 10, score: 70 },
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

  // Software Engineer
  const softwareEngineerStandards = [
    { skill: "JavaScript", weight: 15, score: 80 },
    { skill: "Git & Version Control", weight: 15, score: 80 },
    { skill: "Database Design", weight: 15, score: 75 },
    { skill: "RESTful API", weight: 15, score: 80 },
    { skill: "Problem Solving", weight: 20, score: 80 },
    { skill: "Teamwork & Collaboration", weight: 20, score: 75 },
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
