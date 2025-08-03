import { Request, Response } from "express";
import { RegisterAnimalUseCase } from "../../application/RegisterAnimalUseCase";
import { Animal } from "../../domain/Animal";

export class RegisterAnimalController {
    constructor(private registerAnimalUseCase: RegisterAnimalUseCase) {}

    async run(req: Request, res: Response) {
        try {
            const { name, breed, species, age, gender, color, size, notes } = req.body;
            const userId = (req as any).user.id;

            // ✅ VALIDACIONES AGREGADAS
            const validationErrors = this.validateAnimalData({ name, breed, species, age, gender, color, size, notes });
            
            if (validationErrors.length > 0) {
                return res.status(400).json({
                    message: validationErrors.join('. '),
                    success: false
                });
            }

            const animal = new Animal(
                '', 
                name || null,
                breed || null,
                species || null,
                age !== undefined ? age : null,
                gender || null,
                color || null,
                size || null,
                userId.toString(),
                notes || null
            );

            const registeredAnimal = await this.registerAnimalUseCase.registerAnimal(animal, userId);

            res.status(201).json({
                message: 'Animal registered successfully',
                success: true,
                animal: registeredAnimal
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            console.error('❌ Error registering animal:', errorMessage);
            res.status(400).json({
                message: errorMessage,
                success: false,
            });
        }
    }

    // ✅ MÉTODO DE VALIDACIÓN
    private validateAnimalData(data: any): string[] {
        const errors: string[] = [];

        // Validar name (requerido)
        if (!data.name) {
            errors.push('Name is required');
        } else if (typeof data.name !== 'string') {
            errors.push('Name must be a string');
        } else if (data.name.trim().length === 0) {
            errors.push('Name cannot be empty or only whitespace');
        } else if (data.name.length > 255) {
            errors.push('Name is too long (maximum 255 characters)');
        }

        // Validar species (requerido)
        if (!data.species) {
            errors.push('Species is required');
        } else if (typeof data.species !== 'string') {
            errors.push('Species must be a string');
        } else if (data.species.trim().length === 0) {
            errors.push('Species cannot be empty or only whitespace');
        }

        // Validar age (opcional, pero si se proporciona debe ser válido)
        if (data.age !== undefined && data.age !== null) {
            if (typeof data.age !== 'number') {
                errors.push('Age must be a number');
            } else if (data.age < 0) {
                errors.push('Age cannot be negative');
            } else if (data.age > 500) {
                errors.push('Age is unrealistic (maximum 500 years)');
            }
        }

        // Validar campos de string opcionales
        const stringFields = ['breed', 'gender', 'color', 'size', 'notes'];
        stringFields.forEach(field => {
            if (data[field] !== undefined && data[field] !== null) {
                if (typeof data[field] !== 'string') {
                    errors.push(`${field} must be a string`);
                }
            }
        });

        if (data.name && typeof data.name === 'string') {
            const dangerousChars = /<script|javascript:|on\w+=/i;
            if (dangerousChars.test(data.name)) {
                errors.push('Name contains potentially malicious content');
            }
            const sqlInjectionPatterns = /(\bDROP\b|\bTABLE\b|\bDELETE\b|\bINSERT\b|\bUPDATE\b|--|\/\*|\*\/)/i;
            if (sqlInjectionPatterns.test(data.name)) {
                errors.push('Name contains potentially malicious SQL content');
            }
        }

        return errors;
    }
}