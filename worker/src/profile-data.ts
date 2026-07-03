/**
 * Structured Profile Data for the AI Chat Widget.
 * Source of truth: Bharathkumar Dasaraju's resume + GitHub profile README.
 * This is injected into the system prompt so the model answers from facts only.
 */

export interface Role {
  company: string;
  title: string;
  dates: string;
  location: string;
  stack?: string;
  achievements: string[];
}

export const profile = {
  name: "Bharathkumar Dasaraju",
  title: "Senior DevOps & Platform Engineer / SRE",
  location: "Singapore",
  contact: {
    email: "bhrth.dsra1@gmail.com",
    phone: "+65 9082 9964",
    website: "https://bharathkumaraju.com",
    linkedin: "https://www.linkedin.com/in/dasararaju/",
    github: "https://github.com/Bharathkumarraju",
    medium: "https://medium.com/@bhrth.dsra1",
    stackoverflow:
      "https://stackoverflow.com/users/4036804/bharathkumarraju-dasararaju",
  },
  summary:
    "Senior DevOps & Platform Engineer with 10+ years of experience building, scaling, and automating cloud-native platforms across AWS, GCP, and Azure. Expert in Kubernetes (EKS/GKE), CI/CD, Terraform, microservices, observability, and platform security. Has designed and operated large-scale platforms for financial institutions, telcos, airlines, and fintechs. Strong background in SRE, cloud automation, multi-cloud networking, monitoring, and DevSecOps. A CNCF Kubestronaut (holds all five CNCF Kubernetes certifications).",
  countriesWorked: ["India", "Germany", "Singapore"],
  coreStrengths: [
    "Platform engineering",
    "Kubernetes (EKS/GKE)",
    "Terraform / Infrastructure as Code",
    "GitHub Actions & ArgoCD",
    "Helm",
    "Distributed systems & SRE practices",
    "GCP & AWS architecture",
    "Cost optimization",
    "Container & platform security",
    "Automation",
  ],
  skills: {
    cloud: ["AWS", "GCP", "Azure"],
    kubernetes: ["EKS", "GKE", "OpenShift", "Rancher", "Istio", "Traefik", "Tyk APIGW"],
    devops: ["Terraform", "Helm", "ArgoCD", "GitHub Actions", "Jenkins", "AWX/Ansible", "Pulumi", "CloudFormation", "AWS CDK"],
    observability: ["Prometheus", "Grafana", "Loki", "Thanos", "Tempo", "Datadog", "Elastic Stack", "OpenTelemetry"],
    security: ["Vault", "External Secrets Operator (ESO)", "EKS Pod Identity/IRSA", "CIS Benchmarks", "Cloudflare WARP", "AWS Network Firewall"],
    programming: ["Python", "Bash", "Go (basics)"],
    cicd: ["GitHub Actions", "Bitbucket/Jenkins", "GitLab CI"],
    dataStreaming: ["PostgreSQL", "MySQL", "Kafka (Confluent)", "GCP Pub/Sub"],
    other: ["NixOS", "SnowCommander", "Consul", "HAProxy"],
  },
  certifications: [
    "CNCF Kubestronaut (all five CNCF Kubernetes certifications)",
    "CKA — Certified Kubernetes Administrator",
    "CKAD — Certified Kubernetes Application Developer",
    "CKS — Certified Kubernetes Security Specialist",
    "KCNA — Kubernetes and Cloud Native Associate",
    "KCSA — Kubernetes and Cloud Native Security Associate",
    "Google Cloud Professional Cloud Architect",
    "Google Cloud Associate Cloud Engineer",
    "HashiCorp Certified: Terraform Associate",
    "AWS Certified Developer – Associate",
    "AWS Solutions Architect",
    "Azure and AWS AI Cloud Engineer",
  ],
  roles: <Role[]>[
    {
      company: "Abaxx Commodity Futures Exchange and Clearinghouse",
      title: "Senior DevOps (ML/AI) Engineer",
      dates: "Apr 2024 – Present",
      location: "Singapore",
      stack: "AWS EKS Platform",
      achievements: [
        "Architected and operated a large-scale Platform-as-a-Service (PaaS) on AWS EKS, hosting trading, clearing, and market-data workloads across multi-environment clusters.",
        "Designed secure AWS network architecture using AWS Network Firewall for layer-7 inspection, threat detection, segmentation, and centralized policy enforcement.",
        "Engineered end-to-end Cloudflare configurations: page rules, caching tiers, WAF policies, bypass rules, and traffic routing for production and DR endpoints; implemented Cloudflare Origin and Edge Certificates for mTLS.",
        "Designed and maintained Helm charts for mission-critical apps (MMT, MDAPI, Clearing System, TradingView, COCO, CLAUS, Keycloak, and others).",
        "Built reusable Terraform modules for GitHub/AWS provisioning, reducing environment setup time by 40%.",
        "Led observability migration from Prometheus + Thanos + Tempo to the Elastic Stack, with alerting rules managed declaratively in Terraform.",
        "Implemented cloud-cost optimization automation, reducing spend by 35%.",
        "Worked extensively with AWS networking: VPC design, Transit Gateway, subnets, routing, ALB/NLB ingress, RDS, SFTP, IAM, and secure multi-account CI/CD pipelines.",
      ],
    },
    {
      company: "Cloud Kinetics",
      title: "Cloud Architecture Consultant",
      dates: "May 2023 – Apr 2024",
      location: "Singapore (Hybrid)",
      stack: "AWS & Azure",
      achievements: [
        "Designed multi-account AWS landing zone architecture using AWS Control Tower, account vending, guardrails, centralized logging, IAM boundaries, and security baselines.",
        "Consulted for the Abaxx team, designing cloud-native AWS platform patterns aligned with fintech security, availability, and compliance requirements.",
        "Developed a Python-based Kubernetes init container to pull secrets from AWS Secrets Manager at pod startup and mount them for application consumption.",
        "Designed and architected Elastic Cloud for the Abaxx team: log ingestion, metrics visibility, APM strategy, alerting foundations, and operational dashboards.",
        "Designed Flyway-based database versioning patterns for repeatable schema migrations and continuous database delivery.",
      ],
    },
    {
      company: "advance.ai",
      title: "Senior SRE Engineer",
      dates: "Jun 2022 – Jul 2023",
      location: "Singapore",
      stack: "GCP + GKE",
      achievements: [
        "Designed full GCP infrastructure for Safi Bank using Terraform: networking, IAM, security, and multiple GKE workloads including a central observability cluster.",
        "Built CI/CD via GitHub Actions and GitOps via ArgoCD.",
        "Managed Kubernetes workloads with Helm charts and integrated the Istio service mesh.",
        "Implemented platform monitoring with Prometheus, Grafana, Loki, Thanos, and Tempo, lowering MTTD and MTTR.",
        "Built data platform integrations with Kafka (Confluent) and GCP Pub/Sub.",
      ],
    },
    {
      company: "NTUC Singapore",
      title: "Site Reliability Engineer (SRE)",
      dates: "Jul 2020 – May 2022",
      location: "Singapore",
      stack: "GCP + GKE",
      achievements: [
        "Designed Shared VPC architecture on GCP for large enterprise customers.",
        "Containerized internal applications and migrated legacy Docker setups to NixOS.",
        "Automated infrastructure using Terraform + Jinja2 templating driven by YAML metadata.",
        "Built a Python + Cloud Run + Cloud Tasks serverless system to auto-modify IaC repositories from Jira tickets, auto-creating and merging PRs.",
        "Deployed AWX on GKE with multiple Ansible playbooks; built Python-based EC2 maintenance automation (daily encrypted AMIs, EC2/EBS decommissioning).",
      ],
    },
    {
      company: "Singapore Airlines",
      title: "DevOps Engineer",
      dates: "Apr 2019 – Jul 2020",
      location: "Singapore",
      stack: "OpenShift, Docker & Kubernetes",
      achievements: [
        "Led the Container Platform team managing OpenShift 3.6 / 3.11 across AWS and VMware.",
        "Designed microservices architecture and deployed new OpenShift clusters; managed onboarding, CI/CD (Bitbucket, Jenkins, Jira), network policies, RBAC, and multi-cluster security.",
        "Maintained the EFK stack (Elasticsearch, Fluentd, Kibana) for log analytics.",
        "Implemented CIS Kubernetes Benchmarks and image scanning via AquaSec and OpenSCAP; automated AWS workloads with CloudFormation, Step Functions, and Lambda.",
      ],
    },
    {
      company: "Delivion GmbH",
      title: "Cloud Platform Engineer",
      dates: "Dec 2017 – Apr 2019",
      location: "Düsseldorf, Germany",
      stack: "AWS & Multi-Cloud",
      achievements: [
        "Architected and managed multi-cloud infrastructure across AWS, Azure, OpenNebula, vSphere, and vCloud for enterprise customers.",
        "Designed container platforms using Docker, Kubernetes, Helm, and Rancher; developed custom Kubernetes Operators in Go.",
        "Implemented IaC automation with Terraform and Ansible, reducing infrastructure provisioning time by 60%.",
        "Operated platform components: Consul, Zookeeper, ELK, HAProxy, Kafka, PostgreSQL, Graphite, Grafana, Sensu, Prometheus, and Datadog; contributed upstream to open source.",
      ],
    },
    {
      company: "Standard Chartered Bank",
      title: "DevOps Engineer",
      dates: "Sep 2016 – Oct 2017",
      location: "Chennai, India",
      achievements: [
        "Automated WebMethods stack deployment, reducing manual effort from 3 days to 2 hours.",
        "Managed 200+ servers using Ansible, ITRS, and shell scripting.",
        "Built centralized log analytics using ELK, handling 6 TB/day of log ingestion; introduced containerized NGINX gateway with F5 load balancing.",
      ],
    },
    {
      company: "Trimble",
      title: "DevOps Engineer",
      dates: "Jun 2014 – Sep 2016",
      location: "India",
      achievements: [
        "Designed AWS infrastructure and implemented CI/CD, Terraform, and CloudFormation stacks.",
        "Integrated Datadog and Sumo Logic; automated deployments, reducing release time by 50%; migrated legacy applications to AWS.",
      ],
    },
    {
      company: "Hewlett-Packard",
      title: "Linux Systems Administrator",
      dates: "Feb 2011 – Jun 2014",
      location: "India",
      achievements: [
        "Managed RHEL systems, Apache/Tomcat tuning, and Bash automation scripts; used Control-M for SQL job scheduling.",
        "Supported web and application server platforms for enterprise customers including Airbus and Boeing.",
      ],
    },
  ],
  education: [
    {
      degree: "MCA — Master of Computer Applications (Information Systems)",
      institution: "JNTU Hyderabad",
      year: "2008 – 2011",
    },
  ],
  writing: [
    "CKA Book — Certified Kubernetes Administrator study guide (cka.devops4itengineers.com)",
    "AI-LLM Learning Hub (aillm.devops4itengineers.com)",
    "Medium: Deploy GHA Self-Hosted Runners on AWS EKS with Terraform and Helm",
    "Medium: Tokenization & Visualizing Vector Embeddings in Multi-Dimensional Space (3D)",
    "Medium: Terraform 1.11.0 Unlocks Secure AWS RDS Secrets with Write-Only Attributes",
    "Medium: Stateless vs Stateful Architectures",
    "Medium: Google Cloud Container-Native Load Balancer",
    "Medium: AWS Securely Share App to Clients with PrivateLink via Endpoint Service",
  ],
  authoredContent: {
    ckaBook: {
      title: "CKA Book — Certified Kubernetes Administrator Notes",
      url: "https://cka.devops4itengineers.com/",
      codeRepo: "https://github.com/Bharathkumarraju/certified_kubernetes_administrator/",
      description:
        "A hands-on study guide and notes for the Certified Kubernetes Administrator (CKA) exam, authored by Bharathkumar. Covers the full CKA curriculum with practical examples and lab references.",
      chapters: [
        "Core Concepts",
        "Scheduling",
        "Logging and Monitoring",
        "Application Lifecycle Management",
        "Cluster Maintenance",
        "Security",
        "Storage",
        "Networking",
        "Design Kubernetes",
        "Install Kubernetes with kubeadm",
        "Troubleshooting in Kubernetes",
        "KodeKloud Labs",
        "killer.sh Simulator Labs",
      ],
    },
    aiLlmHub: {
      title: "AI-LLM Learning Hub — AI / LLM / MLOps Notes",
      url: "https://aillm.devops4itengineers.com/",
      codeRepo: "https://github.com/Bharathkumarraju/learn-ai-llm-ml-ops",
      description:
        "A learning hub of notes and hands-on labs covering the modern AI/LLM/MLOps landscape, authored by Bharathkumar — spanning ML pipelines, model training/serving, MLOps tooling, cloud AI services (AWS & Azure), and Generative AI / LLM / RAG.",
      sections: [
        "ML-Ops Tools & Overview",
        "Data Collection and Preparation (with Airflow pipeline orchestration)",
        "Model Development and Training",
        "Model Deployment and Serving",
        "Automating with MLflow and BentoML",
        "Data Security and Governance",
        "AWS SageMaker",
        "AI, ML, and Deep Learning fundamentals",
        "GenAI Learning",
        "OpenAI (text generation, output formatting, vision capabilities)",
        "Azure AI Fundamentals (ML, Vision, NLP, Document Intelligence, AI Search)",
        "Azure OpenAI & GenAI in Azure",
        "AWS AI Certification topics",
        "Azure GenAI + LLM + RAG (incl. Contoso Chat RAG application)",
        "OpenAI use-case examples",
        "Building AI apps on Azure",
        "Azure AI-102 Certification prep",
      ],
    },
  },
};

