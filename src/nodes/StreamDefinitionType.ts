import Type from './Type';
import type { NativeTypeName } from '../native/NativeConstants';
import type TypeSet from './TypeSet';
import type Translation from '@translation/Translation';
import type StreamDefinition from './StreamDefinition';

export default class StreamDefinitionType extends Type {
    readonly definition: StreamDefinition;

    constructor(definition: StreamDefinition) {
        super();

        this.definition = definition;
    }

    getGrammar() {
        return [];
    }
    computeConflicts() {
        return [];
    }

    /** Compatible if it's the same structure definition, or the given type is a refinement of the given structure.*/
    acceptsAll(types: TypeSet): boolean {
        return types.list().every((type) => {
            if (
                type instanceof StreamDefinitionType &&
                this.definition === type.definition
            )
                return true;
        });
    }

    getNativeTypeName(): NativeTypeName {
        return 'function';
    }

    clone() {
        return new StreamDefinitionType(this.definition) as this;
    }

    toWordplay() {
        return this.definition.toWordplay();
    }

    getNodeTranslation(translation: Translation) {
        return translation.nodes.StreamDefinitionType;
    }
}