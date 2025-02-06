import Joi, { CustomHelpers, Extension } from 'joi';

import { IsValidString } from '@finnoto/design-system';

// pluralize
const p = (word: string, num = 0): string => (num === 1 ? word : `${word}s`);
const isPositive = (num = 0): number => Number(num > 0);
const clamp = (value: number, min: number, max: number): number =>
    value < min ? min : value > max ? max : value;

const defaultOptions: ComplexityOptions = {
    min: 6,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 5,
};

export interface JoiPasswordComplexity extends Joi.StringSchema {
    passwordComplexity(): this;
}

export interface ComplexityOptions {
    min?: number;
    lowerCase?: number;
    upperCase?: number;
    numeric?: number;
    symbol?: number;
    requirementCount?: number;
}

const passwordComplexity = (
    options: ComplexityOptions = defaultOptions,
    label = '{{#label}}'
): JoiPasswordComplexity => {
    const {
        min = 0,
        lowerCase = 0,
        upperCase = 0,
        numeric = 0,
        symbol = 0,
        requirementCount = 0,
    } = Object.assign(defaultOptions, options);

    const joiPasswordComplexity: Extension = {
        type: 'passwordComplexity',
        base: Joi.string(),
        messages: {
            'passwordComplexity.tooShort': `${label} should be at least ${min} ${p(
                'character',
                min
            )} long`,
            'passwordComplexity.lowercase': `${label} should contain at least ${lowerCase} lower-cased ${p(
                'letter',
                lowerCase
            )}`,
            'passwordComplexity.uppercase': `${label} should contain at least ${upperCase} upper-cased ${p(
                'letter',
                upperCase
            )}`,
            'passwordComplexity.numeric': `${label} should contain at least ${numeric} ${p(
                'number',
                numeric
            )}`,
            'passwordComplexity.symbol': `${label} should contain at least ${symbol} ${p(
                'symbol',
                symbol
            )}`,
            'passwordComplexity.requirementCount': `${label} must meet at least ${requirementCount} of the complexity requirements`,
        },
        validate: (value: unknown, helpers: CustomHelpers) => {
            const errors = [];
            let score = 5;

            if (typeof value === 'string') {
                const lowercaseCount = value.match(/[a-z]/g)?.length ?? 0;
                const upperCaseCount = value.match(/[A-Z]/g)?.length ?? 0;
                const numericCount = value.match(/[0-9]/g)?.length ?? 0;
                const symbolCount = value.match(/[^a-zA-Z0-9]/g)?.length ?? 0;

                const meetsMin = min && value.length >= min;
                const meetsLowercase = lowercaseCount >= lowerCase;
                const meetsUppercase = upperCaseCount >= upperCase;
                const meetsNumeric = numericCount >= numeric;
                const meetsSymbol = symbolCount >= symbol;

                const maxRequirement =
                    isPositive(min) +
                    isPositive(lowerCase) +
                    isPositive(upperCase) +
                    isPositive(numeric) +
                    isPositive(symbol);

                const requirement = clamp(
                    requirementCount || maxRequirement,
                    1,
                    maxRequirement
                );

                const requirementErrors = [];

                if (!meetsMin) {
                    errors.push(
                        helpers.error('passwordComplexity.tooShort', { value })
                    );
                    score -= 1;
                }
                if (!meetsLowercase) {
                    requirementErrors.push(
                        helpers.error('passwordComplexity.lowercase', { value })
                    );
                    score -= 1;
                }
                if (!meetsUppercase) {
                    requirementErrors.push(
                        helpers.error('passwordComplexity.uppercase', { value })
                    );
                    score -= 1;
                }
                if (!meetsNumeric) {
                    requirementErrors.push(
                        helpers.error('passwordComplexity.numeric', { value })
                    );
                    score -= 1;
                }
                if (!meetsSymbol) {
                    requirementErrors.push(
                        helpers.error('passwordComplexity.symbol', { value })
                    );
                    score -= 1;
                }

                if (maxRequirement - requirementErrors.length < requirement) {
                    errors.push(...requirementErrors);
                    if (requirement < maxRequirement) {
                        errors.push(
                            helpers.error(
                                'passwordComplexity.requirementCount',
                                { value }
                            )
                        );
                    }
                }
            }

            return {
                score,
                value,
                errors: errors.length ? errors : null,
            };
        },
    };

    return (
        Joi.extend(joiPasswordComplexity) as JoiPasswordComplexity
    ).passwordComplexity();
};

export default passwordComplexity;

/**
 * Calculates a score representing the complexity of a given password.
 *
 * @param {string} password - the password to be scored
 * @param {ComplexityOptions} [options] - optional complexity options
 * @return {number} a score between 0 and 4 representing the password's complexity
 */
export const getPasswordScore = (
    password: string,
    options?: ComplexityOptions
) => {
    let score = 5;
    const validation = passwordComplexity({
        ...options,
        min: 6,
        requirementCount: 5,
    }).validate(password);

    if (!IsValidString(validation.value)) return 0;
    if (!validation.error) return score;

    for (const [_, error] of validation.error?.details?.entries()) {
        if (error.type === 'passwordComplexity.requirementCount') continue;
        score -= 1;
    }

    return score;
};
