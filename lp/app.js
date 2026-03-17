(function () {
  const defaults = {
    brandOwner: "First Touch",
    primaryBrand: "First Touch",
    offerName: "First Touch",
    siteName: "First Touch",
    siteUrl: "https://firsttouch.app",
    bookingUrl: "https://calendly.com/james-harrington-firsttouch/15min",
    leadFormEndpoint: "/api/leads",
    leadMagnetUrl: "./assets/strategy-toolkit.md",
    contactEmail: "james@firsttouch.app",
    legalCompanyName: "First Touch",
    legalLocation: "London, United Kingdom",
    linkedinUrl: "https://www.linkedin.com/company/firsttouch-ai/",
    seoTitle: "First Touch | All-in-One AI Manager OS for Execution",
    seoDescription: "First Touch is an all-in-one AI manager operating system: global context, best-model orchestration, action workflows, meeting transcription, planning, coding support, and recurring reporting.",
    seoKeywords: [
      "AI manager assistant",
      "all in one AI operating system",
      "AI agent orchestration",
      "autonomous workflow automation",
      "meeting transcription and action items",
      "executive AI assistant",
      "model agnostic AI platform",
      "no vendor lock in AI",
      "business compliant AI assistant",
      "AI planning writing coding reporting"
    ],
    ogImageUrl: "https://firsttouch.app/assets/og-firsttouch.jpg"
  };

  const cfg = Object.assign({}, defaults, window.FIRST_TOUCH_CONFIG || {});

  captureTrafficSource();
  wireGlobalLinks();
  wireCalendlyModal();
  wireFooterText();
  wireLeadForm();
  wireHeroEmailForm();
  wireThankYou();
  wireSeoTags();
  wireStructuredData();
  wireLenis();
  wireGsapAnimations();
  wireAnalytics();
  wireCalendlyPostMessage();

  function wireGlobalLinks() {
    // Set real Calendly URL as href — JS clicks are intercepted by wireCalendlyModal()
    // and open the inline modal (e.preventDefault stops navigation).
    // No-JS fallback: user follows the direct Calendly link in a new tab.
    document.querySelectorAll("[data-book-link]").forEach((el) => {
      el.setAttribute("href", cfg.bookingUrl);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
      el.setAttribute("aria-haspopup", "dialog");
    });
    // Fallback mailto links — shown as secondary CTAs when Calendly is unsuitable
    document.querySelectorAll("[data-mailto-link]").forEach((el) => {
      el.setAttribute("href", "mailto:" + cfg.contactEmail + "?subject=First%20Touch%20Inquiry");
    });
  }

  // ── Traffic source capture ────────────────────────────────────
  // Runs once per session. UTMs are canonical; falls back to referrer bucketing.
  // Stored in sessionStorage so it survives modal open/close without re-reading.
  function captureTrafficSource() {
    if (sessionStorage.getItem("ft_traffic_source")) return; // already set this session
    var params = new URLSearchParams(window.location.search);
    var source = params.get("utm_source");
    var medium = params.get("utm_medium");

    if (source) {
      // Normalise: lowercase, trim, combine with medium when it adds signal
      source = source.toLowerCase().trim();
      if (medium) {
        medium = medium.toLowerCase().trim();
        // e.g. "google / cpc", "linkedin / sponsored"
        source = source + " / " + medium;
      }
      sessionStorage.setItem("ft_traffic_source", source);
      return;
    }

    // No UTMs — bucket referrer
    var ref = document.referrer;
    if (!ref) {
      sessionStorage.setItem("ft_traffic_source", "direct");
      return;
    }
    var referrerBuckets = [
      [/google\./i,    "google / organic"],
      [/bing\./i,      "bing / organic"],
      [/linkedin\./i,  "linkedin / organic"],
      [/twitter\.com|t\.co/i, "twitter"],
      [/facebook\./i,  "facebook"],
      [/instagram\./i, "instagram"],
      [/t\.me|telegram\./i, "telegram"],
      [/substack\./i,  "substack"],
      [/producthunt\./i, "product-hunt"],
      [/firsttouch\.app/i, "internal"]
    ];
    for (var i = 0; i < referrerBuckets.length; i++) {
      if (referrerBuckets[i][0].test(ref)) {
        sessionStorage.setItem("ft_traffic_source", referrerBuckets[i][1]);
        return;
      }
    }
    // Known domain but not bucketed → use hostname
    try {
      var hostname = new URL(ref).hostname.replace(/^www\./, "");
      sessionStorage.setItem("ft_traffic_source", "referral / " + hostname);
    } catch (e) {
      sessionStorage.setItem("ft_traffic_source", "referral / unknown");
    }
  }

  function getTrafficSource() {
    return sessionStorage.getItem("ft_traffic_source") || "unknown";
  }

  function wireCalendlyModal() {
    var modal = document.getElementById("calendly-modal");
    var embedEl = document.getElementById("calendly-embed");
    if (!modal || !embedEl) return;

    var iframeCreated = false;
    var lastFocused = null;

    function openModal() {
      if (!iframeCreated) {
        // Show spinner while Calendly loads
        embedEl.innerHTML =
          '<div class="calendly-modal__loader">' +
            '<div class="calendly-modal__loader-spinner"></div>' +
            '<span>Loading calendar…</span>' +
          '</div>';

        var iframe = document.createElement("iframe");
        iframe.src = cfg.bookingUrl +
          "?embed_domain=firsttouch.app&embed_type=Inline" +
          "&hide_landing_page_details=1&hide_gdpr_banner=1&background_color=16161A&text_color=ffffff&primary_color=9301BB";
        iframe.title = "Book a 15-min strategy call with First Touch";
        iframe.setAttribute("allowfullscreen", "");
        iframe.style.opacity = "0";
        iframe.style.transition = "opacity 0.3s ease";
        iframe.addEventListener("load", function () {
          var loader = embedEl.querySelector(".calendly-modal__loader");
          if (loader) loader.remove();
          iframe.style.opacity = "1";
        });
        embedEl.appendChild(iframe);
        iframeCreated = true;
      }

      lastFocused = document.activeElement;
      modal.removeAttribute("hidden");
      document.body.classList.add("modal-open");

      // Focus close button for keyboard users
      var closeBtn = document.getElementById("calendly-modal-close");
      if (closeBtn) closeBtn.focus();

      if (typeof window.plausible === "function") {
        window.plausible("Calendly Modal Open", { props: { traffic_source: getTrafficSource() } });
      }
    }

    function closeModal() {
      modal.setAttribute("hidden", "");
      document.body.classList.remove("modal-open");
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    // Open modal on any [data-book-link] click
    document.addEventListener("click", function (e) {
      var bookEl = e.target.closest("[data-book-link]");
      if (bookEl) {
        e.preventDefault();
        openModal();
        return;
      }
      // Close on backdrop or close button
      if (e.target.closest("#calendly-modal-close") || e.target.id === "calendly-modal-backdrop") {
        closeModal();
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hasAttribute("hidden")) {
        closeModal();
      }
    });
  }

  function wireAnalytics() {
    // ── 1. Calendly CTA clicks — event delegation catches dynamically-injected CTAs
    //    (e.g. mobile nav CTA added by the second IIFE after this runs)
    document.addEventListener("click", function (e) {
      var bookEl = e.target.closest("[data-book-link]");
      if (bookEl) {
        var loc = resolveCtaLocation(bookEl);
        window.plausible("Calendly CTA Click", { props: { location: loc, traffic_source: getTrafficSource() } });
      }

      // ── 2. Mailto link clicks
      if (e.target.closest("[data-mailto-link]")) {
        window.plausible("Mailto Click", {});
      }

      // ── 3. Sticky CTA dismissal
      if (e.target.closest("#sticky-cta-close")) {
        window.plausible("Sticky CTA Dismissed", {});
      }
    });

    // ── 4. Lead form start — first field interaction (funnel entry step)
    var leadForm = document.getElementById("lead-form");
    if (leadForm) {
      var formStartFired = false;
      leadForm.addEventListener("focusin", function () {
        if (!formStartFired) {
          formStartFired = true;
          window.plausible("Lead Form Start", {});
        }
      });
    }

    // ── 5. Scroll depth milestones — 25 / 50 / 75 / 90 %
    var scrollMilestones = [25, 50, 75, 90];
    var firedMilestones = {};
    window.addEventListener("scroll", function () {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      var pct = Math.round((window.scrollY / docHeight) * 100);
      scrollMilestones.forEach(function (m) {
        if (!firedMilestones[m] && pct >= m) {
          firedMilestones[m] = true;
          window.plausible("Scroll Depth", { props: { depth: m + "%" } });
        }
      });
    }, { passive: true });
  }

  // Walk up the DOM to determine where a CTA was clicked
  function resolveCtaLocation(el) {
    // Explicit override wins
    if (el.dataset.ctaLocation) return el.dataset.ctaLocation;

    // Closest landmark with an id (section, header, div[id])
    var landmark = el.closest("[id]");
    if (landmark) {
      var id = landmark.id;
      var locationMap = {
        "hero":         "hero",
        "sticky-cta":   "sticky-bar",
        "top":          "nav",
        "nav-links":    "nav",
        "lead-capture": "lead-capture-section",
        "pricing":      "pricing",
        "footer":       "footer",
        "teams":        "teams-section",
        "cta":          "cta-section",
        "offer":        "offer-section",
        "addons":       "addons-section",
        "faq":          "faq-section"
      };
      return locationMap[id] || id;
    }

    // Fallback: check class hints
    if (el.classList.contains("nav-cta-desktop")) return "nav";
    if (el.classList.contains("nav-mobile-cta"))  return "nav-mobile";
    if (el.classList.contains("footer-cta-btn"))  return "footer";

    return "unknown";
  }

  function wireFooterText() {
    const ownerEl = document.getElementById("brand-owner");
    const brandEl = document.getElementById("primary-brand");
    const legalEl = document.getElementById("legal-line");
    const offerEl = document.getElementById("offer-name-footer");
    const linkedinEl = document.getElementById("linkedin-link");
    const founderLinkedinEl = document.getElementById("linkedin-founder-link");
    const emailEl = document.getElementById("contact-email");

    if (ownerEl) ownerEl.textContent = cfg.brandOwner;
    if (brandEl) brandEl.textContent = cfg.primaryBrand;
    if (offerEl) offerEl.textContent = cfg.offerName;
    if (linkedinEl) linkedinEl.href = cfg.linkedinUrl;
    if (founderLinkedinEl) founderLinkedinEl.href = cfg.founderLinkedinUrl;
    if (emailEl) emailEl.href = "mailto:" + cfg.contactEmail;
    if (legalEl) legalEl.textContent = cfg.legalCompanyName + " | " + cfg.legalLocation;
  }

  function wireHeroEmailForm() {
    const heroForm = document.getElementById("hero-email-form");
    if (!heroForm) return;

    const heroInput = document.getElementById("hero-email-input");
    const heroError = document.getElementById("hero-email-error");
    const heroBtn   = heroForm.querySelector(".hero-email-btn");

    heroForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = (heroInput ? heroInput.value : "").trim();

      // Clear previous error
      if (heroError) { heroError.hidden = true; heroError.textContent = ""; }
      if (heroInput) heroInput.removeAttribute("aria-invalid");

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (heroError) { heroError.textContent = "Enter a valid work email."; heroError.hidden = false; }
        if (heroInput) { heroInput.setAttribute("aria-invalid", "true"); heroInput.focus(); }
        return;
      }

      // Pre-fill email in the main lead form
      const mainEmailInput = document.getElementById("lf-email");
      if (mainEmailInput) mainEmailInput.value = email;

      // Track in analytics
      if (typeof window.plausible === "function") {
        window.plausible("Hero Email Capture", { props: { traffic_source: getTrafficSource() } });
      }

      // Disable button briefly to show progress
      if (heroBtn) { heroBtn.disabled = true; heroBtn.textContent = "Almost there…"; }

      // Scroll to the full form and focus the name field
      const panel = document.getElementById("lead-capture");
      if (panel) {
        panel.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(function () {
          const nameInput = document.getElementById("lf-name");
          if (nameInput) nameInput.focus();
          if (heroBtn) { heroBtn.disabled = false; heroBtn.textContent = "Get Free Toolkit →"; }
        }, 700);
      } else {
        if (heroBtn) { heroBtn.disabled = false; heroBtn.textContent = "Get Free Toolkit →"; }
      }
    });

    // Clear error on input
    if (heroInput) {
      heroInput.addEventListener("input", function () {
        if (heroError) { heroError.hidden = true; heroError.textContent = ""; }
        heroInput.removeAttribute("aria-invalid");
      });
    }
  }

  function wireLeadForm() {
    const leadForm = document.getElementById("lead-form");
    const formStatus = document.getElementById("form-status");
    const submitBtn = document.getElementById("lead-submit");
    if (!leadForm) return;

    // Field-level validation config: [fieldName, label, validator]
    const REQUIRED_FIELDS = [
      { name: "email",   label: "Work email",  validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "Enter a valid work email." },
      { name: "name",    label: "Full name",   validate: (v) => v.length >= 2 ? null : "Enter your full name." },
      { name: "company", label: "Company",     validate: (v) => v.length >= 1 ? null : "Enter your company name." },
      { name: "role",    label: "Role",        validate: (v) => v ? null : "Select your role." }
    ];

    leadForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearAllErrors();

      const email   = String(leadForm.elements["email"]?.value   || "").trim();
      const name    = String(leadForm.elements["name"]?.value    || "").trim();
      const company = String(leadForm.elements["company"]?.value || "").trim();
      const role    = String(leadForm.elements["role"]?.value    || "").trim();
      const message = String(leadForm.elements["message"]?.value || "").trim();

      // Field-level validation
      let hasErrors = false;
      for (const field of REQUIRED_FIELDS) {
        const value = String(leadForm.elements[field.name]?.value || "").trim();
        const error = field.validate(value);
        if (error) {
          showFieldError(field.name, error);
          hasErrors = true;
        }
      }
      if (hasErrors) return;

      setLoading(true);
      setStatus("", false);

      const utm = readUtmParams();
      const payload = {
        email,
        name,
        company,
        role,
        message,
        source: "first-touch-lp",
        page_url: window.location.href,
        timestamp: new Date().toISOString(),
        ...utm
      };

      try {
        if (cfg.leadFormEndpoint) {
          const response = await fetch(cfg.leadFormEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            throw new Error(body.error || "Submission failed (" + response.status + ").");
          }
        } else {
          // Offline fallback — persist locally so no lead is lost during dev
          window.localStorage.setItem("first_touch_last_lead", JSON.stringify(payload));
        }

        // Track successful lead form submission before navigating away
        if (typeof window.plausible === "function") {
          window.plausible("Lead Form Submit", { props: { role: role } });
        }

        window.location.href = "./thank-you.html?email=" + encodeURIComponent(email);
      } catch (error) {
        setStatus(error.message || "Something went wrong. Please try again or email james@firsttouch.app.", true);
        setLoading(false);
      }
    });

    // Real-time: clear field error on input
    leadForm.addEventListener("input", (e) => {
      const name = e.target.name;
      if (name) clearFieldError(name);
    });

    function showFieldError(fieldName, msg) {
      const errorEl = leadForm.querySelector("[data-error='" + fieldName + "']");
      if (errorEl) {
        errorEl.textContent = msg;
        errorEl.hidden = false;
      }
      const input = leadForm.elements[fieldName];
      if (input) input.setAttribute("aria-invalid", "true");
    }

    function clearFieldError(fieldName) {
      const errorEl = leadForm.querySelector("[data-error='" + fieldName + "']");
      if (errorEl) {
        errorEl.textContent = "";
        errorEl.hidden = true;
      }
      const input = leadForm.elements[fieldName];
      if (input) input.removeAttribute("aria-invalid");
    }

    function clearAllErrors() {
      leadForm.querySelectorAll("[data-error]").forEach((el) => {
        el.textContent = "";
        el.hidden = true;
      });
      Array.from(leadForm.elements).forEach((el) => el.removeAttribute("aria-invalid"));
    }

    function setLoading(loading) {
      if (!submitBtn) return;
      submitBtn.disabled = loading;
      submitBtn.textContent = loading ? "Sending…" : "Send me the Toolkit";
    }

    function setStatus(text, isError) {
      if (!formStatus) return;
      formStatus.textContent = text;
      formStatus.classList.remove("error", "ok");
      if (text) formStatus.classList.add(isError ? "error" : "ok");
    }
  }

  function wireThankYou() {
    const dl = document.getElementById("direct-download");
    if (dl && cfg.leadMagnetUrl) {
      dl.href = cfg.leadMagnetUrl;
      // Force browser download rather than navigating to the file
      dl.setAttribute("download", "strategy-toolkit.md");
      dl.setAttribute("rel", "noopener");

      // Track download clicks
      dl.addEventListener("click", function () {
        if (typeof window.plausible === "function") {
          window.plausible("Lead Magnet Download", { props: { file: "strategy-toolkit" } });
        }
      });
    }

    const params = new URLSearchParams(window.location.search);
    const thanksMessage = document.getElementById("thanks-message");
    const email = params.get("email");
    if (thanksMessage && email) {
      thanksMessage.textContent = "Thanks — we've captured " + email + ". Download your Strategy Toolkit below and bring one workflow to the strategy call.";
    }
  }

  function wireSeoTags() {
    const canonical = document.getElementById("canonical-link");
    if (!canonical) return;

    if (cfg.seoTitle) document.title = cfg.seoTitle;
    setMetaByName("description", cfg.seoDescription);
    setMetaByName("keywords", Array.isArray(cfg.seoKeywords) ? cfg.seoKeywords.join(", ") : cfg.seoKeywords);

    setMetaByProperty("og:title", cfg.seoTitle);
    setMetaByProperty("og:description", cfg.seoDescription);
    setMetaByProperty("og:url", cfg.siteUrl);
    setMetaByProperty("og:image", cfg.ogImageUrl || defaults.ogImageUrl);

    setMetaByName("twitter:title", cfg.seoTitle);
    setMetaByName("twitter:description", cfg.seoDescription);
    setMetaByName("twitter:image", cfg.ogImageUrl || defaults.ogImageUrl);

    if (canonical && cfg.siteUrl) canonical.href = cfg.siteUrl;
  }

  function wireStructuredData() {
    const orgSchemaEl = document.getElementById("org-schema");
    const softwareSchemaEl = document.getElementById("software-schema");
    const faqSchemaEl = document.getElementById("faq-schema");
    const breadcrumbSchemaEl = document.getElementById("breadcrumb-schema");

    if (orgSchemaEl) {
      orgSchemaEl.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: cfg.primaryBrand,
        url: cfg.siteUrl,
        logo: "https://firsttouch.app/assets/firsttouch-logo.svg",
        email: cfg.contactEmail,
        foundingDate: "2024",
        legalName: cfg.legalCompanyName,
        address: {
          "@type": "PostalAddress",
          addressLocality: "London",
          addressCountry: "GB"
        },
        founder: {
          "@type": "Person",
          name: "James Harrington",
          email: cfg.contactEmail
        },
        sameAs: [cfg.linkedinUrl]
      });
    }

    if (softwareSchemaEl) {
      softwareSchemaEl.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: cfg.primaryBrand,
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "AI Assistant",
        operatingSystem: "Web, Telegram",
        description: cfg.seoDescription,
        url: cfg.siteUrl,
        screenshot: cfg.ogImageUrl,
        featureList: [
          "AI agent orchestration",
          "Meeting transcription and action items",
          "Autonomous workflow automation",
          "Multi-model AI routing (Claude, GPT-4, Gemini)",
          "Role-level access control",
          "Compliance-ready data handling",
          "Recurring management reporting",
          "Telegram interface",
          "Document and knowledge base integration"
        ],
        offers: {
          "@type": "Offer",
          price: "500",
          priceCurrency: "EUR",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "500",
            priceCurrency: "EUR",
            name: "Pilot"
          },
          url: cfg.bookingUrl,
          availability: "https://schema.org/InStock"
        },
        provider: {
          "@type": "Organization",
          name: cfg.primaryBrand,
          url: cfg.siteUrl
        },
        audience: {
          "@type": "BusinessAudience",
          audienceType: "B2B",
          geographicArea: "Europe"
        },
        softwareVersion: "1.0",
        releaseNotes: cfg.siteUrl
      });
    }

    if (faqSchemaEl) {
      const faqItems = Array.from(document.querySelectorAll("[data-faq-item]"))
        .map((item) => {
          const question = item.querySelector("[data-faq-question]")?.textContent?.trim() || "";
          const answer = item.querySelector("[data-faq-answer]")?.textContent?.trim() || "";
          if (!question || !answer) return null;
          return {
            "@type": "Question",
            name: question,
            acceptedAnswer: {
              "@type": "Answer",
              text: answer
            }
          };
        })
        .filter(Boolean);

      faqSchemaEl.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems
      });
    }

    if (breadcrumbSchemaEl) {
      breadcrumbSchemaEl.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: cfg.siteUrl
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Guides",
            item: cfg.siteUrl + "guides/"
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Autonomous Actions",
            item: cfg.siteUrl + "guides/autonomous-actions.html"
          }
        ]
      });
    }
  }

  function wireLenis() {
    if (typeof Lenis === "undefined") return;
    // Fix #1: Skip Lenis on touch devices — native scroll is faster and matches OS physics.
    // Also skip if user prefers reduced motion or viewport is mobile-width.
    const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobileWidth = window.matchMedia("(max-width: 900px)").matches;
    if (isTouchDevice || prefersReduced || isMobileWidth) return;

    // P0 Fix: disable CSS scroll-behavior:smooth while Lenis handles scrolling
    // to prevent double-animation on anchor link clicks.
    document.documentElement.classList.add("lenis-active");

    const lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }
    });

    if (typeof gsap !== "undefined") {
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  function wireGsapAnimations() {
    // Fix #2: Respect prefers-reduced-motion — CSS rules exist but JS animations override them.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".reveal-gsap").forEach(function (el) {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      // Fallback: show all hidden elements
      document.querySelectorAll(".reveal-gsap").forEach(function (el) {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Hero — staggered text reveal
    gsap.from(".hero-copy > *", {
      y: 40,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: "power3.out",
      delay: 0.2
    });

    gsap.from(".hero-visual > *", {
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power2.out",
      delay: 0.4
    });

    // Sections — reveal on scroll
    gsap.utils.toArray(".reveal-gsap").forEach(function (el) {
      gsap.to(el, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true
        }
      });
    });

    // Bento grid — cascade
    gsap.utils.toArray(".bento-cell").forEach(function (el, i) {
      gsap.from(el, {
        y: 24,
        opacity: 0,
        duration: 0.7,
        delay: (i % 3) * 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true
        }
      });
    });

    // Timeline scrub — How it works
    gsap.to(".timeline-progress", {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: "#system",
        start: "top 60%",
        end: "bottom 40%",
        scrub: 1
      }
    });

    // Timeline items — fade in
    gsap.utils.toArray(".timeline-item").forEach(function (el, i) {
      gsap.from(el, {
        x: -20,
        opacity: 0,
        duration: 0.6,
        delay: i * 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true
        }
      });
    });

    // Stats counter animation
    document.querySelectorAll(".stat-value[data-count]").forEach(function (el) {
      var target = parseFloat(el.dataset.count);
      var suffix = el.dataset.suffix || "";
      gsap.to({ val: 0 }, {
        val: target,
        duration: 1.8,
        ease: "power2.out",
        onUpdate: function () {
          el.textContent = Math.round(this.targets()[0].val) + suffix;
        },
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true
        }
      });
    });

    // Pricing cards — stagger in
    gsap.from(".pricing-card", {
      y: 32,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#pricing",
        start: "top 75%",
        once: true
      }
    });

    // Dayflow steps
    gsap.utils.toArray(".dayflow-step").forEach(function (el, i) {
      gsap.from(el, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: (i % 3) * 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true
        }
      });
    });
  }

  // ── Calendly postMessage listener ────────────────────────────
  // Fires "Calendly Booking Confirmed" when the user completes a booking inside the iframe.
  // Calendly dispatches window.postMessage({ event: "calendly.event_scheduled", payload: {...} })
  // after the confirmation screen is shown.
  function wireCalendlyPostMessage() {
    window.addEventListener("message", function (e) {
      if (!e.data || typeof e.data !== "object") return;
      var eventName = e.data.event;
      if (!eventName || typeof eventName !== "string") return;

      var source = getTrafficSource();

      if (eventName === "calendly.event_scheduled") {
        if (typeof window.plausible === "function") {
          window.plausible("Calendly Booking Confirmed", { props: { traffic_source: source } });
        }
      }

      // Also track when user reaches time selection step (modal engaged, not just opened)
      if (eventName === "calendly.date_and_time_selected") {
        if (typeof window.plausible === "function") {
          window.plausible("Calendly Time Selected", { props: { traffic_source: source } });
        }
      }
    });
  }

  function setMetaByName(name, content) {
    if (!content) return;
    const el = document.querySelector('meta[name="' + name + '"]');
    if (el) el.setAttribute("content", content);
  }

  function setMetaByProperty(property, content) {
    if (!content) return;
    const el = document.querySelector('meta[property="' + property + '"]');
    if (el) el.setAttribute("content", content);
  }

  function readUtmParams() {
    const params = new URLSearchParams(window.location.search);
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    const out = {};
    keys.forEach((key) => {
      const value = params.get(key);
      if (value) out[key] = value;
    });
    return out;
  }
})();

