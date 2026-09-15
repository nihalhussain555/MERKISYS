/* =========================================================
   MERKISYS — MAIN JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const root = document.documentElement;
    const body = document.body;

    /* =====================================================
       THEME
    ===================================================== */

    const themeBtn =
        document.getElementById("theme-toggle");

    const themeIcon =
        document.querySelector(".theme-icon");

    const savedTheme =
        localStorage.getItem("theme");

    const systemDark =
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

    const initialTheme =
        savedTheme ||
        (systemDark ? "dark" : "light");

    root.dataset.theme = initialTheme;


    function updateThemeIcon() {

        if (!themeIcon) return;

        themeIcon.textContent =
            root.dataset.theme === "dark"
                ? "☀"
                : "☾";
    }

    updateThemeIcon();


    themeBtn?.addEventListener(
        "click",
        () => {

            const nextTheme =
                root.dataset.theme === "dark"
                    ? "light"
                    : "dark";

            root.dataset.theme =
                nextTheme;

            localStorage.setItem(
                "theme",
                nextTheme
            );

            updateThemeIcon();
        }
    );


    /* =====================================================
       NAVBAR
    ===================================================== */

    const navbar =
        document.getElementById("navbar");


    function updateNavbar() {

        if (!navbar) return;

        navbar.classList.toggle(
            "scrolled",
            window.scrollY > 40
        );
    }

    updateNavbar();

    window.addEventListener(
        "scroll",
        updateNavbar,
        { passive: true }
    );


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const hamburger =
        document.getElementById("hamburger");

    const mobileNav =
        document.getElementById("mobile-nav");


    function closeMobileMenu() {

        if (!hamburger || !mobileNav) return;

        hamburger.classList.remove("active");

        hamburger.setAttribute(
            "aria-expanded",
            "false"
        );

        hamburger.setAttribute(
            "aria-label",
            "Open menu"
        );

        mobileNav.classList.remove("open");

        body.classList.remove(
            "menu-open"
        );
    }


    function openMobileMenu() {

        if (!hamburger || !mobileNav) return;

        hamburger.classList.add("active");

        hamburger.setAttribute(
            "aria-expanded",
            "true"
        );

        hamburger.setAttribute(
            "aria-label",
            "Close menu"
        );

        mobileNav.classList.add("open");

        body.classList.add(
            "menu-open"
        );
    }


    hamburger?.addEventListener(
        "click",
        () => {

            const isOpen =
                hamburger.classList.contains(
                    "active"
                );

            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        }
    );


    document
        .querySelectorAll(".mobile-link")
        .forEach(link => {

            link.addEventListener(
                "click",
                closeMobileMenu
            );

        });


    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {
                closeMobileMenu();
            }

        }
    );


    /* =====================================================
       SMOOTH SCROLL
    ===================================================== */

    document
        .querySelectorAll(
            '.nav-link, .mobile-link, .logo, .footer-links a, .scroll-cue'
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const href =
                        link.getAttribute("href");

                    if (
                        !href ||
                        !href.startsWith("#")
                    ) {
                        return;
                    }

                    const target =
                        document.querySelector(
                            href
                        );

                    if (!target) return;

                    event.preventDefault();

                    const offset =
                        navbar
                            ? navbar.offsetHeight
                            : 0;

                    const targetPosition =
                        target.getBoundingClientRect()
                            .top +
                        window.scrollY -
                        offset;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: "smooth"
                    });

                }
            );

        });


    /* =====================================================
       ACTIVE NAV
    ===================================================== */

    const sections =
        document.querySelectorAll(
            "section[id]"
        );

    const navLinks =
        document.querySelectorAll(
            ".nav-link"
        );


    const sectionObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    const id =
                        entry.target.id;

                    navLinks.forEach(link => {

                        link.classList.toggle(
                            "active",
                            link.getAttribute(
                                "href"
                            ) === `#${id}`
                        );

                    });

                });

            },
            {
                rootMargin:
                    "-35% 0px -55% 0px"
            }
        );


    sections.forEach(section => {

        sectionObserver.observe(
            section
        );

    });


    /* =====================================================
       SCROLL PROGRESS
    ===================================================== */

    const progress =
        document.getElementById(
            "scroll-progress"
        );


    function updateProgress() {

        if (!progress) return;

        const scrollTop =
            window.scrollY;

        const documentHeight =
            document.documentElement
                .scrollHeight;

        const windowHeight =
            window.innerHeight;

        const total =
            documentHeight -
            windowHeight;

        const percentage =
            total > 0
                ? (scrollTop / total) * 100
                : 0;

        progress.style.width =
            `${Math.min(
                percentage,
                100
            )}%`;
    }


    updateProgress();

    window.addEventListener(
        "scroll",
        updateProgress,
        { passive: true }
    );


    /* =====================================================
       REDUCED MOTION
    ===================================================== */

    const reduceMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /* =====================================================
       REVEAL
    ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".reveal-section"
        );


    if (reduceMotion) {

        revealElements.forEach(
            element => {

                element.classList.add(
                    "visible"
                );

            }
        );

    } else {

        const revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }

                            entry.target.classList.add(
                                "visible"
                            );

                            revealObserver.unobserve(
                                entry.target
                            );

                        }
                    );

                },
                {
                    threshold: .12
                }
            );


        revealElements.forEach(
            element => {

                revealObserver.observe(
                    element
                );

            }
        );
    }


    /* =====================================================
       COUNTERS
    ===================================================== */

    const counters =
        document.querySelectorAll(
            ".stat-number"
        );


    const counterObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }

                        const element =
                            entry.target;

                        const target =
                            Number(
                                element.dataset
                                    .target
                            );


                        if (reduceMotion) {

                            element.textContent =
                                target;

                            counterObserver
                                .unobserve(
                                    element
                                );

                            return;
                        }


                        const duration = 1500;

                        const start =
                            performance.now();


                        function animate(now) {

                            const progress =
                                Math.min(
                                    (now - start) /
                                    duration,
                                    1
                                );

                            const eased =
                                1 -
                                Math.pow(
                                    1 - progress,
                                    3
                                );

                            element.textContent =
                                Math.floor(
                                    target *
                                    eased
                                );


                            if (
                                progress < 1
                            ) {

                                requestAnimationFrame(
                                    animate
                                );

                            } else {

                                element.textContent =
                                    target;
                            }
                        }


                        requestAnimationFrame(
                            animate
                        );

                        counterObserver
                            .unobserve(
                                element
                            );

                    }
                );

            },
            {
                threshold: .5
            }
        );


    counters.forEach(counter => {

        counterObserver.observe(
            counter
        );

    });


    /* =====================================================
       SERVICES
    ===================================================== */

    const serviceTabs =
        document.querySelectorAll(
            ".service-tab"
        );

    const serviceDetail =
        document.getElementById(
            "service-detail"
        );


    const serviceData = {

        data: {
            title:
                "Data Analytics & Insights",

            description:
                "We transform raw data into actionable insights that empower your business to make informed, strategic decisions. From advanced analytics to real-time reporting, we help you stay ahead of the curve.",

            capabilities: [
                "Descriptive, Predictive, and Prescriptive Analytics.",
                "Custom BI Solutions, Data Warehousing.",
                "Real-time Dashboards, Custom Reports",
                "Market Research, Customer Segmentation"
            ]
        },

        web: {
            title:
                "Website Development",

            description:
                "Our team builds responsive, user-friendly websites tailored to your brand and business goals, ensuring a seamless user experience across devices.",

            capabilities: [
                "UI/UX Design, Mobile-first Design.",
                "Shopify, WooCommerce, Magento Development.",
                "WordPress, Joomla, Drupal.",
                "Managed Hosting, Regular Updates."
            ]
        },

        software: {
            title:
                "Software Development",

            description:
                "Whether it's a custom application or an enterprise-grade solution, we create scalable, secure, and high-performing software tailored to your unique needs.",

            capabilities: [
                "Web Apps, Mobile Apps.",
                "ERP, CRM, Custom Platforms.",
                "ERP, CRM, Custom Platforms.",
                "Software Testing, Debugging, Performance Optimization"
            ]
        },

        business: {
            title:
                "Business Solutions",

            description:
                "Digital tools that simplify operations, reduce repetitive work and improve business efficiency.",

            capabilities: [
                "Workflow Automation",
                "CRM Integration",
                "ERP Solutions",
                "Process Optimization",
                "Business Dashboards"
            ]
        },

        learning: {
            title:
                "Learning & Development",

            description:
                "We design and deliver customized training programs that enhance your team’s skills and capabilities, driving innovation and growth.",

            capabilities: [
                "Executive Coaching, Leadership Development.",
                "Technical Skills, Soft Skills, Compliance Training.",
                "Online Courses, Learning Management Systems (LMS).",
                "In-person Training, Virtual Training."
            ]
        },

        hr: {
            title:
                "HR Consultant Services",

            description:
                "We offer recruitment strategies, talent management solutions, and employee engagement initiatives that align with your company’s goals.",

            capabilities: [
                "Recruitment Strategies, Candidate Sourcing.",
                "KPIs, Performance Reviews.",
                "Employee Surveys, Retention Strategies.",
                "HRIS Implementation, Automation Solutions."
            ]
        },

        consulting: {
            title:
                "Consulting and Business Operations.",

            description:
                "We offer customized strategies to streamline processes, improve efficiency, and drive growth in your organization.",

            capabilities: [
                "Lean & Six Sigma Consulting.",
                "Market Entry, Growth Strategy, Cost Optimization.",
                "Organizational Restructuring, Digital Transformation.",
                "Financial Risk, Operational Risk, Compliance Audits."
            ]
        }

    };


    function renderService(key) {

        const data =
            serviceData[key];

        if (!data || !serviceDetail) {
            return;
        }

        serviceDetail.style.opacity = "0";

        serviceDetail.style.transform =
            "translateY(15px)";


        setTimeout(() => {

            serviceDetail.innerHTML = `

                <span class="section-label">
                    SERVICE
                </span>

                <h3>
                    ${data.title}
                </h3>

                <p>
                    ${data.description}
                </p>

                <ul>

                    ${data.capabilities
                        .map(
                            item =>
                                `<li>${item}</li>`
                        )
                        .join("")}

                </ul>

            `;


            requestAnimationFrame(() => {

                serviceDetail.style.opacity =
                    "1";

                serviceDetail.style.transform =
                    "translateY(0)";
            });

        }, 120);
    }


    serviceTabs.forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                serviceTabs.forEach(
                    item => {

                        item.classList.toggle(
                            "active",
                            item === tab
                        );

                    }
                );


                renderService(
                    tab.dataset.service
                );

            }
        );

    });


    if (serviceTabs.length) {

        renderService(
            serviceTabs[0]
                .dataset
                .service
        );
    }


    /* =====================================================
       SOLUTIONS
    ===================================================== */

    const solutionTabs =
        document.querySelectorAll(
            ".solution-tab"
        );

    const solutionContent =
        document.getElementById(
            "solution-content"
        );


    const solutionData = {

        startups: {

            title: "Startups",

            description:
                "Move quickly from idea to market with focused technology and scalable foundations.",

            challenges: [
                "Limited development resources",
                "Fast-changing requirements",
                "Need for rapid validation"
            ],

            solutions: [
                "MVP Development",
                "Scalable Architecture",
                "Product Prototyping"
            ]
        },


        small: {

            title: "Small Businesses",

            description:
                "Replace manual processes with practical digital systems built around your day-to-day operations.",

            challenges: [
                "Manual workflows",
                "Limited visibility",
                "Operational inefficiency"
            ],

            solutions: [
                "Business Automation",
                "CRM Systems",
                "Digital Dashboards"
            ]
        },


        enterprise: {

            title: "Enterprise",

            description:
                "Build secure, scalable technology ecosystems designed for complex organizations.",

            challenges: [
                "System complexity",
                "Security requirements",
                "Legacy technology"
            ],

            solutions: [
                "Cloud Transformation",
                "Enterprise Integration",
                "Modernization"
            ]
        },


        education: {

            title: "Educational Institutions",

            description:
                "Create connected digital environments for students, educators and administrators.",

            challenges: [
                "Student engagement",
                "Administrative workload",
                "Fragmented systems"
            ],

            solutions: [
                "Learning Platforms",
                "Student Portals",
                "Collaboration Systems"
            ]
        },


        org: {

            title: "Organizations",

            description:
                "Use technology to improve communication, operations and measurable impact.",

            challenges: [
                "Limited resources",
                "Operational complexity",
                "Need for transparency"
            ],

            solutions: [
                "Digital Platforms",
                "Workflow Automation",
                "Impact Dashboards"
            ]
        }

    };


    function renderSolution(key) {

        const data =
            solutionData[key];

        if (!data || !solutionContent) {
            return;
        }

        solutionContent.style.opacity = "0";


        setTimeout(() => {

            solutionContent.innerHTML = `

                <h3>
                    ${data.title}
                </h3>

                <p>
                    ${data.description}
                </p>

                <div class="solution-columns">

                    <div class="solution-block">

                        <h4>
                            Challenges
                        </h4>

                        <ul>

                            ${data.challenges
                                .map(
                                    item =>
                                        `<li>${item}</li>`
                                )
                                .join("")}

                        </ul>

                    </div>


                    <div class="solution-block">

                        <h4>
                            Our Approach
                        </h4>

                        <ul>

                            ${data.solutions
                                .map(
                                    item =>
                                        `<li>${item}</li>`
                                )
                                .join("")}

                        </ul>

                    </div>

                </div>

            `;

            solutionContent.style.opacity =
                "1";

        }, 120);
    }


    solutionTabs.forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                solutionTabs.forEach(
                    item => {

                        item.classList.toggle(
                            "active",
                            item === tab
                        );

                    }
                );


                renderSolution(
                    tab.dataset.solution
                );

            }
        );

    });


    if (solutionTabs.length) {

        renderSolution(
            solutionTabs[0]
                .dataset
                .solution
        );
    }


    /* =====================================================
       PROJECT FILTER
    ===================================================== */

    const filterButtons =
        document.querySelectorAll(
            ".filter-btn"
        );

    const projectCards =
        document.querySelectorAll(
            ".project-card"
        );


    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const filter =
                    button.dataset.filter;


                filterButtons.forEach(
                    btn => {

                        btn.classList.toggle(
                            "active",
                            btn === button
                        );

                    }
                );


                projectCards.forEach(
                    card => {

                        const category =
                            card.dataset.category ||
                            "";

                        const matches =
                            filter === "all" ||
                            category.includes(
                                filter
                            );


                        if (matches) {

                            card.classList.remove(
                                "hidden"
                            );

                            if (
                                !reduceMotion
                            ) {

                                card.animate(
                                    [
                                        {
                                            opacity: 0,
                                            transform:
                                                "translateY(15px)"
                                        },
                                        {
                                            opacity: 1,
                                            transform:
                                                "translateY(0)"
                                        }
                                    ],
                                    {
                                        duration: 350,
                                        easing:
                                            "ease-out"
                                    }
                                );
                            }

                        } else {

                            card.classList.add(
                                "hidden"
                            );

                        }

                    }
                );

            }
        );

    });


    /* =====================================================
       CONTACT FORM
    ===================================================== */
