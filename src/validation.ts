export interface FormValues {
  uuid: string;
  batteryPercent: string;
}

export type FormErrors = Partial<Record<keyof FormValues, string>>;

export function validate({ uuid, batteryPercent }: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (uuid.trim() === '') {
    errors.uuid = 'UUID je povinné.';
  }

  if (batteryPercent.trim() === '') {
    errors.batteryPercent = 'Batéria je povinná.';
  } else {
    const value = Number(batteryPercent);
    // API prijíma len celé čísla (strict integer) od 0 do 100.
    if (!Number.isInteger(value) || value < 0 || value > 100) {
      errors.batteryPercent = 'Batéria musí byť celé číslo od 0 do 100.';
    }
  }

  return errors;
}
