import type { NativeTypeName } from '../native/NativeConstants';
import type Locale from '@locale/Locale';
import type Context from './Context';
import type Node from './Node';
import Type from './Type';
import { UNKNOWN_SYMBOL } from '../parser/Symbols';
import Glyphs from '../lore/Glyphs';
import type Markup from './Markup';

export default abstract class UnknownType<
    ExpressionType extends Node
> extends Type {
    readonly expression: ExpressionType;
    readonly why: Type | undefined;

    constructor(expression: ExpressionType, why: Type | undefined) {
        super();

        this.expression = expression;
        this.why = why;
    }

    getGrammar() {
        return [];
    }

    computeConflicts() {}

    acceptsAll() {
        return false;
    }

    getNativeTypeName(): NativeTypeName {
        return 'unknown';
    }

    clone() {
        return this;
    }

    toWordplay() {
        return UNKNOWN_SYMBOL;
    }

    getReasons(): UnknownType<any>[] {
        return [
            this,
            ...(this.why instanceof UnknownType
                ? [...this.why.getReasons()]
                : []),
        ];
    }

    getNodeLocale(translation: Locale) {
        return translation.node.UnknownType;
    }

    abstract getReason(translation: Locale, context: Context): Markup;

    getGlyphs() {
        return Glyphs.Unknown;
    }
}
