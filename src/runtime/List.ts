import ListType from '@nodes/ListType';
import Bool from './Bool';
import Text from './Text';
import Measurement from './Measurement';
import None from './None';
import Primitive from './Primitive';
import type Value from './Value';
import UnionType from '@nodes/UnionType';
import type Context from '@nodes/Context';
import type LanguageCode from '@locale/LanguageCode';
import { LIST_CLOSE_SYMBOL, LIST_OPEN_SYMBOL } from '@parser/Symbols';
import type { NativeTypeName } from '../native/NativeConstants';
import type Locale from '@locale/Locale';
import type Expression from '../nodes/Expression';
import concretize from '../locale/concretize';

export default class List extends Primitive {
    readonly values: Value[] = [];

    constructor(creator: Expression, values: Value[]) {
        super(creator);

        this.values = values.slice();
    }

    getValues() {
        return this.values;
    }

    get(index: Measurement) {
        const num = index.toNumber();
        const value =
            num === 0 ? undefined : this.values.at(num > 0 ? num - 1 : num);
        return value === undefined ? new None(this.creator) : value;
    }

    length(requestor: Expression) {
        return new Measurement(requestor, this.values.length);
    }

    has(requestor: Expression, value: Value) {
        return new Bool(
            requestor,
            this.values.find((v) => value.isEqualTo(v)) !== undefined
        );
    }

    isEqualTo(value: Value): boolean {
        return (
            value instanceof List &&
            this.values.length === value.values.length &&
            this.values.every((v, index) => value.values[index].isEqualTo(v))
        );
    }

    join(requestor: Expression, separator: Text) {
        return new Text(
            requestor,
            this.values
                .map((v) => (v instanceof Text ? v.text : v.toString()))
                .join(separator.text)
        );
    }

    add(requestor: Expression, value: Value) {
        return new List(requestor, [...this.values, value]);
    }

    replace(requestor: Expression, index: Measurement, value: Value) {
        const copy = this.values.slice();
        const num = index.toNumber();
        if (!isNaN(num) && num >= 1 && num <= copy.length)
            copy[num - 1] = value;
        return new List(requestor, copy);
    }

    first() {
        return this.values.length === 0
            ? new None(this.creator)
            : this.values[0];
    }

    last() {
        return this.values.length === 0
            ? new None(this.creator)
            : this.values[this.values.length - 1];
    }

    sansFirst(requestor: Expression) {
        return new List(requestor, this.values.slice(1));
    }

    sansLast(requestor: Expression) {
        return new List(requestor, this.values.slice(0, -1));
    }

    sansAll(requestor: Expression, value: Value) {
        return new List(
            requestor,
            this.values.filter((v) => !v.isEqualTo(value))
        );
    }

    reverse(requestor: Expression) {
        return new List(requestor, this.values.reverse());
    }

    append(requestor: Expression, list: List) {
        return new List(requestor, [...this.values, ...list.values]);
    }

    getType(context: Context) {
        return ListType.make(
            UnionType.getPossibleUnion(
                context,
                this.values.map((v) => v.getType(context))
            )
        );
    }

    getNativeTypeName(): NativeTypeName {
        return 'list';
    }

    toWordplay(languages: LanguageCode[]): string {
        return `${LIST_OPEN_SYMBOL}${Array.from(this.values)
            .map((value) => value.toWordplay(languages))
            .join(' ')}${LIST_CLOSE_SYMBOL}`;
    }

    getDescription(locale: Locale) {
        return concretize(locale, locale.term.list);
    }

    getSize() {
        let sum = 0;
        for (const value of this.values) sum += value.getSize();
        return sum;
    }
}