// ── Mobile nav toggle ────────────────────────────────────────────
(function () {
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');
  if (!toggle || !links) return;

  // Inject mobile-only CTA button into nav
  const mobileCta = document.createElement('a');
  mobileCta.className = 'nav-mobile-cta';
  mobileCta.setAttribute('data-book-link', '');
  mobileCta.href = '#';
  mobileCta.textContent = 'Book 15-min Assessment →';
  links.appendChild(mobileCta);

  // Backdrop: semi-transparent overlay behind the nav drawer.
  // Clicking it closes the drawer (tap-outside-to-close UX).
  const backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');
  links.insertAdjacentElement('afterend', backdrop);

  let _navScrollY = 0;

  function openNav() {
    links.classList.add('is-open');
    backdrop.classList.add('is-visible');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation');
    // Fix: use position:fixed to prevent scroll-behind on iOS Safari
    _navScrollY = window.scrollY;
    document.body.style.top = '-' + _navScrollY + 'px';
    document.body.classList.add('nav-open');
  }

  function closeNav() {
    links.classList.remove('is-open');
    backdrop.classList.remove('is-visible');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    document.body.classList.remove('nav-open');
    document.body.style.top = '';
    window.scrollTo(0, _navScrollY);
  }

  toggle.addEventListener('click', () => {
    toggle.getAttribute('aria-expanded') === 'true' ? closeNav() : openNav();
  });

  // Tap backdrop to close
  backdrop.addEventListener('click', closeNav);

  // Close when a nav link is clicked
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeNav);
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeNav();
  });

  // Reset on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) closeNav();
  }, { passive: true });
})();

// ── Sticky CTA — mobile only, appears after hero scrolls out ─────
(function () {
  const bar   = document.getElementById('sticky-cta');
  const close = document.getElementById('sticky-cta-close');
  const hero  = document.getElementById('hero');
  if (!bar || !close) return;

  let dismissed = !!sessionStorage.getItem('cta-dismissed');

  function show(visible) {
    if (dismissed) return;
    bar.classList.toggle('is-visible', visible);
  }

  if (hero && typeof IntersectionObserver !== 'undefined') {
    const obs = new IntersectionObserver(
      ([entry]) => show(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-72px 0px 0px 0px' } // offset for sticky nav height
    );
    obs.observe(hero);
  } else {
    // Fallback: scroll threshold
    const THRESHOLD = window.innerHeight * 0.8;
    window.addEventListener('scroll', () => {
      show(window.scrollY > THRESHOLD);
    }, { passive: true });
  }

  close.addEventListener('click', () => {
    dismissed = true;
    sessionStorage.setItem('cta-dismissed', '1');
    bar.classList.remove('is-visible');
  });
})();
