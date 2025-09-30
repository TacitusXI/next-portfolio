'use client';

import { PersonalInfo, Experience, Project, Skill, Certificate, Publication, Language, Recommendation } from '@/types/index';
import { FaGithub, FaLinkedin, FaTwitter, FaMedium } from 'react-icons/fa';
import React from 'react';

export const personalInfo: PersonalInfo = {
  name: "Ivan Leskov",
  title: "Security Researcher | Blockchain Security Expert",
  email: "ivan.leskov@protonmail.com",
  location: "Europe, Poland",
  linkedin: "https://www.linkedin.com/in/ivan-leskov/",
  summary: "Security Researcher specializing in blockchain security, smart contract auditing, and vulnerability research. I focus on identifying and mitigating security risks in decentralized systems, conducting comprehensive security audits, and developing secure blockchain solutions. Technical reviewer for Packt's 'Developing Blockchain Solutions in the Cloud', contributing security expertise to industry publications.",
  bio: [
    "Hello! I'm Ivan Leskov, a dedicated Security Researcher with expertise in blockchain security and smart contract vulnerability analysis.",
    "With a strong focus on security auditing, threat modeling, and vulnerability research, I specialize in identifying and mitigating risks in decentralized systems.",
    "I serve as a technical reviewer for published blockchain literature, including Packt's 'Developing Blockchain Solutions in the Cloud', where I contributed security expertise across numerous chapters.",
    "I'm constantly exploring new security methodologies and research techniques to enhance the security posture of blockchain ecosystems."
  ],
  socials: [
    {
      name: "GitHub",
      url: "https://github.com/ivanleskov",
      icon: React.createElement(FaGithub)
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/ivan-leskov/",
      icon: React.createElement(FaLinkedin)
    },
    {
      name: "X (Twitter)",
      url: "https://x.com/TacitusXI",
      icon: React.createElement(FaTwitter)
    },
    {
      name: "Medium",
      url: "https://medium.com/@ivanlieskov",
      icon: React.createElement(FaMedium)
    }
  ]
};

