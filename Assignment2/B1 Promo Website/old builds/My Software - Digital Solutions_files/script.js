document.addEventListener("DOMContentLoaded", function() {
    // Smooth Scrolling for Navigation Links
    const links = document.querySelectorAll("a[href^='#']");
    links.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 50,
                    behavior: "smooth"
                });
            }
        });
    });

    // Team Member Hover Effect
    const teamMembers = document.querySelectorAll(".team-member");
    teamMembers.forEach(member => {
        member.addEventListener("mouseover", function() {
            this.style.transform = "scale(1.05)";
            this.style.transition = "0.3s ease-in-out";
        });
        member.addEventListener("mouseleave", function() {
            this.style.transform = "scale(1)";
        });
    });

    // Reveal Sections on Scroll
    const sections = document.querySelectorAll(".section");
    const revealSection = () => {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const triggerHeight = window.innerHeight * 0.85;
            if (sectionTop < triggerHeight) {
                section.classList.add("visible");
            }
        });
    };

    window.addEventListener("scroll", revealSection);
    revealSection(); // Run on load to show any sections already in view
});

document.addEventListener("DOMContentLoaded", function () {
    // Select all team member containers
    const teamMembers = document.querySelectorAll(".team-member");

    teamMembers.forEach(member => {
        const flipBtn = member.querySelector(".flip-btn"); // Flip button
        const returnBtn = member.querySelector(".card-back .flip-btn"); // Return button

        // Flip the card
        flipBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            member.classList.add("flipped");
        });

        // Flip back the card
        returnBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            member.classList.remove("flipped");
        });
    });
});

function toggleMenu() {
    document.querySelector(".nav-menu").classList.toggle("active");
}

document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    function toggleMenu() {
        navMenu.classList.toggle("active");
    }

    // Attach event listener to hamburger menu
    if (hamburger) {
        hamburger.addEventListener("click", toggleMenu);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    function toggleMenu() {
        navMenu.classList.toggle("active");
    }

    // Attach event listener to hamburger menu
    if (hamburger) {
        hamburger.addEventListener("click", toggleMenu);
    }
});
