document.addEventListener('DOMContentLoaded', () => {
    const projectsUrl = 'projects.json';
    const YEAR_CHANGE_DELAY = 240;
    let allProjects = [];
    let currentYear = null;
    let yearChangeTimeout;

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
        clearTimeout(yearChangeTimeout);

        document.querySelectorAll('.year-item').forEach(el => {
            const isActive = parseInt(el.dataset.year) === year;
            el.classList.toggle('active', isActive);
        });

        projectDetailsContainer.classList.remove('visible');
        projectsListContainer.classList.add('switching');

        yearChangeTimeout = setTimeout(() => {
            const yearProjects = allProjects.filter(p => p.year === year);
            renderProjectsList(yearProjects);

            requestAnimationFrame(() => {
                projectsListContainer.classList.remove('switching');
            });

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
        }, YEAR_CHANGE_DELAY); 
    }

    function renderProjectsList(projects) {
        projectsListContainer.innerHTML = '';

        projects.forEach((project, index) => {
            const card = document.createElement('div');
            card.classList.add('project-card-mini');
            card.style.setProperty('--card-delay', `${index * 60}ms`);

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
        projectDetailsContainer.classList.remove('visible');

        document.querySelectorAll('.project-card-mini').forEach(c => c.classList.remove('active'));
        activeCard.classList.add('active');

        const tagsHtml = project.tags.map(tag => `
            <span class="tag">
                <i class="fas fa-code"></i> ${tag}
            </span>
        `).join('');

        const teamHtml = project.team && project.team.length > 0 ? `
            <div class="team-section">
                <div class="team-label"><i class="fas fa-users"></i> Команда:</div>
                <div class="team-members">
                    ${project.team.map(member => `<span class="team-member">${member}</span>`).join('')}
                </div>
            </div>
        ` : '';

        setTimeout(() => {
            projectDetailsContainer.innerHTML = `
                <div class="details-image">
                    <img src="${project.image}" alt="${project.title}">
                </div>
                <div class="details-content">
                    <h2>${project.title}</h2>
                    <div class="tags">${tagsHtml}</div>
                    <p>${project.description}</p>
                    ${teamHtml}
                    <a href="${project.link}" class="details-link" target="_blank">
                        Перейти к проекту <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            `;

            void projectDetailsContainer.offsetWidth;

            requestAnimationFrame(() => {
                projectDetailsContainer.classList.add('visible');
            });

            if (window.innerWidth < 900) {
                projectDetailsContainer.scrollIntoView({ behavior: 'smooth' });
            }
        }, 300);
    }
});

function scrollToProjects() {
    document.getElementById('showcase').scrollIntoView({ behavior: 'smooth' });
}
