import nunjucks from 'nunjucks';
import { writeFileSync } from 'fs';

const { configure, render } = nunjucks;

configure('templates', { autoescape: false });

const skillLegend = [
    "1. Organization and Method",
    "2. Requirements",
    "3. Innovation",
    "4. Viability",
    "5. Requirements specification, analysis",
    "6. Analysis",
    "7. Architecture, performance, security",
    "8. Infrastructure, performance, security",
    "9. Database",
    "10. Scope",
    "11. Effort",
    "12. Scratchs",
    "13. Documentation",
    "14. Organization and Method",
    "15. Schedule",
    "16. Quality",
    "17. Programming, deployment",
    "18. Implantation",
    "19. Planning",
];

const experienceLevels = [
    { name: "Intern", color: "#ff6384" },
    { name: "Junior", color: "#36a2eb" },
    { name: "Medium", color: "#32a852" },
    { name: "Senior", color: "#a52a2a" },
    { name: "Expert", color: "#881896" },
];

const dataSetSettings = (label, color) => {
    return {
        label,
        fill: true,
        backgroundColor: "transparent",
        borderColor: color,
        pointBackgroundColor: color,
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: color,
    };
};

const html = render(`professional-skills.html`, {
    experienceLevelsForTemlate: experienceLevels,
    experienceLevels: JSON.stringify(experienceLevels),
    skillLegend,
    chartOptions: JSON.stringify({
        type: "radar",
        data: {
            labels: Object.keys(skillLegend).map((skill) => parseInt(skill) + 1),
            datasets: experienceLevels.map((experience) => {
                return {
                    data: new Array(19).fill(0),
                    ...dataSetSettings(experience.name, experience.color),
                };
            }),
        },
        options: {
            elements: {
                line: {
                    borderWidth: 3,
                },
            },
            scales: {
                r: {
                    angleLines: {
                        display: false,
                    },
                    suggestedMin: 0,
                    suggestedMax: 5,
                },
            },
        },
    })
});
writeFileSync('../professional-skills.html', html);
