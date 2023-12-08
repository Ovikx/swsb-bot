import Eris from 'eris';
import roles from '../resources/roles.json';

/**
 * Pauses program execution for a specified amount of time
 * @param ms Number of milliseconds to delay the program by
 */
 export async function sleep(ms: number) {
    await (() => new Promise(resolve => setTimeout(resolve, ms)))();
}

/**
 * Transforms a 1D array to a 2D array
 * @param arr The array to paginate
 * @param itemsPerPage Number of elements per page
 * @returns 2D array, each array is a page
 */
export function paginate<T>(arr: T[], itemsPerPage: number): T[][] {
    let pages: T[][] = [];
    for (let i = 0; i < Math.ceil(arr.length/itemsPerPage); i++) {
        pages.push([]);
    }
    for (let i = 0; i < arr.length; i++) {
        pages[Math.floor(i/itemsPerPage)].push(arr[i]);
    }
    return pages;
}

/**
 * Capitalizes the first letter of a string
 * @param s String to capitalize
 * @returns Capitalized string
 */
export function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Outdenting tag for template literals
 * @param strs Template literal to outdent
 * @returns Outdented template literal
 */
export function outdent(strs: TemplateStringsArray, ...values: any[]){
    let res = '';
    strs.forEach((str, i) => {
        res += str + (values[i] != undefined ? values[i] : '');
    });
    return res.replace(/(\n)\s+/g, '$1');
}

/**
 * Returns the difference between two arrays (arr1 - arr2)
 * @param arr1 Array to subtract from
 * @param arr2 Array to subtract
 * @returns The array difference of arr1 and arr2
 */
export function difference<T>(arr1: T[], arr2: T[]): T[] {
    return arr1.filter(x => !arr2.includes(x));
}

/**
 * Creates an author object to use in embeds
 * @param interaction Discord slash command interaction
 * @returns An author object
 */
export function createAuthor(interaction: Eris.CommandInteraction): {name: string, icon_url: string} {
    return {name: interaction.member?.username ?? '', icon_url: interaction.member?.avatarURL ?? ''};
}

/**
 * Checks if the member is an admin
 * @param member The member to check
 * @returns Whether the member is an admin
 */
export function isAdmin(member: Eris.Member) {
    let isAdmin = false;
    for (const role of member.roles) {
        if (roles.authorizedRoles.includes(role)) {
            isAdmin = true;
            break;
        }
    }

    return isAdmin;
}