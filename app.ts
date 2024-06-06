#!/usr/bin/env node

import inquirer from "inquirer";

let program = true;

let i: number = 10000;
function generateUniqueId(): number {
  return i++;
}

type Student = {
  id: number;
  name: string;
  course: string[];
  balance: number;
  fee: number;
  feeStatus: string;
};

const students: Student[] = [];

async function addStudent() {
  const answers = await inquirer.prompt([
    {
      name: "name",
      type: "input",
      message: "Enter Name: ",
      validate: (input) => (input ? true : "Name cannot be empty"),
    },
  ]);

  let studentName = answers.name.trim();

  if (studentName.includes(" ")) {
    let words: string[] = studentName.split(" ");

    studentName = words
      .map(
        (word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
      )
      .join(" ");
  } else {
    studentName =
      studentName.charAt(0).toUpperCase() + studentName.substr(1).toLowerCase();
  }

  const student: Student = {
    id: generateUniqueId(),
    name: studentName,
    course: [],
    balance: 1000,
    fee: 500,
    feeStatus: "Unpaid",
  };

  students.push(student);

  console.log(
    `Student ${student.name} added successfully with ID: ${student.id}`
  );
}

const courses = [
  {
    name: "TypeScript",
    cost: 20,
  },
  {
    name: "Python",
    cost: 50,
  },
  {
    name: "Gen AI",
    cost: 100,
  },
];

const getCourses = () => {
  return courses.map((course) => `${course.name} ($${course.cost})`);
};

async function enroll() {
  let student = await findStudent();

  if (!student) {
    console.log("Student ID not found.");
    return;
  }

  const enrollStudent = await inquirer.prompt([
    {
      name: "course",
      type: "list",
      choices: getCourses(),
      message: "Select a course to enroll in: ",
    },
  ]);

  const selectedCourseWithCost = enrollStudent.course;
  const selectedCourse = selectedCourseWithCost.split(" (")[0];
  const courseDetail = courses.find((course) => course.name === selectedCourse);

  if (!courseDetail) {
    console.log("Course not found.");
    return;
  }

  if (student.course.includes(selectedCourse)) {
    console.log(`Dear ${student.name}, You are already enrolled in ${selectedCourse}.`);
    return;
  } else {
    if (student.balance >= courseDetail.cost) {
      student.course.push(selectedCourse);
      student.balance -= courseDetail.cost;
      console.log(
        `Dear ${student.name}, You successfully enrolled in ${selectedCourse}. Remaining balance: $${student.balance}`
      );
    } else {
      console.log(`Insufficient balance to enroll in ${selectedCourse}.`);
    }
  }
}

async function balance() {
  let student = await findStudent();

  if (!student) {
    console.log("Student ID not found.");
    return;
  }

  console.log(`Student Name: ${student.name} \nBalance: $${student.balance}`);
}

async function payFee() {
  let student = await findStudent();

  if (!student) {
    console.log("Student ID not found.");
    return;
  }

  if (student.feeStatus === "Paid") {
    console.log(
      `Dear ${student.name}, you have already paid your tuition fee.`
    );
    console.log(`Your remaining balance is $${student.balance}.`);
  } else {
    let pay = await inquirer.prompt([
      {
        name: "fee",
        type: "list",
        choices: [500],
        message: "Enter amount: ",
      },
    ]);

    let remainingBalance = (student.balance -= pay.fee);
    student.balance = remainingBalance;
    student.feeStatus = "Paid";
    console.log(
      `${student.name}, you have successfully paid your tuition fee of $${pay.fee}`
    );
    console.log(`Your remaining balance is $${student.balance}.`);
  }
}

async function showStatus() {
  let student = await findStudent();
  if (!student) {
    console.log("Student ID not found.");
    return;
  }

  console.log("\n***** Student Status *****\n");
  console.log(`Student ID: ${student.id}`);
  console.log(`Student Name: ${student.name}`);
  console.log(`Student Course: ${student.course}`);
  console.log(`Student Balance: $${student.balance}`);
  console.log(`Tuition Fee: $${student.fee} (${student.feeStatus})`);
  console.log("");
}

async function findStudent() {
  const findStudent = await inquirer.prompt([
    {
      name: "stdID",
      type: "input",
      message: "Enter Student ID: ",
      validate: async (input) => {
        const parsedInput = parseInt(input);
        if (input.trim() === "" || isNaN(parsedInput) || parsedInput <= 0) {
          return "Please enter a valid ID.";
        }
        return true;
      },
    },
  ]);

  findStudent.stdID = parseInt(findStudent.stdID);
  return students.find((student) => student.id === findStudent.stdID);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function time() {
  await delay(2000);
  program = false;
  console.log("Exited.");
}

(async function main() {
  let array: string[] = [
    "Add New Student",
    "Enroll in Courses",
    "View Balance",
    "Pay Tuition Fee",
    "Show Status",
    "Exit",
  ];

  console.log("\n ===== Welcome to Student Management System. =====\n");

  while (program) {
    const work = await inquirer.prompt([
      {
        name: "do",
        type: "list",
        choices: array,
        message: "Select option: ",
      },
    ]);

    const index = array.indexOf(work.do);

    switch (index) {
      case 0:
        // Add New Student
        await addStudent();
        console.log("");
        break;
      case 1:
        // Enroll in Courses
        await enroll();
        console.log("");
        break;
      case 2:
        // View Balance
        await balance();
        console.log("");
        break;
      case 3:
        // Pay Tuition Fees
        await payFee();
        console.log("");
        break;
      case 4:
        // Show Status
        await showStatus();
        break;
      case 5:
        // Exit
        console.log("Exiting...");
        await time();
        break;
      default:
        console.log("Invalid choice.");
        break;
    }
  }
})();