export const experiences: Experience[] = [
  {
    title: "Blockchain Engineer",
    company: "Various Projects",
    period: "2024 - 2025",
    description: "Worked with early-stage blockchain startups and personal projects, focusing on smart contract development, decentralized application architecture across multiple chains, technical reviews, audits and side projects.",
    achievements: [
      "Designed and implemented custom smart contract solutions for various DeFi and NFT use cases",
      "Built full-stack dApps with React, Next.js and Solidity, focusing on user experience and secure blockchain integration",
      "Deepened security expertise by performing smart contract audits on Code4rena, identifying vulnerabilities across different blockchain projects."
    ],
    proof: {
      title: "Technical Book Reviewer",
      description: "Served as technical reviewer for 'Developing Blockchain Solutions in the Cloud' by Stefano Tempesta and Michael Peña, published by Packt. Focused on side projects, startup consulting, and Code4rena audits during this period.",
      images: [
        "/images/proofs/packt/packt1.webp",
        "/images/proofs/packt/packt2.webp"
      ],
      links: [
        {
          title: "Book on Amazon",
          url: "https://www.amazon.com/Developing-Blockchain-Solutions-Cloud-blockchain-powered-ebook/dp/B0CW59K1M4"
        }
      ]
    }
  },
  {
    title: "Blockchain Engineer",
    company: "BlockTrust",
    period: "2022 - 2024",
    description: "Developed a comprehensive library of NFT smart contracts (ERC-721 and ERC-1155) for physical asset tokenization, primarily focusing on firearm collectibles and other real-world items for major clients in the collectibles industry.",
    achievements: [
      "Created a full set of backend infrastructure for various projects and clients, including Node.js endpoints to retrieve blockchain data",
      "Created certificates of authenticity as NFTs for the firearm collection market, supporting charity initiatives through sales",
      "Developed reusable smart contract libraries and blockchain infrastructure components to streamline development across multiple projects"
    ],
    proof: {
      title: "Charity NFT Project",
      description: "Created certificate of authenticity contract for firearm #022, gifted by Czech President Pavel to President Zelensky. NFT auctioned with proceeds donated to charity.",
      images: [
        "/images/proofs/blocktrust/blocktrust1.webp",
        "/images/proofs/blocktrust/blocktrust2.webp",
        "/images/proofs/blocktrust/blocktrust3.webp"
      ],
      links: [
        {
          title: "OpenSea NFT #22",
          url: "https://opensea.io/item/matic/0x32f3a5cd66b0813f5650abaf8505f178dff24a35/22"
        },
        {
          title: "Polygon Contract",
          url: "https://polygonscan.com/address/0x32f3a5cd66b0813f5650abaf8505f178dff24a35"
        }
      ]
    }
  },
  {
    title: "Independent Trader",
    company: "Self-Employed",
    period: "2019 - 2022",
    description: "Executed sophisticated trading strategies in volatile cryptocurrency markets, maintaining financial independence through disciplined analysis and strategic position management.",
    achievements: [
      "Mastered market cycles through rigorous technical analysis, navigating two significant market rises and subsequent corrections",
      "Developed proprietary risk management system that consistently preserved capital during extreme market volatility",
      "Transformed market insights into actionable technical knowledge, facilitating strategic transition to blockchain development"
    ],
    proof: {
      title: "Crypto Trading & Technical Expertise",
      description: "Mastered technical analysis and blockchain concepts while developing trading strategies. Spoke at local events on crypto/blockchain topics. Built trading bots and studied smart contracts, laying the foundation for my blockchain engineering career.",
      images: [
        "/images/proofs/technical/technical1.webp",
        "/images/proofs/technical/technical2.webp"
      ],
      links: []
    }
  },
  {
    title: "Financial Consultant",
    company: "Major Banking Institution",
    period: "2015 - 2019",
    description: "Dominated regional banking and insurance markets through strategic client acquisition and sophisticated financial product positioning, establishing unmatched sales authority.",
    achievements: [
      "Secured top sales performer status across entire regional branch network for multiple consecutive months",
      "Mastered complex insurance and banking offerings, creating persuasive value propositions for diverse client portfolios",
      "Cultivated exclusive client relationships through targeted financial strategy consultations, establishing reputation for expertise"
    ],
    proof: {
      title: "Top Sales Performance",
      description: "Achieved #1 sales position in regional banking network through high-quality client acquisition and agency partnerships. Maintained top performance across quantity and quality metrics consistently throughout tenure.",
      images: [
        "/images/proofs/seller/seller1.webp",
        "/images/proofs/seller/seller2.webp"
      ],
      links: []
    }
  }
];

