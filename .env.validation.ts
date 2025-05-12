import {
    IsDefined,
    IsEnum,
    IsNumber,
    IsString,
    validateSync,
    ValidationError,
} from 'class-validator';
import { plainToInstance } from 'class-transformer';

enum Environment {
    Development = 'development',
    Production = 'production',
    Test = 'test',
    Provision = 'provision',
}

class EnvironmentVariables {
    @IsEnum(Environment)
    NODE_ENV: string;
    @IsNumber()
    PORT: number;
    @IsString()
    DATABASE_HOST: string;
    @IsNumber()
    POSTGRESQL_PORT: number;
    @IsString()
    POSTGRESQL_USERNAME: string;
    @IsString()
    POSTGRESQL_PASSWORD: string;
    @IsString()
    POSTGRESQL_DATABASE: string;
    @IsString()
    @IsDefined()
    SECRET: string;
}

export function validate(config: Record<string, unknown>) {
    //plainInstance converts plain (literal) object to class (constructor) object. Also works with arrays.
    const validatedConfig = plainToInstance(EnvironmentVariables, config, {
        /**
         * enableImplicitConversion will tell class-transformer that if it sees a
         primitive that is currently a string (like a boolean or a number) to assume it
         should be the primitive type instead and transform it, even though @Type(() =>
         Number) or @Type(() => Boolean) isn't used
         */
        enableImplicitConversion: true,
    });
    /**
     * Performs sync validation of the given object.
     * Note that this method completely ignores async validations.
     * If you want to properly perform validation you need to call validate method
     instead. */
    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });
    if (errors.length > 0) {
        throw new Error(formatErrors(errors));
    }
    return validatedConfig;
}

function formatErrors(errors: ValidationError[]): string {
    return errors
        .map((err) => {
            // Type guard to ensure `err` is a ValidationError with constraints
            if (isValidationError(err) && err.constraints) {
                const constraints = Object.values(err.constraints);
                return `${err.property}: ${constraints.join(', ')}`;
            }
            // Handle the case where constraints are not available
            return `${err.property}: Unknown error`;
        })
        .join('; ');
}
// Type guard to ensure `err` is a `ValidationError`
function isValidationError(err: unknown): err is ValidationError {
    return (
        typeof err === 'object' &&
        err !== null &&
        'property' in err &&
        'constraints' in err
    );
}
