-- ============================================================
-- GDGJobs - Seed inicial de vagas reais/recentes
-- Atualizado em: 04/09/2026
-- Níveis: JUNIOR, PLENO, SENIOR e STAFF
-- ============================================================

INSERT INTO public.jobs (
  title,
  company_name,
  company_logo_url,
  location,
  modality,
  seniority,
  description,
  requirements,
  technologies,
  application_url
) VALUES

-- ============================================================
-- JUNIOR
-- ============================================================

(
  'Junior Software Engineer',
  'Sezzle',
  'https://www.google.com/s2/favicons?domain=sezzle.com&sz=128',
  'Brasil',
  'REMOTE',
  'JUNIOR',
  'Oportunidade para pessoa desenvolvedora júnior atuar no desenvolvimento de soluções de software, participando do ciclo completo de desenvolvimento e trabalhando com aplicações web, APIs e bancos de dados.',
  ARRAY[
    '0 a 3 anos de experiência em desenvolvimento',
    'Experiência com aplicações web ou APIs',
    'Conhecimento de bancos de dados relacionais',
    'Familiaridade com processos de desenvolvimento de software',
    'Conhecimento de ferramentas de IA para desenvolvimento'
  ],
  ARRAY[
    'Golang',
    'TypeScript',
    'React',
    'React Native',
    'Python',
    'PostgreSQL',
    'MySQL',
    'AWS',
    'Kubernetes'
  ],
  'https://br.linkedin.com/jobs/view/junior-software-engineer-brazil-at-sezzle-4462400777'
),

(
  'Junior Software Developer - Observability',
  'Canonical',
  'https://www.google.com/s2/favicons?domain=canonical.com&sz=128',
  'Florianópolis, SC',
  'REMOTE',
  'JUNIOR',
  'Atuação no desenvolvimento de ferramentas e soluções relacionadas a observabilidade, monitoramento e infraestrutura de software dentro do ecossistema Ubuntu.',
  ARRAY[
    'Conhecimentos de programação',
    'Interesse em Linux e software open source',
    'Conhecimento básico de sistemas distribuídos',
    'Boa comunicação e capacidade de trabalhar remotamente',
    'Interesse em observabilidade e infraestrutura'
  ],
  ARRAY[
    'Python',
    'Go',
    'Linux',
    'Ubuntu',
    'Kubernetes',
    'Observability',
    'Open Source'
  ],
  'https://br.linkedin.com/jobs/view/junior-software-developer-observability-at-canonical-4345568345'
),

(
  'Junior Software Engineer',
  'MixRank',
  'https://www.google.com/s2/favicons?domain=mixrank.com&sz=128',
  'Brasil',
  'REMOTE',
  'JUNIOR',
  'Vaga para início de carreira em engenharia de software em uma equipe distribuída globalmente. A posição envolve desenvolvimento de sistemas, processamento de dados e evolução de infraestrutura de software.',
  ARRAY[
    'Experiência inicial em programação',
    'Conhecimento de desenvolvimento de software',
    'Interesse em sistemas distribuídos',
    'Capacidade de aprender de forma independente',
    'Boa comunicação em ambiente remoto'
  ],
  ARRAY[
    'Python',
    'PostgreSQL',
    'Distributed Systems',
    'Data Pipelines',
    'Git',
    'Cloud'
  ],
  'https://br.linkedin.com/jobs/view/junior-software-engineer-%E2%80%94-remote-brazil-at-mixrank-4415454307'
),

(
  'Desenvolvedor(a) Júnior Front-End',
  'Capgemini',
  'https://www.google.com/s2/favicons?domain=capgemini.com&sz=128',
  'São Paulo, SP',
  'HYBRID',
  'JUNIOR',
  'Atuação em desenvolvimento de aplicações front-end, participando da construção de interfaces modernas e soluções digitais para projetos de clientes.',
  ARRAY[
    'Conhecimento de desenvolvimento front-end',
    'Conhecimento de HTML, CSS e JavaScript',
    'Noções de frameworks modernos',
    'Conhecimento de Git',
    'Boa capacidade de trabalho em equipe'
  ],
  ARRAY[
    'JavaScript',
    'HTML',
    'CSS',
    'Angular',
    'TypeScript',
    'Git'
  ],
  'https://br.linkedin.com/jobs/junior-software-engineer-vagas-brazil?count=25&f_AL=true'
),