export const additionalExperiences: Experience[] = [
  {
    title: "Smart Contract Infrastructure Engineer",
    company: "HIRO",
    period: "2025",
    description: "Executed adaptation of Uniswap v3 for custom blockchain, overcoming significant technical barriers in contract deployment and EVM compatibility issues to deliver a functional decentralized exchange.",
    achievements: [
      "Deployed essential infrastructure contracts (UniswapInterfaceMulticall, CREATE2, Permit2) with precise configuration, establishing full protocol functionality on a chain with limited compatibility",
      "Modified and patched multiple core packages (sdk-core, universal-router-sdk, smart-order-router etc.) to support custom chain parameters",
      "Resolved complex EVM version mismatches (Istanbul vs. Cancun) while executing comprehensive UI redesign according to client specifications"
    ]
  },
  {
    title: "Blockchain Engineer | Smart Contract Developer",
    company: "Stacknova",
    period: "2024 - 2025",
    description: "Developed multi-chain presale infrastructure across eight EVM-compatible blockchains, implementing secure and efficient smart contracts in Solidity.",
    achievements: [
      "Built and deployed Solidity smart contracts for cross-chain presale functionality with secure token distribution mechanics",
      "Created GraphQL infrastructure to sync all transaction data across 8 chains efficiently, enabling real-time monitoring",
      "Implemented fully backend and frontend for presale page, creating a complete end-to-end solution"
    ]
  },
  {
    title: "Blockchain Technical Reviewer",
    company: "Packt",
    period: "2023 - 2024",
    description: "Served as technical reviewer for 'Developing Blockchain Solutions in the Cloud', with my name and bio featured in the published book.",
    achievements: [
      "Reviewed technical content across 15+ chapters, ensuring accuracy and quality of blockchain concepts",
      "Provided technical feedback and suggestions to improve code examples and architectural explanations",
      "Collaborated with authors and editors to enhance the educational value of the publication"
    ]
  },
  {
    title: "Blockchain Developer",
    company: "Aetlas",
    period: "2023 - 2024",
    description: "Developed an upgradable DeFi system for carbon offset tokens, featuring ERC20-compliant token pools with deposit, redemption, and cross-chain bridging capabilities.",
    achievements: [
      "Built dynamic pricing mechanism for carbon projects based on attributes like region, standard, and methodology",
      "Engineered multi-asset AMM pools using Balancer's price formulas to ensure stable pricing for carbon market assets",
      "Guided and helped external team participation in Chainlink Hackathon, implementing wrapped MRV standard for oracle integration with carbon methodologies"
    ]
  },
  {
    title: "Solidity Developer",
    company: "1000Geeks",
    period: "2022",
    description: "Developed smart contracts for NFT projects using Solidity, focusing on gas optimization and cross-project compatibility.",
    achievements: [
      "Integrated blockchain components using node.js endpoints for scalable and efficient deployment",
      "Built and deployed smart contracts for multiple NFT collections following industry best practices",
      "Implemented gas optimization techniques for more cost-effective transactions in production environments"
    ]
  }
];

