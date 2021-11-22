"use strict";

///////////////////////////////////////
// Modal window
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal"); //результат - NodeList, не массив, из методов имеет entries(), forEach(), keys(), values(), item ( idx )

//Button scrolling
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

// Tabbed component
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

//Menu fade animation
const nav = document.querySelector(".nav");

const header = document.querySelector(".header");

//Modal window
const openModal = function (e) {
  e.preventDefault(); //при небольшом скролле при нажатии на кнопку "Open account"(что является ссылкой <a>) страница прыгает в самое начало и убирается скролл - убираем этот эффет данной строкой
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//Button scrolling
//Сделаем при нажатии на кнопку Learn more плавный переход на первый раздел страницы
btnScrollTo.addEventListener("click", function (e) {
  const s1coords = section1.getBoundingClientRect(); //получаем координаты начала раздела с айди section--1

  //Scrolling

  //Это старый способ
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset, //положение раздела + положении курсора
  //   behavior: "smooth",
  // });

  //Новый крутой способ
  section1.scrollIntoView({ behavior: "smooth" });
});

//Page navigation

// //этот вариант не самый оптимальный, тк к каждому элементу nodeList-а прикреплена одна и та же функция, то есть создается копия функции для каждого элемента
// document.querySelectorAll(".nav__link").forEach(function (el) {
//   el.addEventListener("click", function (e) {
//     e.preventDefault(); //чтобы не перемещалось на раздел по id неплавно, убираем эту опцию, сделаем, чтобы перемещалось плавно
//     const id = this.getAttribute("href"); //получаем строку, чтобы эту переменную вставить в query selector
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//   });
// });

///Оптимальный вариант:
//1. Add event listener to common parent element
//2. Determine what element originated the event

document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault(); //чтобы не перемещалось на раздел по id неплавно, убираем эту опцию, сделаем, чтобы перемещалось плавно

  //Matching strategy
  if (e.target.classList.contains("nav__link")) {
    //только при нажатии на элементы будет происходить действие, если кликнуть на область между ними, ничего не должно срабатывать
    const id = e.target.getAttribute("href"); //получаем строку, чтобы эту переменную вставить в query selector
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

// Tabbed component
tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab"); //при нажатии на кнопку всегда будет выбираться сама кнопка с этим классом, если кликается span внутри кнопки, то все равно будет эффект будто нажали на кнопку

  //Guard clause
  if (!clicked) return; //при нажатии на область между кнопками, JS возвращает null и возникает ошибка, чтобы не возникала эта ошибка при нажатии НЕ НА КНОПКУ прекращаем выполнение функции и не добавляем класс active строкой ниже

  //Remove active classses
  tabs.forEach((t) => t.classList.remove("operations__tab--active")); //сначала убираем со всех элементов класс active, чтобы потом добавить нужному разделу. Так при каждом нажатии функция срабатывает заново, отключая класс у других кнопок и добавляя его нужной кнопке
  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));

  //Active tab
  clicked.classList.add("operations__tab--active");

  //Active content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

//Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link"); //при наведении на наш элемент, находим родителя, который содержит в себе все элементы с классом nav__link, чтобы их заблерить позже
    const logo = link.closest(".nav").querySelector("img"); //также выделяем лого, которое также в навигации вместе с элементом, который нужно выделить, чтобы лого после заблерить

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// nav.addEventListener("mouseover", function (e) {
//   handleHover(e, 0.5); //передаем функцию так, а не вторым параметром-коллбэком в addEventListener, тк нам нужна там функция, а не ее результат, иначе нет возможности передать нужные входящие параметры
// });

//Правильнее сделать так!
nav.addEventListener("mouseover", handleHover.bind(0.5)); //значение 0.5 - это this в функции

nav.addEventListener("mouseout", handleHover.bind(1));

// Sticky navigation: Intersection Observer API
// const obsCallback = function (entries, observer) {
//   entries.forEach((entry) => { // перебираем, потому что в entries попадает массив threshold: [0, 0.2], где мы можем получить index и entry
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null, //устанавливаем null, потому что нам нужен весь viewport, а не его определенная часть
//   threshold: [0, 0.2], // 0 - это когда наш target (а именно section1) не будет вообще виднеться на странице и будет срабатывать obsCallback, 0.2 - на 20% скролла в section1 будет срабатывать коллбэк obsCallback
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const navHeight = nav.getBoundingClientRect().height; //получаем высоту навигации, чтобы иметь responsive значение

const stickyNav = function (entries) {
  const [entry] = entries; //entries - это массив, внутри которого есть нужный нам объект IntersectionObserverEntry на нулевой позиции, этой строкой мы достаем этот объект

  if (!entry.isIntersecting) nav.classList.add("sticky");
  //только когда header не во viewport (его не видно на странице), добавляем класс sticky нашей навигации
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, //указать можно только в px, благодаря этому параметру навигация будет появляться за 90px до конца прокрутки header
});

headerObserver.observe(header);

//Reveal sections (при прокрутке до каждого раздела сделаем интересный эффект их выплывания)
const allSections = document.querySelectorAll(".section");

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden"); //в объект IntersectionObserverEntry есть ключ target с объектом внутри, в котором есть данные о классах и тп секций, через этот объект убираем класс section--hidden
  observer.unobserve(entry.target); //чтобы не срабатывал observer посе того, как все разделы уже показаны
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

//Lazy loading images
const imgTargets = document.querySelectorAll("img[data-src]");

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    //изображение поменяется на изображение с высоким качеством только после полной прогрузки таковых
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px", //чтобы не было видно пользователю изначальные заблеренные картинки, а сразу прогруженные. так они начнут чуть раньше загружаться и покажутся пользователю полностью загруженными
});

imgTargets.forEach((img) => imgObserver.observe(img));

//Slider
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  //Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class='dots__dot' data-slide='${i}'></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide='${slide}']`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  //Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  //Event handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
