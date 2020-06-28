export interface ValueModelConverter<SourceType, TransformType> {
    transform(value: SourceType): TransformType

    revert(value: TransformType): SourceType
}