import React from 'react';

/**
 *
 * @param {React.ComponentType} Component - React component
 * @param {ZodSchema} schema - schema to validate props
 * @returns{}
 */

const ValidatedComponent = (Component, schema) => {
    // PRODUCTION
    if (!import.meta.env.DEV) {
        return Component;
    }

    // DEV
    const Wrapped = (rawProps) => {
        const validationResult = schema.safeParse(rawProps);

        if (validationResult.success === false) {
            console.error(`Invalid props for ${Component.name || Component.displayName}:`, validationResult);

            return (
                <div style={{ fontSize: '1.6rem', color: 'red' }}>
                    Invalid props for {Component.displayName || Component.name}
                </div>
            );
        }

        const props = validationResult.data;

        return <Component {...props} />;
    };

    Wrapped.displayName = `Validated(${Component.displayName || Component.name})`;

    return Wrapped;
};

export default ValidatedComponent;