-- ============================================================
-- PLENO
-- ============================================================

(
  'Pleno Backend Software Engineer - Camunda',
  'Agibank',
  'https://www.google.com/s2/favicons?domain=agibank.com.br&sz=128',
  'Campinas, SP',
  'HYBRID',
  'PLENO',
  'Desenvolvimento e evolução de APIs e serviços backend, com participação na implementação de processos de negócio e arquiteturas orientadas a eventos.',
  ARRAY[
    'Experiência com Java',
    'Experiência com Spring Boot',
    'Conhecimento de APIs REST',
    'Experiência com bancos relacionais ou NoSQL',
    'Conhecimento de arquiteturas orientadas a eventos'
  ],
  ARRAY[
    'Java 21',
    'Spring Boot',
    'Camunda 8',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'Apache Kafka',
    'JUnit',
    'Mockito'
  ],
  'https://br.linkedin.com/jobs/view/pleno-backend-software-engineer-camunda-campinas-sp-at-lato-jobs-4455706786'
),

(
  'Software Engineer | Backend Pleno',
  'Sankhya',
  'https://www.google.com/s2/favicons?domain=sankhya.com.br&sz=128',
  'Brasil',
  'REMOTE',
  'PLENO',
  'Desenvolvimento e evolução de soluções backend para serviços de integração e conectividade, criando APIs e microsserviços escaláveis utilizados por diferentes produtos e parceiros.',
  ARRAY[
    'Experiência com desenvolvimento backend',
    'Experiência com Java',
    'Conhecimento de APIs REST',
    'Experiência com microsserviços',
    'Conhecimento de arquitetura de sistemas'
  ],
  ARRAY[
    'Java',
    'Spring Boot',
    'REST API',
    'Microservices',
    'PostgreSQL',
    'Docker',
    'Cloud'
  ],
  'https://br.linkedin.com/jobs/view/software-engineer-backend-pleno-at-sankhya-4450180592'
),

(
  'Software Engineer Pleno - Full Stack',
  'Líber',
  'https://www.google.com/s2/favicons?domain=liber.com.br&sz=128',
  'Brasil',
  'REMOTE',
  'PLENO',
  'Atuação full stack no desenvolvimento e evolução de aplicações modernas, com autonomia técnica para propor soluções e participar das decisões de produto e arquitetura.',
  ARRAY[
    'Experiência prática com Node.js',
    'Experiência com React',
    'Conhecimento de APIs',
    'Capacidade de atuar com autonomia',
    'Experiência com desenvolvimento de aplicações web'
  ],
  ARRAY[
    'Node.js',
    'React',
    'TypeScript',
    'JavaScript',
    'REST API',
    'PostgreSQL',
    'Git'
  ],
  'https://br.linkedin.com/jobs/view/software-engineer-pleno-node-js-react-at-liber-4437309990'
),

(
  'Software Engineer Pleno',
  'iFood',
  'https://www.google.com/s2/favicons?domain=ifood.com.br&sz=128',
  'Brasil',
  'REMOTE',
  'PLENO',
  'Desenvolvimento de aplicações e infraestrutura de software em uma das maiores plataformas digitais da América Latina, trabalhando em soluções escaláveis e de alto volume.',
  ARRAY[
    'Experiência profissional em engenharia de software',
    'Conhecimento de desenvolvimento backend',
    'Experiência com APIs e serviços',
    'Conhecimento de cloud e infraestrutura',
    'Capacidade de trabalhar em ambientes de alta escala'
  ],
  ARRAY[
    'Go',
    'Golang',
    'Cloud',
    'APIs',
    'Microservices',
    'Distributed Systems',
    'Kubernetes'
  ],
  'https://br.linkedin.com/jobs/view/software-engineer-pleno-at-ifood-4452479392'
),

-- ============================================================
-- SENIOR
-- ============================================================