export const projects: Project[] = [
  {
    title: "Dark Forest",
    period: "2024 - Present",
    description: "A comprehensive library of blockchain security audits and exploit analysis by Tacitvs. Dark Forest serves as an educational platform featuring detailed writeups of historic blockchain hacks, security vulnerabilities, and comprehensive audit reports. The platform combines narrative storytelling with technical analysis to illuminate the shadows of the crypto ecosystem.",
    links: {
      github: "https://github.com/TacitusXI/dark-forest",
      live: "https://dark-forest.tacitvs.eth.limo"
    },
    githubInfo: {
      stars: 0,
      forks: 0,
      languages: [
        { name: "JavaScript", percentage: 85.2 },
        { name: "CSS", percentage: 12.8 },
        { name: "HTML", percentage: 2.0 }
      ],
      topics: [
        "blockchain-security", "smart-contract-audits", "exploit-analysis", 
        "vulnerability-research", "defi-security", "audit-reports", "security-research",
        "blockchain-audits", "crypto-security", "web3-security"
      ]
    }
  },
  {
    title: "Tacitus Swap",
    period: "2023 - Present",
    description: "A sophisticated fork of Uniswap with custom Tacitus implementations, featuring an enhanced user interface with modern design elements. The platform incorporates a distinctive digital rain animation for a cyberpunk aesthetic, while maintaining the robust trading functionality of the original DEX. Supports multiple chains and token swaps with optimized transaction processing.",
    links: {
      github: "https://github.com/TacitusXI/tacitus-swap",
      live: "https://tacitus-swap.vercel.app/"
    },
    githubInfo: {
      stars: 4,
      forks: 1,
      languages: [
        { name: "TypeScript", percentage: 78.5 },
        { name: "JavaScript", percentage: 14.3 },
        { name: "CSS", percentage: 5.7 },
        { name: "Solidity", percentage: 1.5 }
      ],
      topics: [
        "defi", "uniswap", "dex", "ethereum", "web3", 
        "smart-contracts", "amm", "liquidity-pool", "decentralized-exchange"
      ]
    }
  },
  {
    title: "DeFi IL Hedge Bot",
    period: "2024 - Present",
    description: "A Python-based trading bot and backtesting framework that hedges impermanent loss in Uniswap V2 ETH/USDC liquidity pools using Binance perpetual contracts. The bot collects historical data, calculates LP position value, determines position sensitivity to ETH price changes, and executes hedging orders.",
    links: {
      github: "https://github.com/TacitusXI/defi-il-hedge-bot"
    },
    githubInfo: {
      stars: 1,
      forks: 0,
      languages: [
        { name: "Python", percentage: 100.0 }
      ],
      topics: [
        "python", "algorithmic-trading", "hedging", "backtesting", 
        "tradingbot", "binance", "ccxt", "crypto-trading", "defi", 
        "uniswap", "the-graph", "uniswap-v2", "liquidity-provisioning", "impermanent-loss"
      ]
    }
  },
  {
    title: "Ledger Signer",
    period: "2024 - Present",
    description: "A utility tool for Ledger hardware wallet integration that enables secure transaction signing with enhanced verification and multi-chain support. The signer provides a seamless interface for dApp interactions while maintaining the security benefits of hardware-based key storage.",
    links: {
      github: "https://github.com/TacitusXI/ledger-signer"
    },
    githubInfo: {
      stars: 2,
      forks: 0,
      languages: [
        { name: "TypeScript", percentage: 80.5 },
        { name: "JavaScript", percentage: 15.5 },
        { name: "HTML", percentage: 4.0 }
      ],
      topics: [
        "ledger", "hardware-wallet", "signer", "ethereum", "web3", 
        "blockchain", "cryptocurrency", "security", "multi-chain", "transaction-signing"
      ]
    }
  },
  {
    title: "LeskoDEX",
    period: "2021 - 2023",
    description: "LeskoDEX is a decentralized exchange (DEX) featuring a decentralized order book and a custom ERC-20 ESKO token. Users can seamlessly connect via Metamask to trade the ETH/ESKO pair. The platform includes an integrated charting tool for comprehensive technical analysis.",
    links: {
      github: "https://github.com/TacitusXI/LeskoDEX"
    },
    githubInfo: {
      stars: 3,
      forks: 0,
      languages: [
        { name: "Solidity", percentage: 65.3 },
        { name: "JavaScript", percentage: 25.2 },
        { name: "CSS", percentage: 9.5 }
      ],
      topics: [
        "dex", "defi", "erc20-token", "decentralized-exchange", 
        "ethereum", "trading", "metamask", "web3"
      ]
    }
  },
  {
    title: "TechnoirClub Marketplace",
    period: "2022 - 2023",
    description: "A collection of unique NFT mutant robots featuring an interactive frontend interface and marketplace. Each robot can be modified and reassembled to create entirely new configurations using interchangeable parts, offering over 999 trillion potential combinations for collectors and enthusiasts.",
    links: {
      github: "https://github.com/TacitusXI/TechnoirClub-Marketplace",
      live: "https://technoir.on-fleek.app"
    },
    githubInfo: {
      stars: 2,
      forks: 0,
      languages: [
        { name: "HTML", percentage: 64.8 },
        { name: "JavaScript", percentage: 19.5 },
        { name: "Solidity", percentage: 9.8 },
        { name: "CSS", percentage: 5.9 }
      ],
      topics: [
        "coverage-testing", "solidity", "ethereum-contract", "ethereum-dapp", 
        "nft", "smart-contract", "nft-marketplace", "nft-collection"
      ]
    }
  },
  {
    title: "LIQUID-DEX",
    period: "2023 - 2024",
    description: "LIQUID Decentralized Exchange: Built on the Stacks ecosystem for STX/LIQ trading, utilizing the LIQUID SIP010 token and developed in Clarity for enhanced security. Users can connect, trade, and manage liquidity with advanced wallet integration and comprehensive trading features.",
    links: {
      github: "https://github.com/TacitusXI/LIQUID-DEX",
      live: "https://stacks-dex.vercel.app/"
    },
    githubInfo: {
      stars: 1,
      forks: 0,
      languages: [
        { name: "TypeScript", percentage: 75.3 },
        { name: "Clarity", percentage: 20.3 },
        { name: "JavaScript", percentage: 3.8 },
        { name: "CSS", percentage: 0.6 }
      ],
      topics: [
        "smart-contracts", "swap", "dex", "stacks", "clarity", 
        "clarinet", "stx", "defi", "liquidity-pool"
      ]
    }
  }
];

