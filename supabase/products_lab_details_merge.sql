-- Merge Product Details, Nutritional Facts (per 100g), and NABL Lab Reports into public.products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS ingredients text,
  ADD COLUMN IF NOT EXISTS purity_processing text,
  ADD COLUMN IF NOT EXISTS storage_shelf_life text,
  ADD COLUMN IF NOT EXISTS farm_origin text,
  ADD COLUMN IF NOT EXISTS nutrition_info jsonb,
  ADD COLUMN IF NOT EXISTS lab_report jsonb;

-- 1) Mango Powder (Amchur Powder) - id = 11 - Report PCL/NN/2026-27/K2090/4 (15/09/2026)
UPDATE public.products SET
  ingredients = '100% Sun-Dried Raw Green Mango (Amchur), Cold-Milled',
  nutrition_info = '{"moisture":"0.88%","ash":"1.22%","energy_kcal":15,"total_fat_g":0,"saturated_fat_g":0,"trans_fat_g":0,"carbohydrates_g":0,"dietary_fibre_g":0,"added_sugar_g":0,"protein_g":0,"cholesterol_mg":0}'::jsonb,
  lab_report = '{"lab":"Prodcontrol (India) Private Limited","nabl_cert":"TC 7415","report_no":"PCL/NN/2026-27/K2090/4","test_date":"15/09/2026","total_plate_count":"10 CFU/g (<10^3)","ecoli":"Absent","salmonella":"Absent","yeast_mold":"Absent","heavy_metals":"NOT DETECTED","status":"Fit for Human Consumption"}'::jsonb
WHERE id = 11;

-- 2) Chalkumro Powder (Ash Gourd / Chal Kumra Powder) - id = 13 - Report PCL/NN/2026-27/K2090/6 (15/09/2026)
UPDATE public.products SET
  ingredients = '100% Dehydrated Ash Gourd (Chal Kumra), Cold-Milled',
  nutrition_info = '{"moisture":"0.76%","ash":"1.02%","energy_kcal":15,"total_fat_g":0,"saturated_fat_g":0,"trans_fat_g":0,"carbohydrates_g":3.0,"dietary_fibre_g":3.0,"added_sugar_g":13.5,"protein_g":0,"cholesterol_mg":0,"calcium_mg":20,"sodium_mg":110,"iron_mg":0.4,"potassium_mg":75}'::jsonb,
  lab_report = '{"lab":"Prodcontrol (India) Private Limited","nabl_cert":"TC 7415","report_no":"PCL/NN/2026-27/K2090/6","test_date":"15/09/2026","total_plate_count":"28 CFU/g (<10^3)","ecoli":"Absent","salmonella":"Absent","yeast_mold":"Absent","heavy_metals":"NOT DETECTED","status":"Fit for Human Consumption"}'::jsonb
WHERE id = 13;

-- 3) Lemon Powder (Kagji Lime Powder) - id = 14 - Report PCL/NN/2026-27/K2090/5 (15/09/2026)
UPDATE public.products SET
  ingredients = '100% Dehydrated Kagji Lime, Cold-Milled',
  nutrition_info = '{"moisture":"0.80%","ash":"1.20%","energy_kcal":54,"total_fat_g":0,"saturated_fat_g":0,"trans_fat_g":0,"carbohydrates_g":13.5,"dietary_fibre_g":0,"added_sugar_g":13.5,"protein_g":0,"cholesterol_mg":0,"calcium_mg":7.5,"sodium_mg":142.5,"potassium_mg":75,"magnesium_mg":9,"chloride_mg":165}'::jsonb,
  lab_report = '{"lab":"Prodcontrol (India) Private Limited","nabl_cert":"TC 7415","report_no":"PCL/NN/2026-27/K2090/5","test_date":"15/09/2026","total_plate_count":"28 CFU/g (<10^3)","ecoli":"Absent","salmonella":"Absent","yeast_mold":"Absent","heavy_metals":"NOT DETECTED","status":"Fit for Human Consumption"}'::jsonb
WHERE id = 14;

