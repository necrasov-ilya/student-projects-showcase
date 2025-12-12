document.addEventListener('DOMContentLoaded', () => {
    const projectsUrl = 'projects.json';
    let allProjects = [];
    let currentYear = null;

    const timelineContainer = document.querySelector('.timeline');
    const projectsListContainer = document.getElementById('projects-list');
    const projectDetailsContainer = document.getElementById('project-details');

    if (typeof projectsData !== 'undefined') {
        allProjects = projectsData;
        initApp();
    } else {
        console.error('Projects data not found. Make sure js/projects.js is loaded.');
    }

    function initApp() {
        const years = [...new Set(allProjects.map(p => p.year))].sort((a, b) => b - a);
        
        if (years.length > 0) {
            renderTimeline(years);
            selectYear(years[0]);
        }
    }

    function renderTimeline(years) {
        timelineContainer.innerHTML = '';
        years.forEach(year => {
            const yearEl = document.createElement('div');
            yearEl.classList.add('year-item');
            yearEl.innerHTML = `<span>${year}</span>`;
            yearEl.dataset.year = year;
            yearEl.addEventListener('click', () => selectYear(year));
            timelineContainer.appendChild(yearEl);
        });
    }

    function selectYear(year) {
        currentYear = year;

        document.querySelectorAll('.year-item').forEach(el => {
            const isActive = parseInt(el.dataset.year) === year;
            el.classList.toggle('active', isActive);
        });

        // Плавно скрываем текущие детали
        projectDetailsContainer.classList.remove('visible');

        // Ждем завершения анимации скрытия перед сменой контента
        setTimeout(() => {
            const yearProjects = allProjects.filter(p => p.year === year);
            renderProjectsList(yearProjects);

            // Показываем пустое состояние только если нет проектов
            if (yearProjects.length === 0) {
                projectDetailsContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-layer-group"></i>
                        <p>Нет проектов за этот год</p>
                    </div>`;
                projectDetailsContainer.classList.add('visible');
            } else {
                projectDetailsContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-layer-group"></i>
                        <p>Выберите проект, чтобы узнать детали</p>
                    </div>`;
            }
        }, 300); // Задержка равна времени анимации скрытия
    }

    function renderProjectsList(projects) {
        projectsListContainer.innerHTML = '';

        projects.forEach((project) => {
            const card = document.createElement('div');
            card.classList.add('project-card-mini');

            card.innerHTML = `
                <img src="${project.image}" alt="${project.title}">
                <div class="project-mini-info">
                    <h3>${project.title}</h3>
                </div>
            `;

            card.addEventListener('click', () => showProjectDetails(project, card));
            projectsListContainer.appendChild(card);
        });
    }

    function showProjectDetails(project, activeCard) {
        // Сначала скрываем текущие детали
        projectDetailsContainer.classList.remove('visible');

        // Убираем активность у всех карточек
        document.querySelectorAll('.project-card-mini').forEach(c => c.classList.remove('active'));
        activeCard.classList.add('active');

        const tagsHtml = project.tags.map(tag => `
            <span class="tag">
                <i class="fas fa-code"></i> ${tag}
            </span>
        `).join('');

        // Ждем завершения анимации скрытия перед сменой контента
        setTimeout(() => {
            projectDetailsContainer.innerHTML = `
                <div class="details-image">
                    <img src="${project.image}" alt="${project.title}">
                </div>
                <div class="details-content">
                    <h2>${project.title}</h2>
                    <div class="tags">${tagsHtml}</div>
                    <p>${project.description}</p>
                    <a href="${project.link}" class="details-link" target="_blank">
                        Перейти к проекту <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            `;

            // Форсируем reflow для корректной анимации
            void projectDetailsContainer.offsetWidth;

            // Показываем новые детали
            requestAnimationFrame(() => {
                projectDetailsContainer.classList.add('visible');
            });

            if (window.innerWidth < 900) {
                projectDetailsContainer.scrollIntoView({ behavior: 'smooth' });
            }
        }, 300); // Задержка равна времени анимации скрытия
    }
});

function scrollToProjects() {
    document.getElementById('showcase').scrollIntoView({ behavior: 'smooth' });
}
