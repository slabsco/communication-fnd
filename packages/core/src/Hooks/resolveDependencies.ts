import { IsArray } from 'class-validator';
import { Schema } from 'joi';
import { FieldValues, UseFormWatch } from 'react-hook-form';

import { ObjectDto } from '../backend/Dtos';
import { IsFunction } from '../Utils/common.utils';

export type SchemaType = Schema;
export type Dependency<SchemaType> = {
    type: DependencyType;

    sourceField: string | string[];
    targetField: string;
    when: (sourceValue: any, targetValue: any) => boolean;
    customProps?: (sourceValue: any, targetValue: any) => ObjectDto | ObjectDto;
};
export enum DependencyType {
    DISABLE,
    REQUIRE,
    HIDE,
    CUSTOM_PROPS,
}
export default function resolveDependencies<SchemaType>(
    dependencies: Dependency<SchemaType>[],
    // currentFieldName: keyof SchemaType,
    currentFieldName: string,
    watch: UseFormWatch<FieldValues>
) {
    let isDisabled = false;
    let isHidden = false;
    let isRequired = false;
    let overrideCustomProps: any | undefined;

    const currentFieldValue = watch(currentFieldName as string);
    const currentFieldDependencies = dependencies.filter(
        (dependency) => dependency.targetField === currentFieldName
    );
    for (const dependency of currentFieldDependencies) {
        const watchedValue = IsArray(dependency.sourceField as any)
            ? (dependency?.sourceField as string[])?.map((el) => watch(el))
            : watch(dependency.sourceField as any);

        const conditionMet = dependency.when(watchedValue, currentFieldValue);

        switch (dependency.type) {
            case DependencyType.DISABLE:
                if (conditionMet) {
                    isDisabled = true;
                }
                break;
            case DependencyType.REQUIRE:
                if (conditionMet) {
                    isRequired = true;
                }
                break;
            case DependencyType.HIDE:
                if (conditionMet) {
                    isHidden = true;
                }
                break;
            case DependencyType.CUSTOM_PROPS:
                if (conditionMet) {
                    overrideCustomProps = IsFunction(dependency?.customProps)
                        ? dependency?.customProps(
                              watchedValue,
                              currentFieldValue
                          )
                        : dependency.customProps;
                }
                break;
        }
    }

    return {
        isDisabled,
        isHidden,
        isRequired,
        overrideCustomProps,
    };
}
