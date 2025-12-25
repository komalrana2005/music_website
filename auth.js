const authLink = document.getElementById("authLink");

function updateAuthLink() {
  const isSignedIn = localStorage.getItem("signedIn") === "true";
  authLink.textContent = isSignedIn ? "Sign Out" : "Sign In";
}

authLink.addEventListener("click", () => {
  const isSignedIn = localStorage.getItem("signedIn") === "true";
  localStorage.setItem("signedIn", !isSignedIn);
  updateAuthLink();
});

updateAuthLink();