(
  'Senior Software Engineer - Backend',
  'Hotmart',
  'https://www.google.com/s2/favicons?domain=hotmart.com&sz=128',
  'São Paulo, SP',
  'REMOTE',
  'SENIOR',
  'Responsável por projetar e implementar arquiteturas backend robustas, escaláveis e performáticas, atuando também na resolução de problemas complexos e mentoria técnica.',
  ARRAY[
    'Experiência sólida em desenvolvimento backend',
    'Experiência com Java e Spring',
    'Conhecimento de sistemas distribuídos',
    'Experiência com cloud',
    'Conhecimento de CI/CD e DevOps',
    'Capacidade de tomada de decisões arquiteturais'
  ],
  ARRAY[
    'Java',
    'Spring',
    'AWS',
    'GCP',
    'Azure',
    'CI/CD',
    'DevOps',
    'Distributed Systems'
  ],
  'https://br.linkedin.com/jobs/view/senior-software-engineer-back-end-at-lato-jobs-4457008891'
),

(
  'Senior Software Engineer - React.js / TypeScript',
  'Exadel',
  'https://www.google.com/s2/favicons?domain=exadel.com&sz=128',
  'Brasil',
  'REMOTE',
  'SENIOR',
  'Atuação como engenheiro(a) de software sênior em projetos de grande escala, desenvolvendo aplicações modernas e colaborando com equipes multidisciplinares.',
  ARRAY[
    'Experiência avançada com React',
    'Experiência com TypeScript',
    'Conhecimento de arquitetura frontend',
    'Experiência com aplicações web de grande escala',
    'Boa capacidade de comunicação técnica'
  ],
  ARRAY[
    'React.js',
    'TypeScript',
    'JavaScript',
    'HTML',
    'CSS',
    'Web Architecture',
    'Cloud'
  ],
  'https://br.linkedin.com/jobs/view/senior-software-engineer-react-js-typescript-at-exadel-4458922972'
),

(
  'Senior Software Engineer | SRE & Software Architecture',
  'CI&T',
  'https://www.google.com/s2/favicons?domain=ciandt.com&sz=128',
  'Brasil',
  'REMOTE',
  'SENIOR',
  'Atuação em engenharia de software, confiabilidade e arquitetura, contribuindo para soluções modernas orientadas a cloud, automação e inteligência artificial.',
  ARRAY[
    'Experiência sólida em engenharia de software',
    'Conhecimento de arquitetura de sistemas',
    'Experiência com práticas de SRE',
    'Experiência com cloud',
    'Conhecimento de automação e CI/CD'
  ],
  ARRAY[
    'SRE',
    'Cloud',
    'Software Architecture',
    'CI/CD',
    'DevOps',
    'AI',
    'Observability'
  ],
  'https://br.linkedin.com/jobs/view/s%C3%AAnior-software-engineer-sre-software-architecture-brazil-at-ci-t-4462454245'
),

(
  'Senior Software Engineer - Java & AWS',
  'Exadel',
  'https://www.google.com/s2/favicons?domain=exadel.com&sz=128',
  'São Paulo, SP',
  'REMOTE',
  'SENIOR',
  'Desenvolvimento de soluções backend de alta escala utilizando Java e serviços cloud, com foco em arquitetura, qualidade, performance e integração de sistemas.',
  ARRAY[
    'Experiência avançada em Java',
    'Experiência com AWS',
    'Conhecimento de arquitetura de software',
    'Experiência com APIs e microsserviços',
    'Capacidade de atuar tecnicamente com autonomia'
  ],
  ARRAY[
    'Java',
    'AWS',
    'Spring',
    'Microservices',
    'REST',
    'Cloud',
    'CI/CD'
  ],
  'https://br.linkedin.com/jobs/senior-software-engineer-vagas'
),

-- ============================================================
-- STAFF
-- ============================================================

(
  'Staff Software Engineer',
  'Unico Skill',
  'https://www.google.com/s2/favicons?domain=unico.io&sz=128',
  'Brasil',
  'REMOTE',
  'STAFF',
  'Referência técnica para evolução de sistemas e produtos, contribuindo para decisões de arquitetura, padrões de engenharia e desenvolvimento de soluções de alto impacto.',
  ARRAY[
    'Experiência avançada em engenharia de software',
    'Experiência com arquitetura de sistemas',
    'Capacidade de liderança técnica',
    'Experiência em sistemas distribuídos',
    'Capacidade de influenciar decisões técnicas e de produto'
  ],
  ARRAY[
    'Software Architecture',
    'Distributed Systems',
    'Cloud',
    'Microservices',
    'APIs',
    'Engineering Leadership'
  ],
  'https://br.linkedin.com/jobs/view/staff-software-engineer-at-unico-skill-4460753015'
),