export const skills: Skill[] = [
  {
    category: "Blockchain",
    items: ["Blockchain", "Ethereum", "EVM", "Solidity", "Hardhat", "Foundry", "ethers.js", "DeFi"]
  },
  {
    category: "Development",
    items: ["Back-End", "Front-End", "Database Management"]
  },
  {
    category: "Languages & Frameworks",
    items: ["Python", "TypeScript", "React.js", "Next.js"]
  },
  {
    category: "Tools & Others",
    items: ["Git", "Integration Tests", "Unit Tests", "CI/CD", "Agile"]
  },
  {
    category: "Soft Skills",
    items: ["Leadership", "Problem Solving", "Attention to Detail", "Self-Motivated"]
  }
];

export const certificates: Certificate[] = [
  {
    name: "CS50",
    issuer: "Harvard University",
    date: "Apr 2023"
  },
  {
    name: "Advanced Solidity",
    issuer: "Ethereum Foundation",
    date: "Jan 2023"
  },
  {
    name: "Blockchain Security",
    issuer: "OpenZeppelin",
    date: "Nov 2022"
  }
];

export const publications: Publication[] = [
  {
    title: "Demystifying CREATE2 and Permit2: Deterministic Smart Contract Deployment in Ethereum",
    publisher: "Medium",
    link: "https://medium.com/@ivanlieskov/demystifying-create2-and-permit2-deterministic-smart-contract-deployment-in-ethereum-c15548c7a198",
    description: "A comprehensive technical guide exploring how deterministic contract deployment works in Ethereum, the cryptographic formula behind CREATE2, and real-world applications like Uniswap's Permit2."
  },
  {
    title: "Developing Blockchain Solutions in the Cloud",
    publisher: "Packt",
    link: "https://www.amazon.com/Developing-Blockchain-Solutions-Cloud-blockchain-powered-ebook/dp/B0CW59K1M4",
    description: "A comprehensive guide to building blockchain applications in cloud environments, covering AWS, Azure, and Hyperledger architectures."
  },
  {
    title: "How Blockchain Developers Are Getting Hacked: The Hidden Threats We Overlook",
    publisher: "Block Magnates",
    link: "https://medium.com/@ivanlieskov/how-blockchain-developers-are-getting-hacked-the-hidden-threats-we-overlook-3f3ee4a3108f",
    description: "An in-depth analysis of security vulnerabilities that blockchain developers often miss, with practical prevention strategies."
  },
  {
    title: "Solidity Style Guide (Part I)",
    publisher: "Block Magnates",
    link: "https://medium.com/block-magnates/solidity-style-guide-part-i-d0fda6041ff9",
    description: "A guide to writing clean, readable, and maintainable Solidity code with best practices for naming, variable visibility, and events."
  },
  {
    title: "Solidity Style Guide (Part II)",
    publisher: "Coinsbench",
    link: "https://coinsbench.com/solidity-style-guide-part-iii-176d31e386f0",
    description: "Continues the exploration of Solidity style with insights from OpenZeppelin's code and recommendations for documentation and formatting."
  },
  {
    title: "The Importance of Test-Driven Development (TDD) in Smart Contract Development",
    publisher: "Coinsbench",
    link: "https://medium.com/coinsbench/the-importance-of-test-driven-development-tdd-in-smart-contract-development-9d9a4c14f654",
    description: "A practical guide to implementing TDD in smart contract development, with examples using Hardhat and Chai for testing Solidity code."
  }
];

export const languages: Language[] = [
  { language: "English", level: "Professional" },
  { language: "Polish", level: "Fluent" },
  { language: "Ukrainian", level: "Native" },
  { language: "Russian", level: "Fluent" }
];