const contactForm = document.getElementById("contact-form");

if (contactForm) {
    const nameInput = contactForm.querySelector('input[name="name"]');
    const emailInput = contactForm.querySelector('input[name="email"]');
    const subjectInput = contactForm.querySelector('input[name="subject"]');
    const messageInput = contactForm.querySelector('textarea[name="message"]');
    const submitButton = contactForm.querySelector(".submit-btn");

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const subject = subjectInput.value.trim();
        const message = messageInput.value.trim();

        if (!name) {
            showToast("Please enter your name.");
            nameInput.focus();
            return;
        }

        if (!email || !emailInput.checkValidity()) {
            showToast("Please enter a valid email address.");
            emailInput.focus();
            return;
        }

        if (!subject) {
            showToast("Please enter a subject.");
            subjectInput.focus();
            return;
        }

        if (!message || message.length < 20) {
            showToast("Please enter at least 20 characters.");
            messageInput.focus();
            return;
        }

        const originalButtonHTML = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = `Sending... <span>→</span>`;

        fetch(contactForm.action, {
            method: "POST",
            headers: { "Accept": "application/json" },
            body: new FormData(contactForm)
        })
        .then(response => {
            if (!response.ok) throw new Error("Request failed");
            return response.json();
        })
        .then(data => {
                submitButton.disabled = false;
                submitButton.innerHTML = `Message Sent! <span>✓</span>`;

                // Clear all form fields
                contactForm.reset();

                // Remove validation/error styling
                contactForm.querySelectorAll("input, textarea").forEach(field => {
                    field.classList.remove("invalid");
                });

                // Show success message
                showToast("Your message has been sent successfully!");

                // Restore button after 3 seconds
                setTimeout(() => {
                    submitButton.innerHTML = originalButtonHTML;
                }, 3000);
            })
        .catch(error => {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonHTML;
            showToast("Failed to send message. Please try again.");
            console.error(error);
        });
    });
}
    /* =====================================================
       AI AGENT (Groq powered chat)
    ===================================================== */

    const aiToggle   = document.getElementById("ai-agent-toggle");
    const aiPanel    = document.getElementById("ai-agent-panel");
    const aiClose    = document.getElementById("ai-agent-close");
    const aiForm     = document.getElementById("ai-agent-form");
    const aiInput    = document.getElementById("ai-agent-input");
    const aiMessages = document.getElementById("ai-agent-messages");

    // Pure client-side setup: this calls Groq directly from the browser
    // using the key in config.js. See the warning in that file — the key
    // is visible to anyone who inspects this page.
    const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

    const AI_SYSTEM_PROMPT =
        "You are the Merkisys website assistant. Merkisys is a technology, " +
        "innovation and digital solutions company. Answer visitor questions " +
        "helpfully and concisely. If you don't know something specific about " +
        "the company, say so honestly instead of making details up.";

    let aiHistory = [];
    let aiOpen = false;

    function openAiPanel() {
        aiOpen = true;
        aiPanel?.classList.add("show");
        aiPanel?.setAttribute("aria-hidden", "false");
        aiToggle?.classList.add("is-active");

        if (aiMessages && aiMessages.childElementCount === 0) {
            appendAiMessage(
                "bot",
                "Hi! I'm the Merkisys assistant. Ask me anything about our services or solutions."
            );
        }

        setTimeout(() => aiInput?.focus(), 200);
    }

    function closeAiPanel() {
        aiOpen = false;
        aiPanel?.classList.remove("show");
        aiPanel?.setAttribute("aria-hidden", "true");
        aiToggle?.classList.remove("is-active");
    }

    aiToggle?.addEventListener("click", () => {
        aiOpen ? closeAiPanel() : openAiPanel();
    });

    aiClose?.addEventListener("click", closeAiPanel);

    function appendAiMessage(role, text) {
        if (!aiMessages) return;

        const bubble = document.createElement("div");
        bubble.className = `ai-msg ${role}`;
        bubble.textContent = text;

        aiMessages.appendChild(bubble);
        aiMessages.scrollTop = aiMessages.scrollHeight;

        return bubble;
    }

    function showAiTyping() {
        const bubble = document.createElement("div");
        bubble.className = "ai-msg bot typing";
        bubble.innerHTML = "<span></span><span></span><span></span>";
        aiMessages?.appendChild(bubble);
        aiMessages.scrollTop = aiMessages.scrollHeight;
        return bubble;
    }

    aiForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const text = aiInput?.value.trim();
        if (!text) return;

        appendAiMessage("user", text);
        aiHistory.push({ role: "user", content: text });
        aiInput.value = "";

        const typingBubble = showAiTyping();

        try {
            if (typeof GROQ_API_KEY === "undefined" ||
                !GROQ_API_KEY ||
                GROQ_API_KEY === "your_groq_api_key_here") {
                throw new Error("Missing Groq API key");
            }

            const response = await fetch(GROQ_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: (typeof GROQ_MODEL !== "undefined" && GROQ_MODEL)
                        || "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: AI_SYSTEM_PROMPT },
                        ...aiHistory
                    ],
                    temperature: 0.7,
                    max_tokens: 512
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error("Groq API error:", response.status, errText);
                throw new Error("Groq request failed");
            }

            const data = await response.json();
            const reply = data.choices?.[0]?.message?.content?.trim()
                || "Sorry, I couldn't generate a response.";

            typingBubble?.remove();
            appendAiMessage("bot", reply);
            aiHistory.push({ role: "assistant", content: reply });

        } catch (err) {
            typingBubble?.remove();

            const message = (err && err.message === "Missing Groq API key")
                ? "The assistant isn't set up yet — add your Groq API key to config.js."
                : "I'm having trouble connecting right now. Please try again in a moment.";

            appendAiMessage("bot", message);
            console.error("AI agent error:", err);
        }
    });


    /* =====================================================
       DIGITAL EARTH CANVAS
    ===================================================== */

    const canvas =
        document.getElementById(
            "hero-canvas"
        );


    if ( canvas && !reduceMotion ) {

        const ctx = canvas.getContext("2d");


        let particles = [];
        let width = 0;
        let height = 0;


        function resizeCanvas() {

            const ratio =
                Math.min(
                    window.devicePixelRatio || 1,
                    2
                );


            width =
                window.innerWidth;

            height =
                window.innerHeight;


            canvas.width =
                width * ratio;

            canvas.height =
                height * ratio;


            canvas.style.width =
                `${width}px`;

            canvas.style.height =
                `${height}px`;


            ctx.setTransform(
                ratio,
                0,
                0,
                ratio,
                0,
                0
            );
        }


        function createParticles() {

            particles = [];


            const count =
                width < 700
                    ? 30
                    : 70;


            for (
                let i = 0;
                i < count;
                i++
            ) {

                particles.push({

                    x:
                        Math.random() *
                        width,

                    y:
                        Math.random() *
                        height,

                    vx:
                        (Math.random() - .5) *
                        .25,

                    vy:
                        (Math.random() - .5) *
                        .25,

                    size:
                        Math.random() *
                        1.5 +
                        .5

                });

            }
        }


        function drawParticles() {

            ctx.clearRect(
                0,
                0,
                width,
                height
            );


            particles.forEach(
                particle => {

                    particle.x +=
                        particle.vx;

                    particle.y +=
                        particle.vy;


                    if (
                        particle.x < 0 ||
                        particle.x > width
                    ) {

                        particle.vx *= -1;
                    }


                    if (
                        particle.y < 0 ||
                        particle.y > height
                    ) {

                        particle.vy *= -1;
                    }


                    ctx.beginPath();


                    ctx.arc(
                        particle.x,
                        particle.y,
                        particle.size,
                        0,
                        Math.PI * 2
                    );


                    ctx.fillStyle =
                        "rgba(8,126,234,.45)";


                    ctx.fill();

                }
            );


            for (
                let i = 0;
                i < particles.length;
                i++
            ) {

                for (
                    let j = i + 1;
                    j < particles.length;
                    j++
                ) {

                    const a =
                        particles[i];

                    const b =
                        particles[j];


                    const dx =
                        a.x - b.x;

                    const dy =
                        a.y - b.y;


                    const distance =
                        Math.sqrt(
                            dx * dx +
                            dy * dy
                        );


                    if (
                        distance < 130
                    ) {

                        const opacity =
                            (1 -
                                distance /
                                130) *
                            .08;


                        ctx.beginPath();

                        ctx.moveTo(
                            a.x,
                            a.y
                        );

                        ctx.lineTo(
                            b.x,
                            b.y
                        );


                        ctx.strokeStyle =
                            `rgba(
                                8,
                                126,
                                234,
                                ${opacity}
                            )`;


                        ctx.lineWidth = 1;

                        ctx.stroke();
                    }

                }

            }


            requestAnimationFrame(
                drawParticles
            );
        }


        window.addEventListener(
            "resize",
            () => {

                resizeCanvas();

                createParticles();

            }
        );


        resizeCanvas();

        createParticles();

        drawParticles();
    }


    /* =====================================================
       LOADING SCREEN
    ===================================================== */

    const loader =
        document.getElementById(
            "loading-screen"
        );


    if (loader) {

        const hideLoader =
            () => {

                setTimeout(() => {

                    loader.style.opacity =
                        "0";

                    loader.style.visibility =
                        "hidden";


                    setTimeout(() => {

                        loader.remove();

                    }, 700);

                }, 350);
            };


        if (
            document.readyState ===
            "complete"
        ) {

            hideLoader();

        } else {

            window.addEventListener(
                "load",
                hideLoader,
                { once: true }
            );
        }
    }

});