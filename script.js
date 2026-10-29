(function () {
  "use strict";

  // Set this when the UptimeRobot status page is ready. Leave empty to hide the links.
  var STATUS_URL = "";

  var body = document.body;
  var btn = document.getElementById("menuBtn");
  var menu = document.getElementById("menu");

  function setMenu(open) {
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.hidden = !open;
    body.classList.toggle("menu-open", open);
  }

  if (btn && menu) {
    btn.addEventListener("click", function () {
      setMenu(btn.getAttribute("aria-expanded") !== "true");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) {
        setMenu(false);
        btn.focus();
      }
    });
    window.matchMedia("(min-width: 821px)").addEventListener("change", function (e) {
      if (e.matches) setMenu(false);
    });
  }

  // Status page links
  if (STATUS_URL) {
    var note = document.getElementById("statusNote");
    var link = document.getElementById("statusLink");
    var foot = document.getElementById("footerStatus");
    if (link) link.href = STATUS_URL;
    if (foot) foot.href = STATUS_URL;
    if (note) note.hidden = false;
    if (foot) foot.hidden = false;
  }

  // Contact form
  var form = document.getElementById("contactForm");
  var submit = document.getElementById("submitBtn");
  var status = document.getElementById("formStatus");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.className = "form-status";
      status.textContent = "Sending...";
      submit.disabled = true;

      fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form)
      })
        .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
        .then(function (r) {
          if (r.ok && r.data.success) {
            form.reset();
            status.className = "form-status ok";
            status.textContent = "Thank you. Your message is in, and we will reply within one working day.";
          } else {
            throw new Error("failed");
          }
        })
        .catch(function () {
          status.className = "form-status err";
          status.textContent = "The message did not send. Please try again, or email pharosworks.dev@gmail.com.";
        })
        .then(function () { submit.disabled = false; });
    });
  }
})();
