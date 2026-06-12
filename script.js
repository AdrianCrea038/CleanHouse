const navLinks = document.querySelector('[data-nav-links]');
const menuToggle = document.querySelector('.menu-toggle');
const modal = document.querySelector('[data-modal]');
const openButtons = document.querySelectorAll('[data-open-booking]');
const closeButton = document.querySelector('[data-close-booking]');
const contactForm = document.querySelector('#contactForm');
const modalForm = document.querySelector('#modalForm');
const contactNote = document.querySelector('#formNote');
const modalNote = document.querySelector('#modalNote');

menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

function openModal() {
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => modal.querySelector('input')?.focus(), 100);
}

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

openButtons.forEach((button) => button.addEventListener('click', openModal));
closeButton?.addEventListener('click', closeModal);
modal?.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
});

function buildMessage(form) {
  const data = new FormData(form);
  const name = data.get('name') || 'Cliente';
  const phone = data.get('phone') || '';
  const service = data.get('service') || 'Servicio no especificado';
  const date = data.get('date') || 'Fecha por confirmar';
  const rooms = data.get('rooms') || 'No especificado';
  const bathrooms = data.get('bathrooms') || 'No especificado';
  const message = data.get('message') || '';
  return `Hola CleanHouse, soy ${name}. Quiero una cotización para: ${service}. Teléfono: ${phone}. Fecha ideal: ${date}. Habitaciones: ${rooms}. Baños: ${bathrooms}. Detalles: ${message}`;
}

function handleSubmit(event, noteElement) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const encoded = encodeURIComponent(buildMessage(form));
  const whatsappUrl = `https://wa.me/18322773850?text=${encoded}`;
  noteElement.innerHTML = `¡Solicitud lista! <a href="${whatsappUrl}" target="_blank" rel="noopener">Enviar por WhatsApp</a> para confirmar la cotización.`;
  form.reset();
}

contactForm?.addEventListener('submit', (event) => handleSubmit(event, contactNote));
modalForm?.addEventListener('submit', (event) => handleSubmit(event, modalNote));

document.querySelectorAll('[data-service]').forEach((link) => {
  link.addEventListener('click', () => {
    const service = link.getAttribute('data-service');
    const mainSelect = document.querySelector('#contactForm select[name="service"]');
    const modalSelect = document.querySelector('#modalForm select[name="service"]');
    if (mainSelect && service) mainSelect.value = service;
    if (modalSelect && service) modalSelect.value = service;
  });
});

const sections = [...document.querySelectorAll('main section[id], header[id]')];
const navAnchors = [...document.querySelectorAll('.nav-links a')];
const setActiveLink = () => {
  const current = sections
    .filter((section) => section.getBoundingClientRect().top <= 120)
    .pop();
  if (!current) return;
  navAnchors.forEach((anchor) => {
    anchor.classList.toggle('active', anchor.getAttribute('href') === `#${current.id}`);
  });
};
window.addEventListener('scroll', setActiveLink, { passive: true });
setActiveLink();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
