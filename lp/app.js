(function () {
  const defaults = {
    brandOwner: "Jan Kluz",
    primaryBrand: "EMA AI",
    offerName: "First Touch",
    siteName: "First Touch",
    siteUrl: "https://firsttouch.ai",
    bookingUrl: "https://calendly.com/your-handle/first-touch-strategy-call",
    leadFormEndpoint: "",
    leadMagnetUrl: "./assets/jana-offer-pack.md",
    contactEmail: "jan@yourdomain.com",
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

  function wireGlobalLinks() {
    document.querySelectorAll("[data-book-link]").forEach((el) => {
      el.setAttribute("href", cfg.bookingUrl);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noreferrer noopener");
    });
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
    if (!leadForm) return;

    leadForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(leadForm);

      const email = String(formData.get("email") || "").trim();
      const name = String(formData.get("name") || "").trim();
      const company = String(formData.get("company") || "").trim();
      const role = String(formData.get("role") || "").trim();

      if (!email || !name || !company || !role) {
        setStatus("Please fill all required fields.", true);
        return;
      }

      const utm = readUtmParams();
      Object.entries(utm).forEach(([k, v]) => formData.append(k, v));
      formData.append("source", "first-touch-lp");
      formData.append("page_url", window.location.href);
      formData.append("timestamp", new Date().toISOString());

      setStatus("Submitting...", false);

      try {
        if (cfg.leadFormEndpoint) {
          const response = await fetch(cfg.leadFormEndpoint, {
            method: "POST",
            body: formData,
            headers: { Accept: "application/json" }
          });

          if (!response.ok) {
            throw new Error("Lead endpoint returned non-OK response");
          }
        } else {
          const localLead = {
            email,
            name,
            company,
            role,
            source: "first-touch-lp",
            timestamp: new Date().toISOString(),
            utm
          };
          window.localStorage.setItem("first_touch_last_lead", JSON.stringify(localLead));
        }

        const next = "./thank-you.html?email=" + encodeURIComponent(email);
        window.location.href = next;
      } catch (error) {
        setStatus("Submission failed. Check lead endpoint in config.js.", true);
      }
    });

    function setStatus(text, isError) {
      if (!formStatus) return;
      formStatus.textContent = text;
      formStatus.classList.remove("error", "ok");
      formStatus.classList.add(isError ? "error" : "ok");
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
    const serviceSchemaEl = document.getElementById("service-schema");
    const faqSchemaEl = document.getElementById("faq-schema");
    const websiteSchemaEl = document.getElementById("website-schema");

    if (orgSchemaEl) {
      orgSchemaEl.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: cfg.primaryBrand,
        url: cfg.siteUrl,
        founder: cfg.brandOwner,
        sameAs: [cfg.linkedinUrl]
      });
    }

    if (serviceSchemaEl) {
      serviceSchemaEl.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        name: cfg.offerName,
        serviceType: "AI Manager Operating System",
        provider: {
          "@type": "Organization",
          name: cfg.primaryBrand
        },
        areaServed: "Europe",
        description: cfg.seoDescription,
        url: cfg.siteUrl,
        offers: {
          "@type": "Offer",
          url: cfg.bookingUrl,
          availability: "https://schema.org/InStock"
        }
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

    if (websiteSchemaEl) {
      websiteSchemaEl.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: cfg.siteName,
        url: cfg.siteUrl,
        description: cfg.seoDescription
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
