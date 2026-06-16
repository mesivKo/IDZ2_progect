/* =========================
    LOADER
========================= */
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");

  if (!preloader) return;

  preloader.classList.add("hide");

  setTimeout(() => {
    preloader.remove();
  }, 400);
});

document.addEventListener("DOMContentLoaded", () => {
  

  /* =========================
     HEADER SCROLL
  ========================= */
  const header = document.querySelector("header");

  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  });


  /* =========================
     FAQ ACCORDION
  ========================= */
  const buttons = document.querySelectorAll(".unwrapper-button");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const question = btn.closest(".question");
      const dish = btn.closest(".dish-details");

      // 1. Закрываем все вопросы
      document.querySelectorAll(".question").forEach((q) => {
        if (q !== question) {
          q.classList.remove("active");
        }
      });

      // 2. Открываем/закрываем текущий вопрос
      if (question) {
        question.classList.toggle("active");
      }

      // 3. Аккордеон блюда (если есть)
      if (dish) {
        dish.classList.toggle("active");
      }
    });
  });


  /* =========================
     HALL SLIDER
  ========================= */
  const halls = document.querySelectorAll(".hall");
  const controls = document.querySelectorAll(".controls");

  let hallIndex = 0;

  function show(index) {
    if (!halls.length) return;

    halls[hallIndex].classList.remove("active");
    halls[index].classList.add("active");
    hallIndex = index;
  }

  controls.forEach((btn) => {
    btn.addEventListener("click", (event) => {

      if (event.currentTarget.classList.contains("prev")) {
        let index = hallIndex - 1;
        if (index < 0) index = halls.length - 1;
        show(index);
      }

      if (event.currentTarget.classList.contains("next")) {
        let index = hallIndex + 1;
        if (index >= halls.length) index = 0;
        show(index);
      }

    });
  });

  show(0);


  /* =========================
     BURGER MENU
  ========================= */
  const headerEl = document.querySelector("header");
  const burger = document.getElementById("burger");

  function closeMenu() {
    headerEl.classList.remove("open");
    document.body.classList.remove("no-scroll");
  }

  if (burger) {
    burger.addEventListener("click", (e) => {
      e.stopPropagation();

      headerEl.classList.toggle("open");

      document.body.classList.toggle(
        "no-scroll",
        headerEl.classList.contains("open")
      );
    });
  }

  document.addEventListener("click", (e) => {
    if (
      headerEl.classList.contains("open") &&
      !e.target.closest(".header-menu") &&
      !e.target.closest("#burger")
    ) {
      closeMenu();
    }
  });

  document.querySelectorAll(".header-menu a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });


  /* =========================
     PHONE MASK
  ========================= */
  const phoneInput = document.getElementById("phone");

  function setCursorPosition(pos, el) {
    el.focus();
    el.setSelectionRange(pos, pos);
  }

  function mask(event) {
    let matrix = "+7 (___) ___-__-__";
    let i = 0;
    let def = matrix.replace(/\D/g, "");
    let val = this.value.replace(/\D/g, "");

    if (def.length >= val.length) val = def;

    this.value = matrix.replace(/./g, function (a) {
      if (/[_\d]/.test(a) && i < val.length) return val.charAt(i++);
      return i >= val.length ? "" : a;
    });

    if (event.type === "blur") {
      if (this.value.length < 5) this.value = "";
    } else {
      setCursorPosition(this.value.length, this);
    }
  }

  if (phoneInput) {
    phoneInput.addEventListener("input", mask, false);
    phoneInput.addEventListener("focus", mask, false);
    phoneInput.addEventListener("blur", mask, false);
    phoneInput.addEventListener("keydown", mask, false);
  }


  /* =========================
     MODALS
  ========================= */
  const modals = document.querySelectorAll(".modal-overflow");
  const reservationForm = document.getElementById("reservation-form");
  const doneForm = document.getElementById("done-form");
  const form = document.getElementById("reservationForm");
  const consent = document.getElementById("user-consent");

  const inputs = form
    ? {
        name: form.querySelector('input[name="name"]'),
        phone: form.querySelector('input[name="phone"]'),
        quantity: form.querySelector('input[name="quantity"]'),
        date: form.querySelector('input[name="date"]'),
        time: form.querySelector('input[name="time"]'),
        consent: form.querySelector('input[name="user-consent"]')
      }
    : {};

  function setError(input, message) {
    const field = input.closest(".field");
    const errorEl = field?.querySelector(".error");

    input.classList.add("error-border");
    input.classList.remove("success-border");

    if (errorEl) errorEl.textContent = message;
  }

  function setSuccess(input) {
    const field = input.closest(".field");
    const errorEl = field?.querySelector(".error");

    input.classList.remove("error-border");
    input.classList.add("success-border");

    if (errorEl) errorEl.textContent = "";
  }

  function validateName(value) {
    return /^[A-Za-zА-Яа-яЁё\s-]{2,}$/.test(value.trim());
  }

  function validatePhone(value) {
    const cleaned = value.replace(/\D/g, "");
    return /^7\d{10}$/.test(cleaned) || /^8\d{10}$/.test(cleaned);
  }

  function validateDate(value) {
    if (!value) return false;

    const today = new Date();
    const max = new Date();
    const min = new Date();

    min.setHours(0, 0, 0, 0);
    max.setDate(today.getDate() + 20);

    const date = new Date(value);

    return date >= min && date <= max;
  }

  function validateTime(value) {
    if (!value) return false;

    const [h, m] = value.split(":").map(Number);
    const minutes = h * 60 + m;

    return minutes >= 12 * 60 && minutes <= 20 * 60;
  }

  function validateForm() {
    let valid = true;

    if (!inputs.name || !inputs.phone) return false;

    if (!validateName(inputs.name.value)) {
      setError(inputs.name, "Введите имя (минимум 2 буквы)");
      valid = false;
    } else setSuccess(inputs.name);

    if (!validatePhone(inputs.phone.value)) {
      setError(inputs.phone, "Введите номер в формате +7 (999) 999-99-99");
      valid = false;
    } else setSuccess(inputs.phone);

    if (!inputs.quantity.value) {
      setError(inputs.quantity, "Укажите количество гостей (от 1 до 40)");
      valid = false;
    } else setSuccess(inputs.quantity);

    if (!validateDate(inputs.date.value)) {
      setError(inputs.date, "Выберите дату в пределах 20 дней от сегодня");
      valid = false;
    } else setSuccess(inputs.date);

    if (!validateTime(inputs.time.value)) {
      setError(inputs.time, "Выберите время с 12:00 до 20:00");
      valid = false;
    } else setSuccess(inputs.time);

    if (!inputs.consent.checked) {
      setError(inputs.consent, "Необходимо согласие на обработку данных");
      valid = false;
    } else {
      setSuccess(inputs.consent);
    }

    return valid;
  }

  function openModal(modal) {
    if (!modal) return;

    document.querySelectorAll(".modal-overflow.active")
      .forEach(activeModal => {
        activeModal.classList.remove("active");
      });

    modal.classList.add("active");
    document.body.classList.add("no-scroll");
  }

  function closeModal(modal) {
    if (!modal) return;

    modal.classList.remove("active");

    const anyOpen = document.querySelector(".modal-overflow.active");

    if (!anyOpen) {
      document.body.classList.remove("no-scroll");
    }
  }


  /* =========================
     OPEN MODALS
  ========================= */
  document.querySelectorAll(".open-reservation").forEach(btn => {
    btn.addEventListener("click", () => {
      openModal(reservationForm);
    });
  });


  /* =========================
     CLOSE BUTTONS
  ========================= */
  document.querySelectorAll(".close-button").forEach(btn => {
    btn.addEventListener("click", () => {
      closeModal(btn.closest(".modal-overflow"));
    });
  });

  /* =========================
     CLICK OUTSIDE MODAL
  ========================= */
  modals.forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  /* =========================
     ESC CLOSE
  ========================= */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {

      document.querySelectorAll(".modal-overflow.active")
        .forEach(modal => closeModal(modal));

      closeMenu();
    }
  });


  /* =========================
     FORM SUBMIT
  ========================= */
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      closeModal(reservationForm);
      openModal(doneForm);

      form.reset();

      form.querySelectorAll("input").forEach(input => {
        input.classList.remove("error-border", "success-border");
      });
    });
  }


  /* =========================
     DONE MODAL
  ========================= */
  document.querySelector("#done-form .primary-button")
    ?.addEventListener("click", () => {
      closeModal(doneForm);
    });


  /* =========================
     DISH MODAL
  ========================= */
  const dishModal = document.getElementById("dish-modal");

  document.querySelectorAll(".dish").forEach(dish => {

    dish.addEventListener("click", () => {

      const dishId = dish.dataset.dish;

      const image = dish.querySelector("img")?.src;
      const title = dish.querySelector("h4")?.textContent;
      const description = dish.querySelector(".dish-title p")?.innerHTML;
      const price = dish.querySelector(".price")?.textContent;
      const quantity = dish.querySelector(".quantity")?.textContent;

      const nutrition = dishesData[dishId];

      if (!dishModal || !nutrition) return;

      dishModal.querySelector(".dish-modal-image").src = image;
      dishModal.querySelector(".dish-modal-image").alt = title;

      dishModal.querySelector(".dish-modal-title").textContent = title;
      dishModal.querySelector(".dish-modal-description").innerHTML = description;

      dishModal.querySelector(".dish-modal-price").textContent = price;
      dishModal.querySelector(".dish-modal-quantity").textContent = quantity;

      dishModal.querySelector(".dish-modal-proteins").textContent = nutrition.proteins;
      dishModal.querySelector(".dish-modal-fats").textContent = nutrition.fats;
      dishModal.querySelector(".dish-modal-carbs").textContent = nutrition.carbs;
      dishModal.querySelector(".dish-modal-calories").textContent = nutrition.calories;

      openModal(dishModal);
    });

  });

});


