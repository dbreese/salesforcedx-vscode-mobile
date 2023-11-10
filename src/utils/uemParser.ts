/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

export class UEMParser {
    public static findSObjects(json: Object): Array<string> {
        const sObjects = UEMParser.findObjectsWithValues(json, [
            'mcf/list',
            'mcf/timedList',
            'mcf/genericLists'
        ]);
        const results: string[] = [];

        sObjects.forEach((obj) => {
            let properties = obj['properties' as keyof Object];
            let objectApiName = properties[
                'objectApiName' as keyof Object
            ] as unknown as string;

            // Only include unique values in the array.
            if (!results.includes(objectApiName)) {
                results.push(objectApiName);
            }
        });

        return results;
    }

    static findObjectsWithValues(
        nestedJsonBlock: any,
        valuesToMatch: string[]
    ): Array<any> {
        const results: Array<any> = [];

        if (typeof nestedJsonBlock === 'object') {
            const values = Object.values(nestedJsonBlock);

            const matched = valuesToMatch.some((value) =>
                values.includes(value)
            );

            if (matched) {
                results.push(nestedJsonBlock);
            }

            for (const key in nestedJsonBlock) {
                results.push(
                    ...UEMParser.findObjectsWithValues(
                        nestedJsonBlock[key as keyof Object],
                        valuesToMatch
                    )
                );
            }
        } else if (Array.isArray(nestedJsonBlock)) {
            const nestedArrayBlock = nestedJsonBlock as Array<Object>;
            for (const item of nestedArrayBlock) {
                results.push(
                    ...UEMParser.findObjectsWithValues(item, valuesToMatch)
                );
            }
        }

        return results;
    }
}
