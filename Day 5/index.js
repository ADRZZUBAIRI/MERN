// var a = 5;
// var b = 10;
// var sum = a + b;
// document.write("The Sum of a & b is: "+ sum);

var English = 80;
var Urdu = 75;
var Math = 90;
var totalMarks = 300;
var obtainedMarks = English + Urdu + Math;
var percentage = (obtainedMarks / totalMarks) * 100;
var average = obtainedMarks / 3;
document.write("Obtained Marks: " + obtainedMarks + "<br>");
document.write("Percentage: " + percentage + "%" + "<br>");
document.write("Total Marks: " + totalMarks + "<br>");
document.write("Average Marks: " + average + "<br>")

if (percentage >= 80) {
    document.write("Grade: A-one" + "<br>");
    document.write("Remarks: Excellent" + "<br>");
}

else if (percentage >= 70) {
    document.write("Grade: A" + "<br>");
    document.write("Remarks: Good" + "<br>");
}

else if (percentage >= 60) {
    document.write("Grade: B" + "<br>");
    document.write("Remarks: You need to improve" + "<br>");
}

else {
    document.write("Grade: Fail" + "<br>");
    document.write("Remarks: Sorry" + "<br>");
}

var age = 71;
if (age >= 18 && age <= 60) {
    document.write("You are old enough to drive");
}

else if (age > 60) {
    document.write("You are too old to drive. Go Home Nigga!");
}

else {
    document.write("You are too young to drive.");
}