const dishesData = {
  marble: {
    proteins: "28 г",
    fats: "24 г",
    carbs: "31 г",
    calories: "513 ккал, 2148 кДж"
  },

  homely: {
    proteins: "26 г",
    fats: "29 г",
    carbs: "27 г",
    calories: "528 ккал, 2210 кДж"
  },

  mutton: {
    proteins: "29 г",
    fats: "32 г",
    carbs: "24 г",
    calories: "572 ккал, 2394 кДж"
  },

  assorted: {
    proteins: "27 г",
    fats: "28 г",
    carbs: "28 г",
    calories: "538 ккал, 2251 кДж"
  },

  moose: {
    proteins: "32 г",
    fats: "18 г",
    carbs: "25 г",
    calories: "451 ккал, 1887 кДж"
  },

  pork: {
    proteins: "30 г",
    fats: "26 г",
    carbs: "23 г",
    calories: "497 ккал, 2080 кДж"
  },

  duck: {
    proteins: "27 г",
    fats: "31 г",
    carbs: "22 г",
    calories: "545 ккал, 2280 кДж"
  },

  venison: {
    proteins: "31 г",
    fats: "17 г",
    carbs: "24 г",
    calories: "438 ккал, 1833 кДж"
  },

  mkhetskys: {
    proteins: "25 г",
    fats: "23 г",
    carbs: "38 г",
    calories: "521 ккал, 2180 кДж"
  },

  kazbek: {
    proteins: "28 г",
    fats: "30 г",
    carbs: "35 г",
    calories: "587 ккал, 2456 кДж"
  },

  kokand: {
    proteins: "26 г",
    fats: "28 г",
    carbs: "36 г",
    calories: "552 ккал, 2310 кДж"
  },

  samarkand: {
    proteins: "24 г",
    fats: "27 г",
    carbs: "39 г",
    calories: "541 ккал, 2263 кДж"
  }
};