(
  'Staff Software Engineer',
  'Tako',
  'https://www.google.com/s2/favicons?domain=tako.com.br&sz=128',
  'São Paulo, SP',
  'HYBRID',
  'STAFF',
  'Atuação como referência técnica na construção e evolução de uma plataforma de operações de pessoas, participando de decisões arquiteturais e desenvolvimento de sistemas complexos.',
  ARRAY[
    'Experiência sólida em engenharia de software',
    'Experiência com arquitetura de sistemas',
    'Capacidade de liderar tecnicamente projetos',
    'Experiência com produtos SaaS',
    'Visão sistêmica e orientação a produto'
  ],
  ARRAY[
    'Software Architecture',
    'SaaS',
    'Distributed Systems',
    'Cloud',
    'AI',
    'APIs',
    'Microservices'
  ],
  'https://br.linkedin.com/jobs/view/staff-software-engineer-at-tako-4454655289'
),

(
  'Staff Software Engineer',
  'Stix',
  'https://www.google.com/s2/favicons?domain=stix.com.br&sz=128',
  'Brasil',
  'HYBRID',
  'STAFF',
  'Referência técnica para evolução da plataforma de tecnologia, definindo padrões de desenvolvimento, influenciando decisões arquiteturais e contribuindo para a evolução dos sistemas da empresa.',
  ARRAY[
    'Experiência avançada em engenharia de software',
    'Experiência com arquitetura e sistemas escaláveis',
    'Capacidade de definir padrões técnicos',
    'Experiência em liderança técnica',
    'Boa comunicação com equipes técnicas e de negócio'
  ],
  ARRAY[
    'Software Architecture',
    'Cloud',
    'Microservices',
    'Distributed Systems',
    'APIs',
    'Engineering Leadership',
    'Scalability'
  ],
  'https://br.linkedin.com/jobs/view/staff-software-engineer-at-stix-4443773744'
);

-- ============================================================
-- COBERTURA POR ÁREA DE TECNOLOGIA (Mobile, Data, DevOps/SRE, QA)
-- Adicionado em: 23/09/2026 — vagas reais e ativas no Gupy,
-- garantindo pelo menos 2 vagas por área pra testar filtros/matching.
-- ============================================================

INSERT INTO public.jobs (
  title,
  company_name,
  company_logo_url,
  location,
  modality,
  seniority,
  description,
  requirements,
  technologies,
  application_url
) VALUES

-- ---------- MOBILE ----------

(
  'React Native Desenvolvedor Mobile | Senior (Remote)',
  'Compass UOL',
  'https://www.google.com/s2/favicons?domain=compass.uol.com.br&sz=128',
  'Brasil',
  'REMOTE',
  'SENIOR',
  'Vaga para desenvolvedor mobile sênior atuando com React Native, responsável por colaborar na arquitetura e desenvolvimento de funcionalidades de alta disponibilidade do aplicativo, com foco em qualidade (testes unitários, SonarQube) em ambiente ágil e multidisciplinar.',
  ARRAY[
    'Experiência com React Native, Kotlin (Android) ou Swift (iOS)',
    'Experiência com desenvolvimento frontend em React',
    'Experiência com bancos de dados SQL e NoSQL',
    'Experiência em DevOps: pipelines CI/CD, code review, análise estática',
    'Conhecimento em arquitetura MVVM/MVI e Clean Architecture',
    'Conhecimento em testes (JUnit/MockK/Turbine, Espresso/Compose Testing)'
  ],
  ARRAY[
    'React Native',
    'Kotlin',
    'Swift',
    'React',
    'SonarQube',
    'AWS',
    'Kafka',
    'GitHub Actions'
  ],
  'https://compass.gupy.io/jobs/11358834'
),

