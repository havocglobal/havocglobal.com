(function () {
  var S = window.SITE || {};
  var LABELS = { instagram: "Instagram", tiktok: "TikTok", linkedin: "LinkedIn", x: "X", facebook: "Facebook",
                 youtube: "YouTube", threads: "Threads", pinterest: "Pinterest" };
  function el(tag, attrs, text) { var e = document.createElement(tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (text) e.textContent = text; return e; }
  function fillSocials(list, accounts, owner) {
    if (!list || !accounts) return;
    list.innerHTML = "";
    Object.keys(LABELS).forEach(function (k) {
      var url = accounts[k];
      if (!url) return;
      var li = el("li"); var a = el("a", { href: url, target: "_blank", rel: "noopener me", "aria-label": owner + " on " + LABELS[k] }, LABELS[k]);
      li.appendChild(a); list.appendChild(li);
    });
  }
  document.querySelectorAll("[data-email]").forEach(function (a) {
    var addr = (S.emails || {})[a.getAttribute("data-email")]; if (!addr) return;
    if (a.tagName === "A") a.href = "mailto:" + addr;
    if (!a.hasAttribute("data-keep-text")) a.textContent = addr;
  });
  document.querySelectorAll("[data-location]").forEach(function (e) { if (S.location) e.textContent = S.location; });
  document.querySelectorAll("[data-socials]").forEach(function (list) {
    var who = list.getAttribute("data-socials");
    if (who === "havoc") fillSocials(list, S.socials, "Havoc Global");
    else fillSocials(list, (S.brands || {})[who], list.getAttribute("data-owner") || who);
  });
  document.querySelectorAll("[data-brand-url]").forEach(function (a) {
    var b = (S.brands || {})[a.getAttribute("data-brand-url")]; if (b && b.website) a.href = b.website;
  });
  // Search engines: Organization data built from the settings above
  try {
    var same = Object.keys(S.socials || {}).map(function (k) { return S.socials[k]; }).filter(Boolean);
    var org = { "@context": "https://schema.org", "@type": "Organization", "@id": "https://havocglobal.com/#organization",
      name: "Havoc Global", url: "https://havocglobal.com", logo: "https://havocglobal.com/assets/havoc-global-monogram.svg",
      description: "Havoc Global is a lifestyle: an experience lived through its brands. A London fashion house, home of Defiant Attitude, A.C.H Kidz and Hevicon.",
      email: (S.emails || {}).general, founder: { "@type": "Person", name: "Oliver Hevicon", jobTitle: "Founder" },
      address: { "@type": "PostalAddress", addressLocality: "London", addressCountry: "GB" },
      brand: [
        { "@type": "Brand", name: "Defiant Attitude", url: ((S.brands || {}).defiant || {}).website, description: "Clothing for men and women, designed in London." },
        { "@type": "Brand", name: "A.C.H Kidz", url: ((S.brands || {}).ach || {}).website, description: "Playful everyday clothing for children aged 5 to 12." },
        { "@type": "Brand", name: "Hevicon", url: ((S.brands || {}).hevicon || {}).website, description: "Everyday wardrobe designed in London. Coming soon." }
      ], sameAs: same };
    var s = el("script", { type: "application/ld+json" }); s.textContent = JSON.stringify(org); document.head.appendChild(s);
  } catch (e) {}
  // Menu toggle
  var t = document.querySelector(".nav-toggle"), n = document.getElementById("site-nav");
  if (t && n) t.addEventListener("click", function () { var o = n.classList.toggle("open"); t.setAttribute("aria-expanded", o ? "true" : "false"); });
  // Forms: open the visitor's email app with the details filled in
  document.querySelectorAll("form[data-mailto]").forEach(function (f) {
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!f.reportValidity()) return;
      var to = (S.emails || {})[f.getAttribute("data-mailto")] || "";
      var lines = [], subject = f.getAttribute("data-subject") || "Website enquiry";
      Array.prototype.forEach.call(f.elements, function (x) {
        if (!x.name || x.type === "submit") return;
        if (x.type === "checkbox") { if (x.checked) lines.push("[x] " + x.name); return; }
        if (x.name === "Subject" && x.value) subject = x.value + " (website)";
        if (x.value) lines.push(x.name + ": " + x.value);
      });
      window.location.href = "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
      var note = f.querySelector(".form-note"); if (note) note.hidden = false;
    });
  });
  document.querySelectorAll("img[data-logo]").forEach(function (i) { var src = (window.LOGOS || {})[i.getAttribute("data-logo")]; if (src) i.src = src; });
  var y = document.querySelectorAll("[data-year]"); y.forEach(function (e) { e.textContent = new Date().getFullYear(); });
})();
