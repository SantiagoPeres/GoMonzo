
AOS.init({
  // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
  offset: 120, // offset (in px) from the original trigger point
  delay: 0, // values from 0 to 3000, with step 50ms
  duration: 900, // values from 0 to 3000, with step 50ms
  easing: 'ease', // default easing for AOS animations
  once: false, // whether animation should happen only once - while scrolling down
  mirror: false, // whether elements should animate out while scrolling past them
  anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation

});

// Função de callback para o Intersection Observer
function handleIntersection(entries, observer) {
  entries.forEach(entry => {
      if (entry.isIntersecting) {
          // Adiciona a classe 'visible' quando o elemento está visível
          entry.target.classList.add('visible');
          // Para de observar o mesmo elemento
          observer.unobserve(entry.target);
      }
  });
}

// Cria uma instância do Intersection Observer
const observer = new IntersectionObserver(handleIntersection, {
  threshold: 0.1 // Quando 10% do elemento está visível
});

// Seleciona todos os elementos que desejamos animar
const elements = document.querySelectorAll('[data-aos]');

// Observa cada elemento
elements.forEach(element => {
  // Adiciona classes de animação baseadas no atributo data-aos
  const animationClass = element.getAttribute('data-aos');
  element.classList.add(animationClass);
  observer.observe(element);
});
