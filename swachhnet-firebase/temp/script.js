console.log("Script.js is running!") 

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded")

  // Mobile menu toggle
  const API_URL = "https://chatbotfunctionality-production.up.railway.app"; // Your Railway backend URL

  const menuToggle = document.querySelector(".menu-toggle")
  const menu = document.querySelector(".menu")

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", function () {
      menu.classList.toggle("active")

      // Animate hamburger to X
      const spans = this.querySelectorAll("span")
      if (menu.classList.contains("active")) {
        spans[0].style.transform = "rotate(45deg) translate(6px, 6px)"
        spans[1].style.opacity = "0"
        spans[2].style.transform = "rotate(-45deg) translate(6px, -6px)"
      } else {
        spans[0].style.transform = "none"
        spans[1].style.opacity = "1"
        spans[2].style.transform = "none"
      }
    })

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && !menuToggle.contains(e.target) && menu.classList.contains("active")) {
        menu.classList.remove("active")
        const spans = menuToggle.querySelectorAll("span")
        spans[0].style.transform = "none"
        spans[1].style.opacity = "1"
        spans[2].style.transform = "none"
      }
    })
  }

  // Active nav link
  const sections = document.querySelectorAll("section, .hero, .page")
  const navLinks = document.querySelectorAll(".nav-link")

  window.addEventListener("scroll", () => {
    let current = ""

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight
      if (pageYOffset >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute("id")
      }
    })

    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href").substring(1) === current) {
        link.classList.add("active")
      }
    })
  })

  // Features hover effect
  const featureCards = document.querySelectorAll(".feature-card")

  if (featureCards.length > 0) {
    featureCards.forEach((card) => {
      // Add hover effect to move card up
      card.addEventListener("mouseenter", () => {
        if (window.innerWidth > 768) {
          // Only apply on desktop
          card.style.transform = "translateY(-10px)" // Move card up by 10px
          card.style.transition = "transform 0.3s ease" // Smooth transition
        }
      })

      // Reset card position when mouse leaves
      card.addEventListener("mouseleave", () => {
        if (window.innerWidth > 768) {
          // Only apply on desktop
          card.style.transform = "translateY(0)" // Move card back to original position
        }
      })
    })
  }

  // Form submission
  const reportForm = document.querySelector(".report-form")
  if (reportForm) {
    reportForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Simple validation
      const location = document.getElementById("location").value
      const wasteType = document.getElementById("waste-type").value

      if (!location || !wasteType) {
        alert("Please fill in all required fields")
        return
      }

      // Success message
      this.innerHTML = `
                <div class="success-message">
                    <div class="success-icon">✓</div>
                    <h3>Thank You!</h3>
                    <p>Your report has been submitted successfully. Our team will look into it.</p>
                    <button type="button" class="submit-btn" onclick="location.reload()">Submit Another Report</button>
                </div>
            `
    })
  }

  // File upload
  const fileInput = document.getElementById("photo")
  const fileName = document.querySelector(".file-name")
  const uploadBtn = document.querySelector(".upload-btn")

  if (fileInput && fileName && uploadBtn) {
    uploadBtn.addEventListener("click", () => {
      fileInput.click()
    })

    fileInput.addEventListener("change", function () {
      if (this.files.length > 0) {
        fileName.textContent = this.files[0].name
      } else {
        fileName.textContent = "No file chosen"
      }
    })
  }

  // Smooth scrolling for navigation links
  const allLinks = document.querySelectorAll('a[href^="#"]')
  allLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href").substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        // Close mobile menu if open
        if (menu && menu.classList.contains("active")) {
          menu.classList.remove("active")
          if (menuToggle) {
            const spans = menuToggle.querySelectorAll("span")
            spans[0].style.transform = "none"
            spans[1].style.opacity = "1"
            spans[2].style.transform = "none"
          }
        }

        // Calculate offset for fixed header
        const navHeight = document.querySelector("nav").offsetHeight
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight

        // Smooth scroll to target
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })


// CHATBOT FUNCTIONALITY - FIXED VERSION
console.log("Setting up chatbot functionality");
const chatLogo = document.getElementById("chatbot-logo");
const chatContainer = document.getElementById("chatbot-container");
const minimizeBtn = document.getElementById("minimize-btn");
const chatTooltip = document.getElementById("chatbot-tooltip");

// Debug log to check if elements exist
console.log("Chat logo:", chatLogo);
console.log("Chat container:", chatContainer);
console.log("Minimize button:", minimizeBtn);
console.log("Chat tooltip:", chatTooltip);

