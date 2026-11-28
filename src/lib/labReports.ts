export interface ProductLabDetails {
  ingredients: string;
  nutrition_info: Record<string, string | number>;
  lab_report: {
    lab: string;
    nabl_cert: string;
    report_no: string;
    test_date: string;
    total_plate_count: string;
    ecoli: string;
    salmonella: string;
    yeast_mold: string;
    heavy_metals: string;
    status: string;
  };
}

/**
 * Verified NABL (TC 7415) Prodcontrol (India) Private Limited lab test results
 * dated 15/09/2026, keyed by product ID.
 */
export const PRODUCT_LAB_DETAILS: Record<number, ProductLabDetails> = {
  11: {
    ingredients: '100% Sun-Dried Raw Green Mango (Amchur), Cold-Milled',
    nutrition_info: {
      moisture: '0.88%',
      ash: '1.22%',
      energy_kcal: 15,
      total_fat_g: 0,
      saturated_fat_g: 0,
      trans_fat_g: 0,
      carbohydrates_g: 0,
      dietary_fibre_g: 0,
      added_sugar_g: 0,
      protein_g: 0,
      cholesterol_mg: 0
    },
    lab_report: {
      lab: 'Prodcontrol (India) Private Limited',
      nabl_cert: 'TC 7415',
      report_no: 'PCL/NN/2026-27/K2090/4',
      test_date: '15/09/2026',
      total_plate_count: '10 CFU/g (<10^3)',
      ecoli: 'Absent',
      salmonella: 'Absent',
      yeast_mold: 'Absent',
      heavy_metals: 'NOT DETECTED',
      status: 'Fit for Human Consumption'
    }
  },
  13: {
    ingredients: '100% Dehydrated Ash Gourd (Chal Kumra), Cold-Milled',
    nutrition_info: {
      moisture: '0.76%',
      ash: '1.02%',
      energy_kcal: 15,
      total_fat_g: 0,
      saturated_fat_g: 0,
      trans_fat_g: 0,
      carbohydrates_g: 3.0,
      dietary_fibre_g: 3.0,
      added_sugar_g: 13.5,
      protein_g: 0,
      cholesterol_mg: 0,
      calcium_mg: 20,
      sodium_mg: 110,
      iron_mg: 0.4,
      potassium_mg: 75
    },
    lab_report: {
      lab: 'Prodcontrol (India) Private Limited',
      nabl_cert: 'TC 7415',
      report_no: 'PCL/NN/2026-27/K2090/6',
      test_date: '15/09/2026',
      total_plate_count: '28 CFU/g (<10^3)',
      ecoli: 'Absent',
      salmonella: 'Absent',
      yeast_mold: 'Absent',
      heavy_metals: 'NOT DETECTED',
      status: 'Fit for Human Consumption'
    }
  },
  14: {
    ingredients: '100% Dehydrated Kagji Lime, Cold-Milled',
    nutrition_info: {
      moisture: '0.80%',
      ash: '1.20%',
      energy_kcal: 54,
      total_fat_g: 0,
      saturated_fat_g: 0,
      trans_fat_g: 0,
      carbohydrates_g: 13.5,
      dietary_fibre_g: 0,
      added_sugar_g: 13.5,
      protein_g: 0,
      cholesterol_mg: 0,
      calcium_mg: 7.5,
      sodium_mg: 142.5,
      potassium_mg: 75,
      magnesium_mg: 9,
      chloride_mg: 165
    },
    lab_report: {
      lab: 'Prodcontrol (India) Private Limited',
      nabl_cert: 'TC 7415',
      report_no: 'PCL/NN/2026-27/K2090/5',
      test_date: '15/09/2026',
      total_plate_count: '28 CFU/g (<10^3)',
      ecoli: 'Absent',
      salmonella: 'Absent',
      yeast_mold: 'Absent',
      heavy_metals: 'NOT DETECTED',
      status: 'Fit for Human Consumption'
    }
  },
  15: {
    ingredients: '100% Shade-Dried Organic Moringa Oleifera Leaves, Cold-Milled',
    nutrition_info: {
      moisture: '1.88%',
      ash: '2.01%',
      energy_kcal: 355,
      total_fat_g: 4.99,
      saturated_fat_g: 2.0,
      trans_fat_g: 0.1,
      carbohydrates_g: 55.0,
      dietary_fibre_g: 0,
      added_sugar_g: 0,
      protein_g: 22.0,
      cholesterol_mg: 0,
      calcium_mg: 3562,
      sodium_mg: 343,
      iron_mg: 63,
      vitamin_c_mg: 33,
      potassium_mg: 976,
      magnesium_mg: 847,
      manganese_mg: 11
    },
    lab_report: {
      lab: 'Prodcontrol (India) Private Limited',
      nabl_cert: 'TC 7415',
      report_no: 'PCL/NN/2026-27/K2090/2',
      test_date: '15/09/2026',
      total_plate_count: '400 CFU/g (<10^3)',
      ecoli: '50 CFU/g',
      salmonella: 'Absent',
      yeast_mold: 'Absent',
      heavy_metals: 'NOT DETECTED',
      status: 'Fit for Human Consumption'
    }
  },
  17: {
    ingredients: '100% Dehydrated Green Okra (Bhindi), Cold-Milled',
    nutrition_info: {
      moisture: '0.88%',
      ash: '1.22%',
      energy_kcal: 33,
      total_fat_g: 0.19,
      saturated_fat_g: 0,
      trans_fat_g: 0,
      carbohydrates_g: 7.46,
      dietary_fibre_g: 3.3,
      added_sugar_g: 0,
      protein_g: 1.9,
      cholesterol_mg: 0,
      calcium_mg: 82,
      sodium_mg: 7,
      iron_mg: 0.62,
      phosphorous_mg: 61,
      zinc_mg: 0.58,
      vitamin_c_mg: 23,
      vitamin_a_mcg: 36,
      vitamin_e_mcg: 0.27,
      vitamin_k_mcg: 31.3,
      potassium_mg: 299,
      magnesium_mg: 57
    },
    lab_report: {
      lab: 'Prodcontrol (India) Private Limited',
      nabl_cert: 'TC 7415',
      report_no: 'PCL/NN/2026-27/K2090/3',
      test_date: '15/09/2026',
      total_plate_count: '200 CFU/g (<10^3)',
      ecoli: '20 CFU/g (<20)',
      salmonella: 'Absent',
      yeast_mold: 'Absent',
      heavy_metals: 'NOT DETECTED',
      status: 'Fit for Human Consumption'
    }
  },
  18: {
    ingredients: '100% Shade-Dried Kulekhara Leaves (Hygrophila auriculata), Cold-Milled',
    nutrition_info: {
      moisture: '0.80%',
      ash: '1.20%',
      energy_kcal: 20,
      total_fat_g: 0,
      saturated_fat_g: 0,
      trans_fat_g: 0,
      carbohydrates_g: 3.5,
      dietary_fibre_g: 2.0,
      added_sugar_g: 0,
      protein_g: 1.0,
      cholesterol_mg: 0,
      vitamin_k_mcg: 168
    },
    lab_report: {
      lab: 'Prodcontrol (India) Private Limited',
      nabl_cert: 'TC 7415',
      report_no: 'PCL/NN/2026-27/K2090/7',
      test_date: '15/09/2026',
      total_plate_count: '28 CFU/g (<10^3)',
      ecoli: 'Absent',
      salmonella: 'Absent',
      yeast_mold: 'Absent',
      heavy_metals: 'NOT DETECTED',
      status: 'Fit for Human Consumption'
    }
  }
};
