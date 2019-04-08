declare interface UeFormStrings {
    SaveButtonText: string;
    CreateButtonText: string;
    CancelButtonText: string;
    LoadingFormIndicator: string;
    ErrorLoadingSchema: string;
    RequiredValueMessage: string;
    ErrorLoadingData: string;
    ItemSavedSuccessfully: string;
    ErrorOnSavingListItem: string;
    TextFormFieldPlaceholder: string;
    NumberFormFieldPlaceholder: string;
  }

  declare module 'UeFormStrings' {
    const strings: UeFormStrings;
    export = strings;
  }
