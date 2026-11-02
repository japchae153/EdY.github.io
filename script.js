(() => {
  'use strict';

  const filters = document.querySelector('.project-filters');
  const projects = [...document.querySelectorAll('.project')];
  const status = document.querySelector('#filter-status');
  const filterButtons = [...filters.querySelectorAll('button')];

  function filterProjects(category) {
    let count = 0;
    for (const project of projects) {
      project.hidden = category !== 'all' && project.dataset.category !== category;
      if (!project.hidden) count++;
    }
    for (const button of filterButtons) {
      button.setAttribute('aria-pressed', String(button.dataset.filter === category));
    }
    status.textContent = `${count} ${category === 'all' ? '' : category + ' '}projects shown.`;
  }

  filters.hidden = false;
  for (const button of filterButtons) {
    button.addEventListener('click', () => filterProjects(button.dataset.filter));
  }

  // Reveal project destinations even when a different filter was selected.
  function revealHashTarget() {
    const target = document.getElementById(window.location.hash.slice(1));
    if (target && target.classList.contains('project') && target.hidden) {
      filterProjects('all');
      target.scrollIntoView();
    }
  }
  window.addEventListener('hashchange', revealHashTarget);
  document.querySelectorAll('a[href^="#project-"]').forEach(link => {
    link.addEventListener('click', () => filterProjects('all'));
  });
  revealHashTarget();

  // Keep navigation in sync with the section currently being read.
  const links = [...document.querySelectorAll('.section-nav a')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href')));
  let scheduled = false;
  function updateNavigation() {
    let active = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 130) active = section;
    }
    for (const link of links) {
      if (link.getAttribute('href') === `#${active.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    scheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(updateNavigation);
    }
  }, { passive: true });
  window.addEventListener('resize', updateNavigation);
  updateNavigation();
})();