export function getProfileContext(): string {
  const rolesText = profile.roles
    .map(
      (r) => `
### ${r.title} — ${r.company}
- Period: ${r.dates}
- Location: ${r.location}${r.stack ? `\n- Stack: ${r.stack}` : ""}
Highlights:
${r.achievements.map((a) => `- ${a}`).join("\n")}`
    )
    .join("\n");

  return `
# ${profile.name} — Professional Profile

## Title
${profile.title} (based in ${profile.location})

## Summary
${profile.summary}

## Countries Worked In
${profile.countriesWorked.join(", ")}

## Core Strengths
${profile.coreStrengths.join(", ")}

## Technical Skills
- Cloud: ${profile.skills.cloud.join(", ")}
- Kubernetes: ${profile.skills.kubernetes.join(", ")}
- DevOps / IaC: ${profile.skills.devops.join(", ")}
- Observability: ${profile.skills.observability.join(", ")}
- Security: ${profile.skills.security.join(", ")}
- Programming: ${profile.skills.programming.join(", ")}
- CI/CD: ${profile.skills.cicd.join(", ")}
- Data & Streaming: ${profile.skills.dataStreaming.join(", ")}
- Other: ${profile.skills.other.join(", ")}

## Certifications
${profile.certifications.map((c) => `- ${c}`).join("\n")}

## Professional Experience
${rolesText}

## Education
${profile.education.map((e) => `- ${e.degree}, ${e.institution} (${e.year})`).join("\n")}

## Writing & Publications
${profile.writing.map((w) => `- ${w}`).join("\n")}

## Authored Technical Books / Learning Hubs
Bharathkumar has authored two in-depth technical resources. When asked about his books, writing, or teaching, describe these and share the links.

### ${profile.authoredContent.ckaBook.title}
${profile.authoredContent.ckaBook.description}
- Website: ${profile.authoredContent.ckaBook.url}
- Code repository: ${profile.authoredContent.ckaBook.codeRepo}
- Chapters covered: ${profile.authoredContent.ckaBook.chapters.join(", ")}

### ${profile.authoredContent.aiLlmHub.title}
${profile.authoredContent.aiLlmHub.description}
- Website: ${profile.authoredContent.aiLlmHub.url}
- Code repository: ${profile.authoredContent.aiLlmHub.codeRepo}
- Sections covered: ${profile.authoredContent.aiLlmHub.sections.join(", ")}

## Contact
- Email: ${profile.contact.email}
- LinkedIn: ${profile.contact.linkedin}
- GitHub: ${profile.contact.github}
`;
}
