const topics = [
  { name: "English", color: "sage", weeklyTime: 240, completedTime: 173 },
  { name: "Math", color: "red", weeklyTime: 360, completedTime: 239 },
  { name: "Chores", color: "yellow", weeklyTime: 120, completedTime: 40 },
  { name: "Astronomy", color: "blue", weeklyTime: 180, completedTime: 20 },
  { name: "CS", color: "salmon", weeklyTime: 400, completedTime: 80 },
  { name: "Spanish", color: "green", weeklyTime: 200, completedTime: 45 }
];

const tasks = [
  {name: "Essay", topic: "English", numBits: 3, complete: false, duedate: "2026-04-01", dueon: "", isLate: false, repeats: ""},
  {name: "Math Homework", topic: "Math", numBits: 2, complete: true, duedate: "2026-04-02", dueon: "", isLate: true, repeats: ""},
  {name: "Laundry", topic: "Chores", numBits: 1, complete: false, duedate: "2026-04-07", dueon: "", isLate: false, repeats: ""},
  {name: "Planet Paper", topic: "Astronomy", numBits: 4, complete: false, duedate: "2026-03-29", isLate: false, repeats: ""},
  {name: "Problem Set", topic: "CS", numBits: 4, complete: false, duedate: "", dueon: "friday" ,isLate: false, repeats: "weekly"},
  {name: "Duolingo", topic: "Spanish", numBits: 1, complete: false, duedate: "", dueon: "daily", isLate: false, repeats: true},
];

const bits = [
  { task: "Essay", description: "intro paragraph", dodate: "2026-03-24", complete: false, isLate: false, color: "sage" },
  { task: "Essay", description: "body paragraph 1", dodate: "2026-03-25", complete: false, isLate: false, color: "sage" },
  { task: "Essay", description: "body paragraph 2", dodate: "2026-03-26", complete: false, isLate: false, color: "sage" },
  { task: "Math Homework", description: "problem 1 & 2", dodate: "2026-03-27", complete: true, isLate: true, color: "red" },
  { task: "Math Homework", description: "problem 3 & 4", dodate: "2026-04-01", complete: true, isLate: true, color: "red" },
  { task: "Laundry", description: "laundry and this is a super long subtext and it prob", dodate: "2026-03-28", complete: false, isLate: false, color: "yellow" },
  { task: "Planet Paper", description: "research", dodate: "2026-03-29", complete: false, isLate: false, color: "blue" },
  { task: "Planet Paper", description: "outline", dodate: "2026-03-30", complete: false, isLate: false, color: "blue" },
  { task: "Planet Paper", description: "first draft", dodate: "2026-03-31", complete: false, isLate: false, color: "blue" },
  { task: "Planet Paper", description: "final draft", dodate: "2026-04-01", complete: false, isLate: false, color: "blue" },
  { task: "Problem Set", description: "part 1", dodate: "2026-03-27", complete: false, isLate: false, color: "salmon" },
  { task: "Problem Set", description: "part 2", dodate: "2026-03-30", complete: false, isLate: false, color: "salmon" },
  { task: "Problem Set", description: "part 3", dodate: "2026-04-02", complete: false, isLate: false, color: "salmon" },
  { task: "Problem Set", description: "part 4", dodate: "2026-04-05", complete: false, isLate: false, color: "salmon" },
  { task: "Duolingo", description: "1 lesson", dodate: "2026-03-24", complete: false, isLate: false, color: "green" },
]