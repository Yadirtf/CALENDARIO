declare module 'react-select-country-list' {
    interface CountryOption {
        value: string;
        label: string;
    }

    interface CountrySelect {
        getData(): CountryOption[];
        getValue(label: string): string;
        getLabel(value: string): string;
    }

    function countrySelect(): CountrySelect;
    export default countrySelect;
}