(
  'Desenvolvedor Mobile Android - Senior',
  'FCamara',
  'https://www.google.com/s2/favicons?domain=fcamara.com.br&sz=128',
  'São Paulo, SP',
  'HYBRID',
  'SENIOR',
  'Desenvolvedor Android sênior para atuar em aplicações com milhões de usuários, participando de decisões técnicas de arquitetura, ferramentas e processos junto a designer, PO e cientista de dados, com foco em performance, revisão de pull requests e acompanhamento de crashes em produção.',
  ARRAY[
    'Kotlin avançado (coroutines, Flow, sealed classes)',
    'Android SDK profundo e domínio de Jetpack (Compose, Navigation, Room, WorkManager)',
    'Arquiteturas MVVM/Clean Architecture e injeção de dependência (Hilt/Dagger)',
    'Consumo de APIs REST (Retrofit/OkHttp) e serialização',
    'Testes unitários e instrumentados (JUnit, MockK, Espresso, Compose Testing)',
    'CI/CD e publicação na Google Play Console'
  ],
  ARRAY[
    'Kotlin',
    'Jetpack Compose',
    'Room',
    'Retrofit',
    'Hilt',
    'Dagger',
    'JUnit',
    'Espresso',
    'GitHub Actions'
  ],
  'https://fcamara.gupy.io/jobs/11365891'
),

-- ---------- DATA / ANALYTICS ----------

(
  'Engenheiro de Dados Sr',
  'Ipiranga',
  'https://www.google.com/s2/favicons?domain=ipiranga.com.br&sz=128',
  'Porto Alegre, RS',
  'HYBRID',
  'SENIOR',
  'Vaga para engenheiro(a) de dados sênior responsável pela concepção, desenvolvimento e evolução de soluções de dados em ambiente Cloud Azure, usando Databricks como plataforma principal de processamento analítico, incluindo construção de pipelines escaláveis, governança de dados e apoio a iniciativas de Analytics e IA.',
  ARRAY[
    'Experiência sólida como Engenheiro de Dados Sênior em ambientes corporativos',
    'Experiência comprovada com Microsoft Azure e Azure Databricks avançado',
    'Experiência com arquitetura Data Lake e Lakehouse',
    'Python, PySpark e SQL avançados',
    'Experiência em projetos de Analytics, Big Data e Modern Data Platform',
    'Conhecimento em DevOps/CI-CD para dados e modelagem dimensional'
  ],
  ARRAY[
    'Azure',
    'Databricks',
    'Python',
    'PySpark',
    'SQL',
    'Delta Lake',
    'Power BI',
    'Terraform',
    'Kafka'
  ],
  'https://ipiranga.gupy.io/job/eyJqb2JJZCI6MTI0MjE3MTUsInNvdXJjZSI6Imd1cHlfcG9ydGFsIn0='
),

(
  'Analytics Engineer Sênior (DATA & AI)',
  'Grupo Casas Bahia',
  'https://www.google.com/s2/favicons?domain=casasbahia.com.br&sz=128',
  'São Paulo, SP',
  'HYBRID',
  'SENIOR',
  'Profissional responsável por desenvolver, estruturar e evoluir soluções analíticas avançadas de Inteligência Artificial, traduzindo necessidades de negócio em modelos, dados e produtos analíticos escaláveis, atuando embarcado em squads de negócio como referência técnica sênior em analytics.',
  ARRAY[
    'Domínio de Python e SQL para análise e processamento de dados',
    'Conhecimento sólido em estatística e Machine Learning',
    'Experiência em construção de pipelines de dados (ETL/ELT)',
    'Vivência com plataformas de Cloud (Azure, AWS ou GCP)',
    'Experiência com MLOps, DataOps, versionamento e deploy de modelos',
    'Conhecimento em integração de sistemas e APIs'
  ],
  ARRAY[
    'Python',
    'SQL',
    'Machine Learning',
    'Azure',
    'AWS',
    'GCP',
    'Power BI',
    'Tableau',
    'LLMs'
  ],
  'https://tecnologiagrupocasasbahia.gupy.io/jobs/11592446'
),

-- ---------- DEVOPS / SRE ----------

