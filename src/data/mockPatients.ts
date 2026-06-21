import { Patient } from '../types';

const FIRST_NAMES_MALE = [
  'Amit', 'Rahul', 'Arjun', 'Karan', 'Vijay', 'Sanjay', 'Rajesh', 'Sunil', 'Vikram', 'Anil',
  'Deepak', 'Sandeep', 'Rohan', 'Ravi', 'Manoj', 'Ajay', 'Harish', 'Pankaj', 'Ashish', 'Aditya',
  'Ramesh', 'Suresh', 'Ganesh', 'Mahesh', 'Kshitij', 'Abhishek', 'Varun', 'Karthik', 'Siddharth',
  'Vivek', 'Manish', 'Dev', 'Alok', 'Yash', 'Mohit', 'Pranav', 'Gaurav', 'Aniket', 'Rakesh'
];

const FIRST_NAMES_FEMALE = [
  'Priya', 'Anjali', 'Sneha', 'Kiran', 'Neha', 'Pooja', 'Aarti', 'Shweta', 'Kirti', 'Preeti',
  'Rashmi', 'Deepa', 'Divya', 'Ritu', 'Sunita', 'Anita', 'Geeta', 'Jyoti', 'Meena', 'Rekha',
  'Kajal', 'Swati', 'Nisha', 'Vidya', 'Shruti', 'Archana', 'Madhavi', 'Pallavi', 'Tanuja',
  'Shalini', 'Rupali', 'Smita', 'Richa', 'Nidhi', 'Aditi', 'Rhea', 'Komal', 'Sonia', 'Megha'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Gupta', 'Mehta', 'Patel', 'Joshi', 'Iyer', 'Nair', 'Rao', 'Reddy',
  'Choudhury', 'Das', 'Sen', 'Roy', 'Banerjee', 'Mishra', 'Pandey', 'Trivedi', 'Saxena',
  'Deshmukh', 'Kulkarni', 'Patil', 'Bose', 'Kumar', 'Singh', 'Yadav', 'Prasad', 'Naidu',
  'Pillai', 'Menon', 'Bhat', 'Hegde', 'Gowda', 'Shetty', 'Joshi', 'Dubey', 'Tripathi', 'Acharya'
];

const CITIES = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad',
  'Jaipur', 'Lucknow', 'Chandigarh', 'Patna', 'Kochi', 'Indore', 'Nagpur', 'Bhopal',
  'Visakhapatnam', 'Surat', 'Coimbatore', 'Thiruvananthapuram', 'Guwahati', 'Bhubaneswar'
];

interface MedicalMapping {
  condition: string;
  procedure: string;
  baseCost: number;
  avgStay: number; // in days
}

const MEDICAL_MAPPINGS: MedicalMapping[] = [
  { condition: 'Coronary Artery Disease', procedure: 'Angioplasty & Stent', baseCost: 150000, avgStay: 4 },
  { condition: 'Hypertension', procedure: 'Cardiorespiratory Evaluation', baseCost: 4500, avgStay: 1 },
  { condition: 'Type 2 Diabetes', procedure: 'HBA1C & Metabolic Panel', baseCost: 2500, avgStay: 0 },
  { condition: 'Appendicitis', procedure: 'Laparoscopic Appendectomy', baseCost: 65000, avgStay: 3 },
  { condition: 'Pneumonia', procedure: 'Nebulization & IV Antibiotics', baseCost: 18000, avgStay: 5 },
  { condition: 'Migraine', procedure: 'Brain MRI & EEG Scan', baseCost: 12000, avgStay: 1 },
  { condition: 'Rheumatoid Arthritis', procedure: 'Joint Infiltration Therapy', baseCost: 22000, avgStay: 2 },
  { condition: 'Pediatric Asthma', procedure: 'Pulmonary Function & Nebulizer', baseCost: 3500, avgStay: 1 },
  { condition: 'Cataract', procedure: 'Phacoemulsification Eye Surgery', baseCost: 40000, avgStay: 1 },
  { condition: 'Kidney Stones', procedure: 'Laser Lithotripsy Procedure', baseCost: 85000, avgStay: 2 },
  { condition: 'Osteoarthritis Knee', procedure: 'Intra-articular PRP Injection', baseCost: 35000, avgStay: 1 },
  { condition: 'Gastroenteritis', procedure: 'Saline Hydration & IV Anti-infectives', baseCost: 7500, avgStay: 2 },
  { condition: 'Lumbar Herniation', procedure: 'Microdiscectomy Surgery', baseCost: 180000, avgStay: 5 },
  { condition: 'Depressive Episode', procedure: 'Cognitive Session & Pharmacotherapy', baseCost: 3000, avgStay: 0 },
  { condition: 'Hypothyroidism', procedure: 'Hormonal Profile & Diet Evaluation', baseCost: 1800, avgStay: 0 },
  { condition: 'Anemia', procedure: 'Ferrous Infusion Therapy', baseCost: 6000, avgStay: 2 },
];

export function generateMockPatients(): Patient[] {
  const patients: Patient[] = [];

  // Seeded Random Helper to keep it strict and deterministic
  let seed = 12345;
  function random() {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  function getRandomElement<T>(arr: T[]): T {
    const idx = Math.floor(random() * arr.length);
    return arr[idx];
  }

  function getRandomRange(min: number, max: number): number {
    return Math.floor(random() * (max - min + 1)) + min;
  }

  for (let i = 1; i <= 200; i++) {
    const isMale = random() > 0.45;
    const gender = isMale ? 'Male' : 'Female';
    const first = isMale ? getRandomElement(FIRST_NAMES_MALE) : getRandomElement(FIRST_NAMES_FEMALE);
    const last = getRandomElement(LAST_NAMES);
    const name = `${first} ${last}`;

    const age = getRandomRange(3, 85);
    const city = getRandomElement(CITIES);
    
    // Generate authentic phone (Indian format +91 9xxxxxxxxx)
    const phone = `+91 ${getRandomRange(70000, 99999)} ${getRandomRange(10000, 99999)}`;
    const address = `Flat No. ${getRandomRange(1, 120)}, Block ${String.fromCharCode(65 + getRandomRange(0, 5))}, Sector ${getRandomRange(1, 24)}, ${city}`;
    
    // Map patient condition to a deterministic procedure & pricing
    const mapping = getRandomElement(MEDICAL_MAPPINGS);
    
    // Add variations to cost (+/- 15%)
    const costVariation = (random() * 0.3 - 0.15) * mapping.baseCost;
    const finalCost = Math.round(mapping.baseCost + costVariation);

    const lengthOfStay = mapping.avgStay === 0 ? 0 : Math.max(1, Math.round(mapping.avgStay + (random() * 3 - 1.5)));
    const readmissionFlag = random() < 0.12; // 12% readmission rate
    const outcome = getRandomElement(['Recovered', 'Improved', 'Stable', 'Critical']) as Patient['outcome'];
    const satisfactionScore = getRandomRange(4, 5); // Patients generally report 4 or 5 star in this premium setup

    patients.push({
      id: `pat-${i}`,
      name,
      age,
      gender,
      phone,
      city,
      address,
      condition: mapping.condition,
      procedure: mapping.procedure,
      cost: finalCost,
      lengthOfStay,
      readmissionFlag,
      outcome,
      satisfactionScore,
    });
  }

  return patients;
}
