document.addEventListener("DOMContentLoaded", () => {
    /* =========================================
     💬 WHATSAPP LINKS
    ========================================= */

    const phoneNumber = "9311716926";
    const countryCode = "91";

    const customerLink = document.getElementById("whatsappLinkCustomer");
    const dealerLink = document.getElementById("whatsappLinkDealer");

    if (customerLink) {
      customerLink.href =
        `https://wa.me/${countryCode}${phoneNumber}?text=${encodeURIComponent(
          "Hi, I am a Customer, I visited Satchel PowerTech website and want to know more"
        )}`;
    }

    if (dealerLink) {
      dealerLink.href =
        `https://wa.me/${countryCode}${phoneNumber}?text=${encodeURIComponent(
          "Hi, I am a Dealer, I visited Satchel PowerTech website and want to know more"
        )}`;
    }

  // Find all anchor tags with data-link
  document.querySelectorAll("a[data-link]").forEach(anchor => {
    const key = anchor.getAttribute("data-link");
    if (links[key]) {
      anchor.href = links[key];
    } else {
      console.warn(`No link found for key: ${key}`);
    }
  });

  /* =========================================
     🔐 SECURITY SETUP
  ========================================= */

  const FORM_LOAD_TIME = Date.now();

  // Generate dynamic token per page load
  function generateAuthToken() {
    return "satchel_secure_2026_" + FORM_LOAD_TIME;
  }

  // Basic bot detection (blocks headless browsers)
  function isBotEnvironment() {
    return (
      navigator.webdriver ||
      !navigator.language ||
      navigator.plugins.length === 0
    );
  }

  /* =========================================
     🍔 HAMBURGER MENU
  ========================================= */

  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  const closeBtn = document.querySelector(".close-btn");
  closeBtn?.addEventListener("click", () => {
    navLinks?.classList.remove("active");
  });

  document.querySelector(".menu-logo")?.addEventListener("click", () => {
    navLinks?.classList.remove("active");
  });


  /* =========================================
     📩 COMMON FORM HANDLER
  ========================================= */

  async function handleFormSubmit(form, successMsg) {

    if (isBotEnvironment()) {
      alert("Bot activity detected.");
      return;
    }

    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {
      const formData = new FormData(form);

      // Add timestamp from page load (not submit click)
      formData.set("timestamp", FORM_LOAD_TIME);

      // Add dynamic auth token
      formData.set("auth_token", generateAuthToken());

      // Get reCAPTCHA
      const captchaResponse = grecaptcha.getResponse();

      if (!captchaResponse) {
        alert("Please complete the captcha.");
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
        return;
      }

      formData.set("g-recaptcha-response", captchaResponse);

      const response = await fetch(form.action, {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (result.status === "success") {
        successMsg.style.display = "block";
        form.reset();
        grecaptcha.reset();
      } else if (result.status === "too_many_requests") {
        alert("Please wait before submitting again.");
      } else if (result.status === "captcha_failed") {
        alert("Captcha verification failed. Please try again.");
        grecaptcha.reset();
      } else {
        alert("Submission failed: " + result.status);
        console.log("Server returned:", result);
      }

    } catch (error) {
      console.error(error);
      alert("Network error. Please try again.");
    }

    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";
  }


  /* =========================================
     🏠 CUSTOMER BOOKING FORM
  ========================================= */

  document.querySelectorAll(".booking-form").forEach(form => {

    const successMsg = document.createElement("div");
    successMsg.style.display = "none";
    successMsg.style.marginTop = "12px";
    successMsg.style.color = "#1b8a3d";
    successMsg.style.fontWeight = "600";
    successMsg.textContent =
      "Booking submitted successfully! Our team will contact you shortly.";

    form.appendChild(successMsg);

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      successMsg.style.display = "none";
      handleFormSubmit(form, successMsg);
    });
  });


  /* =========================================
     🏢 DEALERSHIP FORM
  ========================================= */

  const dealerWrapper = document.querySelector("#dealership-form");

  if (dealerWrapper) {
    const form = dealerWrapper.querySelector("form");

    const successMsg = document.createElement("div");
    successMsg.style.display = "none";
    successMsg.style.marginTop = "15px";
    successMsg.style.color = "#1b8a3d";
    successMsg.style.fontWeight = "600";
    successMsg.textContent =
      "Form submitted successfully! Our team will contact you shortly.";

    form.appendChild(successMsg);

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      successMsg.style.display = "none";
      handleFormSubmit(form, successMsg);
    });
  }});


  /* =========================================
     🎞 SERVICES CAROUSEL
  ========================================= */

  const track = document.querySelector(".carousel-track");

  if (track) {
    const slides = Array.from(track.children);
    let index = 0;

    setInterval(() => {
      index = (index + 1) % slides.length;
      const w = slides[0].getBoundingClientRect().width;
      track.style.transform = `translateX(-${index * w}px)`;
    }, 10000);
  }


  /* =========================================
     🏗 PROJECTS CAROUSEL
  ========================================= */

  const projectTrack = document.querySelector(".projects-carousel-track");

  if (projectTrack) {
    const slides = Array.from(projectTrack.children);
    let index = 0;

    const prev = document.querySelector(".projects-carousel-container .prev");
    const next = document.querySelector(".projects-carousel-container .next");

    function moveSlide(dir) {
      index = (index + dir + slides.length) % slides.length;
      const w = slides[0].getBoundingClientRect().width;
      projectTrack.style.transform = `translateX(-${index * w}px)`;
    }

    prev?.addEventListener("click", () => moveSlide(-1));
    next?.addEventListener("click", () => moveSlide(1));

    setInterval(() => moveSlide(1), 10000);
  }

/* =========================================
   📞 CONTACT MODAL
========================================= */

let selectedProduct = "";

function openContactModal(product) {
  selectedProduct = product;
  document.getElementById("contactModal").style.display = "block";
}

function closeContactModal() {
  document.getElementById("contactModal").style.display = "none";
}

function sendToWhatsApp() {
  const name = document.getElementById("userName").value.trim();
  const email = document.getElementById("userEmail").value.trim();

  if (!name || !email) {
    alert("Please fill all fields.");
    return;
  }

  const phoneNumber = "9311716926";
  const countryCode = "91";

  const message =
    `Hi I am ${name} and my Email ID is ${email}. ` +
    `I visited Satchel PowerTech website and would like pricing details for ${selectedProduct}.`;

  const whatsappURL =
    `https://wa.me/${countryCode}${phoneNumber}?text=${encodeURIComponent(message)}`;

  window.open(whatsappURL, "_blank");
}