(
  'Site Reliability Engineer (SRE) | AWS | Kubernetes | Databricks | Sênior (Remote)',
  'Compass UOL',
  'https://www.google.com/s2/favicons?domain=compass.uol.com.br&sz=128',
  'Brasil',
  'REMOTE',
  'SENIOR',
  'SRE sênior responsável por garantir confiabilidade, disponibilidade e desempenho de sistemas em produção, administrando ambientes Kubernetes, respondendo a incidentes críticos com RCA, e gerenciando pipelines de CI/CD e infraestrutura como código.',
  ARRAY[
    'Experiência sólida como SRE, DevOps Engineer ou Platform Engineer',
    'Vivência em administração de Kubernetes em produção',
    'Experiência com infraestrutura em cloud, preferencialmente AWS',
    'Automação de infraestrutura com Terraform/IaC',
    'Experiência com Databricks e Apache Spark',
    'Conhecimento em SQL, Data Warehouse e modelagem de dados'
  ],
  ARRAY[
    'AWS',
    'Kubernetes',
    'Terraform',
    'Databricks',
    'Apache Spark',
    'Amazon EC2',
    'Amazon S3',
    'AWS Lambda'
  ],
  'https://compass.gupy.io/jobs/11880163'
),

(
  'Site Reliability Engineer (SRE)',
  'Attus',
  'https://www.google.com/s2/favicons?domain=attus.com.br&sz=128',
  'Brasil',
  'REMOTE',
  'SENIOR',
  'SRE responsável por estabelecer e evoluir práticas de confiabilidade em empresa de tecnologia jurídica, desde observabilidade e SLOs até resposta a incidentes e automação, tratando operação como engenharia e aplicando IA para reduzir trabalho manual (AIOps).',
  ARRAY[
    'Experiência com observabilidade (Grafana, Prometheus, Elastic, Dynatrace)',
    'Experiência com Kubernetes e containers (Docker)',
    'Conhecimento em Linux e redes (HTTP, DNS, TLS/SSL)',
    'Conhecimento em scripts e automação (Shell, Python)',
    'Uso de IA aplicada à operação (AIOps)',
    'Diferencial: IaC (Terraform, Ansible) e Chaos Engineering'
  ],
  ARRAY[
    'Grafana',
    'Prometheus',
    'Elastic',
    'Kubernetes',
    'Docker',
    'Linux',
    'Python',
    'Terraform',
    'Redis'
  ],
  'https://attus.gupy.io/jobs/11444982'
),

-- ---------- QA / TESTES ----------

(
  'Analista de Testes (QA) Senior',
  'Ituran',
  'https://www.google.com/s2/favicons?domain=ituran.com.br&sz=128',
  'Rio de Janeiro, RJ',
  'HYBRID',
  'SENIOR',
  'Profissional responsável por definir a estratégia e arquitetura de testes automatizados e conduzir a transição dos testes manuais para automação, integrando qualidade ao pipeline de CI/CD e escalando a capacidade da área de QA para todas as squads de desenvolvimento.',
  ARRAY[
    'Arquitetura de automação de testes (Page Object, modularização) com Playwright',
    'CI/CD para testes em Azure DevOps, GitHub Actions ou similar',
    'Ambientes de teste em containers (Docker) com estratégia de banco reproduzível',
    'Estratégia de testes (pirâmide, integração, regressão) e definição de quality gates',
    'SQL avançado, análise de resultados e métricas de cobertura',
    '5+ anos de experiência com QA, automação e liderança técnica/mentoria'
  ],
  ARRAY[
    'Playwright',
    'Azure DevOps',
    'GitHub Actions',
    'Docker',
    'SQL'
  ],
  'https://vagasituran.gupy.io/jobs/12197211'
),

(
  'Analista de QA Sênior',
  'Claranet',
  'https://www.google.com/s2/favicons?domain=claranet.com.br&sz=128',
  'São Paulo, SP',
  'HYBRID',
  'SENIOR',
  'Profissional responsável por garantir a qualidade das soluções desenvolvidas pela Claranet, realizando testes e validações em produtos e serviços antes da implementação, incluindo desenvolvimento de planos de teste, testes automatizados e manuais, e identificação de bugs e falhas.',
  ARRAY[
    'Graduação completa em Engenharia, Ciência da Computação, TI ou áreas afins',
    'Certificações avançadas em QA, automação de testes ou segurança da informação (desejável)',
    'Inglês avançado',
    'Liderança em QA e desenvolvimento de estratégias de automação de testes',
    'Experiência em suporte à alta administração',
    'Conhecimento em segurança da informação'
  ],
  ARRAY[
    'Automação de Testes',
    'Testes Manuais',
    'Planos de Teste',
    'Segurança da Informação',
    'Gestão da Qualidade'
  ],
  'https://claranet.gupy.io/jobs/11206891'
);