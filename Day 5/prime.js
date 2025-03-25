function isPrime(n) {
  if (n <= 1) {
    return false;
  }
  for (let i = 2; i < n; i++) {
    if (n % i === 0) {
      return false;
    }
  }
  return true; // Return true if no divisors found
}

let num = parseInt(prompt("Enter a number: "));
if (isPrime(num)) {
  document.write(num + " is a prime number.");
} else {
  document.write(num + " is not a prime number.");
}