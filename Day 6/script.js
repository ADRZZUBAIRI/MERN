let answer1 = "it's alright";
let answer2 = "He is called 'Johnny'";
let answer3 = "She is called 'Alice'";

document.getElementById("demo").innerHTML = answer2;
document.getElementById("demo1").innerHTML = answer2.length;
document.getElementById("demo2").innerHTML = answer3.charAt(8);

function myFunction() {
  let test = document.getElementById("demo6");
  if (test.innerHTML.includes("Abdul Rehman")) {
    test.innerHTML = test.innerHTML.replace("Abdul Rehman", "Abdul Moiz bin Abdul Rehman");
    
  }
  
  else if (test.innerHTML.includes("Abdul Moiz bin Abdul Rehman")) {
      test.innerHTML = test.innerHTML.replace("Abdul Moiz bin Abdul Rehman", "Abdul Rehman");
    }
  
  else {
    test.innerHTML = test.innerHTML.replace("Abdul Moiz bin Abdul Rehman", "Abdul Rehman");
  }
}


const myarr = ["Alsvin", "Elantra", "Civic", "Vitz", "Corolla", "City", "Cultus", "Picanto", "Swift", "Mehran"];
myarr[0] = "Audi";
myarr[1] = "BMW";
document.getElementById("demo5").innerHTML = myarr;
document.getElementById("demo6").innerHTML = myarr.length;
document.getElementById("demo7").innerHTML = myarr.sort();
document.getElementById("demo8").innerHTML = myarr.reverse();
document.getElementById("demo9").innerHTML = myarr.indexOf("BMW");
document.getElementById("demo10").innerHTML = myarr.join(" * ");
document.getElementById("demo11").innerHTML = myarr.pop();
document.getElementById("demo12").innerHTML = myarr.push("Mehran");
document.getElementById("demo13").innerHTML = myarr.shift();
document.getElementById("demo14").innerHTML = myarr.unshift("Alsvin");
document.getElementById("demo15").innerHTML = myarr.slice(1, 4);
document.getElementById("demo16").innerHTML = myarr.splice(2, 0, "Vitz", "Corolla");
document.getElementById("demo17").innerHTML = myarr;
document.getElementById("demo18").innerHTML = myarr.splice(2, 2);
document.getElementById("demo19").innerHTML = myarr;
document.getElementById("demo20").innerHTML = myarr.concat("Civic", "City");