-- 4) Moringa Powder - id = 15 - Report PCL/NN/2026-27/K2090/2 (15/09/2026)
UPDATE public.products SET
  ingredients = '100% Shade-Dried Organic Moringa Oleifera Leaves, Cold-Milled',
  nutrition_info = '{"moisture":"1.88%","ash":"2.01%","energy_kcal":355,"total_fat_g":4.99,"saturated_fat_g":2.0,"trans_fat_g":0.1,"carbohydrates_g":55.0,"dietary_fibre_g":0,"added_sugar_g":0,"protein_g":22.0,"cholesterol_mg":0,"calcium_mg":3562,"sodium_mg":343,"iron_mg":63,"vitamin_c_mg":33,"potassium_mg":976,"magnesium_mg":847,"manganese_mg":11}'::jsonb,
  lab_report = '{"lab":"Prodcontrol (India) Private Limited","nabl_cert":"TC 7415","report_no":"PCL/NN/2026-27/K2090/2","test_date":"15/09/2026","total_plate_count":"400 CFU/g (<10^3)","ecoli":"50 CFU/g","salmonella":"Absent","yeast_mold":"Absent","heavy_metals":"NOT DETECTED","status":"Fit for Human Consumption"}'::jsonb
WHERE id = 15;

-- 5) Okra Powder - id = 17 - Report PCL/NN/2026-27/K2090/3 (15/09/2026)
UPDATE public.products SET
  ingredients = '100% Dehydrated Green Okra (Bhindi), Cold-Milled',
  nutrition_info = '{"moisture":"0.88%","ash":"1.22%","energy_kcal":33,"total_fat_g":0.19,"saturated_fat_g":0,"trans_fat_g":0,"carbohydrates_g":7.46,"dietary_fibre_g":3.3,"added_sugar_g":0,"protein_g":1.9,"cholesterol_mg":0,"calcium_mg":82,"sodium_mg":7,"iron_mg":0.62,"phosphorous_mg":61,"zinc_mg":0.58,"vitamin_c_mg":23,"vitamin_a_mcg":36,"vitamin_e_mcg":0.27,"vitamin_k_mcg":31.3,"potassium_mg":299,"magnesium_mg":57}'::jsonb,
  lab_report = '{"lab":"Prodcontrol (India) Private Limited","nabl_cert":"TC 7415","report_no":"PCL/NN/2026-27/K2090/3","test_date":"15/09/2026","total_plate_count":"200 CFU/g (<10^3)","ecoli":"20 CFU/g (<20)","salmonella":"Absent","yeast_mold":"Absent","heavy_metals":"NOT DETECTED","status":"Fit for Human Consumption"}'::jsonb
WHERE id = 17;

-- 6) Kulekhara Powder - id = 18 - Report PCL/NN/2026-27/K2090/7 (15/09/2026)
UPDATE public.products SET
  ingredients = '100% Shade-Dried Kulekhara Leaves (Hygrophila auriculata), Cold-Milled',
  nutrition_info = '{"moisture":"0.80%","ash":"1.20%","energy_kcal":20,"total_fat_g":0,"saturated_fat_g":0,"trans_fat_g":0,"carbohydrates_g":3.5,"dietary_fibre_g":2.0,"added_sugar_g":0,"protein_g":1.0,"cholesterol_mg":0,"vitamin_k_mcg":168}'::jsonb,
  lab_report = '{"lab":"Prodcontrol (India) Private Limited","nabl_cert":"TC 7415","report_no":"PCL/NN/2026-27/K2090/7","test_date":"15/09/2026","total_plate_count":"28 CFU/g (<10^3)","ecoli":"Absent","salmonella":"Absent","yeast_mold":"Absent","heavy_metals":"NOT DETECTED","status":"Fit for Human Consumption"}'::jsonb
WHERE id = 18;

-- 7) Beet Root Powder (if present by name in public.products) - Report PCL/NN/2026-27/K2090/1 (15/09/2026)
UPDATE public.products SET
  ingredients = '100% Dehydrated Red Beetroot, Cold-Milled',
  nutrition_info = '{"moisture":"1.86%","ash":"1.88%","energy_kcal":355,"total_fat_g":3.0,"saturated_fat_g":0,"trans_fat_g":0,"carbohydrates_g":73.52,"dietary_fibre_g":21.53,"added_sugar_g":0,"protein_g":12.38,"cholesterol_mg":0,"calcium_mg":128,"sodium_mg":624,"iron_mg":6.4}'::jsonb,
  lab_report = '{"lab":"Prodcontrol (India) Private Limited","nabl_cert":"TC 7415","report_no":"PCL/NN/2026-27/K2090/1","test_date":"15/09/2026","total_plate_count":"412 CFU/g (<10^3)","ecoli":"20 CFU/g (<20)","salmonella":"Absent","yeast_mold":"Absent","heavy_metals":"NOT DETECTED","status":"Fit for Human Consumption"}'::jsonb
WHERE name ILIKE '%Beet%';
