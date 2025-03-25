let answer1 = "it's alright";
let answer2 = "He is called 'Johnny'";
let answer3 = "She is called 'Alice'";

document.getElementById("demo").innerHTML = answer2;
document.getElementById("demo1").innerHTML = answer2.length;
document.getElementById("demo2").innerHTML = answer3.charAt(8);

function myFunction() {
  let test = document.getElementById("demo6");
  if (test.innerHTML.includes("Abdul Rehman")) {
    test.innerHTML = test.innerHTML.replace("Abdul Rehman", "Abdul Moiz");
  } else {
    test.innerHTML = test.innerHTML.replace("Abdul Moiz", "Abdul Rehman");
  }
}
