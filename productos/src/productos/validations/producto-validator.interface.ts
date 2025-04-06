export interface ProductoValidationResult {
  isValid: boolean;
  message?: string;
}

export interface ProductoValidator {
  validate(row: any): Promise<ProductoValidationResult>;
}
