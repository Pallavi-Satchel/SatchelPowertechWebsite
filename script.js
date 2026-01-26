document.addEventListener("DOMContentLoaded", () => {

  /* ---------- HAMBURGER ---------- */
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
  }
  function toggleMenu() {
    navLinks?.classList.toggle("active");
  }

  const menuLogo = document.querySelector(".menu-logo");
  menuLogo?.addEventListener("click", closeMenu);

  const marquee = document.getElementById("topMarquee");
  if (marquee) {
    document.body.classList.add("has-marquee");
  }

  /* Common Links Handling */
  if (window.SATCHEL_LINKS) {
    document.querySelectorAll("a[data-link]").forEach(el => {
      const key = el.getAttribute("data-link");
      if (window.SATCHEL_LINKS[key]) {
        el.href = window.SATCHEL_LINKS[key];
      }
    });
  } else {
    console.warn("SATCHEL_LINKS not defined");
  }

  /* ---------- CUSTOMER FORM ---------- */
  document.querySelectorAll(".booking-form").forEach(form => {

    const submitBtn = form.querySelector("button[type='submit']");

    // Create success message
    const successMsg = document.createElement("div");
    successMsg.style.display = "none";
    successMsg.style.marginTop = "12px";
    successMsg.style.color = "#1b8a3d";
    successMsg.style.fontWeight = "600";
    successMsg.textContent =
      "Booking submitted successfully! Our team will contact you shortly.";

    form.appendChild(successMsg);

    form.addEventListener("submit", e => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting...";

      fetch(form.action, {
        method: "POST",
        body: new FormData(form)
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          successMsg.style.display = "block";
          form.reset();
        } else {
          alert("Submission failed. Please try again.");
        }
      })
      .catch(() => {
        alert("Network error. Please try again.");
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
      });
    });
  });

  /* ---------- DEALERSHIP FORM ---------- */
  const dealerFormWrapper = document.querySelector("#dealership-form");
  if (dealerFormWrapper) {
    const form = dealerFormWrapper.querySelector("form");
    const submitBtn = form.querySelector("button[type='submit']");

    const successMsg = document.createElement("div");
    successMsg.style.display = "none";
    successMsg.style.marginTop = "15px";
    successMsg.style.color = "#1b8a3d";
    successMsg.style.fontWeight = "600";
    successMsg.textContent =
      "Form submitted successfully! Our team will contact you shortly.";

    form.appendChild(successMsg);

    form.addEventListener("submit", e => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting...";

      fetch(form.action, {
        method: "POST",
        body: new FormData(form)
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          successMsg.style.display = "block";
          form.reset();
        } else {
          alert("Submission failed.");
        }
      })
      .catch(() => alert("Network error"))
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
      });
    });
  }


  /* ---------- SERVICES CAROUSEL ---------- */
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


  /* ---------- PROJECTS CAROUSEL ---------- */
  const projectTrack = document.querySelector(".projects-carousel-track");
  if (projectTrack) {
    const projectSlides = Array.from(projectTrack.children);
    let projectIndex = 0;

    const prev = document.querySelector(".projects-carousel-container .prev");
    const next = document.querySelector(".projects-carousel-container .next");

    function moveProjectSlide(dir) {
      projectIndex = (projectIndex + dir + projectSlides.length) % projectSlides.length;
      const w = projectSlides[0].getBoundingClientRect().width;
      projectTrack.style.transform = `translateX(-${projectIndex * w}px)`;
    }

    prev?.addEventListener("click", () => moveProjectSlide(-1));
    next?.addEventListener("click", () => moveProjectSlide(1));

    setInterval(() => moveProjectSlide(1), 10000);
  }


  /* ---------- WHATSAPP ---------- */
  const phoneNumber = "9311716926";
  const countryCode = "91";

  const isCustomer = document.getElementById("whatsappLinkCustomer");
  const isDealer = document.getElementById("whatsappLinkDealer");

  if (isCustomer) {
    isCustomer.href =
      `https://wa.me/${countryCode}${phoneNumber}?text=${encodeURIComponent(
        "Hi, I am a Customer, I visited Satchel PowerTech website and want to know more"
      )}`;
  }

  if (isDealer) {
    isDealer.href =
      `https://wa.me/${countryCode}${phoneNumber}?text=${encodeURIComponent(
        "Hi, I am a Dealer, I visited Satchel PowerTech website and want to know more"
      )}`;
  }
});

/* ---------- CLOSE MARQUEE ---------- */
function closeMarquee(event) {
  event.preventDefault();
  event.stopPropagation();

  const marquee = document.getElementById("topMarquee");
  const home = document.getElementById("home");

  if (!marquee || !home) return;

  const h = marquee.offsetHeight;

  marquee.style.display = "none";

  // remove layout space instead of visual transform
  home.style.marginTop = `-${h}px`;
}

 function closeMenu() {
    navLinks?.classList.remove("active");
  }
