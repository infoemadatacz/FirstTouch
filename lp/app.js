(function () {
  const defaults = {
    brandOwner: "Jan Kluz",
    primaryBrand: "EMA AI",
    offerName: "First Touch",
    siteName: "First Touch",
    siteUrl: "https://firsttouch.app",
    bookingUrl: "https://calendly.com/jan-kluz-firsttouch/15min",
    leadFormEndpoint: "",
    leadMagnetUrl: "./assets/jana-offer-pack.md",
    contactEmail: "jan.kluz@firsttouch.app",
    legalCompanyName: "EMA AI",
    legalLocation: "Prague, Czech Republic",
    linkedinUrl: "https://www.linkedin.com/",
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
    ogImageUrl: "./assets/og-firsttouch.jpg"
  };

  const cfg = Object.assign({}, defaults, window.FIRST_TOUCH_CONFIG || {});

  wireGlobalLinks();
  wireFooterText();
  wireLeadForm();
  wireThankYou();
  wireSeoTags();
  wireStructuredData();
  wireLenis();
  wireGsapAnimations();
  wireAnalytics();

  function wireGlobalLinks() {
    document.querySelectorAll("[data-book-link]").forEach((el) => {
      el.setAttribute("href", cfg.bookingUrl);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noreferrer noopener");
    });
    // Fallback mailto links — shown as secondary CTAs when Calendly is unsuitable
    document.querySelectorAll("[data-mailto-link]").forEach((el) => {
      el.setAttribute("href", "mailto:" + cfg.contactEmail + "?subject=First%20Touch%20Inquiry");
    });
  }

  function wireAnalytics() {
    if (typeof window.plausible !== "function") return;

    // Track Calendly CTA clicks with location context
    document.querySelectorAll("[data-book-link]").forEach((el) => {
      el.addEventListener("click", function () {
        var location = resolveCtaLocation(el);
        window.plausible("Calendly CTA Click", { props: { location: location } });
      });
    });
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
        "footer":       "footer"
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
    const emailEl = document.getElementById("contact-email");

    if (ownerEl) ownerEl.textContent = cfg.brandOwner;
    if (brandEl) brandEl.textContent = cfg.primaryBrand;
    if (offerEl) offerEl.textContent = cfg.offerName;
    if (linkedinEl) linkedinEl.href = cfg.linkedinUrl;
    if (emailEl) emailEl.href = "mailto:" + cfg.contactEmail;
    if (legalEl) legalEl.textContent = cfg.legalCompanyName + " | " + cfg.legalLocation;
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
        setStatus(error.message || "Something went wrong. Please try again or email jan@firsttouch.app.", true);
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
      submitBtn.textContent = loading ? "Sending…" : "Send me the JANA Pack";
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
    if (dl) dl.href = cfg.leadMagnetUrl;

    const params = new URLSearchParams(window.location.search);
    const thanksMessage = document.getElementById("thanks-message");
    const email = params.get("email");
    if (thanksMessage && email) {
      thanksMessage.textContent = "Thanks. We captured " + email + ". Download your JANA Offer Pack below and bring one workflow to the strategy call.";
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
          addressLocality: "Prague",
          addressCountry: "CZ"
        },
        founder: {
          "@type": "Person",
          name: "Jan Kluz",
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

  function openNav() {
    links.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    links.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    toggle.getAttribute('aria-expanded') === 'true' ? closeNav() : openNav();
  });

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