// Show tooltip on page load
if (chatTooltip) {
    setTimeout(() => {
        chatTooltip.classList.add("visible");
        setTimeout(() => {
            chatTooltip.classList.remove("visible");
        }, 5000);
    }, 1000);
}

// Toggle chatbox visibility
if (chatLogo && chatContainer) {
    chatLogo.onclick = () => {
        console.log("Chat logo clicked!");
        chatContainer.style.display = "block";
        setTimeout(() => {
            chatContainer.classList.add("open");
            chatLogo.style.display = "none";
        }, 10);
    };
}

// Minimize chatbox
if (minimizeBtn && chatContainer && chatLogo) {
    minimizeBtn.onclick = () => {
        console.log("Minimize button clicked!");
        chatContainer.classList.remove("open");
        setTimeout(() => {
            chatContainer.style.display = "none";
            chatLogo.style.display = "flex";
        }, 300);
    };
}

// Rest of the chatbot functionality
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const chatBody = document.getElementById("chat-body");

if (chatInput && sendBtn && chatBody) {
    let isBotTyping = false;

    sendBtn.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });


// Make sure chatInput is defined outside the function
async function sendMessage() {
  if (isBotTyping) return // Prevent multiple requests

  const userMessage = chatInput.value.trim()
  if (!userMessage) return // Ignore empty messages

  // Display user's message
  appendMessage("user", userMessage)
  chatInput.value = "" // Clear input field

  // Show typing indicator
  showTypingIndicator()

  try {
    const response = await fetch("https://Your-Cloudwrangler-URL/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userMessage }),
    })

    const data = await response.json()

    // Hide typing indicator
    hideTypingIndicator()

    // Handle errors
    if (!response.ok) {
      throw new Error(data.error || "Failed to get a response from the server")
    }

    // Display bot's response
    appendMessage("bot", data.response)
  } catch (error) {
    console.error("Error:", error)
    appendMessage("bot", `Error: ${error.message}`)
    hideTypingIndicator()
  }
}


    function appendMessage(sender, text) {
        const messageDiv = document.createElement("div");
        messageDiv.className = `chat-message ${sender}`;
        messageDiv.innerHTML = `
            <div class="message-content">${text}</div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        `;
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function showTypingIndicator() {
        if (isBotTyping) return;
        isBotTyping = true;

        const typingDiv = document.createElement("div");
        typingDiv.className = "chat-message bot typing";
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        chatBody.appendChild(typingDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function hideTypingIndicator() {
        isBotTyping = false;
        const typingElements = document.querySelectorAll(".typing");
        typingElements.forEach((el) => el.remove());
    }
}

// Fix mapSection error (line 426)
window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && menu) {
        menu.classList.remove("active");
        if (menuToggle) {
            const spans = menuToggle.querySelectorAll("span");
            spans[0].style.transform = "none";
            spans[1].style.opacity = "1";
            spans[2].style.transform = "none";
        }
    }

    // Check if mapSection exists before using it
    const mapSection = document.getElementById("map"); // Adjust ID if different
    if (mapSection && typeof initMap === "function" && typeof google !== "undefined") {
        initMap();
    }
});

// ... (rest of your code remains unchanged) ...

  // Animation for elements when they come into view
  const animatedElements = document.querySelectorAll(
    ".feature-card, .map-container, .report-container, .reward-card, .section-title",
  )

  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate")
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
      },
    )

    animatedElements.forEach((element) => {
      element.style.opacity = "0"
      element.style.transform = "translateY(30px)"
      element.style.transition = "opacity 0.8s ease, transform 0.8s ease"
      observer.observe(element)
    })

    // Add animation class when element is in view
    document.addEventListener("scroll", () => {
      animatedElements.forEach((element) => {
        if (element.getBoundingClientRect().top < window.innerHeight * 0.8) {
          element.style.opacity = "1"
          element.style.transform = "translateY(0)"
        }
      })
    })
  }

  // Animate counter for rewards
  const counter = document.querySelector(".count")
  if (counter) {
    let count = 0
    const target = 500
    const duration = 2000
    const step = target / (duration / 16)

    function updateCount() {
      if (count < target) {
        count += step
        counter.textContent = Math.floor(count)
        requestAnimationFrame(updateCount)
      } else {
        counter.textContent = target
      }
    }

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            updateCount()
            counterObserver.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.5,
      },
    )

    counterObserver.observe(counter)
  }

  // Badge hover effect
  const badges = document.querySelectorAll(".badge")
  badges.forEach((badge) => {
    badge.addEventListener("mouseenter", function () {
      this.style.animation = "float 1s infinite ease-in-out"
    })

    badge.addEventListener("mouseleave", function () {
      this.style.animation = "none"
    })
  })

  const aboutSection = document.querySelector("#about")
  if (aboutSection) {
    aboutSection.style.opacity = 0
    aboutSection.style.transform = "translateY(30px)"

    function fadeInAbout() {
      const scrollPosition = window.scrollY + window.innerHeight
      const aboutPosition = aboutSection.offsetTop

      if (scrollPosition > aboutPosition) {
        aboutSection.style.transition = "opacity 1s ease-out, transform 1s ease-out"
        aboutSection.style.opacity = 1
        aboutSection.style.transform = "translateY(0)"
      }
    }

    window.addEventListener("scroll", fadeInAbout)
  }

  // Check if map section exists and initialize map

  // Handle window resize events
  window.addEventListener("resize", () => {
    // Adjust mobile menu on resize
    if (window.innerWidth > 768 && menu) {
      menu.classList.remove("active")
      if (menuToggle) {
        const spans = menuToggle.querySelectorAll("span")
        spans[0].style.transform = "none"
        spans[1].style.opacity = "1"
        spans[2].style.transform = "none"
      }
    }


  })
})

