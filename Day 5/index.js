var a = 5;
var b = 10;
var sum = a + b;
document.write("The Sum of a & b is: " + sum + "<br>");

var English = 80;
var Urdu = 75;
var Math = 90;
var totalMarks = 300;
var obtainedMarks = English + Urdu + Math;
var percentage = (obtainedMarks / totalMarks) * 100;
var average = obtainedMarks / 3;

document.write("Obtained Marks: " + obtainedMarks + "<br>");
document.write("Percentage: " + percentage + "%<br>");
document.write("Total Marks: " + totalMarks + "<br>");
document.write("Average Marks: " + average + "<br>");

if (percentage >= 80) {
  document.write("Grade: A-one<br>");
  document.write("Remarks: Excellent<br>");
} else if (percentage >= 70) {
  document.write("Grade: A<br>");
  document.write("Remarks: Good<br>");
} else if (percentage >= 60) {
  document.write("Grade: B<br>");
  document.write("Remarks: You need to improve<br>");
} else {
  document.write("Grade: Fail<br>");
  document.write("Remarks: Sorry<br>");
}

var age = 71;
if (age >= 18 && age <= 60) {
  document.write("You are old enough to drive.<br>");
} else if (age > 60) {
  document.write("You might need to consider alternative transportation.<br>");
} else {
  document.write("You are too young to drive.<br>");
}

var num = 9;
var range = 1;

document.writeln("<h4>Table of " + num + "</h4>");

for (let i = 10; i >= range; i--) {
  document.writeln(num + " x " + i + " = " + num * i + "<br>");
}

document.writeln("<h4>Functions</h4>");

function myfunc(a, b) {
  return a + b;
}

let value = myfunc(5, 7);
document.writeln(value + "<br>");

function TotalMarks(English, Urdu, Maths) {
  return English + Urdu + Maths;
}

let marks = TotalMarks(75, 80, 90);
document.writeln(marks + "<br>");

document.writeln("<h3><strong>Marksheet</strong></h3>");

function classmarks(English, Maths, Computer) {
  var totalMarks = 300;
  var obtainedMarks = English + Maths + Computer;
  var percentage = (obtainedMarks / totalMarks) * 100;
  var average = obtainedMarks / 3;
  document.write("Obtained Marks: " + obtainedMarks + "<br>");
  document.write("Total Marks: " + totalMarks + "<br>");
  document.write("Percentage: " + percentage + "%<br>");
  document.write("Average Marks: " + average + "<br>");

  if (percentage >= 80) {
    document.write("Grade: A-one<br>");
    document.write("Remarks: Excellent<br>");
  } else if (percentage >= 70) {
    document.write("Grade: A<br>");
    document.write("Remarks: Good<br>");
  } else if (percentage >= 60) {
    document.write("Grade: B<br>");
    document.write("Remarks: You need to improve<br>");
  } else {
    document.write("Grade: Fail<br>");
    document.write("Remarks: Sorry<br>");
  }
}

classmarks(92, 95, 92);

var cars = ["Toyota", "Honda", "Suzuki", "Kia", "Mercedes"];
document.write(cars.join(", ") + "<br>");
