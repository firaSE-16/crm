import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User";
import Entry from "../models/Entry";
import { hashPassword } from "../lib/hash";

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI!);

  await User.deleteMany({});
  await Entry.deleteMany({});

  const password = await hashPassword("123456");

  const users = await User.create([
    {
      email: "manager@test.com",
      password,
      role: "manager",
    },
    {
      email: "user@test.com",
      password,
      role: "user",
    },
    {
      email: "user1@test.com",
      password,
      role: "user",
    },
    {
      email: "user2@test.com",
      password,
      role: "user",
    },
    {
      email: "user3@test.com",
      password,
      role: "user",
    },
    {
      email: "manager2@test.com",
      password,
      role: "manager",
    },
  ]);

  const manager = users.find((u: any) => u.email === "manager@test.com");
  const user = users.find((u: any) => u.email === "user@test.com");
  const user1 = users.find((u: any) => u.email === "user1@test.com");
  const user2 = users.find((u: any) => u.email === "user2@test.com");
  const user3 = users.find((u: any) => u.email === "user3@test.com");

  const entries = [];

  const titles = [
    "Office Supplies Purchase",
    "Marketing Campaign Budget",
    "Software License Renewal",
    "Equipment Maintenance",
    "Travel Expenses",
    "Training Program",
    "Website Development",
    "Consulting Services",
    "Hardware Upgrade",
    "Event Planning",
    "Research Project",
    "Client Meeting Expenses",
    "Product Launch",
    "Security Audit",
    "Cloud Services",
  ];

  const descriptions = [
    "Monthly office supplies order",
    "Q4 marketing campaign budget allocation",
    "Annual software license renewal",
    "Quarterly equipment maintenance",
    "Business travel expenses",
    "Employee training program",
    "Website redesign project",
    "External consulting services",
    "IT hardware upgrade",
    "Company event planning",
    "Market research project",
    "Client meeting and presentation",
    "New product launch campaign",
    "Annual security audit",
    "Cloud infrastructure services",
  ];

  const statuses: ("pending" | "approved" | "rejected")[] = [
    "pending",
    "approved",
    "rejected",
  ];

  for (let i = 0; i < 50; i++) {
    const randomUser = [user, user1, user2, user3][
      Math.floor(Math.random() * 4)
    ];
    const status = statuses[Math.floor(Math.random() * 3)];
    const titleIndex = i % titles.length;

    entries.push({
      title: titles[titleIndex],
      description: descriptions[titleIndex],
      amount: Math.floor(Math.random() * 10000) + 100,
      status,
      createdBy: randomUser!._id,
    });
  }

  await Entry.insertMany(entries);

  console.log(`Seed completed: ${users.length} users, ${entries.length} entries`);
  process.exit();
}

seed();