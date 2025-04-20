'use client';

import { PersonalInfo, Experience, Project, Skill, Certificate, Publication, Language, Recommendation } from '@/types/index';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import React from 'react';

export const personalInfo: PersonalInfo = {
  name: "Ivan Leskov",
  title: "Blockchain Developer | Smart Contract Engineer",
  email: "ivan.leskov@protonmail.com",
  location: "Europe, Poland",
  linkedin: "https://www.linkedin.com/in/ivan-leskov/",
  summary: "Experienced Blockchain Developer with a strong focus on Solidity and secure smart contract implementation. I specialize in DeFi protocols, NFT marketplaces, and decentralized applications with a proven track record of delivering secure and efficient blockchain solutions.",
  bio: [
    "Hello! I'm Ivan Leskov, a passionate Blockchain Developer with expertise in building secure and efficient smart contract implementations.",
    "With a strong focus on DeFi protocols, NFT marketplaces, and decentralized applications, I specialize in creating secure blockchain solutions.",
    "I'm constantly exploring new blockchain technologies and methodologies to build more efficient and secure decentralized systems."
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
      name: "Twitter",
      url: "https://twitter.com/ivanleskov",
      icon: React.createElement(FaTwitter)
    }
  ]
};

export const experiences: Experience[] = [
  {
    title: "Blockchain Engineer | Full-Stack Developer",
    company: "Stacknova",
    period: "Feb 2024 - Feb 2025",
    description: "Prepared a multi-chain presale across eight EVM-compatible blockchains for Bitcoin AI Launchpad solution and developed Ethereum-based smart contracts using Solidity and TypeScript. Integrated backend systems with a scalable database and delivered a user-friendly frontend interface for the dApp.",
    achievements: [
      "Defined technical requirements and led the delivery of a presale campaign across eight major EVM-compatible blockchains",
      "Implemented a secure oracle system to fetch and verify off-chain data, reducing data fetch times by 40%",
      "Developed and deployed smart contracts with 25% gas optimization using Solidity and TypeScript",
      "Led technical design and implementation of backend systems with Node.js and NoSQL databases",
      "Implemented advanced caching mechanisms to improve dApp performance by 35%",
      "Integrated CI/CD pipelines reducing deployment times by 30%"
    ]
  },
  {
    title: "Blockchain Technical Reviewer",
    company: "Packt",
    period: "Sep 2023 - Mar 2024",
    description: "Reviewed the book 'Developing Blockchain Solutions in the Cloud', improving 15+ chapters with 30+ code corrections aligned with AWS, Azure, Hyperledger, and Ethereum standards.",
    achievements: [
      "Provided technical feedback improving accuracy and depth of over 15 chapters on blockchain technologies",
      "Suggested over 30 code corrections and content enhancements for cloud blockchain implementations",
      "Validated cloud-based blockchain architectures and consensus mechanisms for production environments",
      "Ensured code samples adhered to industry best practices for security and optimization",
      "Collaborated with authors to clarify complex blockchain concepts for readers"
    ]
  },
  {
    title: "Blockchain Developer",
    company: "Aetlas",
    period: "Nov 2023 - Feb 2024",
    description: "Developed an upgradable DeFi system using Solidity with ERC20-compliant token pool management for carbon offset tokens and environmental assets.",
    achievements: [
      "Designed core development logic for multi-asset AMM pools, reducing slippage by 15%",
      "Engineered AMM protocol using Balancer's spot and effective price formulas for carbon assets",
      "Guided team in Chainlink Hackathon and implemented wrapped MRV standard for on-chain verification",
      "Collaborated with founding team on protocol logic alignment and governance structure",
      "Integrated latest advancements in smart contract security and audit preparation"
    ]
  },
  {
    title: "Blockchain Engineer",
    company: "BlockTrust",
    period: "Oct 2022 - Jan 2024",
    description: "Developed NFT smart contracts generating revenue per auction, improved modularity by 40% using Diamond Proxy patterns, and optimized gas usage by 25% while ensuring compliance with ERC standards.",
    achievements: [
      "Designed and developed NFT smart contracts for collectibles within EVM-compatible chains",
      "Led R&D efforts on NFT contract architectures and proxy patterns for upgradability",
      "Delivered rapid MVP solution for NFT auction platform with royalty management",
      "Optimized smart contract gas consumption by 25% through storage optimization",
      "Collaborated across multiple teams and mentored junior developers on blockchain standards"
    ]
  },
  {
    title: "Solidity Developer",
    company: "1000Geeks",
    period: "May 2022 - Oct 2022",
    description: "Integrated blockchain components using microservices architecture, reducing deployment times by 15% and implementing robust testing frameworks for smart contract validation.",
    achievements: [
      "Supported multiple NFT projects with smart contract development and deployment",
      "Implemented efficient version control systems and documentation workflows",
      "Reduced gas consumption per transaction by 10% through code optimization",
      "Participated in peer code reviews and maintained high code quality standards",
      "Designed and implemented token distribution mechanisms for project launches"
    ]
  }
];

export const projects: Project[] = [
  {
    title: "Tacitus Swap",
    period: "Jan 2023 - Present",
    description: "A sophisticated fork of Uniswap with custom Tacitus implementations, featuring an enhanced user interface with modern design elements. The platform incorporates a distinctive digital rain animation for a cyberpunk aesthetic, while maintaining the robust trading functionality of the original DEX. Supports multiple chains and token swaps with optimized transaction processing.",
    links: {
      github: "https://github.com/TacitusXI/tacitus-swap",
      live: "https://swap.tacitvs.eth.limo/"
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
    period: "Mar 2024 - Present",
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
    period: "Jan 2024 - Present",
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
    period: "Nov 2021 - Mar 2023",
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
    period: "Jan 2022 - Mar 2023",
    description: "A collection of unique NFT mutant robots featuring an interactive frontend interface and marketplace. Each robot can be modified and reassembled to create entirely new configurations using interchangeable parts, offering over 999 trillion potential combinations for collectors and enthusiasts.",
    links: {
      github: "https://github.com/TacitusXI/TechnoirClub-Marketplace"
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
    period: "Dec 2023 - Jan 2024",
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
    items: ["Back-End Development", "Front-End Development", "Database Management"]
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
  bio: "Blockchain developer | Solidity",
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