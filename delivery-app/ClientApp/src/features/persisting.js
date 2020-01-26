export function persist(key, object) {
    window.sessionStorage.setItem(key, JSON.stringify(object));
}

export function restore(key) {
    return JSON.parse(window.sessionStorage.getItem(key));
}

export const keyForSelectedTagIds = 'selectedTagIds';
export const keyForSelectedRestaurantId = 'selectedRestaurantId';
export const keyForCart = 'cart';