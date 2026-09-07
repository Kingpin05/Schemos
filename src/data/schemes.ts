import { SchemeData } from '../types';

export const OFFICIAL_SCHEMES: SchemeData[] = [
  {
    id: 'pm-kisan',
    name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    shortName: 'PM-KISAN',
    ministry: 'Ministry of Agriculture and Farmers Welfare',
    state: 'All India',
    category: 'Agriculture & Rural',
    summary: 'Direct income support of ₹6,000 per year in three equal 4-monthly installments of ₹2,000 directly to bank accounts of landholding farmer families.',
    financialValue: '₹6,000 per annum (Direct Benefit Transfer)',
    officialUrl: 'https://pmkisan.gov.in',
    departmentPortal: 'Department of Agriculture & Farmers Welfare (Agriwelfare)',
    guidelineDocument: 'PM-KISAN Operational Guidelines Rev. 2023, Clause 2.1-4.2',
    lastUpdated: 'January 2025',
    hardRules: {
      minAge: 18,
      allowedOccupations: ['farmer', 'agricultural_worker', 'self_employed'],
      requiresLandholding: true,
      maxLandholdingAcres: 50, // All cultivable landholding farmer families are eligible (earlier 2 hectares limit removed)
      maxIncome: 1000000,
    },
    benefits: [
      '₹6,000 yearly financial benefit transferred directly via Aadhaar-seeded bank account',
      'Disbursed in three 4-monthly tranches of ₹2,000 each',
      'Provides liquidity to procure agricultural inputs, seeds, and fertilizers'
    ],
    requiredDocuments: [
      'Aadhaar Card (e-KYC biometric or OTP verified)',
      'Land Ownership Record (RoR / Record of Rights / Khata / Pahani)',
      'Aadhaar-seeded Bank Account passbook with IFSC code',
      'Active Mobile Number linked to Aadhaar'
    ],
    applicationProcedure: [
      'Navigate to Farmers Corner at official portal pmkisan.gov.in',
      'Select "New Farmer Registration" and verify Aadhaar and state',
      'Upload landholding Khata/Survey number and land registration certificate',
      'Complete mandatory e-KYC via facial recognition or OTP',
      'Alternatively visit local Common Service Centre (CSC) or Village Nodal Officer'
    ],
    chunks: [
      {
        chunkId: 'pmk-el-01',
        section: 'Eligibility',
        content: 'All landholding farmer families who have cultivable landholding in their names are eligible to receive benefit under the scheme, subject to exclusion criteria. Institutional landholders, former and present holders of constitutional posts, and persons who paid income tax in last assessment year are excluded.',
        sourceDoc: 'PM-KISAN Guidelines',
        pageOrClause: 'Clause 3.1 & 3.2'
      },
      {
        chunkId: 'pmk-ben-02',
        section: 'Benefits',
        content: 'Under PM-KISAN, financial assistance of Rs. 6000/- per year is provided to all eligible landholder farmer families across the country in three equal four-monthly installments of Rs. 2000/- directly transferred through Direct Benefit Transfer (DBT) into bank accounts.',
        sourceDoc: 'PM-KISAN Scheme Document',
        pageOrClause: 'Section 2: Quantum of Assistance'
      },
      {
        chunkId: 'pmk-doc-03',
        section: 'Documents',
        content: 'Mandatory prerequisites include Aadhaar card, valid land possession document showing cultivable land, active bank account seeded with Aadhaar, and biometric or mobile OTP e-KYC. Land records must be validated by State revenue officials.',
        sourceDoc: 'Standard Operating Procedure (SOP) v4',
        pageOrClause: 'Annexure B'
      }
    ]
  },
  {
    id: 'pm-kmy',
    name: 'Pradhan Mantri Kisan Maandhan Yojana (PM-KMY)',
    shortName: 'PM-KMY Pension',
    ministry: 'Ministry of Agriculture and Farmers Welfare / LIC of India',
    state: 'All India',
    category: 'Agriculture & Rural',
    summary: 'Contributory pension scheme for small and marginal farmers (SMFs) offering an assured minimum monthly pension of ₹3,000 upon reaching 60 years of age.',
    financialValue: '₹3,000 / month assured pension after age 60',
    officialUrl: 'https://maandhan.in',
    departmentPortal: 'Ministry of Agriculture / Life Insurance Corporation of India',
    guidelineDocument: 'PM-KMY Gazette Notification No. 12/2019',
    lastUpdated: 'November 2024',
    hardRules: {
      minAge: 18,
      maxAge: 40, // Strict rule: age must be between 18 and 40!
      allowedOccupations: ['farmer'],
      requiresLandholding: true,
      maxLandholdingAcres: 5.0, // Strictly for Small & Marginal Farmers (up to 2 hectares / ~5 acres)
      maxIncome: 500000,
    },
    benefits: [
      'Assured pension of ₹3,000 per month on attaining the age of 60 years',
      '50% monthly contribution matched equally by the Central Government',
      'In case of demise, spouse entitled to 50% family pension (₹1,500/month)',
      'Option to allow monthly premium auto-debit directly from PM-KISAN DBT benefit'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Savings Bank Account passbook with IFSC code',
      'Landholding documents showing cultivable land up to 2 hectares (5 acres)',
      'Nominee details form'
    ],
    applicationProcedure: [
      'Visit nearest Common Services Center (CSC) with Aadhaar and bank details',
      'VLE enrolls farmer through maandhan.in portal',
      'Initial monthly contribution (between ₹55 to ₹200 depending on age of entry) paid at counter',
      'Auto-debit mandate signed and Kisan Pension Card generated'
    ],
    chunks: [
      {
        chunkId: 'pmkmy-el-01',
        section: 'Eligibility',
        content: 'Small and Marginal Farmers having cultivable land up to 2 hectares (5 acres) as per land records of the concerned State/UT, aged between 18 and 40 years are eligible. Farmers aged 41 and above are strictly ineligible to enter the fund.',
        sourceDoc: 'PM-KMY Guidelines',
        pageOrClause: 'Para 4: Age Criterion'
      },
      {
        chunkId: 'pmkmy-ben-02',
        section: 'Benefits',
        content: 'Provides social security to vulnerable farmers during old age with assured minimum pension of Rs. 3,000 per month upon reaching 60 years of age. Government provides matching 100% co-contribution to the pension corpus.',
        sourceDoc: 'Pension Fund Rules LIC',
        pageOrClause: 'Rule 8'
      }
    ]
  },
  {
    id: 'ayushman-bharat',
    name: 'Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)',
    shortName: 'PM-JAY Health Cover',
    ministry: 'Ministry of Health and Family Welfare / National Health Authority',
    state: 'All India',
    category: 'Healthcare',
    summary: 'Worlds largest government-funded health assurance scheme, providing health insurance coverage of ₹5,00,000 per family per year for secondary and tertiary care hospitalization.',
    financialValue: '₹5,00,000 per family per year cashless health cover',
    officialUrl: 'https://pmjay.gov.in',
    departmentPortal: 'National Health Authority (NHA)',
    guidelineDocument: 'NHA PMJAY Operational Guidelines 3.0',
    lastUpdated: 'February 2025',
    hardRules: {
      minAge: 0,
      maxAge: 120,
      maxIncome: 350000,
    },
    benefits: [
      'Cashless and paperless inpatient access at all empaneled public and private hospitals across India',
      'Covers up to 3 days pre-hospitalization and 15 days post-hospitalization diagnostics/medicines',
      'Covers ~1,949 medical packages including oncology, cardiac surgery, knee replacement, ICU care',
      'No restriction on family size, gender or age; senior citizens aged 70+ now receive additional dedicated ₹5 Lakh cover'
    ],
    requiredDocuments: [
      'Aadhaar Card or Government Photo ID',
      'Ration Card / BPL card / SECC confirmation letter',
      'Registered mobile number for OTP'
    ],
    applicationProcedure: [
      'Check eligibility online via beneficiary.nha.gov.in using Aadhaar/Ration card number',
      'Visit nearest empaneled hospital Ayushman Mitra desk or CSC centre',
      'Complete biometric e-KYC and download Ayushman Golden PVC Card instantly'
    ],
    chunks: [
      {
        chunkId: 'pmjay-el-01',
        section: 'Eligibility',
        content: 'Households identified under rural and urban deprivation criteria of SECC 2011, active NFSA ration card holders, and all senior citizens aged 70 years and above irrespective of income are eligible for Ayushman Bharat PMJAY.',
        sourceDoc: 'NHA Operational Framework',
        pageOrClause: 'Chapter 2, Clause 2.3'
      },
      {
        chunkId: 'pmjay-ben-02',
        section: 'Benefits',
        content: 'Entitles eligible families to health protection cover of Rs 5 Lakhs per annum on a family floater basis across over 29,000 empaneled hospitals across India with zero out-of-pocket expenses.',
        sourceDoc: 'PMJAY Benefit Package Manual',
        pageOrClause: 'Section 1.1'
      }
    ]
  },
  {
    id: 'pm-surya-ghar',
    name: 'PM Surya Ghar: Muft Bijli Yojana (Rooftop Solar Subsidy)',
    shortName: 'PM Surya Ghar Solar',
    ministry: 'Ministry of New and Renewable Energy',
    state: 'All India',
    category: 'Energy & Green',
    summary: 'National rooftop solar scheme providing central financial assistance up to ₹78,000 for installing grid-connected solar panels on residential homes, delivering up to 300 units of free electricity monthly.',
    financialValue: 'Direct subsidy up to ₹78,000 + ₹15,000/year electricity savings',
    officialUrl: 'https://pmsuryaghar.gov.in',
    departmentPortal: 'National Portal for Rooftop Solar (MNRE)',
    guidelineDocument: 'PM Surya Ghar Operational Guidelines 2024-25',
    lastUpdated: 'January 2025',
    hardRules: {
      minAge: 18,
      maxAge: 99,
    },
    benefits: [
      'Subsidy of ₹30,000 for 1 kW system, ₹60,000 for 2 kW, and ₹78,000 for 3 kW and higher systems',
      'Up to 300 units of free electricity each month by feeding excess solar energy back to DISCOM via net metering',
      'Low-interest collateral-free bank loans available at ~7% interest for remaining consumer cost'
    ],
    requiredDocuments: [
      'Latest Electricity Bill (DISCOM consumer connection number in applicant name)',
      'Aadhaar Card',
      'Proof of roof ownership / residential property document',
      'Bank Account Passbook / Cancelled Cheque'
    ],
    applicationProcedure: [
      'Register at national portal pmsuryaghar.gov.in with Electricity Consumer Number & DISCOM',
      'Apply for Rooftop Solar and receive DISCOM technical feasibility approval',
      'Get plant installed through any registered vendor with ALMM compliant solar modules',
      'Submit installation details for DISCOM inspection and net meter installation',
      'Receive central subsidy directly into bank account within 30 days of commissioning'
    ],
    chunks: [
      {
        chunkId: 'pmsg-el-01',
        section: 'Eligibility',
        content: 'All Indian residential households having an active electricity connection with the local DISCOM and suitable shadow-free roof space are eligible. Commercial and industrial connections are not eligible for the residential subsidy.',
        sourceDoc: 'MNRE Scheme Guidelines',
        pageOrClause: 'Section 3: Beneficiary Eligibility'
      },
      {
        chunkId: 'pmsg-ben-02',
        section: 'Benefits',
        content: 'Central Financial Assistance (CFA) is fixed at Rs. 30,000 per kW up to 2 kW, and Rs. 18,000 for the 3rd kW, capping at Rs. 78,000 for 3 kW and above. Net metering permits sale of surplus electricity back to DISCOM.',
        sourceDoc: 'MNRE Subsidy Structure Circular',
        pageOrClause: 'Table 1'
      }
    ]
  },
  {
    id: 'pm-svanidhi',
    name: 'PM Street Vendors AtmaNirbhar Nidhi (PM SVANidhi)',
    shortName: 'PM SVANidhi Microcredit',
    ministry: 'Ministry of Housing and Urban Affairs (MoHUA)',
    state: 'All India',
    category: 'Financial & Business',
    summary: 'Micro-credit collateral-free working capital loan scheme for urban street vendors, starting with ₹10,000 and scaling up to ₹50,000 with 7% interest subsidy and cashback on digital transactions.',
    financialValue: 'Collateral-free loans up to ₹50,000 + 7% interest subsidy',
    officialUrl: 'https://pmsvanidhi.mohua.gov.in',
    departmentPortal: 'Small Industries Development Bank of India (SIDBI) / MoHUA',
    guidelineDocument: 'MoHUA SVANidhi Scheme Manual v3.2',
    lastUpdated: 'December 2024',
    hardRules: {
      minAge: 18,
      allowedOccupations: ['street_vendor', 'artisan', 'self_employed', 'daily_wage', 'other'],
    },
    benefits: [
      'First tranche: Collateral-free working capital loan of up to ₹10,000 with 1-year repayment tenure',
      'Second tranche: ₹20,000 upon timely repayment of first loan; third tranche: up to ₹50,000',
      '7% annual interest subsidy credited directly to beneficiary bank account quarterly',
      'Monthly cashback up to ₹100 for conducting digital sales transactions (QR code)'
    ],
    requiredDocuments: [
      'Aadhaar Card linked with mobile number',
      'Certificate of Vending (CoV) / Identity Card issued by Urban Local Body (ULB) OR Letter of Recommendation (LoR)',
      'Bank Account passbook'
    ],
    applicationProcedure: [
      'Check vending status or obtain Letter of Recommendation from local Municipality/ULB',
      'Apply online on pmsvanidhi.mohua.gov.in or through Banking Mitra / CSC kiosk',
      'Select preferred Lending Institution (Public Sector Bank, RRB, NBFC or MFI)',
      'Sanction and disbursement processed directly to bank account within 10-15 business days'
    ],
    chunks: [
      {
        chunkId: 'pmsva-el-01',
        section: 'Eligibility',
        content: 'Street vendors in urban areas possessing Certificate of Vending or Identity Card issued by Urban Local Bodies (ULBs). Vendors left out in survey can apply with Letter of Recommendation (LoR) issued by ULB/Town Vending Committee.',
        sourceDoc: 'MoHUA SVANidhi Guidelines',
        pageOrClause: 'Para 2.1'
      }
    ]
  },
  {
    id: 'pm-vishwakarma',
    name: 'PM Vishwakarma Scheme',
    shortName: 'PM Vishwakarma',
    ministry: 'Ministry of Micro, Small and Medium Enterprises (MSME)',
    state: 'All India',
    category: 'Financial & Business',
    summary: 'Comprehensive scheme for traditional artisans and craftspersons across 18 trades providing PM Vishwakarma Certificate, skill training with ₹500/day stipend, ₹15,000 modern tool-kit incentive, and collateral-free enterprise credit at 5% interest.',
    financialValue: '₹15,000 toolkit voucher + collateral-free loans up to ₹3,00,000 @ 5%',
    officialUrl: 'https://pmvishwakarma.gov.in',
    departmentPortal: 'Ministry of MSME / Skill India Digital',
    guidelineDocument: 'PM Vishwakarma Central Guidelines 2023-28',
    lastUpdated: 'January 2025',
    hardRules: {
      minAge: 18,
      allowedOccupations: ['artisan', 'self_employed', 'daily_wage', 'other'],
    },
    benefits: [
      'Official recognition via PM Vishwakarma Certificate and Digital ID card',
      '5-7 days basic skill training with ₹500 daily allowance stipend',
      '₹15,000 e-voucher grant for purchasing modern toolkits',
      'Collateral-free enterprise credit: ₹1,00,000 in first tranche and ₹2,00,000 in second tranche at concessional 5% interest rate',
      'Digital transaction cashback incentives of ₹1 per transaction up to 100 transactions/month'
    ],
    requiredDocuments: [
      'Aadhaar Card and mobile number linked to Aadhaar',
      'Bank Account Passbook details',
      'Ration Card / Family details',
      'Self-declaration of traditional trade practice'
    ],
    applicationProcedure: [
      'Register at nearest CSC with biometric authentication on pmvishwakarma.gov.in',
      'Three-stage verification: Gram Panchayat / ULB level, District Implementation Committee, and Screening Committee',
      'Receive digital PM Vishwakarma Certificate and schedule skill training module'
    ],
    chunks: [
      {
        chunkId: 'pmvish-el-01',
        section: 'Eligibility',
        content: 'An artisan or craftsperson working with hands and tools in one of 18 family-based traditional trades (carpenter, blacksmith, goldsmith, potter, sculptor, cobbler, mason, basket weaver, tailor, etc.) aged 18+ years on date of registration is eligible. One member per family.',
        sourceDoc: 'PM Vishwakarma Scheme Document',
        pageOrClause: 'Clause 4: Target Beneficiaries'
      }
    ]
  },
  {
    id: 'pm-mudra',
    name: 'Pradhan Mantri MUDRA Yojana (PMMY)',
    shortName: 'MUDRA Loan',
    ministry: 'Ministry of Finance (Department of Financial Services)',
    state: 'All India',
    category: 'Financial & Business',
    summary: 'Institutional collateral-free micro loans up to ₹20 Lakhs to non-corporate, non-farm small and micro enterprises across Shishu, Kishore, Tarun, and Tarun Plus categories.',
    financialValue: 'Collateral-free business loans up to ₹20,00,000',
    officialUrl: 'https://www.mudra.org.in',
    departmentPortal: 'Department of Financial Services / Udyamitra',
    guidelineDocument: 'PMMY Operational Manual (Revised Union Budget 2024)',
    lastUpdated: 'December 2024',
    hardRules: {
      minAge: 18,
      maxAge: 65,
      allowedOccupations: ['self_employed', 'artisan', 'farmer', 'other'],
    },
    benefits: [
      'Shishu: Loans up to ₹50,000 for nascent startups',
      'Kishore: Loans from ₹50,001 up to ₹5,00,000 for business expansion',
      'Tarun: Loans from ₹5,00,001 up to ₹10,00,000',
      'Tarun Plus: Extended loan limit up to ₹20,00,000 for entrepreneurs who repaid previous Tarun loans',
      'No collateral required; credit guarantee cover provided by CGFMU'
    ],
    requiredDocuments: [
      'Proof of identity (Aadhaar / Voter ID / PAN Card)',
      'Proof of residence',
      'Business registration / Udyam Registration certificate (if existing)',
      'Bank statement for last 6 months',
      'Quotation of machinery/items to be purchased'
    ],
    applicationProcedure: [
      'Apply online via udyamimitra.in or JanSamarth portal jansamarth.in',
      'Or approach any commercial bank, RRB, Small Finance Bank or MFI directly',
      'Submit business proposal and quotation along with identity and KYC documents'
    ],
    chunks: [
      {
        chunkId: 'mudra-el-01',
        section: 'Eligibility',
        content: 'Any Indian citizen who has a business plan for a non-farm sector income generating activity such as manufacturing, processing, trading or service sector and whose credit need is up to Rs 20 Lakh can approach a Bank, MFI or NBFC under PMMY.',
        sourceDoc: 'MUDRA Product Note',
        pageOrClause: 'Para 1.2'
      }
    ]
  },
  {
    id: 'pm-awas-gramin',
    name: 'Pradhan Mantri Awas Yojana - Gramin (PMAY-G)',
    shortName: 'PMAY-Gramin Housing',
    ministry: 'Ministry of Rural Development',
    state: 'All India',
    category: 'Housing',
    summary: 'Pucca house with basic amenities to all houseless households and households living in kutcha and dilapidated houses in rural areas.',
    financialValue: '₹1,20,000 in plains / ₹1,30,000 in hilly states + 90 days MGNREGA wages',
    officialUrl: 'https://pmayg.nic.in',
    departmentPortal: 'AwaasSoft / Department of Rural Development',
    guidelineDocument: 'PMAY-G Framework for Implementation 2024-2029',
    lastUpdated: 'February 2025',
    hardRules: {
      minAge: 18,
      maxIncome: 250000,
    },
    benefits: [
      'Direct grant of ₹1,20,000 (plains) or ₹1,30,000 (hilly/North Eastern states) into beneficiary account in instalments tied to geo-tagged construction stages',
      'Additional 90/95 days of unskilled labour under MGNREGA (~₹25,000)',
      '₹12,000 assistance for toilet construction via Swachh Bharat Mission (Gramin)',
      'Convergent benefits: free LPG under PM Ujjwala and electricity under Saubhagya'
    ],
    requiredDocuments: [
      'Aadhaar Card of all family members',
      'MGNREGA Job Card number',
      'Aadhaar-linked Bank Account Passbook',
      'Kutcha house geotag photo and land possession certificate'
    ],
    applicationProcedure: [
      'Selection based on SECC 2011 & Awaas+ 2024 survey prioritized by Gram Sabha',
      'Registration by Gram Panchayat Secretary on AwaasSoft mobile app with geotagged site photo',
      'Sanction order issued by Block Development Officer (BDO)'
    ],
    chunks: [
      {
        chunkId: 'pmayg-el-01',
        section: 'Eligibility',
        content: 'Target beneficiaries include homeless households and those living in zero, one or two room houses with kutcha wall and kutcha roof. Households with motorized vehicle, mechanized agriculture equipment or government employee in household are excluded.',
        sourceDoc: 'PMAY-G Framework',
        pageOrClause: 'Section 3: Exclusion Criteria'
      }
    ]
  },
  {
    id: 'karnataka-raitha-siri',
    name: 'Karnataka Raitha Siri Scheme (Millet & Farmer Incentive)',
    shortName: 'Raitha Siri Karnataka',
    ministry: 'Department of Agriculture, Government of Karnataka',
    state: 'Karnataka',
    category: 'Agriculture & Rural',
    summary: 'Karnataka state-specific incentive offering ₹10,000 per hectare direct benefit transfer to farmers cultivating minor millets (Siri Dhanya) to promote climate-resilient sustainable agriculture.',
    financialValue: '₹10,000 per hectare (up to 2 hectares max: ₹20,000)',
    officialUrl: 'https://raitamitra.karnataka.gov.in',
    departmentPortal: 'K-KISAN / FRUITS Portal (Karnataka Government)',
    guidelineDocument: 'GoK Agriculture Order No. AGRI-2023-RS-88',
    lastUpdated: 'October 2024',
    hardRules: {
      minAge: 18,
      allowedOccupations: ['farmer'],
      allowedStates: ['Karnataka'],
      requiresLandholding: true,
      maxLandholdingAcres: 25,
    },
    benefits: [
      'Direct cash transfer of ₹10,000 per hectare into farmer bank account',
      'Max incentive of ₹20,000 for up to 2 hectares',
      'Guaranteed Minimum Support Price (MSP) procurement for millets (Ragi, Jowar, Foxtail millet)'
    ],
    requiredDocuments: [
      'FRUITS ID (Farmer Registration and Unified Beneficiary Information System Karnataka)',
      'Karnataka RTC / Pahani land record',
      'Aadhaar Card linked with Bank Account (NPCI mapped)'
    ],
    applicationProcedure: [
      'Register land details on FRUITS portal (fruits.karnataka.gov.in)',
      'Submit crop sowing declaration through Karnataka Crop Survey App',
      'Incentive credited automatically through DBT after village revenue officer verification'
    ],
    chunks: [
      {
        chunkId: 'kar-rs-01',
        section: 'Eligibility',
        content: 'Farmers owning cultivable land in Karnataka who have registered on the Karnataka FRUITS portal and sown notified minor millets (Navane, Same, Haraka, Korale, Baragu, Oodalu) are eligible.',
        sourceDoc: 'GoK Raitha Siri Guidelines',
        pageOrClause: 'Clause 3'
      }
    ]
  },
  {
    id: 'karnataka-gruha-lakshmi',
    name: 'Gruha Lakshmi Scheme (Karnataka Guarantee)',
    shortName: 'Gruha Lakshmi Karnataka',
    ministry: 'Department of Women & Child Development, Government of Karnataka',
    state: 'Karnataka',
    category: 'Women & Child',
    summary: 'Universal direct financial assistance of ₹2,000 per month directly to woman head of the family registered in Antyodaya, BPL and APL ration cards in Karnataka.',
    financialValue: '₹2,000 every month (₹24,000 per year)',
    officialUrl: 'https://sevasindhugs.karnataka.gov.in',
    departmentPortal: 'Seva Sindhu Portal Karnataka',
    guidelineDocument: 'GoK WCD Notification GS-GL-2023',
    lastUpdated: 'January 2025',
    hardRules: {
      minAge: 18,
      allowedGenders: ['female'],
      allowedStates: ['Karnataka'],
      maxIncome: 800000,
    },
    benefits: [
      '₹2,000 monthly cash assistance directly deposited into woman head of household bank account',
      'Continuous monthly financial empowerment for household expenses and child welfare'
    ],
    requiredDocuments: [
      'Karnataka Ration Card (RC) with applicant designated as Head of Family',
      'Aadhaar Card of Woman Head & Aadhaar Card of Spouse',
      'Aadhaar-seeded active bank account'
    ],
    applicationProcedure: [
      'Apply online via Seva Sindhu Guarantee Scheme Portal or Karnataka One / Grama One centre',
      'Slot booking via SMS or direct walk-in with Ration Card and Aadhaar',
      'Instant acknowledgement generated with monthly DBT confirmation'
    ],
    chunks: [
      {
        chunkId: 'kar-gl-01',
        section: 'Eligibility',
        content: 'Women designated as the head of the family in Antyodaya (AAY), BPL, or APL ration cards issued by Government of Karnataka are eligible. Women or their spouses who are government employees or income tax payees are excluded.',
        sourceDoc: 'Karnataka Seva Sindhu Gazette',
        pageOrClause: 'Section 4'
      }
    ]
  },
  {
    id: 'pm-fasal-bima',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    shortName: 'PMFBY Crop Insurance',
    ministry: 'Ministry of Agriculture and Farmers Welfare',
    state: 'All India',
    category: 'Agriculture & Rural',
    summary: 'Comprehensive crop insurance covering non-preventable natural risks from pre-sowing to post-harvest at ultra-low uniform farmer premium rates of 2% for Kharif, 1.5% for Rabi, and 5% for commercial/horticultural crops.',
    financialValue: 'Full sum insured reimbursement for crop yield loss',
    officialUrl: 'https://pmfby.gov.in',
    departmentPortal: 'National Crop Insurance Portal (NCIP)',
    guidelineDocument: 'PMFBY Revised Operational Guidelines Rev. IV',
    lastUpdated: 'November 2024',
    hardRules: {
      minAge: 18,
      allowedOccupations: ['farmer', 'agricultural_worker'],
      requiresLandholding: true,
    },
    benefits: [
      'Comprehensive risk coverage against drought, flood, inundation, pests, hailstorm, and post-harvest cyclone damage',
      'Farmer pays nominal premium (1.5% - 2%), balance 98% subsidy shared equally between Central and State Govt',
      'Direct claim settlement through satellite remote sensing and crop-cutting experiments'
    ],
    requiredDocuments: [
      'Land Record (RoR / RTC / Patta / Pahani) or valid tenant sharecropper agreement',
      'Crop Sowing Certificate issued by Patwari / Village Agriculture Assistant',
      'Aadhaar Card and Bank Account details'
    ],
    applicationProcedure: [
      'Enroll via pmfby.gov.in, Bank branch where KCC loan exists, or local CSC',
      'Cut-off date is typically 31st July for Kharif season and 31st December for Rabi season'
    ],
    chunks: [
      {
        chunkId: 'pmfby-el-01',
        section: 'Eligibility',
        content: 'All farmers growing notified crops in a notified area during the season who have insurable interest in the crop are eligible. Applicable to both loanee and non-loanee farmers.',
        sourceDoc: 'PMFBY Guidelines',
        pageOrClause: 'Clause 2'
      }
    ]
  },
  {
    id: 'sukanya-samriddhi',
    name: 'Sukanya Samriddhi Yojana (SSY)',
    shortName: 'Sukanya Samriddhi',
    ministry: 'Ministry of Finance (Department of Economic Affairs)',
    state: 'All India',
    category: 'Women & Child',
    summary: 'Government-backed high-interest savings scheme under Beti Bachao Beti Padhao campaign for the girl child, offering 8.2% annual compounded tax-free interest and Section 80C tax deduction.',
    financialValue: '8.2% sovereign guaranteed interest + tax exemption',
    officialUrl: 'https://www.indiapost.gov.in',
    departmentPortal: 'India Post / Reserve Bank of India',
    guidelineDocument: 'Sukanya Samriddhi Account Rules 2019 (Govt of India Gazette)',
    lastUpdated: 'January 2025',
    hardRules: {
      minAge: 18, // Parent opening account on behalf of girl child
    },
    benefits: [
      'Highest sovereign interest rate among small savings schemes (8.2% for Q1 2025)',
      'Triple Tax Exemption (EEE): Deposit, interest earned, and maturity proceeds are completely tax-free',
      'Partial withdrawal allowed up to 50% for higher education of girl child after age 18'
    ],
    requiredDocuments: [
      'Birth Certificate of the girl child',
      'Identity and address proof of parent/legal guardian (Aadhaar, PAN Card)',
      'Passport size photographs'
    ],
    applicationProcedure: [
      'Open account at any Post Office or authorized commercial bank branch with minimum deposit of ₹250',
      'Deposits can be made annually up to ₹1,50,000 for 15 years from account opening'
    ],
    chunks: [
      {
        chunkId: 'ssy-el-01',
        section: 'Eligibility',
        content: 'Account can be opened by natural or legal guardian in the name of a girl child from her birth till she attains age of 10 years. Maximum two accounts in a family for two girl children.',
        sourceDoc: 'SSY Scheme Rules',
        pageOrClause: 'Rule 3'
      }
    ]
  },
  {
    id: 'post-matric-scholarship',
    name: 'Post-Matric Scholarship for SC / ST / OBC Students',
    shortName: 'Post-Matric Scholarship',
    ministry: 'Ministry of Social Justice and Empowerment / Ministry of Tribal Affairs',
    state: 'All India',
    category: 'Education & Skill',
    summary: 'Centrally sponsored scholarship scheme providing 100% tuition fee reimbursement and monthly maintenance allowances to students from SC, ST, and OBC communities pursuing post-secondary education.',
    financialValue: 'Full tuition reimbursement + monthly maintenance allowance up to ₹13,500/yr',
    officialUrl: 'https://scholarships.gov.in',
    departmentPortal: 'National Scholarship Portal (NSP)',
    guidelineDocument: 'NSP Centrally Sponsored Scheme Guidelines 2024-25',
    lastUpdated: 'December 2024',
    hardRules: {
      minAge: 15,
      maxAge: 35,
      allowedOccupations: ['student'],
      allowedCategories: ['SC', 'ST', 'OBC', 'EWS'],
      maxIncome: 250000,
    },
    benefits: [
      'Complete reimbursement of non-refundable compulsory tuition fees charged by recognized institution',
      'Monthly maintenance allowance ranging from ₹4,000 to ₹13,500 per year based on course group and hosteller/day-scholar status',
      'Additional allowances for thesis typing, book grants, and study tour for technical students'
    ],
    requiredDocuments: [
      'Caste Certificate issued by competent revenue authority (Tahsildar)',
      'Income Certificate showing annual family income up to ₹2.5 Lakhs',
      'Marksheet of qualifying examination (10th/12th/Graduation)',
      'Fee receipt from admitted recognized college/university',
      'Aadhaar Card linked with active bank account'
    ],
    applicationProcedure: [
      'Register on National Scholarship Portal (scholarships.gov.in) with OTR (One Time Registration)',
      'Select Post-Matric Scholarship scheme and fill academic, caste, and institute details',
      'Institute verifies credentials online, followed by District Welfare Officer approval'
    ],
    chunks: [
      {
        chunkId: 'pms-el-01',
        section: 'Eligibility',
        content: 'Students belonging to SC/ST/OBC categories pursuing post-matriculation courses in recognized universities or colleges whose total parental/family annual income does not exceed Rs. 2,50,000 are eligible.',
        sourceDoc: 'Social Justice Scholarship Manual',
        pageOrClause: 'Section 4.1'
      }
    ]
  },
  {
    id: 'nsap-ignoaps',
    name: 'Indira Gandhi National Old Age Pension Scheme (IGNOAPS)',
    shortName: 'IGNOAPS Senior Pension',
    ministry: 'Ministry of Rural Development',
    state: 'All India',
    category: 'Social Welfare',
    summary: 'Non-contributory social security pension for senior citizens living below the poverty line (BPL), administered under the National Social Assistance Programme (NSAP).',
    financialValue: '₹200 to ₹1,000/month (central + state top-up up to ₹2,000/month)',
    officialUrl: 'https://nsap.nic.in',
    departmentPortal: 'National Social Assistance Programme Portal',
    guidelineDocument: 'NSAP Guidelines 2014 Rev. 2022',
    lastUpdated: 'August 2024',
    hardRules: {
      minAge: 60, // Must be 60 or above!
      maxIncome: 120000,
      requiresBPL: true,
    },
    benefits: [
      'Monthly direct cash assistance transferred to bank or post office account',
      '₹200/month central contribution for seniors aged 60-79 (states add ₹400-₹1800 top-up)',
      '₹500/month central contribution for seniors aged 80 and above'
    ],
    requiredDocuments: [
      'Age proof document (Aadhaar Card / Voter ID / Birth Certificate)',
      'BPL Card / Antyodaya Ration Card',
      'Aadhaar-seeded Bank or Post Office Account'
    ],
    applicationProcedure: [
      'Apply at local Gram Panchayat / Municipal Corporation office or via nsap.nic.in',
      'Verification conducted by Village Administrative Officer / Revenue Inspector',
      'Pension sanctioned by Sub-Divisional Officer (SDO)'
    ],
    chunks: [
      {
        chunkId: 'nsap-el-01',
        section: 'Eligibility',
        content: 'Applicants must be 60 years of age or older and must belong to a household living below the poverty line according to the criteria prescribed by the Government of India.',
        sourceDoc: 'NSAP Operational Guidelines',
        pageOrClause: 'Para 2: Old Age Pension'
      }
    ]
  }
];
