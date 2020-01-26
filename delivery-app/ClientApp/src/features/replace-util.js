export function updateById(originalArray, newItems) {
    const copyOfOriginalArray = originalArray.slice();
    newItems.forEach(newItem => updateByIdSingle(copyOfOriginalArray, newItem));
    return copyOfOriginalArray;
}

function updateByIdSingle(originalArray, newItem) {
    const index = originalArray.findIndex(r => r.id === newItem.id);
    if (!index === -1)
        return;

    originalArray.splice(index, 1, newItem);
}