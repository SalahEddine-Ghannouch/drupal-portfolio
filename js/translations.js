/* ============================================================
   i18n dictionary — English (en) + French (fr)
   Keys map to [data-i18n], [data-i18n-html] and rotator/cv below.
   Tech names (React, Drupal, PHP, MySQL, ...) are intentionally
   left untranslated.
   ============================================================ */
window.I18N = {
  en: {
    /* meta */
    'html.lang': 'en',
    'a11y.skip': 'Skip to content',

    /* nav */
    'nav.about': 'About',
    'nav.expertise': 'Expertise',
    'nav.projects': 'Projects',
    'nav.experience': 'Experience',
    'nav.community': 'Community',
    'nav.testimonials': 'Testimonials',
    'nav.contact': 'Contact',

    /* hero */
    'hero.eyebrow': '<full-stack developer · drupal specialist />',
    'hero.prefix': 'I build as a',
    'hero.intro': 'I build complete web applications end to end — clean front ends, robust back ends — with a deep specialization in Drupal.',
    'hero.viewProjects': 'View Projects',
    'hero.downloadCv': 'Download CV',
    'hero.metaYears': '+ years of experience',
    'hero.metaSites': '<strong>40+</strong> projects shipped',
    'term.role': 'Full-Stack Developer · Drupal Specialist',
    'term.stack': 'JS · React · PHP · Drupal · SQL',
    'term.status': 'available for work',

    /* about */
    'about.title': 'About Me',
    'about.p1': "I've spent the last <strong><span data-years-since=\"2023\">3</span> years building for the web</strong> — moving fluidly between front-end and back-end work, with <strong>Drupal as my deep specialization</strong>. I like owning a feature end to end: the data model, the API, and the interface on top of it.",
    'about.p2': 'My sweet spot is turning messy requirements into clean, maintainable systems — a React front end talking to a solid PHP/Drupal back end, or a fully decoupled build with JSON:API and Next.js. When a project needs Drupal done right (custom modules, performance, migrations), that\'s where I go deepest.',
    'about.focus1': 'Full-stack feature delivery',
    'about.focus2': 'Drupal modules & architecture',
    'about.focus3': 'Decoupled / headless builds',
    'about.focus4': 'Performance & clean code',
    'about.glance': 'At a glance',
    'about.lblExp': 'Experience',
    'about.valExp': '+ years',
    'about.lblFocus': 'Focus',
    'about.valFocus': 'Full-stack · Drupal',
    'about.lblStack': 'Main stack',
    'about.lblLoc': 'Location',
    'about.valLoc': 'Casablanca, Morocco',
    'about.lblAvail': 'Availability',
    'about.valAvail': 'Open to work',

    /* expertise */
    'expertise.title': 'Expertise',
    'expertise.sub': 'A full-stack skill set — with a deep specialization in Drupal.',
    'skill.specialty': 'Specialty',
    'skill.drupal.title': 'Custom Drupal Module Development',
    'skill.drupal.desc': 'Custom Drupal 9/10/11 modules, services, hooks, plugins, forms & entity APIs.',
    'skill.apis.title': 'Headless & RESTful APIs',
    'skill.apis.desc': 'RESTful API design and integration, decoupled builds with JSON:API, GraphQL, and Next.js.',
    'skill.frontend.title': 'Modern Responsive UIs',
    'skill.frontend.desc': 'Performant, responsive UIs built with Next.js, React, Tailwind CSS, Alpine.js, and Sass.',
    'skill.devops.title': 'DevOps & Environments',
    'skill.devops.desc': 'Containerized local & production workflows, CI/CD automation pipelines, and cloud deployments.',
    'skill.arch.title': 'Performance & Architecture',
    'skill.arch.desc': 'Robust software architecture design, code quality auditing with SonarQube, and caching optimization.',
    'skill.backend.title': 'Backend Engineering',
    'skill.backend.desc': 'Robust server-side logic, object-oriented programming, PHP 8.x, and Symfony ecosystem.',
    'skill.data.title': 'Databases & Data Layer',
    'skill.data.desc': 'Database modeling, ETL data migration processes, and data integrity.',

    /* projects */
    'projects.title': 'Featured Projects',
    'projects.sub': 'Selected work — real client platforms, live in production.',
    'projects.problem': 'Context',
    'projects.solution': 'Work done',
    'projects.result': 'Stack',
    'projects.caseStudy': 'Visit live site',
    'proj1.title': 'ENGIE – Espace Client Pro',
    'proj1.problem': 'UI overhaul and UX improvement of the professional customer portal for a major energy group.',
    'proj1.solution': 'Custom Drupal 11 module development, corrective and evolutionary maintenance, code reviews, and frontend dev with jQuery, Twig, and Sass. Deployed with ArgoCD.',
    'proj1.result': 'Drupal 11 · PHP 8.x · jQuery · Twig · Sass · ArgoCD',
    'proj2.title': 'WAFASALAF – Client Portal',
    'proj2.problem': 'Build a credit-simulation application letting users apply for a loan and track their request in real time.',
    'proj2.solution': 'Drupal 10 back end with a REST API layer consumed by a Next.js front end. Full editorial workflow kept inside Drupal.',
    'proj2.result': 'Drupal 10 · Next.js · PHP · REST API',
    'proj3.title': 'CDG Développement – Corporate Site',
    'proj3.problem': 'Develop CDG Dev\'s website with a structured interface for subsidiaries, business lines, projects, and publications.',
    'proj3.solution': 'Drupal 9/10 back end with Next.js front end and Twig-templated views. Security hardened to Drupal 10 compliance.',
    'proj3.result': 'Drupal 9/10 · PHP · Next.js · Twig',

    /* experience */
    'exp.title': 'Experience',
    'exp.sub': 'A steady path across the full stack, going deeper on Drupal at each step.',
    'exp.present': 'Present',
    'exp1.role': 'Full-Stack Drupal Developer · Niji Maroc — Casablanca',
    'exp1.desc': 'Custom Drupal 11 module development and maintenance. Frontend integration with Next.js, Sass, and CSS. Code reviews, security patches, and contribution to multi-client platform evolutions. Stack: Drupal 11, PHP 8.x, Next.js, Sass, Git, REST API, SonarQube.',
    'exp2.role': 'Full-Stack Developer & Drupal · Agence Digitale VOID — Casablanca',
    'exp2.desc': 'Custom Drupal 9/10 module development. Frontend interfaces built with Next.js, Twig, and Alpine.js. Client needs analysis, REST API integrations, and security updates for Drupal Core and contrib modules.',
    'exp3.role': 'Internship – Drupal Developer · Agadir',
    'exp3.desc': 'End-of-study Master internship. Custom Drupal module development and content migrations via ETL processes. Stack: Drupal 9/10, PHP, React.js, Tailwind CSS, Bootstrap, Twig, jQuery.',

    /* certs & open source */
    'certs.title': 'Open Source & Certifications',
    'certs.sub': 'Drupal.org contrib modules created & official industry certifications.',
    'contrib.heading': 'Open Source Contrib Modules (Drupal.org)',
    'contrib.viewOnDrupal': 'View on Drupal.org',
    'contrib.arabic.desc': 'Foundation module providing reusable services for Arabic text normalization (Alef variants, Tatweel, diacritics), direction detection, text analysis, auditing, Twig filters, Drush commands, and Search API integration.',
    'contrib.transcription.desc': 'Accessibility module enabling transcription creation, management, and customizable display for remote video media entities with rich text WYSIWYG editor support.',
    'certs.heading': 'Certifications',
    'cert.checkmarx.title': 'Checkmarx One for Developers',
    'cert.checkmarx.date': 'Jan. 2026 · Checkmarx',
    'cert.checkmarx.desc': 'Deepened knowledge in application security and secure coding practices for safer software delivery.',
    'cert.react.title': 'Frontend Development using React',
    'cert.react.date': 'Mar. 2024 · Board Infinity',
    'cert.react.desc': 'Mastery of modern React.js frontend development, component architecture, and state management.',
    'cert1.title': 'Acquia Certified Drupal Developer',
    'cert1.desc': 'Expert-level back-end & module development.',
    'cert2.title': 'Acquia Certified Site Builder',
    'cert2.desc': 'Content modeling, Views, and configuration.',

    /* testimonials */
    'testi.title': 'Testimonials',
    'testi.q1': '"Salah was the first developer who could explain our own content model back to us better than we could. The migration finally stuck."',
    'testi.q1role': 'Product Manager, Public Sector',
    'testi.q2': '"We handed Salah a stalled commerce migration and got back a working checkout in six weeks. Calm, precise, and great with our editors."',
    'testi.q2role': 'CTO, Retail Startup',
    'testi.q4': '"I had the pleasure of working with Salah at VOID. He is a very rigorous Full-Stack developer with excellent command of PHP and Drupal, and a sharp sense for fluid, well-structured development. He always delivers reliable solutions with a genuine focus on quality and performance. An outstanding professional and a great team player."',
    'testi.q4role': 'Technical Lead @ VOID · Drupal & Next.js',

    /* contact */
    'contact.title': "Let's build something",
    'contact.sub': "Have a project that needs a full-stack hand — or a Drupal build done right? I'd like to hear about it.",
    'contact.linkedinSub': 'Connect professionally',
    'contact.githubSub': 'See my code',
    'contact.drupalSub': 'Community profile',
    /* footer */
    'footer.tag': 'Full-Stack Developer · Drupal specialist · building for the web.',
    'footer.copy': 'Built with HTML, CSS & JavaScript.',

    /* rotator words */
    'rotator': ['Full-Stack Developer', 'Drupal Specialist', 'Backend Engineer', 'Frontend Developer'],
  },

  fr: {
    /* meta */
    'html.lang': 'fr',
    'a11y.skip': 'Aller au contenu',

    /* nav */
    'nav.about': 'À propos',
    'nav.expertise': 'Expertise',
    'nav.projects': 'Projets',
    'nav.experience': 'Expérience',
    'nav.community': 'Communauté',
    'nav.testimonials': 'Témoignages',
    'nav.contact': 'Contact',

    /* hero */
    'hero.eyebrow': '<développeur full-stack · spécialiste drupal />',
    'hero.prefix': 'Je travaille comme',
    'hero.intro': "Je conçois des applications web complètes, de bout en bout — interfaces soignées, back-ends robustes — avec une spécialisation poussée en Drupal.",
    'hero.viewProjects': 'Voir les projets',
    'hero.downloadCv': 'Télécharger le CV',
    'hero.metaYears': "+ ans d'expérience",
    'hero.metaSites': '<strong>40+</strong> projets livrés',
    'term.role': 'Développeur Full-Stack · Spécialiste Drupal',
    'term.stack': 'JS · React · PHP · Drupal · SQL',
    'term.status': 'disponible pour un poste',

    /* about */
    'about.title': 'À propos',
    'about.p1': "Depuis <strong><span data-years-since=\"2023\">3</span> ans, je développe pour le web</strong> — je passe naturellement du front-end au back-end, avec <strong>Drupal comme spécialisation principale</strong>. J'aime prendre en charge une fonctionnalité de bout en bout : le modèle de données, l'API et l'interface qui va dessus.",
    'about.p2': "Mon point fort : transformer des besoins flous en systèmes clairs et maintenables — un front-end React relié à un back-end PHP/Drupal solide, ou une architecture entièrement découplée avec JSON:API et Next.js. Quand un projet demande du Drupal fait dans les règles (modules sur mesure, performance, migrations), c'est là que je vais le plus loin.",
    'about.focus1': 'Livraison full-stack de fonctionnalités',
    'about.focus2': 'Modules & architecture Drupal',
    'about.focus3': 'Projets découplés / headless',
    'about.focus4': 'Performance & code propre',
    'about.glance': 'En bref',
    'about.lblExp': 'Expérience',
    'about.valExp': '+ ans',
    'about.lblFocus': 'Spécialité',
    'about.valFocus': 'Full-stack · Drupal',
    'about.lblStack': 'Stack principale',
    'about.lblLoc': 'Localisation',
    'about.valLoc': 'Casablanca, Maroc',
    'about.lblAvail': 'Disponibilité',
    'about.valAvail': 'Ouvert aux opportunités',

    /* expertise */
    'expertise.title': 'Expertise',
    'expertise.sub': 'Un profil full-stack — avec une spécialisation poussée en Drupal.',
    'skill.specialty': 'Spécialité',
    'skill.drupal.title': 'Développement Drupal sur mesure',
    'skill.drupal.desc': 'Modules Drupal 9/10/11 sur mesure, services, hooks, plugins, APIs formulaires et entités.',
    'skill.apis.title': 'Architectures Headless & API RESTful',
    'skill.apis.desc': "Conception et intégration d'API RESTful, architectures Headless avec JSON:API, GraphQL, React et Next.js.",
    'skill.frontend.title': 'Interfaces utilisateur modernes & responsives',
    'skill.frontend.desc': 'Interfaces utilisateur modernes, performantes et responsives avec Next.js, React, Tailwind CSS, Alpine.js et Sass.',
    'skill.devops.title': 'Environnements DevOps & CI/CD',
    'skill.devops.desc': 'Environnements conteneurisés (Docker), pipelines CI/CD, OpenShift, ArgoCD, SonarQube et déploiements.',
    'skill.arch.title': 'Performance & Architecture logicielle',
    'skill.arch.desc': "Conception d'architectures logicielles robustes, optimisation des performances et qualité de code avec SonarQube.",
    'skill.backend.title': 'Ingénierie Back-end',
    'skill.backend.desc': 'Logique serveur robuste, programmation orientée objet (POO), PHP 8.x et écosystème Symfony / Laravel.',
    'skill.data.title': 'Bases de données & Traitement de données',
    'skill.data.desc': 'Modélisation de bases de données (MySQL, Oracle, PostgreSQL), processus de migration ETL et intégrité des données.',

    /* projects */
    'projects.title': 'Projets phares',
    'projects.sub': 'Une sélection de plateformes clients réelles, en production.',
    'projects.problem': 'Contexte',
    'projects.solution': 'Travaux réalisés',
    'projects.result': 'Stack',
    'projects.caseStudy': 'Voir le site en ligne',
    'proj1.title': 'ENGIE – Espace Client Pro',
    'proj1.problem': "Refonte graphique et amélioration de l'expérience utilisateur de l'espace client professionnel d'un leader de l'énergie.",
    'proj1.solution': "Développement de modules Drupal 11 personnalisés, maintenance corrective et évolutive, revues de code, développement frontend avec jQuery, Twig et Sass. Déploiement via ArgoCD.",
    'proj1.result': 'Drupal 11 · PHP 8.x · jQuery · Twig · Sass · ArgoCD',
    'proj2.title': 'WAFASALAF – Portail Client',
    'proj2.problem': "Développement d'une application de simulation de crédit permettant aux utilisateurs de faire une demande de prêt et de suivre l'état de leur demande.",
    'proj2.solution': "Back-end Drupal 10 avec une couche API REST consommée par un front-end Next.js. Workflow éditorial intégralement conservé dans Drupal.",
    'proj2.result': 'Drupal 10 · Next.js · PHP · API REST',
    'proj3.title': 'CDG Développement – Site Institutionnel',
    'proj3.problem': "Développement du site web de CDG Dév avec une interface pour la gestion des filiales, des métiers, des projets et des publications.",
    'proj3.solution': "Back-end Drupal 9/10 avec front-end Next.js et vues Twig. Renforcement de la sécurité en conformité Drupal 10.",
    'proj3.result': 'Drupal 9/10 · PHP · Next.js · Twig',

    /* experience */
    'exp.title': 'Expérience',
    'exp.sub': 'Un parcours régulier sur toute la stack, avec Drupal de plus en plus en profondeur.',
    'exp.present': "Aujourd'hui",
    'exp1.role': 'Développeur Full-Stack Drupal · Niji Maroc — Casablanca',
    'exp1.desc': "Développement et maintenance de modules Drupal 11 personnalisés. Intégration frontend avec Next.js, Sass et CSS. Revues de code, correctifs de sécurité et participation aux évolutions des plateformes clients. Stack : Drupal 11, PHP 8.x, Next.js, Sass, Git, API REST, SonarQube.",
    'exp2.role': 'Développeur Full-Stack & Drupal · Agence Digitale VOID — Casablanca',
    'exp2.desc': "Développement de modules Drupal 9/10 personnalisés. Interfaces frontend avec Next.js, Twig et Alpine.js. Analyse des besoins clients, intégrations API REST et mises à jour de sécurité du Core et des modules contrib.",
    'exp3.role': "Stage de fin d'études – Développeur Drupal · Agadir",
    'exp3.desc': "Stage Master. Développement de modules Drupal personnalisés et migrations de contenu via des processus ETL. Stack : Drupal 9/10, PHP, React.js, Tailwind CSS, Bootstrap, Twig, jQuery.",

    /* certs & open source */
    'certs.title': 'Open Source & Certifications',
    'certs.sub': 'Modules contrib créés sur Drupal.org & certifications professionnelles.',
    'contrib.heading': 'Modules Contrib Open Source (Drupal.org)',
    'contrib.viewOnDrupal': 'Voir sur Drupal.org',
    'contrib.arabic.desc': 'Module de fondation pour Drupal 10/11 fournissant des services réutilisables pour le traitement de la langue arabe (normalisation de texte, détection de direction, audit, filtres Twig, commandes Drush et intégration Search API).',
    'contrib.transcription.desc': "Module d'accessibilité permettant l'ajout, la gestion et l'affichage personnalisé de transcriptions enrichies (WYSIWYG) pour les entités médias vidéo distantes.",
    'certs.heading': 'Certifications',
    'cert.checkmarx.title': 'Checkmarx One for Developers',
    'cert.checkmarx.date': 'Janv. 2026 · Checkmarx',
    'cert.checkmarx.desc': 'Formation approfondie en sécurité applicative et pratiques de développement sécurisé pour la création de logiciels sûrs.',
    'cert.react.title': 'Frontend Development using React',
    'cert.react.date': 'Mars 2024 · Board Infinity',
    'cert.react.desc': "Maîtrise du développement frontend React.js moderne, architecture de composants et gestion d'état.",
    'cert1.title': 'Acquia Certified Drupal Developer',
    'cert1.desc': 'Développement back-end & modules de niveau expert.',
    'cert2.title': 'Acquia Certified Site Builder',
    'cert2.desc': 'Modélisation de contenu, Views et configuration.',

    /* testimonials */
    'testi.title': 'Témoignages',
    'testi.q1': "« Salah a été le premier développeur capable de nous réexpliquer notre propre modèle de contenu mieux que nous. La migration a enfin tenu. »",
    'testi.q1role': 'Chef de produit, secteur public',
    'testi.q2': "« Nous avons confié à Salah une migration e-commerce bloquée et récupéré un tunnel de commande fonctionnel en six semaines. Calme, précis, et excellent avec nos éditeurs. »",
    'testi.q2role': 'CTO, startup retail',
    'testi.q4': "« J'ai eu le plaisir de travailler avec Salah chez VOID. C'est un développeur Full Stack très rigoureux, avec une excellente maîtrise de PHP, Drupal, et un sens aigu du développement fluide. Il apporte toujours des solutions fiables et bien structurées, avec un vrai souci de qualité et de performance. Un excellent professionnel et un très bon collaborateur. »",
    'testi.q4role': 'Technical Lead @ VOID · Drupal & Next.js',

    /* contact */
    'contact.title': 'Construisons quelque chose',
    'contact.sub': "Un projet qui a besoin d'un renfort full-stack — ou d'un build Drupal fait dans les règles ? J'aimerais en discuter.",
    'contact.linkedinSub': 'Connectons-nous',
    'contact.githubSub': 'Voir mon code',
    'contact.drupalSub': 'Profil communautaire',

    /* footer */
    'footer.tag': 'Développeur Full-Stack · spécialiste Drupal · au service du web.',
    'footer.copy': 'Réalisé avec HTML, CSS & JavaScript.',

    /* rotator words */
    'rotator': ['Développeur Full-Stack', 'Spécialiste Drupal', 'Ingénieur Backend', 'Développeur Frontend'],
  },
};

/* CV is hosted externally — see https://flowcv.com/resume/mo6drwvsqenr */