// GitHub Information
export const githubInfo = {
  username: "TacitusXI",
  profileUrl: "https://github.com/TacitusXI",
  bio: "Security researcher | Blockchain security expert",
  featuredRepos: [
    {
      name: "NFT-Smart-Contracts",
      description: "A collection of secure and optimized NFT smart contracts with ERC-721 and ERC-1155 implementations",
      languages: ["Solidity", "JavaScript"],
      stars: 7,
      url: "https://github.com/TacitusXI/NFT-Smart-Contracts"
    },
    {
      name: "DEX-Prototype",
      description: "Decentralized exchange prototype with AMM functionality and liquidity pool implementation",
      languages: ["Solidity", "TypeScript", "React"],
      stars: 5,
      url: "https://github.com/TacitusXI/DEX-Prototype"
    },
    {
      name: "Solidity-Design-Patterns",
      description: "Implementation and explanation of common Solidity design patterns and best practices",
      languages: ["Solidity", "Markdown"],
      stars: 8,
      url: "https://github.com/TacitusXI/Solidity-Design-Patterns"
    }
  ]
};

// Add a recommendations section to store LinkedIn recommendations
export const recommendations: Recommendation[] = [
  {
    id: 1,
    name: "Reigner Ouano",
    position: "Acumatica ERP Specialist | Expertise in C#, Blazor, and Blockchain",
    image: "./images/recommendations/reigner.jpeg", // Primary path
    fallbackImage: "https://randomuser.me/api/portraits/men/32.jpg", // Fallback image
    text: "I had the privilege of working with Ivan Leskov at BlockTrust, where he demonstrated exceptional skills as a blockchain developer. Ivan's proficiency in blockchain technology, including his work with Solidity, is truly impressive. He has a deep understanding of both front-end and back-end development, which he combines with a genuine enthusiasm for learning and growing in the field.\n\nIvan's technical expertise is complemented by his eagerness to tackle new challenges. Whether developing complex blockchain solutions or collaborating on diverse projects, his ability to adapt and contribute effectively was evident. His commitment to continuous learning and improvement makes him a valuable asset to any team.\n\nIvan's contributions to our projects were invaluable, and his positive attitude and collaborative spirit made working with him a pleasure. I have no doubt that he will continue to excel and bring significant value to future endeavors. I highly recommend Ivan for any role that demands expertise in blockchain development and a passion for innovation.",
    date: "September 15, 2024",
    connection: "Reigner worked with Ivan on the same team"
  },
  {
    id: 2,
    name: "Stefano Tempesta",
    position: "Web3 Architect | AI & Blockchain for Good Ambassador | Scout Leader",
    image: "./images/recommendations/stefano.jpeg", // Primary path
    fallbackImage: "https://randomuser.me/api/portraits/men/67.jpg", // Fallback image
    text: "Had the pleasure of working with Ivan at BlockTrust. We built web3 technology that lasts, running 24/7 without interruption of service. Diligent, precise, reliable, and extremely experienced on all smart contract matters, Ivan is a highly skilled software engineer, versatile across multiple technologies. Pointless to say, I'd hire him over again, no questions asked!",
    date: "September 14, 2024",
    connection: "Stefano managed Ivan directly"
  }
];

// Add a reading section
export const reading = [
  {
    title: "The Dao of Capital",
    author: "Mark Spitznagel",
    description: "A deep exploration of Austrian investing principles and the concept of 'roundaboutness' in capital allocation. Spitznagel presents a unique perspective on risk management and investment strategies through the lens of Austrian economics.",
    category: "Finance & Economics"
  },
  {
    title: "Python for Finance",
    author: "Yves Hilpisch",
    description: "A practical guide to using Python for financial analysis, algorithmic trading, and risk management. Covers essential libraries like NumPy, pandas, and scikit-learn for financial data analysis and modeling.",
    category: "Technical Analysis"
  },
  {
    title: "High Performance Trading",
    author: "Steve Ward",
    description: "A comprehensive guide to understanding the psychological aspects of trading, focusing on mental discipline, emotional control, and decision-making processes in high-pressure trading environments.",
    category: "Trading Psychology"
  },
  {
    title: "The 10X Rule",
    author: "Grant Cardone",
    description: "A powerful framework for achieving extraordinary success by setting massive goals and taking massive action. Cardone's principles on goal setting, work ethic, and persistence are particularly relevant for trading and business success.",
    category: "Personal Development"
  }
]; 