// Typing Animation
document.addEventListener("DOMContentLoaded", () => {
  const textElement = document.getElementById("animated-text")
  if (textElement) {
    const text = textElement.innerHTML // Get existing text
    textElement.innerHTML = "" // Clear the text for animation
    let index = 0
    const speed = 100 // Speed of typing

    function typeEffect() {
      if (index < text.length) {
        textElement.innerHTML += text.charAt(index)
        index++
        setTimeout(typeEffect, speed)
      }
    }

    setTimeout(typeEffect, 500) // Start typing after delay
  }
})

// Add direct event listener outside DOMContentLoaded for the chatbot
window.addEventListener("load", () => {
  console.log("Window loaded - adding direct chatbot event listeners")

  const chatLogo = document.getElementById("chatbot-logo")
  const chatContainer = document.getElementById("chatbot-container")

  if (chatLogo && chatContainer) {
    console.log("Found chatbot elements, adding direct click handler")

    chatLogo.addEventListener("click", (e) => {
      console.log("Chatbot logo clicked (direct handler)")
      e.preventDefault()
      e.stopPropagation()

      // Force display block first, then add the open class
      chatContainer.style.display = "block"

      // Use setTimeout to ensure the display change has taken effect
      setTimeout(() => {
        chatContainer.classList.add("open")
        chatLogo.style.display = "none"
      }, 10)

      return false
    })
  }
})

document.getElementById("generate-description-btn").addEventListener("click", async () => {
  const fileInput = document.getElementById("photo")
  const descriptionField = document.getElementById("description")

  // Check if a file is uploaded
  if (!fileInput.files || fileInput.files.length === 0) {
    alert("Please upload an image first.")
    return
  }

  const file = fileInput.files[0]

  // Prepare the file for upload
  const formData = new FormData()
  formData.append("image", file)

  try {
    descriptionField.value = "Analyzing image..."

    // Send image to server for AI analysis
    const response = await fetch("https://Your-Cloudwrangler-URL/api/analyze-image", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()

    // Set AI-generated description in the textarea
    if (data.description) {
      descriptionField.value = data.description
    } else {
      descriptionField.value = "Could not analyze image."
    }
  } catch (error) {
    descriptionField.value = "Error analyzing image."
    console.error(error)
  }
})

document.addEventListener("DOMContentLoaded", () => {
  let userPoints = 500 // Example user points (Can be fetched from DB)
  const userPointsElement = document.getElementById("user-points")
  const progressFill = document.querySelector(".progress-fill")
  const redeemButtons = document.querySelectorAll(".redeem-btn")

  // Update UI with current points
  function updateUI() {
    if (userPointsElement && progressFill) {
      userPointsElement.textContent = userPoints
      const progress = (userPoints / 1000) * 100 // Assuming 1000 points for max progress
      progressFill.style.width = progress + "%"
    }
  }

  // Reward Redeem Function
  redeemButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const cost = Number.parseInt(this.getAttribute("data-cost"))

      if (userPoints >= cost) {
        userPoints -= cost
        updateUI()
        alert("Reward redeemed successfully!")
      } else {
        alert("Not enough points to redeem this reward.")
      }
    })
  })

  updateUI()
})

